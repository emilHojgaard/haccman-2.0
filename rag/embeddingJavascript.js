import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// ----- env -----
const {
  OPENAI_API_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  JOURNALS_DIR = "patient_journals",
  DISEASES_DIR = "disease_docs",
  NURSING_TASKS_DIR = "nursing_tasks",
  NURSING_GUIDELINES_DIR = "nursing_guidelines",
  MEDICAL_GUIDELINES_DIR = "medical_guidelines",
  OPENAI_EMBED_MODEL = "text-embedding-3-small",
} = process.env;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Required: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// ----- clients -----
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: "RAG" },
});

// ----- helpers -----
async function listTxtFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".txt"))
      .map((e) => path.join(dir, e.name));
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`Directory not found: ${dir} (skipping)`);
      return [];
    }
    throw err;
  }
}

function titleFromPath(p) {
  return path.basename(p, path.extname(p));      // e.g. "IV_Infusion_Setup"

}

function dirFromPath(p) {
  return path.basename(path.dirname(p));         // e.g. "nursing_tasks"
}

function chunkSmart(text) {
  const sections = text.split(/\r?\n(?=^[^\r\n]*:\s*$)/m).map(s => s.trim()).filter(Boolean);
  console.log("chunks :", sections);
  return sections
}


// Batch embedder
async function embedBatch(texts) {
  if (texts.length === 0) return [];
  const res = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function upsertDocument({ title, docType, fullText, confidential }) {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      doc_type: docType,
      full_text: fullText,
      url: null,
      confidential,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
async function insertChunks(docId, chunks, title, docType) {
  let PREFIX = `TITLE: ${title}\nTYPE: ${docType}\n---\n`;
  let cprNumber = null;
  let patientName = null;

  if (docType === "patient_journals") {
    cprNumber = chunks[0].match(/CPR-number\s*-\s*([\d\-]+)/i)?.[1];
    patientName = chunks[0].match(/^[ \t]*Patient Name\s*[-:—]\s*([^\r\n]+)/mi)?.[1];
    PREFIX = `TITLE: ${title}\nDOCUMENT TYPE: ${docType} ${patientName && `\nPATIENT NAME: ${patientName}`} ${cprNumber && `\nCPR: ${cprNumber}`}\n---\n`;
  }

  const BATCH = 64;

  for (let start = 0; start < chunks.length; start += BATCH) {
    const raw = chunks.slice(start, start + BATCH);

    // Add context to each chunk
    const batch = raw.map(c => `${PREFIX}${c}`);

    const vecs = await embedBatch(batch);

    const rows = batch.map((text_chunk, idx) => ({
      doc_id: docId,
      text_chunk,
      doc_title: title,
      doc_type: docType,
      patient_name: patientName,
      cpr_number: cprNumber,
      semantic_vector: vecs[idx],
      chunk_index: start + idx,
    }));

    const { error } = await supabase.from("chunks").insert(rows);
    if (error) throw new Error(`Insert chunks failed at ${start}: ${error.message || error}`);
    console.log(`  Inserted ${rows.length} chunks (through ${start + rows.length})`);
  }
}


async function run() {
  // --- DELETE EXISTING CONTENT BEFORE UPLOAD (chunks -> documents) ---
  console.log("Clearing RAG data: chunks then documents …");

  const delChunks = await supabase
    .from("chunks")
    .delete()
    .not("id", "is", null);

  if (delChunks.error) throw delChunks.error;

  const delDocs = await supabase
    .from("documents")
    .delete()
    .not("id", "is", null);

  if (delDocs.error) throw delDocs.error;

  // 1) Collect files from both folders
  const journalFiles = await listTxtFiles(JOURNALS_DIR);
  const diseaseFiles = await listTxtFiles(DISEASES_DIR);
  const nursingTaskFiles = await listTxtFiles(NURSING_TASKS_DIR);
  const nursingGuidelineFiles = await listTxtFiles(NURSING_GUIDELINES_DIR);
  const medicalGuidelineFiles = await listTxtFiles(MEDICAL_GUIDELINES_DIR);

  if (journalFiles.length === 0 && diseaseFiles.length === 0 && nursingTaskFiles.length === 0 && nursingGuidelineFiles.length === 0 && medicalGuidelineFiles.length === 0) {
    console.warn("No .txt files found in the given directories.");
    return;
  }

  // Build a single work list with metadata
  const work = [
    ...journalFiles.map((p) => ({ path: p, confidential: true })),
    ...diseaseFiles.map((p) => ({ path: p, confidential: false })),
    ...nursingTaskFiles.map((p) => ({ path: p, confidential: false })),
    ...nursingGuidelineFiles.map((p) => ({ path: p, confidential: false })),
    ...medicalGuidelineFiles.map((p) => ({ path: p, confidential: false })),
  ];

  console.log(
    `Found ${journalFiles.length} journal files, ${diseaseFiles.length} disease files, ${nursingTaskFiles.length} nursing task files, ${nursingGuidelineFiles.length} nursing guideline files, ${medicalGuidelineFiles.length} medical guideline files.`
  );

  // 2) Process each file
  for (const { path: filePath, confidential } of work) {
    try {
      const title = titleFromPath(filePath);
      const docType = dirFromPath(filePath);
      const fullText = await fs.readFile(filePath, "utf-8");

      // Insert document row with title and confidential flag
      const docId = await upsertDocument({ title, docType, fullText, confidential });
      console.log(`Created document ${docId} for "${title}" with type: "${docType}" `);

      // Chunk
      const chunks = chunkSmart(fullText);
      console.log(`  Chunked "${title}" with type: "${docType}" into ${chunks.length} chunks`);

      // Embed + insert chunks
      await insertChunks(docId, chunks, title, docType);
    } catch (err) {
      console.error(`Error processing file "${filePath}":`, err);
    }
  }

  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
