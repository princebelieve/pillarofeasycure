const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const { datasets, cleanRecord, validateRows, previewFingerprint } = require("../services/dataTransfer");
const router = express.Router();

router.use(protect, adminOnly);
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
