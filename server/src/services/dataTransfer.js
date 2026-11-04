const crypto = require("crypto");
const Product = require("../models/Product");
const Testimonial = require("../models/Testimonial");
const NigerianStateShipping = require("../models/NigerianStateShipping");
const ShippingZone = require("../models/ShippingZone");
const TransportCompany = require("../models/TransportCompany");

const datasets = {
  products: { model: Product, keys: ["sku"], sample: { name: "Sample wellness product", sku: "EASYCURE-001", coverImage: "https://example.com/product.jpg", price: 5000, stock: 10, category: "Herbal Tea", status: "active" } },
  content: { model: Testimonial, keys: ["contentType", "title", "name", "testimony"], sample: { contentType: "story", mediaType: "text", title: "Welcome to EasyCure", name: "EasyCure team", testimony: "Wellness education and community support.", approved: true, status: "active" } },
  "state-shipping": { model: NigerianStateShipping, keys: ["state"], sample: { state: "EDO", baseDeliveryFee: 2500, serviceName: "State delivery", estimatedDays: "2-5 business days", active: true } },
  "shipping-zones": { model: ShippingZone, keys: ["state"], sample: { state: "EDO", cities: ["Benin City"], baseDeliveryFee: 2500, serviceName: "Standard Shipping", active: true } },
  "transport-companies": { model: TransportCompany, keys: ["name"], sample: { name: "Example Transport", states: ["EDO", "LAGOS"], active: true } },
};

const excluded = new Set(["_id", "__v", "createdAt", "updatedAt", "submittedBy", "approvalRequestedBy", "deletionRequestedBy", "deletionRequestedAt", "announcementNotifiedAt", "pendingApproval", "pendingDeletion"]);
const mediaFields = ["coverImage", "image", "videoUrl", "videoFile", "audioFile", "linkUrl"];
const numericFields = ["price", "salePrice", "distributorPrice", "stock", "soldCount", "lowStockThreshold", "baseDeliveryFee", "shippingWeight", "shippingLength", "shippingWidth", "shippingHeight"];

function cleanRecord(dataset, record) {
  const fields = Object.keys(dataset.model.schema.paths).filter((key) => !excluded.has(key));
  return Object.fromEntries(fields.filter((key) => Object.hasOwn(record, key)).map((key) => [key, record[key]]));
}

function recordKey(dataset, record) {
  return JSON.stringify(dataset.keys.map((key) => String(record[key] ?? "").trim()));
}

function validateRows(dataset, records, existingRecords = []) {
  if (!Array.isArray(records) || records.length < 1 || records.length > 500) {
    throw new Error("Choose a JSON array containing between 1 and 500 records.");
  }
  const seen = new Set(existingRecords.map((record) => recordKey(dataset, record)));
  const errors = [];
  const ready = [];
  let skipped = 0;
  records.forEach((record, index) => {
    try {
      if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("Each row must be an object.");
      const clean = cleanRecord(dataset, record);
      for (const field of mediaFields) {
        if (clean[field] && (typeof clean[field] !== "string" || !/^https?:\/\//i.test(clean[field]))) throw new Error(`${field} must be a public http or https URL.`);
      }
      if (clean.gallery && (!Array.isArray(clean.gallery) || clean.gallery.some((url) => typeof url !== "string" || !/^https?:\/\//i.test(url)))) throw new Error("Gallery entries must be public http or https URLs.");
      const doc = new dataset.model(clean);
      const error = doc.validateSync();
      if (error) throw error;
      const normalized = cleanRecord(dataset, doc.toObject());
      for (const field of numericFields) {
        if (normalized[field] != null && (!Number.isFinite(normalized[field]) || normalized[field] < 0)) throw new Error(`${field} must be a non-negative number.`);
      }
      if (normalized.stock != null && !Number.isSafeInteger(normalized.stock)) throw new Error("Stock must be a whole number.");
      const key = recordKey(dataset, normalized);
      if (seen.has(key)) { skipped++; return; }
      seen.add(key);
      ready.push(normalized);
    } catch (error) {
      errors.push({ row: index + 1, message: error.message });
    }
  });
  return { ready, skipped, errors };
}

function previewFingerprint(records) {
  return crypto.createHash("sha256").update(JSON.stringify(records)).digest("hex");
}

module.exports = { datasets, cleanRecord, validateRows, previewFingerprint };
