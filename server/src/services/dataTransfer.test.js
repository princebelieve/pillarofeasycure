const { test } = require("node:test");
const assert = require("node:assert/strict");
const { datasets, cleanRecord, validateRows, previewFingerprint } = require("./dataTransfer");

test("product imports strip source identity and ownership, preserving catalogue fields", () => {
  const result = validateRows(datasets.products, [{ ...datasets.products.sample, _id: "old-id", submittedBy: "old-owner", pendingDeletion: true, price: "2500" }]);
  assert.equal(result.errors.length, 0);
  assert.equal(result.ready[0].price, 2500);
  for (const key of ["_id", "submittedBy", "pendingDeletion"]) assert.equal(Object.hasOwn(result.ready[0], key), false);
});

test("existing SKUs and duplicate file rows are skipped", () => {
  const row = datasets.products.sample;
  assert.equal(validateRows(datasets.products, [row, row]).skipped, 1);
  assert.equal(validateRows(datasets.products, [row], [{ sku: row.sku }]).ready.length, 0);
});

test("invalid rows report their row numbers before any write", () => {
  const result = validateRows(datasets.products, [
    { ...datasets.products.sample, coverImage: "javascript:alert(1)" },
    { ...datasets.products.sample, stock: -2 },
    { name: "Missing SKU and image" },
    { ...datasets.products.sample, stock: 1.5 },
  ]);
  assert.deepEqual(result.errors.map((error) => error.row), [1, 2, 3, 4]);
  assert.equal(result.ready.length, 0);
});

test("state normalization detects duplicate shipping records", () => {
  const result = validateRows(datasets["state-shipping"], [{ ...datasets["state-shipping"].sample, state: "edo" }], [{ state: "EDO" }]);
  assert.equal(result.skipped, 1);
});

test("content imports match by content identity and preserve media URLs", () => {
  const row = { ...datasets.content.sample, image: "https://example.com/photo.jpg" };
  assert.equal(validateRows(datasets.content, [row], [row]).skipped, 1);
  assert.equal(validateRows(datasets.content, [row]).ready[0].image, row.image);
});

test("all templates validate and exported fields can be reimported", () => {
  for (const dataset of Object.values(datasets)) {
    const result = validateRows(dataset, [dataset.sample]);
    assert.deepEqual(result.errors, []);
    assert.equal(validateRows(dataset, [cleanRecord(dataset, result.ready[0])]).ready.length, 1);
  }
});

test("imports enforce batch limits and previews detect changed data", () => {
  assert.throws(() => validateRows(datasets.products, []));
  assert.throws(() => validateRows(datasets.products, Array(501).fill(datasets.products.sample)));
  assert.notEqual(previewFingerprint([{ stock: 1 }]), previewFingerprint([{ stock: 2 }]));
});
