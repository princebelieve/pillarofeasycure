const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { protect, adminOnly } = require("../middleware/auth");
const { datasets, cleanRecord, validateRows, previewFingerprint } = require("../services/dataTransfer");
const Product = require("../models/Product");
const { createSourceR2Client, readSourceR2Object, uploadBufferToR2 } = require("../config/r2");
const router = express.Router();

router.use(protect, adminOnly);

function sourceProductCollection() {
  if (!process.env.EASYLIFE_SOURCE_MONGO_URI) throw new Error("Configure EASYLIFE_SOURCE_MONGO_URI on the server.");
  return mongoose.createConnection(process.env.EASYLIFE_SOURCE_MONGO_URI, { serverSelectionTimeoutMS: 12000 });
}

function sourceObjectKey(imageUrl) {
  const baseValue = process.env.EASYLIFE_SOURCE_R2_PUBLIC_BASE_URL;
  if (!baseValue) throw new Error("Configure EASYLIFE_SOURCE_R2_PUBLIC_BASE_URL on the server.");
  const base = new URL(baseValue);
  const image = new URL(imageUrl);
  const basePath = base.pathname.replace(/\/$/, "");
  if (image.origin !== base.origin || !image.pathname.startsWith(`${basePath}/`)) {
    throw new Error(`Product image is not under the configured EasyLife R2 public URL: ${imageUrl}`);
  }
  return decodeURIComponent(image.pathname.slice(basePath.length + 1));
}

function prepareSourceProducts(sourceProducts, existingProducts) {
  const existingSkus = new Set(existingProducts.map(({ sku }) => String(sku || "").trim().toLowerCase()));
  const products = sourceProducts.map((source) => {
    const product = cleanRecord(datasets.products, source);
    if (!product.sku) {
      const id = String(source._id || product.name || "product");
      product.sku = `EASYLIFE-${crypto.createHash("sha256").update(id).digest("hex").slice(0, 12).toUpperCase()}`;
    }
    return { sourceId: String(source._id), product };
  });
  const fingerprint = previewFingerprint(products);
  const duplicates = products.filter(({ product }) => existingSkus.has(String(product.sku).trim().toLowerCase())).length;
  return { products, fingerprint, duplicates };
}

router.get("/easylife-products", async (req, res) => {
  let source;
  try {
    source = await sourceProductCollection();
    await source.asPromise();
    const [sourceProducts, existing] = await Promise.all([
      source.db.collection("products").find({}).toArray(),
      Product.find().select("sku").lean(),
    ]);
    const prepared = prepareSourceProducts(sourceProducts, existing);
    const imageCount = prepared.products.reduce((count, { product }) => count + Boolean(product.coverImage) + (product.gallery || []).length, 0);
    return res.json({ total: prepared.products.length, imageCount, duplicates: prepared.duplicates, fingerprint: prepared.fingerprint });
  } catch (error) {
    console.error("EasyLife MongoDB product preview failed:", error.message);
    return res.status(502).json({ message: error.message || "Could not read products from the EasyLife source database." });
  } finally {
    if (source) await source.close().catch(() => {});
  }
});

router.post("/easylife-products/import", express.json({ limit: "1mb" }), async (req, res) => {
  let source;
  let sourceS3;
  try {
    const { fingerprint } = req.body || {};
    if (!fingerprint) return res.status(400).json({ message: "Preview the source catalogue before starting the transfer." });
    source = await sourceProductCollection();
    await source.asPromise();
    const [sourceProducts, existing] = await Promise.all([
      source.db.collection("products").find({}).toArray(),
      Product.find().select("sku").lean(),
    ]);
    const prepared = prepareSourceProducts(sourceProducts, existing);
    if (prepared.fingerprint !== fingerprint) return res.status(409).json({ message: "The source catalogue changed after preview. Preview again before transferring." });
    if (prepared.products.length > 500) return res.status(400).json({ message: "This catalogue has more than 500 products. Transfer batches of 500 or fewer." });

    sourceS3 = createSourceR2Client();
    const existingSkus = new Set(existing.map(({ sku }) => String(sku || "").trim().toLowerCase()));
    const imageCache = new Map();
    let imported = 0;
    let skipped = 0;
    const failures = [];
    for (const { sourceId, product: sourceProduct } of prepared.products) {
      if (existingSkus.has(String(sourceProduct.sku).trim().toLowerCase())) { skipped++; continue; }
      try {
        const product = { ...sourceProduct };
        const copyImage = async (url, folder) => {
          if (!url) return url;
          if (imageCache.has(url)) return imageCache.get(url);
          const key = sourceObjectKey(url);
          const { buffer, contentType } = await readSourceR2Object(sourceS3, key);
          const copiedUrl = await uploadBufferToR2(buffer, { fileName: key.split("/").pop(), contentType, folder });
          imageCache.set(url, copiedUrl);
          return copiedUrl;
        };
        product.coverImage = await copyImage(product.coverImage, "products");
        product.gallery = await Promise.all((product.gallery || []).map((url) => copyImage(url, "products/gallery")));
        await Product.create(product);
        existingSkus.add(String(product.sku).trim().toLowerCase());
        imported++;
      } catch (error) {
        failures.push({ product: sourceProduct.name || sourceId, message: error.message });
      }
    }
    return res.json({ imported, skipped, failures, message: `${imported} products copied from EasyLife with their R2 images. ${skipped} duplicate products skipped.${failures.length ? ` ${failures.length} products failed; review the listed errors and retry after correcting the source or configuration.` : ""}` });
  } catch (error) {
    console.error("EasyLife MongoDB/R2 product transfer failed:", error.message);
    return res.status(502).json({ message: error.message || "The EasyLife MongoDB and R2 transfer could not be completed." });
  } finally {
    if (sourceS3) sourceS3.destroy();
    if (source) await source.close().catch(() => {});
  }
});

router.param("dataset", (req, res, next, name) => {
  if (!Object.hasOwn(datasets, name)) return res.status(404).json({ message: "Unknown import category." });
  req.dataset = datasets[name];
  next();
});

router.get("/:dataset/template", (req, res) => res.json([req.dataset.sample]));
router.get("/:dataset/export", async (req, res) => {
  try {
    const records = await req.dataset.model.find().lean();
    res.json(records.map((record) => cleanRecord(req.dataset, record)));
  } catch (error) {
    res.status(500).json({ message: "Unable to export data.", detail: error.message });
  }
});

router.post("/:dataset/import", express.json({ limit: "5mb" }), async (req, res) => {
  try {
    const { records, dryRun, fingerprint } = req.body;
    const existing = await req.dataset.model.find().select(req.dataset.keys.join(" ")).lean();
    const result = validateRows(req.dataset, records, existing);
    const currentFingerprint = previewFingerprint(result.ready);
    const report = { total: records.length, ready: result.ready.length, skipped: result.skipped, errors: result.errors, fingerprint: currentFingerprint };
    if (dryRun === true) return res.json(report);
    if (result.errors.length) return res.status(400).json({ ...report, message: "Fix the reported rows and preview again. No records were imported." });
    if (!fingerprint || fingerprint !== currentFingerprint) return res.status(409).json({ message: "Data changed since preview. Preview the file again before importing." });
    // Insert only: existing records are never overwritten. Report partial failures
    // accurately so retrying a file safely skips records already imported.
    let imported = 0;
    const failures = [];
    for (const record of result.ready) {
      try { await req.dataset.model.create(record); imported++; }
      catch (error) { failures.push({ message: error.code === 11000 ? "A matching record was added during import; skipped." : error.message }); }
    }
    return res.json({ ...report, imported, failures, message: `${imported} records imported. ${result.skipped} duplicates skipped.${failures.length ? ` ${failures.length} records could not be saved; preview and retry to finish.` : ""}` });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to import data." });
  }
});

module.exports = router;
