import { useRef, useState } from "react";
import { exportAdminData, getImportTemplate, importAdminData, importSourceProducts, previewSourceProductTransfer } from "../services/api";

const categories = [
  ["products", "Products"], ["content", "Content, stories & testimonials"],
  ["state-shipping", "State shipping rates"], ["shipping-zones", "Shipping zones"],
  ["transport-companies", "Transport companies"],
];

function downloadJson(records, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(records, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminDataTransfer() {
  const [dataset, setDataset] = useState(() => {
    const selected = new URLSearchParams(window.location.search).get("dataset");
    return categories.some(([value]) => value === selected) ? selected : "products";
  });
  const [records, setRecords] = useState(null);
  const [filename, setFilename] = useState("");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sourcePreview, setSourcePreview] = useState(null);
  const input = useRef(null);

  function reset() { setRecords(null); setFilename(""); setReport(null); setSourcePreview(null); setMessage(""); if (input.current) input.current.value = ""; }
  async function readFile(event) {
    const file = event.target.files?.[0];
    setRecords(null); setReport(null); setMessage(""); setFilename("");
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Choose a JSON file smaller than 5 MB.");
      const parsed = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
      if (!Array.isArray(parsed) || !parsed.length || parsed.length > 500) throw new Error("The file must contain a JSON array of 1–500 records. Split larger exports into batches.");
      setRecords(parsed); setFilename(file.name);
    } catch (error) { setMessage(error.message); }
  }
  async function run(action) {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      if (action === "template") downloadJson(await getImportTemplate(dataset), `easycure-${dataset}-template.json`);
      if (action === "export") downloadJson(await exportAdminData(dataset), `easycure-${dataset}-export.json`);
      if (action === "source-preview") {
        const result = await previewSourceProductTransfer();
        setSourcePreview(result);
        setReport(null);
        setMessage("The source MongoDB catalogue is ready for review. Product images will be copied from its R2 bucket during transfer.");
      }
      if (action === "source-import") {
        const result = await importSourceProducts({ fingerprint: sourcePreview.fingerprint });
        setSourcePreview(null);
        setMessage(result.message);
        if (result.failures?.length) setMessage(`${result.message} ${result.failures.map((failure) => `${failure.product}: ${failure.message}`).join("; ")}`);
      }
      if (action === "preview") setReport(await importAdminData(dataset, { records, dryRun: true }));
      if (action === "import") {
        const result = await importAdminData(dataset, { records, fingerprint: report.fingerprint });
        setReport(null); setMessage(result.message);
        if (!result.failures?.length) { setRecords(null); setFilename(""); if (input.current) input.current.value = ""; }
        else setMessage(`${result.message} ${result.failures.map((failure) => failure.message).join(" ")}`);
      }
    } catch (error) { setMessage(error.message); if (action === "import") setReport(null); }
    finally { setBusy(false); }
  }

  return <div className="page"><h1>Catalogue transfer</h1><p>Transfer the source product catalogue from MongoDB, including product images copied from its Cloudflare R2 bucket.</p>
    <section className="data-transfer-card"><label htmlFor="data-category">Choose data to transfer</label><select id="data-category" value={dataset} disabled={busy} onChange={(event) => { reset(); setDataset(event.target.value); }}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <div className="data-transfer-actions">{dataset === "products" && <><button disabled={busy} onClick={() => run("source-preview")}>Preview source products</button><button disabled={busy} onClick={() => run("export")}>Export EasyCure data</button></>}<button disabled={busy} onClick={() => run("template")}>Download JSON template</button></div>
      {dataset === "products" && <><p>Configure the source MongoDB connection and R2 read credentials in the server environment. The source database is read only. Review the count before confirming; each product’s cover and gallery images are copied into this project’s R2 bucket and the new image URLs are saved with the product.</p>{sourcePreview && <div className="data-transfer-report" role="status"><p>Ready to transfer {sourcePreview.total} products and {sourcePreview.imageCount} images. {sourcePreview.duplicates} products already exist in EasyCure and will be skipped.</p><button className="primary" disabled={busy || !sourcePreview.total} onClick={() => run("source-import")}>{busy ? "Transferring…" : `Transfer ${sourcePreview.total - sourcePreview.duplicates} products with images`}</button></div>}</>}
      {dataset !== "products" && <p>Upload a JSON export or fill in the template. Use public image, audio, and video URLs; media files are not copied. Each import accepts up to 500 records and 5 MB.</p>}
      <p>Existing records are kept. Products match by SKU, shipping rates by state, transport companies by name, and content by type, title, name, and text. Duplicate records are skipped.</p>
      <label htmlFor="data-file">Choose JSON file</label><input ref={input} id="data-file" type="file" accept=".json,application/json" disabled={busy} onChange={readFile} />
      {filename && <p>{filename}: {records.length} records selected.</p>}
      <div className="data-transfer-actions"><button disabled={busy || !records} onClick={() => run("preview")}>{busy ? "Working…" : "Preview import"}</button>{report && <button className="primary" disabled={busy || report.errors.length > 0 || !report.ready} onClick={() => run("import")}>Import {report.ready} records</button>}</div>
      {report && <div className="data-transfer-report" role="status"><p>{report.ready} ready to import · {report.skipped} duplicates skipped · {report.errors.length} invalid rows</p>{report.errors.length > 0 && <><p>Correct these rows and choose the file again. No records have been saved.</p><ul>{report.errors.map((error) => <li key={error.row}>Row {error.row}: {error.message}</li>)}</ul></>}</div>}
      {message && <p role="status">{message}</p>}
    </section>
  </div>;
}
