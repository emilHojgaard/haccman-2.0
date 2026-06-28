import cpr from "../../../../rag/patient_journals/cprs.json" with { type: "json" };
import fullnames from "../../../../rag/patient_journals/fullnames.json" with { type: "json" };

/***********************
 * 1) Static data
 ***********************/
const diseaseDocsList = ["Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_Unstable_Angina_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis",
    "Asthma",
    "Atrial_Fibrillation__AF_",
    "Cellulitis",
    "Chronic_Kidney_Disease__CKD_",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy",
    "Heart_Failure_with_Preserved_Ejection_Fraction__HFpEF_",
    "Heart_Failure_with_Reduced_Ejection_Fraction__HFrEF_",
    "Ischemic_Stroke__Acute_",
    "Migraine",
    "Osteoarthritis__Knee_Hip_",
    "Peptic_Ulcer_Disease",
    "Primary_Hypertension__High_Blood_Pressure_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Kidney_Infection_",
    "Seasonal_Influenza",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Stomach_Flu_"
];

const nursingGuidelinesList = [
    "Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_UA_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis__Acute_",
    "Asthma",
    "Atrial_Fibrillation__New_Onset_",
    "Cellulitis__Non_purulent_",
    "Chronic_Kidney_Disease__CKD____Adult",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Adult__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy__Seizure_Care_in_ED_",
    "Heart_Failure__Acute_Decompensation_",
    "Ischemic_Stroke__Acute_",
    "Major_Depressive_Disorder__Adult_",
    "Migraine__Acute_Care_",
    "Osteoarthritis__Knee_Hip_",
    "Primary_Hypertension__Adult_",
    "Prostate_Cancer__Initial_Care_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Acute_",
    "Seasonal_Influenza__Adult_",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Adult_"
];

const nursingTasksList = [
    "12_Lead_ECG_Acquisition",
    "Blood_Glucose_Monitoring__POC_",
    "Central_Line_Care__Maintenance___Dressing_Change_",
    "Enteral_Feeding__Via_NG_PEG__Initiation___Care",
    "Falls_Risk_Assessment___Prevention",
    "In_Hospital_Transfer__Bed_to_Bed_Handover_",
    "Medication_Administration__5_Rights___2_",
    "Nasogastric__NG__Tube_Insertion",
    "Noninvasive_Ventilation__NIV__Setup___Care",
    "Oxygen_Therapy__Titration___Device_Selection_",
    "Pain_Assessment___Management__Adult_Inpatient_",
    "Palliative_Care__Comfort_Measures",
    "Peripheral_IV_Cannulation__PVC__Insertion",
    "Peripheral_IV_Removal",
    "Pressure_Injury_Prevention_Bundle",
    "Rapid_Response_Activation__Deteriorating_Patient_",
    "Specimen_Collection__Venipuncture__Phlebotomy_",
    "Subcutaneous_Insulin_Administration",
    "Transfusion_Administration__Packed_RBCs_",
    "Urinary_Catheterization__Indwelling__Aseptic_Technique_",
    "Wound_Care__Simple_Surgical___Traumatic_",
];

const medicalGuidelinesList = [
    "Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_Unstable_Angina_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis__Acute_",
    "Asthma",
    "Atrial_Fibrillation__AF____New_Onset",
    "Cellulitis__Non_purulent_",
    "Chronic_Kidney_Disease__CKD____Adult",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Adult__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy__Seizure_Management_in_ED_",
    "Heart_Failure__Acute_Decompensation_",
    "Ischemic_Stroke__Acute_",
    "Major_Depressive_Disorder__Adult_",
    "Migraine__Acute_Management_",
    "Osteoarthritis__Knee_Hip_",
    "Primary_Hypertension__Adult_",
    "Prostate_Cancer__Overview_of_Initial_Management_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Acute_",
    "Seasonal_Influenza__Adult_",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Adult_"
];

const allDocTitles = diseaseDocsList.concat(
    nursingGuidelinesList,
    nursingTasksList,
    medicalGuidelinesList
);

/***********************
 * 2) Utilities (fast)
 ***********************/
function normalizeCPR(s) {
    if (!s) return null;
    const digits = s.replace(/\D/g, "");
    if (digits.length !== 10) return null;
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

function normalizeText(s) {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, ""); // Søren -> soren
}

/** Tokenize once; keep alpha/num/æøå */
function tokenize(s) {
    return normalizeText(s).split(/[^a-z0-9æøå]+/i).filter(Boolean);
}

/** Levenshtein with early-exit band (cutoff) */
function levenshteinCapped(a, b, maxDist = 2) {
    a = normalizeText(a); b = normalizeText(b);
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > maxDist) return maxDist + 1;
    if (m === 0) return n;
    if (n === 0) return m;

    const prev = new Array(n + 1);
    const curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;

    for (let i = 1; i <= m; i++) {
        const lo = Math.max(1, i - maxDist);
        const hi = Math.min(n, i + maxDist);

        curr[lo - 1] = Infinity;
        curr[lo] = Math.min(
            prev[lo] + 1,
            (lo > 1 ? curr[lo - 1] : i) + 1,
            prev[lo - 1] + (a[i - 1] === b[lo - 1] ? 0 : 1)
        );

        let rowMin = curr[lo];

        for (let j = lo + 1; j <= hi; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            const del = prev[j] + 1;
            const ins = curr[j - 1] + 1;
            const sub = prev[j - 1] + cost;
            const val = Math.min(del, ins, sub);
            curr[j] = val;
            if (val < rowMin) rowMin = val;
        }

        if (rowMin > maxDist) return maxDist + 1;
        for (let j = 0; j <= n; j++) prev[j] = curr[j] ?? Infinity;
    }
    return prev[n];
}

/**
 * Fast fuzzyContains using:
 *  - exact substring of pre-normalized phrases
 *  - token-level fuzzy on a small token cap with capped Levenshtein
 */
function fuzzyContainsTokens(nmsg, tokens, normalizedTargets, maxDist = 1, opts = {}) {
    const { maxTokens = 80, minTokenLen = 3, maxTokenLen = 40 } = opts;

    // Exact phrase first
    for (const p of normalizedTargets) {
        if (p && nmsg.includes(p)) return true;
    }

    // Prepare limited tokens
    const toks = [];
    for (const t of tokens) {
        if (t.length >= minTokenLen && t.length <= maxTokenLen) {
            toks.push(t);
            if (toks.length >= maxTokens) break;
        }
    }

    // Fuzzy fallback
    for (const p of normalizedTargets) {
        if (!p) continue;
        const plen = p.length;
        for (const tok of toks) {
            if (Math.abs(tok.length - plen) > maxDist) continue;
            if (maxDist === 1 && tok[0] !== p[0]) continue; // micro filter
            if (levenshteinCapped(tok, p, maxDist) <= maxDist) return true;
        }
    }
    return false;
}

/***********************
 * 3) Precompute caches (For speed)
 ***********************/
//Cpr normalized set
const cprSet = new Set(cpr.map(normalizeCPR).filter(Boolean));

// Fullnames normalized set + map by first name
const normalizedFullnames = fullnames
    .map(n => normalizeText(n).trim().replace(/\s+/g, " ")) // "katrine olsen"
    .filter(Boolean);
// indexing last names by first name
const fullByFirst = new Map();
for (const n of normalizedFullnames) {
    const parts = n.split(" ");
    if (parts.length < 2) continue;
    const first = parts[0];
    if (!fullByFirst.has(first)) fullByFirst.set(first, new Set());
    fullByFirst.get(first).add(n);
}

// Normalize all titles once, and also bucket them by first char + length
const normalizedTitles = allDocTitles.map(t => normalizeText(t));
// quick exact lookup
const normTitleSet = new Set(normalizedTitles);

// length/first-letter buckets to reduce fuzzy comparisons
const titleBuckets = new Map(); // key = `${firstChar}:${len}`, value = array of normalized titles
for (const t of normalizedTitles) {
    if (!t) continue;
    const key = `${t[0] || "_"}:${t.length}`;
    if (!titleBuckets.has(key)) titleBuckets.set(key, []);
    titleBuckets.get(key).push(t);
}

// Normalize trigger lists once
const fullDocTriggers = [
    "full", "entire", "whole", "complete", "all pages", "full text",
    "complete record", "full record", "entire record", "patient record",
    "full journal", "entire journal", "whole journal", "show all",
    "print", "download", "export", "open full", "open entire"
].map(normalizeText);

const retrieveTriggers = [
    "retrieve", "fetch", "open", "display", "show", "access", "load"
].map(normalizeText);

const summaryTriggers = [
    "summarize", "summarise", "summary", "tl;dr", "brief", "briefly",
    "overview", "synopsis", "outline", "digest", "recap", "short version"
].map(normalizeText);

// Broad category keywords (fallback)
const categoryPhrases = [
    "disease", "diseases", "condition", "conditions",
    "guideline", "guidelines", "medical guideline", "nursing guideline",
    "nursing task", "task",
    "sepsis", "asthma", "copd", "ckd", "aki", "dka", "pneumonia",
    "pulmonary embolism", "pe", "migraine", "heart failure", "stroke",
    "appendicitis", "cellulitis", "pyelonephritis", "ulcerative colitis",
    "hypertension", "osteoarthritis", "covid",
    "upper gi bleed", "ugib", "anaphylaxis",
    "oxygen therapy", "ecg", "iv cannulation", "pressure injury",
    "wound care", "blood glucose", "nasogastric", "enteral feeding",
    "transfusion", "rapid response", "specimen collection"
].map(normalizeText);

/***********************
 * 4) Entity extractors
 ***********************/
function extractJournalId(text) {
    const re = /\b(?:journal|jounral|jornal|jurnal|jouranl|jorunal|journel|journl|jounal|jonal|junal)[-_ ]?(\d{1,3})\b/i;
    const m = re.exec(text);
    if (!m) return null;
    const id = parseInt(m[1], 10);
    return id >= 1 && id <= 150 ? id : null;
}

function extractFullName(text) {
    if (!text) return null;
    const toks = tokenize(text);
    if (toks.length < 2) return null;

    for (let i = 0; i < toks.length - 1; i++) {
        const first = toks[i];
        const last = toks[i + 1];
        const candidates = fullByFirst.get(first);
        if (candidates) {
            const two = `${first} ${last}`;
            if (candidates.has(two)) {
                return { first: first[0].toUpperCase() + first.slice(1), last: last[0].toUpperCase() + last.slice(1) };
            }
        }
    }

    return null;
}



function extractCPR(text) {
    if (typeof text !== "string") return null;

    // match various CPR spellings: dd.mm.yy-xxxx, dd-mm-yy xxxx, ddmmyy-xxxx, 10 digits, etc.
    const m = text.match(/\b\d{2}[.\-/ ]?\d{2}[.\-/ ]?\d{2}[- ]?\d{4}\b/);
    if (!m) return null;

    const candidate = normalizeCPR(m[0]);
    if (!candidate) return null;

    return cprSet.has(candidate) ? candidate : null;
}

/***********************
 * 5) Fast known-title match
 ***********************/
/**
 * Tries to match a known document title inside the message.
 * Strategy:
 *  1) Exact phrase on normalized message (fast)
 *  2) Fuzzy token ~ title with capped Levenshtein, but only against a small
 *     candidate set picked by first letter and length±2.
 */
function matchKnownDocTitleFast(nmsg, tokens, maxDist = 2) {
    // exact phrase
    for (const t of normalizedTitles) {
        if (t && nmsg.includes(t)) return t;
    }

    // candidate shortlist from buckets
    const shortlist = new Set();
    for (const tok of tokens) {
        if (!tok) continue;
        for (let len = tok.length - maxDist; len <= tok.length + maxDist; len++) {
            if (len <= 0) continue;
            const key = `${tok[0] || "_"}:${len}`;
            const arr = titleBuckets.get(key);
            if (arr) for (const cand of arr) shortlist.add(cand);
        }
    }

    // fuzzy check only on shortlist
    for (const cand of shortlist) {
        for (const tok of tokens) {
            if (Math.abs(tok.length - cand.length) > maxDist) continue;
            if (maxDist === 1 && tok[0] !== cand[0]) continue;
            if (levenshteinCapped(tok, cand, maxDist) <= maxDist) return cand;
        }
    }

    // broad category fallback -- disabled for now; will alow summary without a specific doc title.
    // if (fuzzyContainsTokens(nmsg, tokens, categoryPhrases, 2)) return "category-match";

    return null;
}

/***********************
 * 6) Public API
 ***********************/
export function detectIntent(message) {
    const msg = message || "";
    const nmsg = normalizeText(msg);
    const tokens = tokenize(msg);

    // Entities
    const journalId = extractJournalId(msg);
    const cpr = extractCPR(msg);
    const nameInit = extractFullName(msg);
    const knownDoc = matchKnownDocTitleFast(nmsg, tokens, 2);



    // Triggers (use pre-normalized lists)
    const wantsFull =
        fuzzyContainsTokens(nmsg, tokens, fullDocTriggers, 1) ||
        fuzzyContainsTokens(nmsg, tokens, retrieveTriggers, 1);
    const wantsSummary =
        fuzzyContainsTokens(nmsg, tokens, summaryTriggers, 2);


    // Decision (favor "hybrid")
    let mode = "hybrid";
    if ((journalId || cpr || nameInit || knownDoc) && wantsFull) {
        mode = "full";
    } else if ((journalId || cpr || nameInit || knownDoc) && wantsSummary) {
        mode = "summary";
    }

    return { mode, journalId, cpr, nameInit, knownDoc };
}
