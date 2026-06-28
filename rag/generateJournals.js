// generateJournals.js
// Generates N detailed, fictional patient journals into ./patient_journals
// Usage:
//   node generateJournals.js              -> default 150
//   node generateJournals.js 40           -> 40 files
//   JOURNAL_COUNT=60 node generateJournals.js -> 60 files
//
// Output format uses colon headers for chunking:
// Document Information, Medical History & Prior Results, Chief Complaint, History of Present Illness, Physical Examination,
// Diagnostics (Today), Assessment, Plan, Patient Education & Safety Net,
// Follow-up & Disposition, Sign-off
//
// ⚠️ Fictional content for a game. Not for clinical use.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Utilities --------------------
const OUT_DIR = path.join(__dirname, "patient_journals");

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Random realistic date (YYYY-MM-DD) between minISO and maxISO
function randomDateBetweenISO(minISO, maxISO) {
  const start = new Date(minISO).getTime();
  const end = new Date(maxISO).getTime();
  const t = Math.random() * (end - start) + start;
  return new Date(t).toISOString().slice(0, 10);
}

// Random realistic date (YYYY-MM-DD) between 2023-01-01 and today
function randomDateISO(minISO = "2023-01-01") {
  const start = new Date(minISO).getTime();
  const end = Date.now();
  const t = Math.random() * (end - start) + start;
  return new Date(t).toISOString().slice(0, 10);
}

// Danish-like CPR: DDMMYY-XXXX (no checksum validation; fictional)
function fakeCPR() {
  const year = rint(1930, 2008); // adult-ish range
  const y2 = String(year).slice(-2);
  const month = String(rint(1, 12)).padStart(2, "0");
  const day = String(rint(1, 28)).padStart(2, "0"); // simple valid day
  const suffix = String(rint(0, 9999)).padStart(4, "0");
  return `${day}${month}${y2}-${suffix}`;
}

// Year helper bounded by encounter year
function randPastYear(encounterISO, minYear = 1980) {
  const encYear = new Date(encounterISO).getFullYear();
  const hi = Math.max(minYear, encYear - 1);
  return rint(minYear, hi);
}

// Date within N months before encounter date
function dateBeforeEncounter(
  encounterISO,
  monthsBackMin = 1,
  monthsBackMax = 12
) {
  const enc = new Date(encounterISO);
  const m = rint(monthsBackMin, monthsBackMax);
  const minDate = new Date(enc);
  minDate.setMonth(minDate.getMonth() - m);
  const minISO = minDate.toISOString().slice(0, 10);
  const maxISO = new Date(enc.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return randomDateBetweenISO(minISO, maxISO);
}

// -------------------- Pools --------------------
const firstNames = [
  "Anders",
  "Mette",
  "Jonas",
  "Kirsten",
  "Lars",
  "Sanne",
  "Peter",
  "Camilla",
  "Thomas",
  "Nina",
  "Rasmus",
  "Grethe",
  "Christian",
  "Lene",
  "Brian",
  "Helle",
  "Maja",
  "Søren",
  "Ida",
  "Frederik",
  "Julie",
  "Morten",
  "Anja",
  "Ole",
  "Birgit",
  "Emil",
  "Tina",
  "Viggo",
  "Solveig",
  "Carsten",
  "Maria",
  "Sebastian",
  "Katrine",
  "Henrik",
  "Louise",
  "Niklas",
  "Anne",
  "Rune",
  "Sofia",
  "Magnus",
];

const lastNames = [
  "Nielsen",
  "Hansen",
  "Larsen",
  "Madsen",
  "Pedersen",
  "Sørensen",
  "Kristensen",
  "Jensen",
  "Rasmussen",
  "Thomsen",
  "Poulsen",
  "Christensen",
  "Mortensen",
  "Olsen",
  "Andersen",
  "Iversen",
  "Mikkelsen",
  "Holm",
  "Bæk",
  "Laursen",
  "Petersen",
  "Johansen",
  "Knudsen",
  "Østergaard",
  "Gram",
  "Bjørk",
  "Dam",
  "Thygesen",
  "Skov",
  "Bang",
  "Lund",
];

function patientName() {
  return `${rand(firstNames)} ${rand(lastNames)}`;
}

const doctors = [
  "Dr. H. Sørensen, Internal Medicine",
  "Dr. L. Holm, Cardiology",
  "Dr. P. Jensen, Psychiatry",
  "Dr. S. Nielsen, Pulmonology",
  "Dr. A. Thomsen, Emergency Medicine",
  "Dr. J. Knudsen, ENT",
  "Dr. M. Petersen, Gastroenterology",
  "Dr. R. Iversen, Neurology",
  "Dr. C. Mikkelsen, Endocrinology",
  "Dr. K. Østergaard, General Surgery",
  "Dr. V. Laursen, Nephrology",
  "Dr. T. Bæk, Infectious Diseases",
  "Dr. E. Dam, Rheumatology",
  "Dr. S. Gram, Hematology",
  "Dr. O. Bjørk, Urology",
];
const authorName = () => rand(doctors);

// Tiny helpers to vary vitals/phrasing
const vitals = () => ({
  HR: rint(58, 118),
  RR: rint(12, 26),
  BPsys: rint(98, 168),
  BPdia: rint(58, 98),
  Temp: (36 + Math.random() * 2.3).toFixed(1),
  SpO2: rint(92, 100),
});

// -------------------- Medical History & Prior Results --------------------
const dxPool = [
  "Hypertension",
  "Iron Deficiency",
  "Type 2 Diabetes",
  "Asthma",
  "COPD",
  "Heart failure (HFpEF)",
  "Heart failure (HFrEF)",
  "CKD",
  "Dyslipidemia",
  "Peptic ulcer disease",
  "GERD",
  "Depression",
  "Anxiety",
  "Migraine",
  "Osteoarthritis",
  "Hypothyroidism",
  "Atrial fibrillation",
  "Obesity",
  "Irritable bowel syndrome",
  "Gout",
  "Gallstones",
  "Psoriasis",
  "Osteoporosis",
];

const medPool = [
  "Ramipril 5 mg daily",
  "Lisinopril 10 mg daily",
  "Amlodipine 5 mg daily",
  "Metformin 500 mg BID",
  "Empagliflozin 10 mg daily",
  "Atorvastatin 20 mg nightly",
  "Ferrous sulfate 100 mg every other day",
  "Pantoprazole 40 mg daily",
  "Furosemide 40 mg daily",
  "Bisoprolol 5 mg daily",
  "Levothyroxine 75 µg daily",
];

// Use em dashes instead of colons in this block
const consultTemplates = [
  (d) => `${d} — Routine check-up — stable BP, mild anemia noted.`,
  (d) => `${d} — Follow-up for anemia — improved fatigue after iron therapy.`,
  (d) =>
    `${d} — Medication review — adherence reinforced, no adverse effects reported.`,
  (d) =>
    `${d} — Respiratory review — inhaler technique optimized, symptoms improved.`,
  (d) =>
    `${d} — Heart failure clinic — diuretic adjusted, weight trending down.`,
];

function buildMedicalHistoryBlock(encounterISO) {
  // Past Diagnoses
  const dxCount = rint(2, 4);
  const pool = [...dxPool];
  const dxItems = [];
  for (let i = 0; i < dxCount && pool.length; i++) {
    const idx = rint(0, pool.length - 1);
    dxItems.push(`${pool.splice(idx, 1)[0]} (${randPastYear(encounterISO)})`);
  }
  if (Math.random() < 0.6) dxItems.push("Chronic lower back pain");

  // Recent Lab Results date (within 1–3 months)
  const labsDate = dateBeforeEncounter(encounterISO, 1, 3);
  const hb = (6.5 + Math.random() * 2.0).toFixed(1); // mmol/L
  const ferritin = rint(8, 150); // µg/L
  const crp = rint(1, 25); // mg/L
  const creat = rint(55, 110); // µmol/L
  const hbFlag = Number(hb) < 7.5 ? " (low)" : "";
  const ferritinFlag = ferritin < 15 ? " (low)" : "";
  const crpFlag = "";
  const creatFlag = "";

  // Prior Consultations (two items, 3–12 months back)
  const c1 = consultTemplates[rint(0, consultTemplates.length - 1)](
    dateBeforeEncounter(encounterISO, 3, 12)
  );
  const c2 = consultTemplates[rint(0, consultTemplates.length - 1)](
    dateBeforeEncounter(encounterISO, 3, 12)
  );

  // Medications (2–4)
  const medsPool = [...medPool];
  const medCount = rint(2, 4);
  const meds = [];
  for (let i = 0; i < medCount && medsPool.length; i++) {
    meds.push(medsPool.splice(rint(0, medsPool.length - 1), 1)[0]);
  }

  // Allergies
  const allergies =
    Math.random() < 0.8
      ? "None known."
      : rand([
        "Penicillin (rash).",
        "ACE inhibitors (cough).",
        "NSAIDs (dyspepsia).",
      ]);

  const lines = [];
  lines.push("Medical History & Prior Results:");
  lines.push(`- Past Diagnoses — ${dxItems.join(", ")}.`);
  lines.push(`- Recent Lab Results (${labsDate})`);
  lines.push(`    Hb ${hb} mmol/L${hbFlag}`);
  lines.push(`    Ferritin ${ferritin} µg/L${ferritinFlag}`);
  lines.push(`    CRP ${crp} mg/L${crpFlag}`);
  lines.push(`    Creatinine ${creat} µmol/L${creatFlag}`);
  lines.push(`- Prior Consultations`);
  lines.push(`    - ${c1}`);
  lines.push(`    - ${c2}`);
  lines.push(`- Medications — ${meds.join(", ")}.`);
  lines.push(`- Allergies — ${allergies}`);
  lines.push("");
  return lines;
}

// -------------------- Condition Templates --------------------
const conditions = [
  {
    tag: "Iron-Deficiency Anemia",
    cc: (n) =>
      `${n} reports fatigue, reduced exercise tolerance, and occasional lightheadedness.`,
    hpi: (n) =>
      `${n} notes weeks of progressive tiredness and exertional dyspnea. Diet is low in iron-rich foods; denies obvious bleeding but reports intermittent dyspepsia with NSAID use. No black stools observed at home.`,
    exam: () => {
      const v = vitals();
      return `Pale conjunctivae; soft systolic flow murmur; no focal deficits. Vitals stable (BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm). Abdomen soft, non-tender.`;
    },
    dx: () =>
      `Hb low with microcytosis, low ferritin, and reduced transferrin saturation. Stool testing and GI evaluation considered if no dietary cause identified.`,
    assessment: `Microcytic anemia most consistent with iron deficiency; source evaluation warranted (dietary vs occult GI blood loss).`,
    plan: [
      `Start oral iron with vitamin C; discuss GI side effects and adherence strategies (alternate-day dosing if needed).`,
      `Review NSAID exposure and consider gastroprotection or alternatives.`,
      `Arrange GI work-up if poor response or red flags emerge (e.g., melena, weight loss).`,
    ],
    education: `Explain expected timeline for symptom improvement and iron store repletion. Advise on iron-rich foods and to seek care for black stools, severe dizziness, or chest pain.`,
    followup: () =>
      `Recheck Hb and ferritin in ${rint(
        6,
        8
      )} weeks; earlier review if symptoms worsen.`,
  },
  {
    tag: "Community-Acquired Pneumonia",
    cc: (n) =>
      `${n} complains of fever, productive cough, and right-sided chest pain.`,
    hpi: (n) =>
      `${n} developed a sudden cough with green sputum ${rint(
        2,
        6
      )} days ago, followed by fevers and pleuritic pain. Increased breathlessness when climbing stairs; no recent travel.`,
    exam: () => {
      const v = vitals();
      return `Febrile (${v.Temp} °C), RR ${v.RR}/min, SpO₂ ${v.SpO2}% on room air. Crackles and bronchial breath sounds over the right lower zone; no peripheral edema.`;
    },
    dx: () =>
      `CXR shows right lower lobe consolidation. CRP elevated; WBC mildly raised. Consider sputum culture if severe or atypical features.`,
    assessment: `Community-acquired pneumonia, lobar pattern, clinically stable for ward/ambulatory care depending on scores.`,
    plan: [
      `Start empiric antibiotics per local protocol; provide antipyretics and hydration.`,
      `Titrate oxygen to target saturations and encourage early mobilization and incentive spirometry.`,
      `Review response within 48–72 hours; escalate if hypoxemia or sepsis criteria develop.`,
    ],
    education: `Discuss contagious period, cough hygiene, and gradual return to activity. Reinforce smoking cessation and vaccination where applicable.`,
    followup: () =>
      `Safety check in ${rint(
        2,
        3
      )} days if outpatient; clinical review in ${rint(
        1,
        2
      )} weeks to ensure recovery.`,
  },
  {
    tag: "Type 2 Diabetes – Hyperglycemia Visit",
    cc: (n) => `${n} reports thirst, frequent urination, and blurred vision.`,
    hpi: (n) =>
      `${n} has several weeks of polyuria, polydipsia, and fatigue. Diet has been irregular during recent work stress; missed evening doses twice last week. No abdominal pain or vomiting.`,
    exam: () => {
      const v = vitals();
      return `Vitals: BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm. Dry mucous membranes; otherwise normal exam; no focal deficits.`;
    },
    dx: () =>
      `Capillary glucose elevated; ketones negative or trace; no acidosis on venous blood gas. HbA1c ordered for control assessment.`,
    assessment: `Poor glycemic control without DKA. Medication adherence and lifestyle contributors likely.`,
    plan: [
      `Reinforce medication schedule; consider adding or adjusting therapy per plan.`,
      `Hydration guidance and sick-day rules; check for precipitating infection.`,
      `Arrange diabetes education and home glucose monitoring review.`,
    ],
    education: `Review hypoglycemia recognition and treatment. Encourage regular meals, activity, and sleep hygiene to stabilize control.`,
    followup: () =>
      `Clinic follow-up in ${rint(
        2,
        4
      )} weeks to assess response and review HbA1c.`,
  },
  // -------------------- Mental disorders --------------------
  {
    tag: "Bipolar Affective Disorder – Current Manic Episode",
    cc: (n) =>
      `${n} reports decreased need for sleep, elevated mood, and increased goal-directed activity.`,
    hpi: (n) =>
      `${n} describes two weeks of heightened energy, rapid speech, and impulsive spending. Sleep reduced to 3–4 hours per night. Denies hallucinations or substance use.`,
    exam: () => {
      const v = vitals();
      return `Alert, restless, pressured speech, euphoric and irritable mood. No psychosis. Vitals stable (BP ${v.BPsys}/${v.BPdia}, HR ${v.HR} bpm).`;
    },
    dx: () =>
      `Findings consistent with manic episode; labs for lithium and thyroid function ordered.`,
    assessment: `Bipolar affective disorder, type I, current manic episode.`,
    plan: [
      `Continue or initiate mood stabilizer (e.g., lithium or valproate).`,
      `Discontinue antidepressants if present.`,
      `Offer short inpatient stabilization if insight poor or risk increases.`,
    ],
    education: `Discuss relapse prevention, importance of sleep, and medication adherence. Provide crisis contact information.`,
    followup: () =>
      `Follow-up in ${rint(5, 10)} days to reassess mood and safety.`,
  },

  {
    tag: "Major Depressive Episode",
    cc: (n) =>
      `${n} reports persistent sadness, fatigue, and loss of interest in usual activities.`,
    hpi: (n) =>
      `${n} has felt low for the past ${rint(
        3,
        8
      )} weeks, with poor concentration and early morning waking. Denies psychosis or suicidal plan.`,
    exam: () => {
      const v = vitals();
      return `Flat affect, slow speech, psychomotor retardation. No delusions. Vitals normal (BP ${v.BPsys}/${v.BPdia}, HR ${v.HR}).`;
    },
    dx: () =>
      `Depressive symptoms meeting diagnostic criteria; exclude thyroid or medication causes.`,
    assessment: `Major depressive episode, moderate severity.`,
    plan: [
      `Start SSRI (e.g., sertraline 50 mg daily) or adjust current therapy.`,
      `Encourage structured daily routine and gradual activity.`,
      `Refer for psychotherapy or CBT.`,
    ],
    education: `Discuss early treatment effects, side effects, and warning signs. Provide emergency numbers for crisis support.`,
    followup: () =>
      `Follow-up in ${rint(2, 4)} weeks to assess mood and adherence.`,
  },
  {
    tag: "Generalized Anxiety Disorder",
    cc: (n) => `${n} reports constant worry, muscle tension, and poor sleep.`,
    hpi: (n) =>
      `${n} describes months of excessive anxiety difficult to control, with restlessness and fatigue. Denies panic attacks or substance misuse.`,
    exam: () => {
      const v = vitals();
      return `Anxious affect, fidgeting. HR ${v.HR} bpm, BP ${v.BPsys}/${v.BPdia} mmHg. No tremor or thyrotoxicosis signs.`;
    },
    dx: () =>
      `Persistent anxiety with somatic tension; exclude thyroid and cardiac causes.`,
    assessment: `Generalized anxiety disorder.`,
    plan: [
      `Begin CBT-focused therapy; consider SSRI or SNRI if persistent.`,
      `Teach breathing and relaxation exercises.`,
      `Avoid benzodiazepines long term.`,
    ],
    education: `Explain nature of chronic anxiety and coping tools. Encourage sleep hygiene and regular exercise.`,
    followup: () => `Review in ${rint(3, 6)} weeks to monitor response.`,
  },
  {
    tag: "Schizophrenia – Acute Exacerbation",
    cc: (n) =>
      `${n} presents with hearing voices and increased suspiciousness.`,
    hpi: (n) =>
      `${n} reports auditory hallucinations and belief that neighbors are watching. Sleep poor; no substance use disclosed. Non-adherent with medication for 2 weeks.`,
    exam: () => {
      const v = vitals();
      return `Distracted by internal stimuli, flat affect, limited insight. Vitals: BP ${v.BPsys}/${v.BPdia}, HR ${v.HR} bpm.`;
    },
    dx: () => `Active psychosis; rule out intoxication or medical cause.`,
    assessment: `Schizophrenia, acute exacerbation due to medication nonadherence.`,
    plan: [
      `Restart antipsychotic (oral or depot).`,
      `Ensure safe environment; involve crisis team.`,
      `Assess capacity and consider inpatient admission if risk present.`,
    ],
    education: `Discuss importance of medication adherence and early relapse signs with patient and relatives.`,
    followup: () =>
      `Close follow-up within ${rint(3, 7)} days or inpatient as required.`,
  },
  {
    tag: "Adjustment Disorder with Mixed Anxiety and Depressed Mood",
    cc: (n) =>
      `${n} reports stress and low mood following a recent life event.`,
    hpi: (n) =>
      `${n} describes sadness, irritability, and worry after recent psychosocial stressor (job loss, relationship conflict). Duration <6 months.`,
    exam: () => {
      const v = vitals();
      return `Mildly tearful, cooperative, no psychosis. Vitals within normal range (BP ${v.BPsys}/${v.BPdia}).`;
    },
    dx: () =>
      `Emotional disturbance related to identifiable stressor, not meeting full criteria for major depression.`,
    assessment: `Adjustment disorder with mixed anxiety and depressed mood.`,
    plan: [
      `Provide supportive counselling.`,
      `Encourage coping strategies and social support.`,
      `Short-term anxiolytic if severe insomnia or anxiety.`,
    ],
    education: `Explain normal stress reactions and when to seek help. Promote daily structure and self-care.`,
    followup: () => `Follow-up in ${rint(3, 5)} weeks to reassess.`,
  },
  {
    tag: "Panic Disorder",
    cc: (n) =>
      `${n} reports recurrent episodes of sudden intense fear and palpitations.`,
    hpi: (n) =>
      `${n} describes abrupt attacks of shortness of breath, chest tightness, and fear of dying lasting ${rint(
        5,
        15
      )} minutes. Between attacks, anticipatory anxiety persists.`,
    exam: () => {
      const v = vitals();
      return `During visit, mildly anxious, HR ${v.HR} bpm, BP ${v.BPsys}/${v.BPdia}. ECG normal.`;
    },
    dx: () =>
      `Recurrent panic attacks without underlying cardiac or endocrine cause.`,
    assessment: `Panic disorder.`,
    plan: [
      `Provide CBT focused on panic management.`,
      `Consider SSRI for long-term control.`,
      `Educate on breathing and relaxation techniques.`,
    ],
    education: `Explain physiological basis of panic and avoidance behaviors. Encourage gradual exposure to feared situations.`,
    followup: () => `Follow-up in ${rint(4, 6)} weeks for progress evaluation.`,
  },
  {
    tag: "Post-Traumatic Stress Disorder (PTSD)",
    cc: (n) => `${n} reports nightmares, flashbacks, and hypervigilance.`,
    hpi: (n) =>
      `${n} experienced a traumatic event ${rint(
        3,
        12
      )} months ago and now has intrusive memories, sleep disturbance, and avoidance of reminders.`,
    exam: () => {
      const v = vitals();
      return `Alert, tense, occasional tearfulness. Startles easily. Vitals: BP ${v.BPsys}/${v.BPdia}, HR ${v.HR} bpm.`;
    },
    dx: () =>
      `Symptoms meet criteria for PTSD; rule out concurrent depression or substance misuse.`,
    assessment: `Post-traumatic stress disorder.`,
    plan: [
      `Refer for trauma-focused CBT or EMDR.`,
      `Avoid routine benzodiazepine use.`,
      `Consider SSRI if comorbid depression or anxiety.`,
    ],
    education: `Discuss trauma response normalization and coping strategies. Encourage gradual exposure and social support.`,
    followup: () =>
      `Follow-up in ${rint(3, 5)} weeks to review therapy engagement.`,
  },

  // -------------------- Somatic disorders --------------------
  {
    tag: "Hypertension – Uncontrolled",
    cc: (n) =>
      `${n} presents for follow-up with persistently elevated blood pressure readings.`,
    hpi: (n) =>
      `${n} notes occasional headaches and dizziness. Adherence to medication inconsistent; diet high in salt.`,
    exam: () => {
      const v = vitals();
      return `BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm, no edema, no murmurs.`;
    },
    dx: () => `Office BP elevated; renal function and electrolytes ordered.`,
    assessment: `Essential hypertension, suboptimally controlled.`,
    plan: [
      `Reinforce lifestyle modification (salt restriction, exercise).`,
      `Increase or add antihypertensive therapy.`,
      `Monitor home BP readings.`,
    ],
    education: `Explain importance of adherence and cardiovascular risk reduction.`,
    followup: () => `Review in ${rint(3, 6)} weeks with BP log.`,
  },
  {
    tag: "Heart Failure Exacerbation",
    cc: (n) => `${n} reports shortness of breath and leg swelling.`,
    hpi: (n) =>
      `${n} has gained ${rint(
        2,
        4
      )} kg over the past week, with worsening dyspnea and orthopnea. Missed diuretic doses reported.`,
    exam: () => {
      const v = vitals();
      return `Crackles at lung bases, bilateral pitting edema, elevated JVP. BP ${v.BPsys}/${v.BPdia}, HR ${v.HR} bpm.`;
    },
    dx: () => `BNP elevated, chest X-ray shows pulmonary congestion.`,
    assessment: `Acute-on-chronic heart failure exacerbation.`,
    plan: [
      `Administer loop diuretic (e.g., furosemide).`,
      `Monitor weight and urine output.`,
      `Optimize heart failure regimen and education.`,
    ],
    education: `Teach daily weight monitoring, salt restriction, and when to seek urgent care.`,
    followup: () =>
      `Follow-up in ${rint(1, 2)} weeks or earlier if symptoms recur.`,
  },
  {
    tag: "COPD Exacerbation",
    cc: (n) => `${n} complains of increased cough, sputum, and breathlessness.`,
    hpi: (n) =>
      `${n} reports ${rint(
        3,
        6
      )} days of worsening cough with purulent sputum and wheeze. No fever or chest pain.`,
    exam: () => {
      const v = vitals();
      return `RR ${v.RR}/min, SpO₂ ${v.SpO2}%. Wheezes and prolonged expiration on auscultation.`;
    },
    dx: () => `Likely infective COPD exacerbation; sputum culture if severe.`,
    assessment: `COPD exacerbation, mild to moderate.`,
    plan: [
      `Increase bronchodilator frequency.`,
      `Start oral corticosteroid and consider antibiotic if purulent.`,
      `Ensure inhaler technique and smoking cessation advice.`,
    ],
    education: `Discuss exacerbation action plan and vaccination importance.`,
    followup: () => `Review in ${rint(2, 4)} weeks post-treatment.`,
  },
  {
    tag: "Acute Appendicitis",
    cc: (n) =>
      `${n} presents with right lower quadrant abdominal pain and nausea.`,
    hpi: (n) =>
      `${n} reports ${rint(
        6,
        24
      )} hours of migrating abdominal pain, initially periumbilical, now localized to right iliac fossa, with mild fever.`,
    exam: () => {
      const v = vitals();
      return `T ${v.Temp} °C, tenderness and rebound in right lower quadrant, guarding present.`;
    },
    dx: () =>
      `Leukocytosis and elevated CRP; ultrasound/CT confirms inflamed appendix.`,
    assessment: `Acute appendicitis.`,
    plan: [
      `NPO, IV fluids, analgesia.`,
      `Surgical evaluation for appendectomy.`,
      `Administer pre-operative antibiotics.`,
    ],
    education: `Explain surgical procedure and recovery expectations.`,
    followup: () => `Postoperative review in ${rint(7, 10)} days.`,
  },
  {
    tag: "Gastritis / Peptic Ulcer Disease",
    cc: (n) => `${n} reports epigastric pain and indigestion.`,
    hpi: (n) =>
      `${n} has burning upper abdominal pain related to meals. Uses NSAIDs intermittently; no hematemesis.`,
    exam: () => {
      const v = vitals();
      return `Epigastric tenderness, no guarding. Vitals: BP ${v.BPsys}/${v.BPdia}, HR ${v.HR}.`;
    },
    dx: () => `Suspected gastritis/ulcer; H. pylori test ordered.`,
    assessment: `Peptic ulcer disease, likely NSAID-related.`,
    plan: [
      `Stop NSAIDs; start PPI (e.g., pantoprazole 40 mg daily).`,
      `If positive, treat H. pylori.`,
      `Advise small, frequent meals and limit alcohol/caffeine.`,
    ],
    education: `Explain risk factors and warning signs of bleeding.`,
    followup: () =>
      `Reassess in ${rint(4, 6)} weeks; consider endoscopy if persistent.`,
  },
  {
    tag: "Migraine Attack",
    cc: (n) => `${n} presents with throbbing unilateral headache and nausea.`,
    hpi: (n) =>
      `${n} reports recurrent headaches lasting ${rint(
        4,
        24
      )} hours, aggravated by light and noise. No focal neurological deficits.`,
    exam: () => {
      const v = vitals();
      return `Normal neuro exam. BP ${v.BPsys}/${v.BPdia}, HR ${v.HR}.`;
    },
    dx: () =>
      `Clinical diagnosis of migraine; exclude secondary causes if atypical.`,
    assessment: `Migraine without aura.`,
    plan: [
      `Administer triptan and antiemetic as needed.`,
      `Avoid triggers, maintain hydration and regular sleep.`,
      `Consider prophylactic therapy if frequent attacks.`,
    ],
    education: `Discuss trigger identification and medication overuse prevention.`,
    followup: () =>
      `Follow-up in ${rint(4, 8)} weeks for frequency reassessment.`,
  },
  {
    tag: "Urinary Tract Infection",
    cc: (n) => `${n} reports dysuria, frequency, and suprapubic discomfort.`,
    hpi: (n) =>
      `${n} developed burning on urination for ${rint(
        2,
        5
      )} days. No flank pain or fever.`,
    exam: () => {
      const v = vitals();
      return `Afebrile (${v.Temp} °C), suprapubic tenderness. No costovertebral angle tenderness.`;
    },
    dx: () => `Urinalysis positive for nitrites and leukocytes.`,
    assessment: `Uncomplicated lower urinary tract infection.`,
    plan: [
      `Start short course of oral antibiotic per protocol.`,
      `Encourage fluid intake.`,
      `Review symptoms resolution.`,
    ],
    education: `Advise to complete antibiotics and monitor for fever or flank pain.`,
    followup: () => `Follow-up if symptoms persist beyond ${rint(3, 5)} days.`,
  },
  {
    tag: "Pyelonephritis",
    cc: (n) => `${n} presents with fever, flank pain, and urinary symptoms.`,
    hpi: (n) =>
      `${n} reports ${rint(
        1,
        3
      )} days of dysuria, chills, and right-sided flank pain.`,
    exam: () => {
      const v = vitals();
      return `T ${v.Temp} °C, costovertebral angle tenderness on right side. HR ${v.HR} bpm.`;
    },
    dx: () => `Urinalysis positive for nitrites; elevated CRP and WBC.`,
    assessment: `Acute pyelonephritis.`,
    plan: [
      `Start empiric antibiotic therapy.`,
      `Hydration and pain control.`,
      `Hospitalize if vomiting or sepsis.`,
    ],
    education: `Advise early presentation for recurrence; complete full antibiotic course.`,
    followup: () => `Recheck in ${rint(7, 10)} days to confirm recovery.`,
  },
  {
    tag: "Gout Flare",
    cc: (n) => `${n} reports sudden onset of joint pain and swelling.`,
    hpi: (n) =>
      `${n} developed severe pain in the first MTP joint overnight, with redness and swelling. No trauma or fever.`,
    exam: () => {
      const v = vitals();
      return `Erythematous, tender MTP joint. Vitals: BP ${v.BPsys}/${v.BPdia}, HR ${v.HR}.`;
    },
    dx: () =>
      `Serum uric acid elevated; joint aspirate with monosodium urate crystals.`,
    assessment: `Acute gout attack.`,
    plan: [
      `Start NSAID or colchicine (if renal function allows).`,
      `Elevate limb and apply ice packs.`,
      `Review long-term urate-lowering therapy adherence.`,
    ],
    education: `Avoid alcohol and purine-rich foods; maintain hydration.`,
    followup: () => `Follow-up in ${rint(3, 7)} days to monitor improvement.`,
  },
  {
    tag: "Osteoarthritis Flare",
    cc: (n) => `${n} presents with joint stiffness and increased pain.`,
    hpi: (n) =>
      `${n} notes worsening knee pain over ${rint(
        5,
        14
      )} days, aggravated by activity. No trauma or systemic symptoms.`,
    exam: () => {
      const v = vitals();
      return `Mild joint effusion, bony tenderness, no warmth. BP ${v.BPsys}/${v.BPdia}.`;
    },
    dx: () => `No acute inflammation; radiographs show osteoarthritic changes.`,
    assessment: `Osteoarthritis flare-up.`,
    plan: [
      `Use acetaminophen or topical NSAID.`,
      `Encourage physiotherapy and weight management.`,
      `Avoid prolonged inactivity.`,
    ],
    education: `Discuss chronic nature of OA and exercise importance.`,
    followup: () => `Reassess pain control in ${rint(4, 8)} weeks.`,
  },
  {
    tag: "Chronic Low Back Pain – Exacerbation",
    cc: (n) => `${n} reports worsening lower back pain.`,
    hpi: (n) =>
      `${n} has chronic back pain now intensified after lifting or prolonged sitting. No radicular symptoms or incontinence.`,
    exam: () => {
      const v = vitals();
      return `Paraspinal muscle tenderness, normal reflexes and strength. BP ${v.BPsys}/${v.BPdia}.`;
    },
    dx: () => `Mechanical exacerbation of chronic low back pain.`,
    assessment: `Chronic low back pain, acute exacerbation.`,
    plan: [
      `Encourage activity as tolerated.`,
      `Use heat therapy and simple analgesics.`,
      `Refer for physiotherapy if persistent.`,
    ],
    education: `Discuss posture, core strengthening, and weight control.`,
    followup: () => `Follow-up in ${rint(3, 6)} weeks.`,
  },
  {
    tag: "Viral Upper Respiratory Infection",
    cc: (n) => `${n} reports sore throat, cough, and mild fever.`,
    hpi: (n) =>
      `${n} developed nasal congestion and cough ${rint(
        2,
        5
      )} days ago. No dyspnea or chest pain.`,
    exam: () => {
      const v = vitals();
      return `T ${v.Temp} °C, mild pharyngeal erythema, lungs clear.`;
    },
    dx: () => `Clinical diagnosis of viral upper respiratory tract infection.`,
    assessment: `Viral URI.`,
    plan: [
      `Supportive care: rest, fluids, paracetamol for fever.`,
      `Avoid unnecessary antibiotics.`,
      `Educate on hygiene and infection control.`,
    ],
    education: `Reassure benign course; return if high fever or worsening.`,
    followup: () =>
      `Follow-up only if symptoms persist beyond ${rint(7, 10)} days.`,
  },
  {
    tag: "Cellulitis",
    cc: (n) => `${n} presents with redness and swelling of the lower leg.`,
    hpi: (n) =>
      `${n} noticed redness and tenderness spreading over ${rint(
        1,
        3
      )} days. No trauma reported.`,
    exam: () => {
      const v = vitals();
      return `Warm, erythematous area with indistinct margins, mild edema. T ${v.Temp} °C.`;
    },
    dx: () => `Clinical cellulitis; CBC and CRP elevated.`,
    assessment: `Bacterial cellulitis, likely streptococcal.`,
    plan: [
      `Start empiric oral antibiotic covering streptococci.`,
      `Mark margin and monitor spread.`,
      `Elevate limb and manage pain.`,
    ],
    education: `Explain signs of worsening infection and when to seek urgent review.`,
    followup: () => `Review in ${rint(2, 3)} days to assess response.`,
  },
];

// -------------------- Builder --------------------
function buildEntry() {
  const cond = rand(conditions);
  const name = patientName();
  const cpr = fakeCPR();
  const encounterDate = randomDateISO();
  const author = authorName();

  const lines = [];
  lines.push("Document Information:");
  lines.push(`CPR-number - ${cpr}`);
  lines.push(`Encounter Date - ${encounterDate}`);
  lines.push(`Author - ${author}`);
  lines.push(`Patient Name - ${name}`);
  lines.push("");

  // Medical History & Prior Results (no colons in subsections)
  lines.push(...buildMedicalHistoryBlock(encounterDate));

  lines.push("Present Illness:");
  lines.push(`   - ${cond.cc(name)}`);
  lines.push(`- History of Present Illness`);
  lines.push(`   - ${cond.hpi(name)}`);
  lines.push(`- Physical Examination`);
  lines.push(`   - ${cond.exam()}`);
  lines.push(`- Diagnostics (Today)`);
  lines.push(`   - ${cond.dx()}`);
  lines.push(`- Assessment`);
  lines.push(`   - ${cond.assessment}`);
  lines.push("");

  lines.push("Plan:");
  for (const p of cond.plan) lines.push(`   - ${p}`);
  lines.push("- Follow-up & Disposition");
  lines.push(`   - ${cond.followup()}`);
  lines.push("");

  lines.push("Patient Education & Safety Net:");
  lines.push(cond.education);
  lines.push("");

  lines.push("Sign-off:");
  lines.push(author);
  lines.push("");

  return { text: lines.join("\n"), name, cpr };
}

// -------------------- Main --------------------
const argCount = Number(process.argv[2]);
const envCount = Number(process.env.JOURNAL_COUNT);
const COUNT =
  Number.isFinite(argCount) && argCount > 0
    ? Math.floor(argCount)
    : Number.isFinite(envCount) && envCount > 0
      ? Math.floor(envCount)
      : 150;

// Fresh output directory
if (fs.existsSync(OUT_DIR))
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// NEW: collectors
const allNames = [];
const allCPRs = [];

// Write files
for (let i = 1; i <= COUNT; i++) {
  const { text, name, cpr } = buildEntry();
  fs.writeFileSync(path.join(OUT_DIR, `journal${i}.txt`), text, "utf8");
  allNames.push(name);
  allCPRs.push(cpr);
}

// NEW: export lists (JSON arrays)
fs.writeFileSync(
  path.join(OUT_DIR, "fullnames.json"),
  JSON.stringify(allNames, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(OUT_DIR, "cprs.json"),
  JSON.stringify(allCPRs, null, 2),
  "utf8"
);

console.log(`Generated ${COUNT} detailed journal files in ${OUT_DIR}`);
console.log(
  `Also wrote ${path.join(OUT_DIR, "fullnames.json")} and ${path.join(
    OUT_DIR,
    "cprs.json"
  )}`
);
