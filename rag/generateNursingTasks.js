// generateNursingTasks.js
// Generates a set of nursing task guideline documents as plain text strings (one .txt per task),
// formatted for colon-based chunking with a single "Document Information" block per file.
//
// EXACT SECTIONS (in order):
// 1) Document Information
// 2) Purpose
// 3) Scope
// 4) Indications
// 5) Contraindications
// 6) Equipment
// 7) Procedure Steps
// 8) Monitoring & Documentation
// 9) Patient/Family Education
// 10) Escalation
// 11) Safety Notes
//
// Rules:
// - Do NOT include TITLE or Version or any header lines inside the content.
// - Date is random, realistic (between 2023-01-01 and today) and appears ONLY in "Document Information".
// - File name (task name) functions as the title outside the document.
// - Each section contains ≥ 1–2 sentences and is task-specific.
// - Headers end with ":" and content follows on the next line.
//
// ⚠️ Fictional content for a game. Not for clinical use.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "nursing_tasks");

// Fresh output directory each run
if (fs.existsSync(OUT_DIR))
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper to make safe filenames
const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Random realistic date (YYYY-MM-DD) between 2023-01-01 and today
function randomDateISO(minISO = "2023-01-01") {
  const start = new Date(minISO).getTime();
  const end = Date.now();
  const t = Math.random() * (end - start) + start;
  return new Date(t).toISOString().slice(0, 10);
}

// Fixed section order
const SECTION_ORDER = [
  "Document Information",
  "Purpose",
  "Scope",
  "Indications",
  "Contraindications",
  "Equipment",
  "Procedure Steps",
  "Monitoring & Documentation",
  "Patient/Family Education",
  "Escalation",
  "Safety Notes",
];

// =================== TASK DOCS (each entry -> one file) ===================
const tasks = [
  {
    task: "Peripheral IV Cannulation (PVC) Insertion",
    department: "Medical Ward / Infection Medicine",
    sections: {
      Purpose:
        "Provide standardized steps for safe insertion, securement, and initial care of a peripheral venous catheter in adults. Emphasize asepsis, vessel preservation, and documentation clarity.",
      Scope:
        "Applies to registered nurses trained and authorized in PVC insertion across ward, ED, day-case, or outpatient settings. Students may assist under direct supervision.",
      Indications:
        "Short-term IV access for medication administration, fluids, or contrast. Temporary access while awaiting central access or for preoperative therapy.",
      Contraindications:
        "Severe local infection or dermatitis at the intended site, lymphoedema, or limb with AV fistula or prior axillary node dissection. Avoid small fragile veins for vesicants or hyperosmolar infusions.",
      Equipment:
        "Appropriate gauge catheter, tourniquet, chlorhexidine/alcohol antiseptic, sterile gloves, transparent dressing, stabilization device, extension set, needle-free connector, 0.9% saline flush, labels, and sharps container.",
      "Procedure Steps":
        "Perform hand hygiene and PPE; verify identity and allergies; explain the procedure. Select a suitable vein (prefer forearm), clean with antiseptic and allow to dry, insert at 15–30° until flashback, advance cannula, dispose sharps safely, attach extension and flush, secure with sterile dressing and label.",
      "Monitoring & Documentation":
        "Inspect site per shift for phlebitis, infiltration, leakage, and dressing integrity. Document site, gauge, attempts, patency, patient tolerance, and education provided.",
      "Patient/Family Education":
        "Request reporting of pain, heat, swelling, leakage, or restricted movement. Advise to keep the site clean and dry and avoid pulling on tubing.",
      Escalation:
        "Stop infusion and re-site if infiltration, extravasation, purulence, or inability to flush occurs. Consider central access for recurrent failures or anticipated prolonged therapy.",
      "Safety Notes":
        "Use aseptic non-touch technique and allow antiseptic to dry fully. Choose the smallest gauge that meets therapy needs and limit repeated attempts on the same limb.",
    },
  },
  {
    task: "Peripheral IV Removal",
    department: "Medical Ward",
    sections: {
      Purpose:
        "Ensure safe removal of a peripheral IV cannula and assessment of the site after therapy completion. Prevent catheter breakage and reduce infection risk.",
      Scope:
        "Applies to nurses in inpatient and outpatient areas where PVCs are used. Students may remove under supervision.",
      Indications:
        "IV therapy completed, device no longer indicated, or complications such as phlebitis, infiltration, or suspected infection.",
      Contraindications:
        "Do not remove if line is needed for imminent emergency therapy without suitable replacement. Seek senior review if tip fracture is suspected.",
      Equipment:
        "Clean gloves, adhesive remover if needed, sterile gauze, tape or dressing, waste bag, hand hygiene supplies.",
      "Procedure Steps":
        "Perform hand hygiene, don gloves, stop infusion, and release securement while stabilizing the catheter. Withdraw catheter smoothly, apply pressure until hemostasis, inspect catheter tip, dress the site, and discard waste.",
      "Monitoring & Documentation":
        "Observe for bleeding, hematoma, or signs of infection after removal. Document removal time, catheter integrity, site condition, and patient tolerance.",
      "Patient/Family Education":
        "Explain that mild bruising can occur and to report increasing pain, redness, warmth, swelling, or discharge. Keep the dressing dry for several hours.",
      Escalation:
        "Escalate for persistent bleeding, suspected retained fragment, or signs of systemic infection. Seek clinician review if significant pain or swelling develops.",
      "Safety Notes":
        "Never reinsert the stylet into a used catheter. Apply gentle traction and avoid ripping skin when removing adhesive.",
    },
  },
  {
    task: "Urinary Catheterization (Indwelling, Aseptic Technique)",
    department: "Urology / Medical Ward",
    sections: {
      Purpose:
        "Establish bladder drainage using aseptic technique while minimizing catheter-associated infection. Ensure correct sizing and securement.",
      Scope:
        "Applies to nurses trained and authorized to insert Foley catheters in adults. Use gender-appropriate equipment and chaperone per policy.",
      Indications:
        "Acute urinary retention, accurate output monitoring in critical illness, perioperative needs, or wound healing protection where necessary.",
      Contraindications:
        "Suspected urethral trauma (blood at meatus, high-riding prostate) or recent urethral surgery; consider urology input. Avoid for convenience alone.",
      Equipment:
        "Sterile catheter kit with appropriate catheter size, sterile field, antiseptic, anesthetic gel, drainage bag, securement device, PPE, and waste disposal.",
      "Procedure Steps":
        "Explain procedure and obtain consent; perform hand hygiene and don PPE. Prepare sterile field, clean meatus, instill anesthetic gel, insert catheter until urine flows, inflate balloon per manufacturer guidance, connect drainage bag, and secure.",
      "Monitoring & Documentation":
        "Record size/type, balloon volume, urine characteristics, and indication. Monitor output, patency, and signs of infection; maintain closed system and dependent drainage.",
      "Patient/Family Education":
        "Teach catheter care, hygiene, and bag positioning below bladder. Explain signs of blockage or infection and when to seek help.",
      Escalation:
        "Escalate for failed insertion, severe pain, hematuria, or bypassing/leakage. Seek urgent review for suspected trauma or urosepsis.",
      "Safety Notes":
        "Use sterile technique, correct balloon volume, and avoid traction on the catheter. Reassess daily for ongoing need to reduce catheter days.",
    },
  },
  {
    task: "Nasogastric (NG) Tube Insertion",
    department: "Gastroenterology / Medical Ward",
    sections: {
      Purpose:
        "Provide access for gastric decompression or feeding while minimizing aspiration and mucosal injury. Confirm placement safely before use.",
      Scope:
        "For nurses trained in NG tube placement in adults under local policy. Additional confirmation requirements may apply for feeding use.",
      Indications:
        "Gastric decompression for obstruction/ileus, medication administration, or enteral feeding when oral intake is unsafe.",
      Contraindications:
        "Suspected basal skull fracture, severe facial trauma, or esophageal varices without senior approval. Caution in coagulopathy and altered anatomy.",
      Equipment:
        "Appropriate NG tube, lubricant, pH indicator strips, syringe, tape/securement, PPE, glass of water with straw if allowed.",
      "Procedure Steps":
        "Explain and measure NEX distance, lubricate, and insert with neck flexion; advance during swallowing if safe. Verify placement by aspirate pH (≤5.5) and per policy; secure tube and document.",
      "Monitoring & Documentation":
        "Document size, nostril, insertion depth, and placement check. Monitor for coughing, respiratory distress, migration, or skin breakdown.",
      "Patient/Family Education":
        "Explain the purpose of the tube, discomfort expectations, and the need to avoid pulling. Describe how feeding or decompression works.",
      Escalation:
        "Stop and escalate if respiratory distress, persistent coughing, or malposition suspected. Obtain imaging confirmation per local policy when required.",
      "Safety Notes":
        "Never rely on auscultation alone for placement. Recheck position after episodes of coughing, vomiting, or repositioning.",
    },
  },
  {
    task: "Enteral Feeding (Via NG/PEG) Initiation & Care",
    department: "Nutrition Support / Medical Ward",
    sections: {
      Purpose:
        "Safely initiate and maintain enteral feeding to meet nutritional goals while preventing aspiration and tube complications.",
      Scope:
        "For nurses managing adult enteral feeds on wards and step-down units. Applies to NG and gastrostomy devices.",
      Indications:
        "Inadequate oral intake with a functional GI tract, dysphagia, or neurological impairment requiring tube feeding.",
      Contraindications:
        "GI obstruction, severe ileus without decompression, or high-risk aspiration without mitigation. Defer if hemodynamically unstable.",
      Equipment:
        "Feeding pump or gravity set, prescribed formula, water for flushes, pH strips where applicable, syringes, securement, PPE.",
      "Procedure Steps":
        "Confirm tube placement per policy, elevate head of bed 30–45°, start feeds at ordered rate, and perform scheduled water flushes. Titrate rate as tolerated and maintain tube patency.",
      "Monitoring & Documentation":
        "Monitor tolerance (abdominal discomfort, residuals per policy, stool pattern), hydration, and weight trends. Record intake and any adverse events.",
      "Patient/Family Education":
        "Explain feed goals, positioning, and the importance of not altering pump settings. Teach tube care and when to call for help.",
      Escalation:
        "Escalate for aspiration signs, persistent vomiting, high residuals per policy, or tube displacement. Hold feeds and notify the prescriber.",
      "Safety Notes":
        "Maintain head elevation during and after feeds; verify placement regularly. Use clean technique for handling formula and tubing to reduce infection.",
    },
  },
  {
    task: "Oxygen Therapy (Titration & Device Selection)",
    department: "Respiratory / Medical Ward",
    sections: {
      Purpose:
        "Deliver and titrate oxygen to achieve ordered saturation targets while minimizing harm such as CO₂ retention.",
      Scope:
        "For adult inpatients requiring supplemental oxygen in ward or ED settings. Includes nasal cannula, simple masks, and venturi systems.",
      Indications:
        "Hypoxemia from respiratory or cardiac illness, perioperative needs, or palliative dyspnea relief.",
      Contraindications:
        "No absolute contraindications; use caution in CO₂ retainers and flammable environments. Follow fire safety policies strictly.",
      Equipment:
        "Oxygen source, appropriate delivery interface, humidification if required, pulse oximeter, signage, and PPE.",
      "Procedure Steps":
        "Assess baseline saturations and clinical status, choose device, and titrate flow to ordered target. Reassess after changes and document device and settings.",
      "Monitoring & Documentation":
        "Monitor SpO₂, work of breathing, and comfort; check skin integrity at contact points. Record flow, device, and response each round.",
      "Patient/Family Education":
        "Explain goals, safety near heat sources, and avoiding smoking. Teach not to adjust settings without staff.",
      Escalation:
        "Escalate for persistent hypoxemia, rising distress, or suspected CO₂ retention (drowsiness). Consider high-flow or NIV per local pathway.",
      "Safety Notes":
        "Use lowest flow that maintains targets and secure tubing to prevent falls. Confirm oxygen points are shut off when discontinued.",
    },
  },
  {
    task: "Noninvasive Ventilation (NIV) Setup & Care",
    department: "Respiratory / ICU",
    sections: {
      Purpose:
        "Provide positive pressure support for acute respiratory failure while avoiding intubation when appropriate.",
      Scope:
        "For trained nurses in monitored settings initiating or maintaining NIV (CPAP/BiPAP) per protocol.",
      Indications:
        "Hypercapnic COPD exacerbation, cardiogenic pulmonary edema, or selected hypoxemic failure with intact airway and cooperation.",
      Contraindications:
        "Impaired consciousness, copious secretions, facial trauma, or hemodynamic instability. Relative caution with agitation or poor mask tolerance.",
      Equipment:
        "NIV device, mask interfaces, headgear, heated humidification if available, oxygen supply, monitoring equipment.",
      "Procedure Steps":
        "Explain therapy, select mask size, apply with minimal leaks, set initial pressures per protocol, and titrate based on comfort and gas exchange. Provide skin protection at pressure points.",
      "Monitoring & Documentation":
        "Monitor respiratory rate, SpO₂, CO₂ markers/ABGs, comfort, and mask leaks. Document settings, tolerance, and skin checks.",
      "Patient/Family Education":
        "Describe goals, sensations of pressure, and the importance of mask cooperation. Reassure regarding breaks for hydration and communication.",
      Escalation:
        "Escalate for worsening oxygenation/ventilation, declining mental status, or hemodynamic instability. Prepare for intubation if failure criteria met.",
      "Safety Notes":
        "Avoid prolonged pressure on nasal bridge and ensure rapid access to airway equipment. Keep suction available for secretions.",
    },
  },
  {
    task: "Blood Glucose Monitoring (POC)",
    department: "Endocrinology / Medical Ward",
    sections: {
      Purpose:
        "Obtain accurate capillary blood glucose measurements to guide therapy and detect hypoglycemia/hyperglycemia.",
      Scope:
        "For adult inpatients requiring glucose checks per protocol (e.g., insulin therapy, steroids, sepsis).",
      Indications:
        "Diabetes management, altered mental status evaluation, or therapy known to affect glucose.",
      Contraindications:
        "Avoid sampling from affected/edematous fingers or near infusion lines causing dilution. Consider lab confirmation if perfusion is poor.",
      Equipment:
        "POC glucose meter, quality-controlled strips, lancets, alcohol wipes, gauze, gloves, sharps container.",
      "Procedure Steps":
        "Perform hand hygiene, confirm patient ID, and prepare the meter. Clean site, obtain capillary sample with minimal squeezing, apply to strip, record value, and dispose sharps safely.",
      "Monitoring & Documentation":
        "Trend values and correlate with meals/insulin dosing; verify critical results. Document readings with time and related interventions.",
      "Patient/Family Education":
        "Explain purpose and timing of checks and symptoms of hypo/hyperglycemia. Encourage reporting of hunger, tremor, or confusion promptly.",
      Escalation:
        "Escalate for severe hypoglycemia, persistent hyperglycemia, or unexplained variability. Notify prescriber for regimen adjustment.",
      "Safety Notes":
        "Use control solutions and check expiry dates. Rotate finger sites and avoid excessive squeezing to improve accuracy.",
    },
  },
  {
    task: "Subcutaneous Insulin Administration",
    department: "Endocrinology / Medical Ward",
    sections: {
      Purpose:
        "Administer insulin safely with correct dose, timing, and technique to manage hyperglycemia.",
      Scope:
        "For nurses trained in insulin administration in inpatient settings, including basal-bolus and correction scales.",
      Indications:
        "Hyperglycemia management in diabetes or stress hyperglycemia. Perioperative glycemic control.",
      Contraindications:
        "Withhold if hypoglycemic or meal is delayed for prandial doses; seek guidance for NPO adjustments. Verify allergy to components if recorded.",
      Equipment:
        "Insulin vials/pens, pen needles or syringes, alcohol wipes, sharps container, glucose meter.",
      "Procedure Steps":
        "Verify order and patient identity, check dose and insulin type, and confirm timing with meals. Use proper injection technique and rotate sites; document administration and glucose values.",
      "Monitoring & Documentation":
        "Monitor for hypoglycemia and track glucose response to dosing. Document lot numbers as required and education provided.",
      "Patient/Family Education":
        "Teach recognition and treatment of hypoglycemia and proper injection rotation. Clarify differences between basal and bolus insulins.",
      Escalation:
        "Escalate for recurrent hypoglycemia, persistent hyperglycemia, or dosing confusion. Request endocrinology input for complex regimens.",
      "Safety Notes":
        "Double-check high-risk doses and avoid mixing incompatible insulins. Ensure correct units and device priming.",
    },
  },
  {
    task: "Medication Administration (5 Rights + 2)",
    department: "Pharmacy / Nursing",
    sections: {
      Purpose:
        "Reduce medication errors by adhering to verification steps and safe administration practices.",
      Scope:
        "For all nurses administering medications in inpatient and ambulatory settings.",
      Indications:
        "Any prescribed medication including PRN, scheduled, and one-time orders.",
      Contraindications:
        "Do not administer if any Right is not met or if clinical status makes drug unsafe at that time. Clarify illegible or conflicting orders.",
      Equipment:
        "MAR/eMAR, bar-code scanner where available, appropriate delivery devices, PPE, patient identifiers.",
      "Procedure Steps":
        "Verify right patient, drug, dose, route, time, indication, and documentation. Clarify allergies and interactions, administer per protocol, and observe immediate effects.",
      "Monitoring & Documentation":
        "Monitor for therapeutic effect and adverse reactions; document administration time and site if applicable. Report and document near-misses per policy.",
      "Patient/Family Education":
        "Explain purpose and key side effects. Encourage questions and adherence to timing for critical medications.",
      Escalation:
        "Escalate for suspected adverse drug reactions, anaphylaxis, or dosing errors. Activate rapid response if patient deteriorates.",
      "Safety Notes":
        "Avoid distractions, use bar-code scanning, and never borrow medications between patients. Perform independent double-check for high-alert meds.",
    },
  },
  {
    task: "Wound Care (Simple Surgical / Traumatic)",
    department: "Surgery / Wound Care",
    sections: {
      Purpose:
        "Promote healing and prevent infection for simple surgical or traumatic wounds using clean or aseptic technique as indicated.",
      Scope:
        "For nurses in wards, ED, and outpatient clinics performing routine wound assessments and dressing changes.",
      Indications:
        "Postoperative incisions, minor lacerations, or abrasions requiring dressing care and surveillance.",
      Contraindications:
        "Do not disturb advanced dressings without orders; caution with suspected deep infection or ischemia. Seek specialist input for complex wounds.",
      Equipment:
        "Appropriate dressing set, saline, sterile/clean gloves, wound cleanser, adhesive remover, waste bag, and documentation tools.",
      "Procedure Steps":
        "Perform hand hygiene and don gloves, remove old dressing carefully, assess wound bed and periwound skin, cleanse as ordered, and apply new dressing. Document findings and next change date.",
      "Monitoring & Documentation":
        "Monitor for signs of infection, exudate amount, and wound dimension changes. Record pain scores and dressing tolerance.",
      "Patient/Family Education":
        "Teach dressing protection during bathing and signs that require review. Discuss nutrition, smoking cessation, and offloading for healing.",
      Escalation:
        "Escalate for spreading erythema, fever, uncontrolled exudate, or dehiscence. Refer to wound care team for stagnating wounds.",
      "Safety Notes":
        "Use aseptic technique when indicated and avoid skin tears with adhesive traction. Label drains and lines separately to prevent confusion.",
    },
  },
  {
    task: "Pressure Injury Prevention Bundle",
    department: "Wound Care / Nursing",
    sections: {
      Purpose:
        "Prevent hospital-acquired pressure injuries through risk screening and protective measures.",
      Scope:
        "Applies to all adult inpatients, especially those immobile, malnourished, or incontinent.",
      Indications:
        "Patients with limited mobility, sensory deficits, or vascular disease at risk of pressure damage.",
      Contraindications:
        "No absolute contraindications; individualize positioning in spinal instability or pain.",
      Equipment:
        "Risk assessment tool, repositioning schedule, support surfaces, protective dressings, moisturizers, incontinence supplies.",
      "Procedure Steps":
        "Screen on admission and daily; reposition on schedule; optimize moisture control and nutrition; offload heels and bony prominences. Document bundle adherence.",
      "Monitoring & Documentation":
        "Audit skin checks, device-related pressure points, and adherence to repositioning. Track any stage changes promptly.",
      "Patient/Family Education":
        "Explain repositioning importance and encourage participation. Discuss cushions and offloading at home after discharge.",
      Escalation:
        "Escalate for nonblanchable erythema, skin breakdown, or device-related pressure. Involve wound care specialists for staging and management.",
      "Safety Notes":
        "Use slide sheets to reduce shear and protect fragile skin with barrier products. Avoid donut-type devices that concentrate pressure.",
    },
  },
  {
    task: "Central Line Care (Maintenance & Dressing Change)",
    department: "ICU / Vascular Access",
    sections: {
      Purpose:
        "Maintain central venous catheters to prevent CLABSI and ensure reliable access.",
      Scope:
        "For nurses trained in sterile dressing changes and line maintenance in ICU and wards.",
      Indications:
        "Any patient with a central line requiring ongoing infusion, blood sampling, or hemodynamic monitoring.",
      Contraindications:
        "Do not manipulate lines during hemodynamic instability unless emergent benefit outweighs risk. Avoid dressing changes in uncontrolled bleeding.",
      Equipment:
        "Sterile dressing kit, chlorhexidine applicator, sterile gloves, mask, securement device, caps, flushes, and waste disposal.",
      "Procedure Steps":
        "Perform hand hygiene, mask both nurse and patient if possible, and establish sterile field. Remove old dressing, scrub hub, clean insertion site, allow to dry, replace securement and dressing, and cap with needleless connectors.",
      "Monitoring & Documentation":
        "Assess for redness, drainage, tenderness, and line integrity. Document date/time, site condition, and any culture or therapy changes.",
      "Patient/Family Education":
        "Explain line purpose, dressing care, and infection signs. Instruct not to handle tubing or caps.",
      Escalation:
        "Escalate for fever of unknown origin, purulence, or suspected catheter dysfunction. Obtain cultures and notify prescriber per policy.",
      "Safety Notes":
        "Use maximal sterile precautions and scrub the hub before each access. Replace caps and tubing per schedule.",
    },
  },
  {
    task: "Transfusion Administration (Packed RBCs)",
    department: "Transfusion / Medical Ward",
    sections: {
      Purpose:
        "Administer red cell transfusions safely while minimizing reactions and documentation errors.",
      Scope:
        "For nurses credentialed in transfusion practices in inpatient units and day hospitals.",
      Indications:
        "Symptomatic anemia or critical thresholds per policy, perioperative needs, or active bleeding stabilization.",
      Contraindications:
        "Avoid unnecessary transfusion in stable chronic anemia when alternatives exist. Defer during unresolved febrile reactions.",
      Equipment:
        "Verified blood product, transfusion set with filter, IV access, vitals monitor, emergency medications, documentation forms.",
      "Procedure Steps":
        "Perform two-person ID check, verify product compatibility and expiry, obtain baseline vitals, start infusion at ordered rate, and observe closely in the first 15 minutes. Reassess vitals per schedule.",
      "Monitoring & Documentation":
        "Monitor for fever, chills, dyspnea, hypotension, rash, or back pain. Document start/stop times, vitals, volume infused, and any reactions.",
      "Patient/Family Education":
        "Explain signs of reaction and to call immediately if symptoms occur. Discuss expected duration and post-transfusion care.",
      Escalation:
        "Stop transfusion and follow reaction protocol if suspected; keep IV line with saline and notify transfusion service. Send required samples and product for investigation.",
      "Safety Notes":
        "Never bypass identity checks; use dedicated tubing with filter. Do not add medications to blood products.",
    },
  },
  {
    task: "12-Lead ECG Acquisition",
    department: "Cardiology / ED",
    sections: {
      Purpose:
        "Acquire a diagnostic-quality 12-lead ECG quickly and safely to aid cardiac assessment.",
      Scope: "For trained nurses and technicians in ED, wards, and clinics.",
      Indications:
        "Chest pain, palpitations, syncope, dyspnea, or arrhythmia monitoring.",
      Contraindications:
        "No absolute contraindications; consider skin sensitivity and device interference. Shave or clean skin as needed.",
      Equipment:
        "Calibrated ECG machine, leads/electrodes, skin prep materials, identification labels.",
      "Procedure Steps":
        "Confirm identity, explain procedure, expose chest respectfully, prep skin, place limb and precordial leads correctly, and acquire tracing at standard settings. Print/label and upload as required.",
      "Monitoring & Documentation":
        "Ensure artifact-free tracing and repeat if needed. Document time, symptoms at acquisition, and any difficulties.",
      "Patient/Family Education":
        "Explain that the test is painless and quick. Encourage remaining still and breathing normally during acquisition.",
      Escalation:
        "Escalate immediately for STEMI pattern, severe brady/tachyarrhythmia, or symptomatic instability. Activate local emergency protocols.",
      "Safety Notes":
        "Avoid lead misplacement and secure privacy. Sanitize equipment between patients.",
    },
  },
  {
    task: "Rapid Response Activation (Deteriorating Patient)",
    department: "Hospital Medicine",
    sections: {
      Purpose:
        "Ensure timely escalation for patients showing acute physiological deterioration to reduce cardiac arrest and ICU transfers.",
      Scope:
        "Applies to all adult inpatients where early warning scores or clinical concern triggers a call.",
      Indications:
        "Threatened airway, respiratory distress, new hypotension, chest pain with instability, altered consciousness, or staff concern.",
      Contraindications:
        "None; activate based on concern even if scores are borderline. Do not delay while seeking permission.",
      Equipment:
        "Bedside monitor, oxygen, suction, IV access equipment, emergency trolley per local setup.",
      "Procedure Steps":
        "Call the rapid response number, state location and concern, and begin basic interventions (airway, oxygen, IV access). Prepare recent vitals, medications, and history for the team.",
      "Monitoring & Documentation":
        "Record activation time, response times, and interventions. Update observation chart and handover to team on arrival.",
      "Patient/Family Education":
        "Reassure patient and family that help is on the way and describe steps being taken. Maintain privacy and dignity.",
      Escalation:
        "If condition worsens before team arrives, call code per protocol. Continue ABC support and re-alert as needed.",
      "Safety Notes":
        "Keep emergency equipment functional and accessible. Practice closed-loop communication during events.",
    },
  },
  {
    task: "Falls Risk Assessment & Prevention",
    department: "Nursing / Quality & Safety",
    sections: {
      Purpose:
        "Identify adults at risk of falling and implement targeted prevention strategies to reduce harm.",
      Scope:
        "Applies to all adult inpatients and outpatients under observation or procedures.",
      Indications:
        "History of falls, gait instability, sedatives, delirium, hypotension, or environmental risks.",
      Contraindications:
        "None; tailor interventions for end-of-life or strict bedrest patients.",
      Equipment:
        "Risk screening tool, non-slip socks, mobility aids, bed/chair alarms where appropriate, signage.",
      "Procedure Steps":
        "Screen on admission and after changes in status, apply risk bundle (call bell access, clutter reduction, appropriate footwear), and review medications with the team.",
      "Monitoring & Documentation":
        "Track incidents and near-misses; reassess risk daily. Document interventions and patient acceptance.",
      "Patient/Family Education":
        "Encourage use of call bell and assistance before mobilizing. Explain risks of getting up unaided.",
      Escalation:
        "Escalate for delirium, new dizziness, or recurrent near-falls. Request PT/OT review for mobility concerns.",
      "Safety Notes":
        "Keep bed in lowest position, brakes on, and lighting adequate. Avoid physical restraints unless specifically ordered and monitored.",
    },
  },
  {
    task: "Pain Assessment & Management (Adult Inpatient)",
    department: "Nursing / Acute Pain Service",
    sections: {
      Purpose:
        "Assess and manage pain effectively to improve recovery and function while minimizing adverse effects.",
      Scope:
        "For adult inpatients across medical, surgical, and palliative services.",
      Indications:
        "Acute postoperative pain, trauma, medical conditions causing pain, or chronic pain exacerbation.",
      Contraindications:
        "Avoid specific analgesics when contraindicated by allergies, renal/hepatic impairment, or interactions. Clarify unclear orders.",
      Equipment:
        "Validated pain scales, medication chart, nonpharmacologic aids (ice/heat packs), PPE.",
      "Procedure Steps":
        "Assess pain at rest and with movement, choose multimodal strategies including nonpharmacologic measures, administer prescribed analgesics, and reassess effect.",
      "Monitoring & Documentation":
        "Monitor pain scores, sedation, respiratory rate, and side effects. Document interventions, responses, and plan adjustments.",
      "Patient/Family Education":
        "Explain realistic goals and the importance of reporting inadequate relief. Discuss side effects and nonpharmacologic options.",
      Escalation:
        "Escalate for uncontrolled pain, oversedation, or suspected compartment syndrome. Consult Acute Pain Service for complex cases.",
      "Safety Notes":
        "Avoid concurrent sedatives without review and respect maximum dosing intervals. Consider bowel regimens with opioids.",
    },
  },
  {
    task: "Palliative Care: Comfort Measures",
    department: "Palliative Care / General Medicine",
    sections: {
      Purpose:
        "Provide symptom relief, dignity, and family support in the last days or hours of life.",
      Scope:
        "Applies across adult wards and hospice-linked services for patients with comfort-focused goals.",
      Indications:
        "Recognized dying phase, withdrawal of non-beneficial treatments, or refractory symptom burden requiring comfort care.",
      Contraindications:
        "None; plans are individualized to patient and family preferences. Reassess when goals of care change.",
      Equipment:
        "Symptom control medications, syringe driver if used, mouth and skin care supplies, positioning aids.",
      "Procedure Steps":
        "Assess pain, breathlessness, agitation, nausea, and secretions; implement standing and PRN orders; optimize environment and family presence; minimize non-beneficial interventions.",
      "Monitoring & Documentation":
        "Record regular symptom scores, interventions, and responses; update individualized care plans. Communicate changes during handover.",
      "Patient/Family Education":
        "Explain the focus on comfort, expected signs of dying, and how to request help. Offer support for rituals and cultural needs.",
      Escalation:
        "Escalate to palliative specialists for refractory distress or complex psychosocial issues. Engage chaplaincy or social work when needed.",
      "Safety Notes":
        "Use clear, compassionate communication and respect advance directives. Avoid burdensome monitoring unless it improves comfort.",
    },
  },
  {
    task: "Specimen Collection: Venipuncture (Phlebotomy)",
    department: "Pathology / Nursing",
    sections: {
      Purpose:
        "Collect laboratory specimens accurately and safely to ensure reliable results and patient comfort.",
      Scope:
        "For nurses and phlebotomists drawing adult venous blood in wards and clinics.",
      Indications:
        "Diagnostic tests, monitoring therapy, or pre-procedure requirements.",
      Contraindications:
        "Avoid limbs with fistulas, lymphoedema, or recent surgery; defer during active IV infusion in the same limb.",
      Equipment:
        "Tourniquet, appropriate needles or vacutainer system, tubes in correct order of draw, antiseptic, gloves, gauze, labels, sharps container.",
      "Procedure Steps":
        "Verify identity, explain procedure, select site, cleanse with antiseptic, perform venipuncture with minimal attempts, release tourniquet, achieve hemostasis, and label at bedside.",
      "Monitoring & Documentation":
        "Observe for hematoma or vasovagal symptoms and document tubes drawn and difficulties encountered. Ensure specimens are sent promptly.",
      "Patient/Family Education":
        "Advise on temporary soreness and bruising precautions. Encourage reporting of dizziness or persistent bleeding.",
      Escalation:
        "Escalate after failed attempts per policy or for persistent bleeding. Inform prescriber for difficult access requiring alternative methods.",
      "Safety Notes":
        "Follow order of draw and never re-sheath needles. Dispose sharps immediately after use.",
    },
  },
  {
    task: "In-Hospital Transfer (Bed-to-Bed Handover)",
    department: "Nursing / Patient Flow",
    sections: {
      Purpose:
        "Ensure safe transfer with complete clinical handover and equipment continuity between units.",
      Scope:
        "Applies to all adult inpatient transfers including ward-to-ward, ED-to-ward, and ward-to-procedure.",
      Indications:
        "Change in level of care, procedure scheduling, or bed management needs.",
      Contraindications:
        "Delay non-urgent transfers during clinical instability unless higher care destination is available.",
      Equipment:
        "Handover checklist, current medication chart, monitoring equipment, oxygen, and mobility aids as required.",
      "Procedure Steps":
        "Perform pre-transfer safety checks, confirm destination readiness, accompany with appropriate staff, and provide SBAR handover including allergies, access devices, and infection status.",
      "Monitoring & Documentation":
        "Monitor vitals during transfer if required; document departure/arrival times and condition at arrival. Verify all personal items and equipment.",
      "Patient/Family Education":
        "Explain reasons for transfer, destination, and what to expect. Encourage questions and address concerns.",
      Escalation:
        "Escalate if deterioration occurs en route or destination is unprepared. Activate rapid response if needed.",
      "Safety Notes":
        "Secure lines and tubes; set bed brakes and use side rails appropriately. Use safe patient handling techniques.",
    },
  },
  {
    task: "Oral Nutrition Support for Patients with Reduced Appetite",
    department: "Nursing / Nutrition Support",
    sections: {
      Purpose:
        "Provide evidence-based strategies to help patients with reduced appetite meet their nutritional needs and prevent malnutrition.",
      Scope:
        "Applies to adult inpatients or residents with decreased oral intake but a functional swallowing ability. Excludes patients requiring enteral or parenteral nutrition.",
      Indications:
        "Reduced oral intake, unintentional weight loss, fatigue or illness affecting appetite, or increased nutritional requirements.",
      Contraindications:
        "Severe dysphagia, gastrointestinal obstruction, or medically indicated NPO (nil per os) status. In these cases, consider enteral feeding per policy.",
      Equipment:
        "Meal intake record, patient preference list, oral supplements, fortified foods, and adaptive utensils as needed.",
      "Procedure Steps":
        "1. Assess current intake and identify barriers to eating (e.g., nausea, taste changes, fatigue).\n2. Encourage small, frequent meals and energy/protein-dense foods.\n3. Offer preferred and culturally appropriate foods where possible.\n4. Provide oral nutritional supplements between meals if prescribed.\n5. Encourage social or assisted mealtimes to increase intake.\n6. Collaborate with the dietitian if intake remains inadequate after 48–72 hours.\n7. Document interventions and patient response daily.",
      "Monitoring & Documentation":
        "Track oral intake, weight, hydration status, and tolerance to fortified foods or supplements. Document progress and escalate if nutritional goals are unmet.",
      "Patient/Family Education":
        "Explain the importance of nutrition, small frequent meals, and the use of supplements. Involve family in encouraging intake and meal preparation when appropriate.",
      Escalation:
        "If the patient’s intake remains insufficient despite interventions, or there are signs of malnutrition or weight loss, escalate to the dietitian or physician to assess for enteral feeding initiation.",
      "Safety Notes":
        "Monitor for swallowing difficulty, aspiration risk, and supplement intolerance. Maintain upright positioning during and after meals.",
    },
  },
];

// =================== BUILD & WRITE ===================
function buildOutput(entry) {
  const lines = [];

  // 1) Document Information (Task, Date, Responsible Department)
  lines.push("Document Information:");
  lines.push(`Task - ${entry.task}`);
  lines.push(`Date - ${randomDateISO()}`);
  lines.push(`Responsible Department - ${entry.department}`);
  lines.push(""); // blank line after first chunk

  // Remaining sections in fixed order
  for (const section of SECTION_ORDER.slice(1)) {
    const content =
      entry.sections && entry.sections[section]
        ? entry.sections[section].trim()
        : "";
    lines.push(`${section}:`);
    lines.push(content.length ? content : "Content pending.");
    lines.push(""); // blank line between sections
  }

  return lines.join("\n").trim() + "\n";
}

for (const entry of tasks) {
  const filename = `${safe(entry.task)}.txt`;
  const fileText = buildOutput(entry);
  fs.writeFileSync(path.join(OUT_DIR, filename), fileText, "utf8");
  console.log("Created:", filename);
}

console.log(`Generated ${tasks.length} nursing task documents in ${OUT_DIR}`);
