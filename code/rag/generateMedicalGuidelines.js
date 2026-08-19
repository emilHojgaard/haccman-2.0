// generateMedicalGuidelines.mjs
// Creates 30 disease-specific *fictional medical* clinical guidelines (one .txt per disease)
// Output format is chunk-friendly with colon headers.
//
// EXACT SECTIONS (in order):
// 1) Document Information
// 2) Purpose
// 3) Scope
// 4) Indications
// 5) Diagnosis
// 6) Treatment/Management
// 7) Monitoring & Follow-up
// 8) When to Escalate
// 9) Safety Notes
//
// Rules:
// - Do NOT include Template, Title, or Version in the file contents.
// - Date is dynamic (today) and included ONLY in "Document Information".
// - File name remains the title (disease name).
// - Each section has ≥1–2 sentences, disease-specific.
// - Document Information can be short lines (key - value).
//
// ⚠️ Fictional content for a game. Not for real clinical care.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "medical_guidelines");

// Fresh output folder each run
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Dynamic date (YYYY-MM-DD)
const today = new Date();
const DATE_STR = new Date(
    Math.random() * (Date.now() - new Date("2023-01-01").getTime()) + new Date("2023-01-01").getTime()
).toISOString().slice(0, 10);
// Section order (fixed)
const SECTION_ORDER = [
    "Document Information",
    "Purpose",
    "Scope",
    "Indications",
    "Diagnosis",
    "Treatment/Management",
    "Monitoring & Follow-up",
    "When to Escalate",
    "Safety Notes",
];

/**
 * Each disease entry must provide:
 * - name (string)
 * - department (string)
 * - sections: object with keys matching SECTION_ORDER (except "Document Information", which is auto-built)
 */
const diseaseData = [
    {
        name: "Asthma",
        department: "Pulmonology Unit",
        sections: {
            "Purpose":
                "Provide structured guidance for recognizing variable airflow limitation, initiating controller therapy, and managing acute exacerbations in adult asthma.",
            "Scope":
                "Applies to clinicians in emergency, outpatient, and inpatient settings who are evaluating or treating adults with suspected or confirmed asthma.",
            "Indications":
                "Typical symptoms include episodic wheeze, dyspnea, chest tightness, and cough that vary over time and are often triggered by allergens, exercise, or respiratory infections.",
            "Diagnosis":
                "Diagnosis is supported by obstructive spirometry with reduced FEV1/FVC and significant bronchodilator reversibility, or by excessive peak flow variability when spirometry is inconclusive. Differential diagnosis includes COPD, vocal cord dysfunction, cardiac dyspnea, and anxiety-related hyperventilation.",
            "Treatment/Management":
                "Initiate an inhaled corticosteroid controller and step up to ICS/LABA if control is inadequate; consider LAMA, leukotriene modifiers, or biologics for eosinophilic or Type 2–high disease. For exacerbations, provide oxygen to target saturations, administer rapid-acting bronchodilators with ipratropium in severe cases, and give short systemic corticosteroids.",
            "Monitoring & Follow-up":
                "Reassess control, symptoms, and rescue use at each visit; verify inhaler technique and adherence, and adjust step therapy accordingly. Provide a written action plan and review triggers, vaccination status, and comorbidities such as rhinitis and reflux.",
            "When to Escalate":
                "Escalate for life-threatening features such as silent chest, exhaustion, or hypoxemia, or for frequent exacerbations despite high-dose ICS/LABA. Consider specialty review for biologic eligibility or uncertainty in diagnosis.",
            "Safety Notes":
                "Use the lowest effective steroid dose and monitor for metabolic and bone effects with long-term therapy. Observe patients after repeated bronchodilator dosing for rebound bronchospasm, and ensure epinephrine readiness if biologics are administered.",
        },
    },
    {
        name: "Chronic Obstructive Pulmonary Disease (COPD)",
        department: "Pulmonology Unit",
        sections: {
            "Purpose":
                "Standardize evaluation of airflow limitation, symptom burden, and exacerbation risk in COPD while guiding inhaled therapy and acute care.",
            "Scope":
                "Intended for adult patients with chronic respiratory symptoms and a smoking or exposure history across primary care, emergency, and inpatient settings.",
            "Indications":
                "Progressive dyspnea, chronic cough, and sputum production in adults with tobacco use or significant biomass/occupational exposure.",
            "Diagnosis":
                "Post-bronchodilator spirometry showing FEV1/FVC below the fixed ratio supports COPD; assess severity by FEV1 and symptom tools. Evaluate for cardiovascular disease, bronchiectasis, and alpha-1 antitrypsin deficiency when appropriate.",
            "Treatment/Management":
                "Use long-acting bronchodilators (LABA/LAMA) tailored to symptoms and exacerbations; add inhaled corticosteroids for frequent exacerbations with eosinophilia. Manage exacerbations with short-acting bronchodilators, controlled oxygen, systemic steroids, and antibiotics if bacterial infection is suspected.",
            "Monitoring & Follow-up":
                "Track exacerbations, rescue medication use, and exercise tolerance; optimize vaccinations and pulmonary rehabilitation. Counsel smoking cessation and inhaler technique at each visit.",
            "When to Escalate":
                "Escalate for acute hypercapnic respiratory failure, persistent hypoxemia, or repeated exacerbations despite maximal inhaled therapy. Consider noninvasive ventilation, oxygen therapy, or referral for advanced interventions.",
            "Safety Notes":
                "Avoid excessive oxygen targets to reduce CO2 retention risk. Watch for pneumonia when initiating ICS and assess osteoporosis with prolonged steroid exposure.",
        },
    },
    {
        name: "Community-Acquired Pneumonia",
        department: "Respiratory/ED Unit",
        sections: {
            "Purpose":
                "Guide timely recognition, severity assessment, antimicrobial selection, and supportive care for adults with community-acquired pneumonia.",
            "Scope":
                "Applies to adults presenting in outpatient clinics, emergency departments, or hospital wards with suspected lower respiratory infection.",
            "Indications":
                "Acute cough, fever, pleuritic chest pain, dyspnea, or sputum production, especially following viral illness or exposure.",
            "Diagnosis":
                "Establish with compatible symptoms plus new infiltrate on chest imaging when feasible; use labs and microbiology selectively. Apply severity tools to inform site-of-care decisions and antibiotic route.",
            "Treatment/Management":
                "Initiate empiric antibiotics based on local patterns and risk factors; de-escalate with culture data and clinical response. Provide oxygen for hypoxemia, antipyretics, fluids, and VTE prophylaxis for hospitalized patients as indicated.",
            "Monitoring & Follow-up":
                "Reassess clinical stability, oxygen needs, and adverse drug effects; convert to oral therapy once stable. Arrange follow-up imaging for high-risk patients or persistent symptoms.",
            "When to Escalate":
                "Escalate for septic shock, respiratory failure, or rapidly progressive multilobar disease. Consider ICU evaluation for high severity scores or increasing oxygen requirements.",
            "Safety Notes":
                "Review allergies and drug interactions when selecting antibiotics and ensure appropriate duration. Encourage early mobilization and aspiration risk mitigation in frail patients.",
        },
    },
    {
        name: "Heart Failure (Acute Decompensation)",
        department: "Cardiology Unit",
        sections: {
            "Purpose":
                "Provide a structured approach to evaluating volume status, precipitating factors, and stabilizing adults with acute decompensated heart failure.",
            "Scope":
                "For emergency and inpatient teams managing adults with known or suspected heart failure with reduced or preserved ejection fraction.",
            "Indications":
                "Worsening dyspnea, orthopnea, edema, rapid weight gain, or fatigue often triggered by dietary indiscretion, arrhythmia, ischemia, or infection.",
            "Diagnosis":
                "Assess vitals, natriuretic peptides, renal function, and chest imaging; evaluate perfusion and congestion at the bedside. Use echocardiography to characterize ejection fraction and structural disease.",
            "Treatment/Management":
                "Administer loop diuretics with careful titration and consider vasodilators for hypertensive congestion. Optimize guideline-directed medical therapy once stable and treat precipitants such as ischemia or arrhythmia.",
            "Monitoring & Follow-up":
                "Track urine output, electrolytes, renal function, and weight; adjust diuretics to achieve euvolemia. Arrange education on diet, fluid limits, and early outpatient follow-up.",
            "When to Escalate":
                "Escalate for hypotension with hypoperfusion, refractory hypoxemia, or shock requiring inotropes or mechanical support. Involve cardiology for advanced therapies or unclear hemodynamics.",
            "Safety Notes":
                "Avoid excessive diuresis causing prerenal azotemia or electrolyte derangements. Review ACEi/ARB/ARNI, MRA, SGLT2i tolerability and contraindications before up-titration.",
        },
    },
    {
        name: "Acute Coronary Syndrome (NSTEMI/Unstable Angina)",
        department: "Cardiology Unit",
        sections: {
            "Purpose":
                "Standardize early risk stratification, antithrombotic therapy, and timely angiography for non-ST elevation acute coronary syndromes.",
            "Scope":
                "For clinicians in emergency and inpatient cardiology managing adults with suspected ischemic chest pain without persistent ST elevation.",
            "Indications":
                "Chest discomfort, pressure, or dyspnea at rest or with minimal exertion, often with risk factors such as diabetes, hypertension, or prior CAD.",
            "Diagnosis":
                "Obtain serial high-sensitivity troponins and ECGs and assess risk scores to guide invasive strategy. Exclude mimics such as aortic dissection and pulmonary embolism when red flags exist.",
            "Treatment/Management":
                "Initiate antiplatelet therapy, anticoagulation, beta-blockers as appropriate, and high-intensity statins. Coordinate early invasive evaluation for high-risk features and address contributing anemia, infection, or tachyarrhythmia.",
            "Monitoring & Follow-up":
                "Monitor telemetry, symptoms, hemodynamics, and bleeding risk; adjust antithrombotics with renal function. Plan cardiac rehab and risk factor modification on discharge.",
            "When to Escalate":
                "Escalate for recurrent pain, hemodynamic instability, malignant arrhythmias, or dynamic ECG changes. Consult interventional cardiology for urgent angiography if deterioration occurs.",
            "Safety Notes":
                "Verify antiplatelet contraindications and recent anticoagulant use. Use nitrates cautiously in suspected right ventricular infarction or severe aortic stenosis.",
        },
    },
    {
        name: "Ischemic Stroke (Acute)",
        department: "Neurology/Stroke Unit",
        sections: {
            "Purpose":
                "Guide rapid recognition, neuroimaging, and reperfusion eligibility assessment for acute ischemic stroke.",
            "Scope":
                "For prehospital, emergency, and stroke-unit teams evaluating adults with new focal neurological deficits.",
            "Indications":
                "Sudden onset facial droop, arm weakness, speech difficulty, visual field loss, or gait imbalance within a definable time window.",
            "Diagnosis":
                "Perform immediate neurological assessment and non-contrast head CT to exclude hemorrhage; consider CT/MR angiography for large vessel occlusion. Determine last known well and contraindications to reperfusion.",
            "Treatment/Management":
                "Manage airway and blood pressure targets and evaluate eligibility for thrombolysis and/or thrombectomy per local criteria. Provide antiplatelet therapy and DVT prophylaxis when reperfusion is not pursued.",
            "Monitoring & Follow-up":
                "Monitor for neurological worsening, hemorrhagic conversion, dysphagia, and aspiration; start early rehabilitation. Address secondary prevention including blood pressure, lipids, and atrial fibrillation screening.",
            "When to Escalate":
                "Escalate for decreasing level of consciousness, refractory hypertension, or malignant cerebral edema. Involve neurosurgery and critical care if deterioration or large infarct syndromes develop.",
            "Safety Notes":
                "Confirm glucose and exclude mimics such as seizures; avoid hypotension and hyperthermia. Carefully apply reperfusion inclusion and exclusion criteria.",
        },
    },
    {
        name: "Diabetic Ketoacidosis (DKA)",
        department: "Endocrinology Unit",
        sections: {
            "Purpose":
                "Provide a consistent protocol for fluid resuscitation, insulin therapy, and electrolyte replacement in adult DKA.",
            "Scope":
                "For emergency and inpatient teams managing hyperglycemic crises in known or new diabetes.",
            "Indications":
                "Polyuria, polydipsia, nausea, abdominal pain, and fatigue with hyperglycemia, ketonemia, and metabolic acidosis often precipitated by infection or insulin omission.",
            "Diagnosis":
                "Identify hyperglycemia with elevated ketones and anion-gap metabolic acidosis; assess osmolality and triggers. Evaluate potassium before insulin administration.",
            "Treatment/Management":
                "Begin isotonic fluids, correct potassium, and initiate continuous insulin once potassium is safe; address precipitating illness and transition to subcutaneous regimens after resolution.",
            "Monitoring & Follow-up":
                "Monitor glucose, electrolytes, ketones, and anion gap; titrate insulin and fluids to steady correction. Educate on sick-day rules and outpatient follow-up.",
            "When to Escalate":
                "Escalate for refractory acidosis, shock, altered mental status, or severe electrolyte disturbances. Consider ICU care for frequent monitoring and insulin titration.",
            "Safety Notes":
                "Avoid early insulin in hypokalemia to prevent arrhythmias. Prevent overly rapid correction of osmolality and watch for cerebral edema in at-risk patients.",
        },
    },
    {
        name: "Sepsis (Adult)",
        department: "Acute Medicine/ICU",
        sections: {
            "Purpose":
                "Standardize early identification, source control, antimicrobial therapy, and hemodynamic resuscitation for adult sepsis.",
            "Scope":
                "Applies to adults with suspected infection and organ dysfunction across emergency and inpatient settings.",
            "Indications":
                "Fever or hypothermia, tachycardia, hypotension, tachypnea, altered mentation, or oliguria in the context of infection symptoms.",
            "Diagnosis":
                "Assess for organ dysfunction with labs and lactate; obtain cultures before antibiotics when feasible without delaying therapy. Identify likely source via examination and imaging as indicated.",
            "Treatment/Management":
                "Administer timely broad-spectrum antibiotics and begin fluid resuscitation with reassessment; add vasopressors for persistent hypotension. Pursue source control procedures and tailor therapy with culture results.",
            "Monitoring & Follow-up":
                "Track hemodynamics, urine output, lactate clearance, and end-organ function; de-escalate antimicrobials when stabilized. Reevaluate source and complications daily.",
            "When to Escalate":
                "Escalate for refractory shock, escalating oxygen requirements, or multiorgan failure. Involve ICU teams for advanced monitoring and support.",
            "Safety Notes":
                "Avoid delays in antibiotics and ensure appropriate dosing in renal or hepatic dysfunction. Monitor for drug reactions and Clostridioides difficile risk.",
        },
    },
    {
        name: "Primary Hypertension (Adult)",
        department: "Internal Medicine",
        sections: {
            "Purpose":
                "Provide a pragmatic pathway for diagnosis confirmation, cardiovascular risk reduction, and medication titration in primary hypertension.",
            "Scope":
                "For outpatient management and emergency confirmation when severe asymptomatic elevations are encountered.",
            "Indications":
                "Repeated elevated office or home readings without a secondary cause, often accompanied by headaches or no symptoms at all.",
            "Diagnosis":
                "Confirm with out-of-office measurements or ambulatory monitoring; evaluate secondary causes based on age and clinical clues. Assess global risk, renal function, and electrolytes.",
            "Treatment/Management":
                "Implement lifestyle measures and initiate first-line agents such as thiazide diuretics, ACEi/ARB, or calcium channel blockers; tailor to comorbidities. Avoid rapid blood pressure reduction in stable, asymptomatic patients.",
            "Monitoring & Follow-up":
                "Review home BP logs, adherence, and adverse effects; titrate medications to targets over weeks. Reinforce diet, activity, and sleep hygiene.",
            "When to Escalate":
                "Escalate for hypertensive emergencies with acute end-organ damage or refractory hypertension on combination therapy. Consider specialty referral for secondary workup.",
            "Safety Notes":
                "Monitor electrolytes and renal function after dose changes and be cautious with dual renin–angiotensin blockade. Assess pregnancy potential before ACEi/ARB use.",
        },
    },
    {
        name: "Atrial Fibrillation (AF) – New Onset",
        department: "Cardiology Unit",
        sections: {
            "Purpose":
                "Offer a consistent approach to rate or rhythm control and thromboembolism prevention in new-onset atrial fibrillation.",
            "Scope":
                "Applies to emergency and inpatient settings for adults presenting with AF with rapid ventricular response or symptomatic palpitations.",
            "Indications":
                "Palpitations, dyspnea, chest discomfort, fatigue, or incidental irregularly irregular rhythm on exam or ECG.",
            "Diagnosis":
                "Confirm with ECG and classify duration and hemodynamic stability; evaluate triggers such as infection, thyrotoxicosis, or alcohol. Calculate stroke risk and bleeding risk to guide anticoagulation.",
            "Treatment/Management":
                "Stabilize if unstable, then pursue rate control and consider rhythm control based on symptoms and duration. Initiate anticoagulation when indicated and address reversible contributors.",
            "Monitoring & Follow-up":
                "Monitor rate, symptoms, and anticoagulation parameters; educate on recurrence and device monitoring options. Plan outpatient rhythm assessment and risk factor modification.",
            "When to Escalate":
                "Escalate for hypotension, ischemia, heart failure, or pre-excited AF with very rapid conduction. Seek urgent cardiology input for cardioversion timing and anticoagulation strategy.",
            "Safety Notes":
                "Review drug interactions with anticoagulants and rate-controlling agents. Avoid AV nodal blockers in pre-excited AF until WPW is excluded.",
        },
    },
    {
        name: "Pulmonary Embolism (PE)",
        department: "Respiratory/ED Unit",
        sections: {
            "Purpose":
                "Provide a risk-adapted strategy for diagnosing and treating suspected pulmonary embolism.",
            "Scope":
                "For adult patients in emergency and inpatient care with acute dyspnea, pleuritic pain, or syncope where PE is a consideration.",
            "Indications":
                "Sudden dyspnea, pleuritic chest pain, hemoptysis, or unexplained hypoxemia, particularly with immobilization, surgery, cancer, or prior VTE.",
            "Diagnosis":
                "Apply clinical probability tools and D-dimer to guide imaging; use CTPA or V/Q scanning when appropriate. Assess right ventricular strain with biomarkers and echocardiography in intermediate or high risk.",
            "Treatment/Management":
                "Start anticoagulation when suspicion is high and bleeding risk acceptable; consider thrombolysis or catheter therapy for high-risk PE with shock. Provide oxygen and treat underlying provoking factors.",
            "Monitoring & Follow-up":
                "Monitor hemodynamics, oxygenation, and bleeding while on anticoagulation; plan duration based on provoked versus unprovoked events. Educate on recurrence risk and activity resumption.",
            "When to Escalate":
                "Escalate for hemodynamic instability, rising troponin/BNP with RV dysfunction, or persistent severe hypoxemia. Involve PE response teams for advanced therapies.",
            "Safety Notes":
                "Verify renal function and weight for anticoagulant dosing and check for drug interactions. Evaluate pregnancy status before imaging and anticoagulant selection.",
        },
    },
    {
        name: "Deep Vein Thrombosis (DVT)",
        department: "Vascular Medicine",
        sections: {
            "Purpose":
                "Standardize evaluation and anticoagulation of suspected lower-extremity deep vein thrombosis.",
            "Scope":
                "For adults with leg swelling or pain in ambulatory and emergency settings.",
            "Indications":
                "Unilateral leg swelling, pain, warmth, and dilated superficial veins, often after immobility, trauma, or surgery.",
            "Diagnosis":
                "Use clinical probability scoring with D-dimer to decide on compression ultrasonography. Consider alternative diagnoses like cellulitis or Baker’s cyst.",
            "Treatment/Management":
                "Initiate anticoagulation when indicated and choose agent based on renal function, cancer status, and preferences. Encourage ambulation as tolerated and compression for symptoms.",
            "Monitoring & Follow-up":
                "Monitor for bleeding and extension; review adherence and duration strategy. Reassess provoking factors and need for thrombophilia testing in selected patients.",
            "When to Escalate":
                "Escalate for extensive iliofemoral thrombosis, phlegmasia, or suspected PE. Seek specialty input for thrombolysis or thrombectomy in limb-threatening cases.",
            "Safety Notes":
                "Adjust dosing in renal impairment and avoid drug interactions that increase bleeding. Educate on warning signs of PE during treatment.",
        },
    },
    {
        name: "Spontaneous Pneumothorax",
        department: "Respiratory/ED Unit",
        sections: {
            "Purpose":
                "Outline recognition and acute management of primary and secondary spontaneous pneumothorax.",
            "Scope":
                "For emergency, respiratory, and ICU teams managing adults with acute pleuritic chest pain and dyspnea.",
            "Indications":
                "Sudden unilateral pleuritic pain and breathlessness, sometimes after coughing or exertion; risk increased in tall thin individuals and underlying lung disease.",
            "Diagnosis":
                "Confirm with chest radiography or ultrasound; use CT when findings are equivocal or to evaluate underlying disease. Estimate size and assess stability to guide intervention.",
            "Treatment/Management":
                "Observe small, stable primary pneumothoraces with oxygen and follow-up; perform needle aspiration or place a chest drain for larger, symptomatic, or secondary cases. Treat tension pneumothorax with immediate needle decompression followed by definitive management.",
            "Monitoring & Follow-up":
                "Monitor for air leak and lung re-expansion; ensure analgesia and educate on recurrence prevention. Plan surgical referral for recurrent episodes or persistent air leak.",
            "When to Escalate":
                "Escalate for tension physiology, hemodynamic instability, or refractory hypoxemia. Involve thoracic surgery for complicated or recurrent disease.",
            "Safety Notes":
                "Avoid high-pressure ventilation where possible and counsel against air travel or diving until radiographic resolution and clearance. Use sterile technique for pleural procedures to reduce infection risk.",
        },
    },
    {
        name: "Appendicitis (Acute)",
        department: "General Surgery",
        sections: {
            "Purpose":
                "Provide a structured approach to diagnosing and managing acute appendicitis including operative and nonoperative pathways.",
            "Scope":
                "For adult and adolescent patients in emergency and surgical services with suspected right lower quadrant pain.",
            "Indications":
                "Periumbilical pain migrating to the right lower quadrant with anorexia, nausea, and localized tenderness; fever may be present.",
            "Diagnosis":
                "Use clinical scoring to guide imaging selection; perform ultrasound or CT depending on availability and patient factors. Evaluate for complications such as perforation or abscess.",
            "Treatment/Management":
                "Offer appendectomy for uncomplicated appendicitis or consider antibiotics in selected cases after shared decision-making. Provide perioperative antibiotics and fluid management.",
            "Monitoring & Follow-up":
                "Monitor for postoperative infection, ileus, and pain control; advance diet as tolerated. Arrange follow-up for pathology review and recurrence counseling after nonoperative care.",
            "When to Escalate":
                "Escalate for peritonitis, sepsis, or failure of nonoperative management. Consult interventional radiology for drainable abscesses.",
            "Safety Notes":
                "Assess pregnancy status before imaging and surgery planning. Review allergies before antibiotics and apply DVT prophylaxis per risk.",
        },
    },
    {
        name: "Acute Pancreatitis",
        department: "Gastroenterology",
        sections: {
            "Purpose":
                "Standardize early diagnosis, supportive care, and complication surveillance in acute pancreatitis.",
            "Scope":
                "For adults admitted with suspected pancreatitis related to gallstones, alcohol, hypertriglyceridemia, or medications.",
            "Indications":
                "Sudden, severe epigastric pain radiating to the back with nausea and vomiting; risk factors include alcohol use and gallstones.",
            "Diagnosis":
                "Establish with characteristic pain plus elevated pancreatic enzymes or imaging findings; evaluate severity and identify biliary etiology with ultrasound.",
            "Treatment/Management":
                "Provide aggressive fluid resuscitation, analgesia, and early nutrition; treat biliary pancreatitis with timely ERCP when cholangitis or obstruction is present.",
            "Monitoring & Follow-up":
                "Monitor vitals, urine output, and labs; assess for necrosis, infection, or organ failure. Plan cholecystectomy for gallstone pancreatitis when clinically appropriate.",
            "When to Escalate":
                "Escalate for organ failure, infected necrosis, or uncontrolled pain. Involve ICU, surgery, or interventional radiology for complications.",
            "Safety Notes":
                "Avoid unnecessary antibiotics in sterile necrosis and limit excess fluids after initial resuscitation. Address alcohol cessation and triglyceride control to prevent recurrence.",
        },
    },
    {
        name: "Acute Cholecystitis",
        department: "General Surgery",
        sections: {
            "Purpose":
                "Guide timely diagnosis and surgical planning for acute inflammation of the gallbladder, typically due to cystic duct obstruction.",
            "Scope":
                "Applies to adults with right upper quadrant pain presenting to emergency or surgical services.",
            "Indications":
                "Steady right upper quadrant pain with fever, leukocytosis, and positive Murphy sign; nausea and vomiting are common.",
            "Diagnosis":
                "Use abdominal ultrasound as initial imaging to identify stones, wall thickening, and sonographic Murphy sign; consider HIDA scan if equivocal. Evaluate severity and suitability for early surgery.",
            "Treatment/Management":
                "Provide analgesia, fluids, and antibiotics targeting biliary flora; arrange early laparoscopic cholecystectomy when feasible. Use percutaneous cholecystostomy for high-risk surgical candidates.",
            "Monitoring & Follow-up":
                "Monitor fever curve, liver tests, and pain control; watch for biliary obstruction or perforation. Plan outpatient follow-up for pathology and risk factor modification.",
            "When to Escalate":
                "Escalate for sepsis, gallbladder gangrene, or perforation. Seek advanced support for cholangitis or choledocholithiasis.",
            "Safety Notes":
                "Screen for antibiotic allergies and adjust dosing in renal or hepatic impairment. Employ DVT prophylaxis perioperatively based on risk.",
        },
    },
    {
        name: "Pyelonephritis (Acute)",
        department: "Urology/Medicine",
        sections: {
            "Purpose":
                "Provide a framework for timely diagnosis and antimicrobial therapy of acute pyelonephritis.",
            "Scope":
                "For adults with systemic features of urinary tract infection in outpatient and inpatient settings.",
            "Indications":
                "Fever, flank pain, nausea, and urinary symptoms such as dysuria or frequency; costovertebral angle tenderness is typical.",
            "Diagnosis":
                "Obtain urinalysis and urine culture; consider imaging for obstruction, stones, or treatment failure. Assess pregnancy status and recent instrumentation.",
            "Treatment/Management":
                "Start empiric antibiotics based on local resistance patterns and narrow when culture results return; ensure hydration and analgesia. Consider hospitalization for sepsis, vomiting, or complicating conditions.",
            "Monitoring & Follow-up":
                "Reassess symptoms within 48–72 hours and adjust therapy if not improving; monitor renal function when using nephrotoxic agents. Arrange follow-up cultures in selected high-risk patients.",
            "When to Escalate":
                "Escalate for septic shock, obstruction with hydronephrosis, or persistent fever despite therapy. Coordinate urgent urologic drainage when obstruction is present.",
            "Safety Notes":
                "Check allergies and pregnancy before antibiotic selection and avoid fluoroquinolones when risks outweigh benefits. Encourage hydration and counsel on recurrence prevention.",
        },
    },
    {
        name: "Cellulitis (Non-purulent)",
        department: "Infectious Diseases",
        sections: {
            "Purpose":
                "Standardize diagnosis and antimicrobial therapy for non-purulent cellulitis while identifying alternate etiologies.",
            "Scope":
                "For adults presenting with acute limb erythema, warmth, and tenderness without abscess.",
            "Indications":
                "Diffuse erythema with indistinct margins, edema, and tenderness often following minor skin breaks or tinea pedis.",
            "Diagnosis":
                "Clinical diagnosis is primary; evaluate for mimics such as stasis dermatitis, gout, or DVT when features are atypical. Use ultrasound to exclude occult abscess if fluctuance is suspected.",
            "Treatment/Management":
                "Start empiric antibiotics covering streptococci and tailor to risk factors; elevate the limb and treat portals of entry. Reserve broad MRSA coverage for systemic toxicity or prior MRSA.",
            "Monitoring & Follow-up":
                "Outline borders to track response and reassess within 48–72 hours; switch to oral therapy when stable. Address edema control and skin care to reduce recurrence.",
            "When to Escalate":
                "Escalate for rapidly progressive infection, necrosis, or systemic instability. Consider surgical consultation if compartment syndrome or necrotizing infection is suspected.",
            "Safety Notes":
                "Review allergy history and potential drug interactions; adjust dosing in renal impairment. Educate on wound hygiene and footwear in high-risk patients.",
        },
    },
    {
        name: "Anaphylaxis",
        department: "Emergency Medicine",
        sections: {
            "Purpose":
                "Ensure rapid recognition and first-line treatment of anaphylaxis with intramuscular epinephrine.",
            "Scope":
                "For prehospital and emergency clinicians managing acute systemic hypersensitivity reactions.",
            "Indications":
                "Acute onset of skin or mucosal symptoms with respiratory compromise, hypotension, or gastrointestinal symptoms after exposure to a likely allergen.",
            "Diagnosis":
                "Make a clinical diagnosis based on compatible features and timing; do not delay treatment for confirmatory testing. Identify triggers such as foods, medications, or stings.",
            "Treatment/Management":
                "Administer intramuscular epinephrine promptly and repeat if needed; provide airway support, oxygen, and IV fluids. Add antihistamines and corticosteroids as adjuncts after epinephrine.",
            "Monitoring & Follow-up":
                "Observe for biphasic reactions and ensure access to self-injectable epinephrine on discharge. Arrange allergy referral for trigger evaluation and action plan.",
            "When to Escalate":
                "Escalate for airway compromise, refractory hypotension, or severe bronchospasm requiring advanced airway or vasopressors. Involve critical care for persistent instability.",
            "Safety Notes":
                "Epinephrine is first-line; avoid delaying its use. Review beta-blocker therapy which may blunt responses and consider glucagon in refractory cases.",
        },
    },
    {
        name: "Viral Gastroenteritis (Adult)",
        department: "Internal Medicine",
        sections: {
            "Purpose":
                "Provide supportive care guidance and dehydration risk assessment for viral gastroenteritis.",
            "Scope":
                "For adults with acute nausea, vomiting, and diarrhea in ambulatory and emergency settings.",
            "Indications":
                "Abrupt onset of watery diarrhea, cramping, nausea, and low-grade fever, often with sick contacts or foodborne exposure.",
            "Diagnosis":
                "Clinical diagnosis is typical; reserve stool testing for severe, persistent, or outbreak-related illness. Assess volume status and exclude red flags like bloody stool or severe tenderness.",
            "Treatment/Management":
                "Emphasize oral rehydration and early diet advancement; use antiemetics and antidiarrheals judiciously. Avoid unnecessary antibiotics.",
            "Monitoring & Follow-up":
                "Monitor for dehydration, electrolyte imbalance, and prolonged symptoms; counsel on hygiene to reduce transmission. Provide return precautions for worsening pain or fever.",
            "When to Escalate":
                "Escalate for severe dehydration, intractable vomiting, or immunocompromised hosts with persistent symptoms. Consider IV fluids and further evaluation.",
            "Safety Notes":
                "Avoid antimotility agents in suspected dysentery or toxin-mediated illness. Reinforce hand hygiene and safe food practices.",
        },
    },
    {
        name: "COVID-19 (Adult, Acute)",
        department: "Respiratory/ID Unit",
        sections: {
            "Purpose":
                "Offer a pragmatic framework for triage, oxygen support, and risk-based antiviral or anti-inflammatory therapy in acute COVID-19.",
            "Scope":
                "For outpatient triage and hospital management of adults with confirmed or suspected SARS-CoV-2 infection.",
            "Indications":
                "Fever, cough, sore throat, anosmia, dyspnea, or hypoxemia following exposure or community spread.",
            "Diagnosis":
                "Confirm with nucleic acid amplification or validated antigen testing; assess severity with oxygenation measures and imaging when indicated. Evaluate risk factors for progression.",
            "Treatment/Management":
                "Provide oxygen to targets and venous thromboembolism prophylaxis; consider antivirals or corticosteroids per risk and oxygen needs. Manage coinfections and escalate respiratory support as needed.",
            "Monitoring & Follow-up":
                "Track respiratory trajectory, inflammatory markers when useful, and secondary infections. Plan safe isolation discontinuation and follow-up for persistent symptoms.",
            "When to Escalate":
                "Escalate for rising oxygen requirements, shock, or impending respiratory failure. Coordinate ICU transfer for high-flow or ventilatory support.",
            "Safety Notes":
                "Review drug interactions with antivirals and immunomodulators. Apply infection prevention and appropriate PPE throughout care.",
        },
    },
    {
        name: "Seasonal Influenza (Adult)",
        department: "Infectious Diseases",
        sections: {
            "Purpose":
                "Support timely diagnosis, antiviral consideration, and complication prevention for adult influenza.",
            "Scope":
                "For outpatient and inpatient care during influenza seasons and outbreaks.",
            "Indications":
                "Abrupt fever, myalgias, cough, sore throat, and fatigue with known community circulation.",
            "Diagnosis":
                "Use clinical judgment and rapid testing when results influence therapy or isolation. Evaluate for secondary bacterial pneumonia if symptoms recur after initial improvement.",
            "Treatment/Management":
                "Provide supportive care and consider antivirals for high-risk patients or early presenters. Implement isolation and vaccinate when appropriate.",
            "Monitoring & Follow-up":
                "Monitor oxygenation and hydration; watch for myocarditis or encephalopathy in severe illness. Arrange follow-up for persistent cough or wheeze.",
            "When to Escalate":
                "Escalate for hypoxemia, decompensated comorbidities, or progressive pneumonia. Consider hospitalization for severe disease or high-risk hosts.",
            "Safety Notes":
                "Review renal dosing for antivirals and avoid unnecessary antibiotics. Encourage vaccination for patients and close contacts.",
        },
    },
    {
        name: "Migraine (Acute Management)",
        department: "Neurology",
        sections: {
            "Purpose":
                "Provide an evidence-informed approach to acute migraine relief and prevention of medication overuse.",
            "Scope":
                "For adults presenting with recurrent moderate to severe headaches with migrainous features.",
            "Indications":
                "Unilateral throbbing pain with nausea, photophobia, phonophobia, or aura; activity worsens symptoms.",
            "Diagnosis":
                "Clinical diagnosis based on recurrent attacks and associated features; exclude secondary causes with red flags or atypical aura. Assess disability and triggers.",
            "Treatment/Management":
                "Use rapid-onset analgesics, antiemetics, and triptans when appropriate; consider gepants or ditans for specific populations. Provide rescue options and nonpharmacologic strategies.",
            "Monitoring & Follow-up":
                "Track frequency and response with a headache diary; evaluate for preventive therapy if attacks are frequent or disabling. Educate on limiting acute medications to avoid rebound.",
            "When to Escalate":
                "Escalate for status migrainosus, neurological deficits, or suspected secondary headache. Consider infusion therapy or specialist referral.",
            "Safety Notes":
                "Avoid triptans in significant vascular disease and review pregnancy status. Screen for drug interactions with serotonergic agents.",
        },
    },
    {
        name: "Epilepsy (Seizure Management in ED)",
        department: "Neurology",
        sections: {
            "Purpose":
                "Standardize initial stabilization, seizure termination, and secondary evaluation for adults with active seizures or recent events.",
            "Scope":
                "For emergency clinicians managing convulsive seizures or post-ictal patients.",
            "Indications":
                "Generalized tonic-clonic activity, focal seizures with impaired awareness, or recurrent events without full recovery.",
            "Diagnosis":
                "Prioritize airway and glucose; obtain targeted labs and consider imaging when new abnormalities or trauma are suspected. Review triggers, medications, and adherence.",
            "Treatment/Management":
                "Use a stepwise benzodiazepine-first approach and load antiseizure medication if needed; treat underlying precipitants. Provide counseling on driving restrictions and safety.",
            "Monitoring & Follow-up":
                "Monitor for recurrent seizures and medication adverse effects; arrange neurology follow-up and EEG as indicated. Address adherence barriers and rescue plans.",
            "When to Escalate":
                "Escalate for status epilepticus, persistent altered consciousness, or focal deficits. Involve critical care for refractory seizures and continuous EEG needs.",
            "Safety Notes":
                "Avoid excessive sedation with repeated benzodiazepine dosing. Check interactions between antiseizure drugs and concurrent therapies.",
        },
    },
    {
        name: "Chronic Kidney Disease (CKD) – Adult",
        department: "Nephrology",
        sections: {
            "Purpose":
                "Coordinate risk reduction, progression slowing, and complication management in adults with chronic kidney disease.",
            "Scope":
                "For outpatient management with periodic inpatient consultation for complications.",
            "Indications":
                "Reduced eGFR or persistent albuminuria on repeated testing, often with diabetes, hypertension, or vascular disease.",
            "Diagnosis":
                "Stage CKD by eGFR and albuminuria and evaluate secondary causes where suspected; review medications and nephrotoxins. Screen for anemia, mineral bone disease, and acidosis.",
            "Treatment/Management":
                "Optimize blood pressure, glycemic control, and RAAS blockade when appropriate; consider SGLT2 inhibitors and nonsteroidal MRAs in eligible patients. Avoid nephrotoxins and adjust doses by kidney function.",
            "Monitoring & Follow-up":
                "Track eGFR, albuminuria, potassium, and hemoglobin; vaccinate per risk and plan dialysis access discussions if progression continues. Coordinate nutrition and cardiovascular risk reduction.",
            "When to Escalate":
                "Escalate for rapid eGFR decline, refractory hyperkalemia, fluid overload, or uremic symptoms. Refer for advanced planning or transplant evaluation when appropriate.",
            "Safety Notes":
                "Monitor for hyperkalemia after medication changes and ensure contrast studies use renal-safe strategies. Educate on over-the-counter NSAID avoidance.",
        },
    },
    {
        name: "Acute Kidney Injury (AKI)",
        department: "Nephrology",
        sections: {
            "Purpose":
                "Provide a structured approach to identifying etiology and reversing acute kidney injury.",
            "Scope":
                "For inpatient and emergency care where sudden creatinine rise or oliguria is detected.",
            "Indications":
                "Abrupt decline in kidney function with reduced urine output, often in sepsis, volume depletion, or nephrotoxin exposure.",
            "Diagnosis":
                "Classify prerenal, intrinsic, and postrenal mechanisms through exam, labs, urinalysis, and imaging for obstruction. Review medications for nephrotoxins and dose adjustments.",
            "Treatment/Management":
                "Restore perfusion with fluids when indicated, remove nephrotoxins, and treat underlying causes. Use renal replacement therapy for standard indications.",
            "Monitoring & Follow-up":
                "Monitor fluid balance, electrolytes, acid–base status, and drug levels for renally cleared agents. Plan follow-up to reassess recovery and adjust long-term therapy.",
            "When to Escalate":
                "Escalate for refractory hyperkalemia, severe acidosis, pulmonary edema, or uremic complications. Involve nephrology early if etiology is unclear or severe.",
            "Safety Notes":
                "Avoid contrast and NSAIDs where possible and correct doses for GFR. Use cautious fluid strategies in heart failure and cirrhosis.",
        },
    },
    {
        name: "Upper Gastrointestinal Bleed (UGIB)",
        department: "Gastroenterology",
        sections: {
            "Purpose":
                "Standardize resuscitation, risk stratification, and endoscopic coordination for suspected upper GI bleeding.",
            "Scope":
                "For emergency and inpatient settings evaluating hematemesis, melena, or anemia suggestive of UGIB.",
            "Indications":
                "Hematemesis, melena, syncope, or symptomatic anemia often due to peptic ulcer disease, esophagitis, or varices.",
            "Diagnosis":
                "Assess hemodynamics, labs, and risk scores; consider nasogastric aspirate selectively. Identify anticoagulant use and comorbid liver disease.",
            "Treatment/Management":
                "Resuscitate with fluids and blood as indicated; start proton pump inhibitors and coordinate early endoscopy. Use vasoactive drugs and antibiotics for suspected variceal bleeding.",
            "Monitoring & Follow-up":
                "Monitor vitals, hemoglobin, and recurrent bleeding; adjust anticoagulants and plan secondary prophylaxis. Arrange H. pylori testing and eradication where relevant.",
            "When to Escalate":
                "Escalate for persistent hemodynamic instability, rebleeding, or suspected varices. Involve interventional radiology or surgery for refractory bleeding.",
            "Safety Notes":
                "Avoid over-transfusion in stable patients and correct coagulopathy thoughtfully. Document timing of last anticoagulant dose and reversal where indicated.",
        },
    },
    {
        name: "Osteoarthritis (Knee/Hip)",
        department: "Rheumatology",
        sections: {
            "Purpose":
                "Provide symptom control strategies and functional optimization for degenerative joint disease of the knee or hip.",
            "Scope":
                "For outpatient management with referral for advanced therapy when conservative measures fail.",
            "Indications":
                "Activity-related joint pain, stiffness after rest, and crepitus with reduced range of motion; imaging shows joint space narrowing and osteophytes.",
            "Diagnosis":
                "Clinical assessment supported by plain radiographs when needed; exclude inflammatory arthritis or referred pain. Evaluate gait, strength, and assistive device needs.",
            "Treatment/Management":
                "Use exercise therapy, weight management, topical/oral analgesics, and intra-articular injections as appropriate. Consider arthroplasty for severe, refractory disability.",
            "Monitoring & Follow-up":
                "Track pain, function, and medication tolerance; reinforce exercise adherence. Revisit surgical candidacy if quality of life declines despite optimized care.",
            "When to Escalate":
                "Escalate for rapid functional decline, severe night pain, or failure of conservative therapy. Refer to orthopedics for advanced options.",
            "Safety Notes":
                "Limit chronic NSAID use in high-risk patients and protect gastric and renal function. Counsel on safe activity progression to prevent falls.",
        },
    },
    {
        name: "Major Depressive Disorder (Adult)",
        department: "Behavioral Health",
        sections: {
            "Purpose":
                "Offer a structured pathway for diagnosis, risk assessment, and treatment selection for major depressive disorder.",
            "Scope":
                "For primary care and behavioral health settings managing adults with persistent low mood or anhedonia.",
            "Indications":
                "At least two weeks of depressed mood or anhedonia with changes in sleep, appetite, energy, concentration, or self-worth; consider comorbid anxiety or substance use.",
            "Diagnosis":
                "Use validated screening tools and clinical interview to confirm criteria; assess suicide risk and medical contributors such as thyroid disease or medications.",
            "Treatment/Management":
                "Provide psychoeducation and choose psychotherapy, pharmacotherapy, or combined approaches based on severity and preference. Address sleep, exercise, and substance use, and plan for measurement-based care.",
            "Monitoring & Follow-up":
                "Monitor symptom scores, adherence, and side effects; adjust therapy at regular intervals. Plan relapse prevention and maintenance strategies for recurrent episodes.",
            "When to Escalate":
                "Escalate for active suicidal intent, psychosis, catatonia, or failure of multiple treatments. Coordinate urgent evaluation and higher levels of care as needed.",
            "Safety Notes":
                "Discuss black-box warnings and initiation side effects; review pregnancy and lactation considerations. Avoid abrupt discontinuation of serotonergic agents.",
        },
    },
    {
        name: "Prostate Cancer (Overview of Initial Management)",
        department: "Urology/Oncology Unit",
        sections: {
            "Purpose":
                "Summarize risk-stratified evaluation and first-line management options for localized and advanced prostate cancer.",
            "Scope":
                "For outpatient and multidisciplinary teams counseling adults with newly diagnosed prostate cancer.",
            "Indications":
                "Elevated PSA, abnormal digital rectal exam, or imaging findings prompting biopsy; symptoms may include obstructive urinary complaints or bone pain in advanced disease.",
            "Diagnosis":
                "Confirm with pathology and assign grade group; stage with imaging based on risk. Discuss genomic testing and baseline function to inform treatment decisions.",
            "Treatment/Management":
                "Offer active surveillance for low-risk disease and consider surgery or radiation for higher risk categories. Use androgen-deprivation therapy and systemic options for advanced disease in coordination with oncology.",
            "Monitoring & Follow-up":
                "Track PSA trends, treatment side effects, and functional outcomes including continence and sexual function. Coordinate survivorship care and bone health strategies.",
            "When to Escalate":
                "Escalate for rapidly rising PSA, symptomatic progression, or complications such as spinal cord compression. Involve radiation or medical oncology for advanced therapies.",
            "Safety Notes":
                "Counsel on fertility, metabolic effects of androgen deprivation, and fracture risk. Screen for cardiovascular risk factors during systemic therapy.",
        },
    },
    {
        name: "Breast Cancer (Early-Stage)",
        department: "Breast Surgery/Oncology",
        sections: {
            "Purpose":
                "Provide a framework for staging, local therapy selection, and systemic adjuvant treatment in early-stage breast cancer.",
            "Scope":
                "For multidisciplinary management after tissue diagnosis in adults.",
            "Indications":
                "Breast mass, abnormal screening imaging, or pathologic nipple discharge leading to biopsy confirmation.",
            "Diagnosis":
                "Characterize receptor status and stage using appropriate imaging; evaluate genetic risk when indicated. Discuss fertility preservation before cytotoxic therapy.",
            "Treatment/Management":
                "Select breast-conserving surgery or mastectomy with nodal evaluation; tailor radiation and systemic therapy to subtype and stage. Coordinate reconstruction and supportive care.",
            "Monitoring & Follow-up":
                "Monitor treatment toxicities and lymphedema; plan survivorship visits and appropriate imaging surveillance. Address psychosocial needs and symptom control.",
            "When to Escalate":
                "Escalate for aggressive biology, rapid progression, or therapy-limiting toxicities. Engage tumor board for complex decisions.",
            "Safety Notes":
                "Review cardiotoxicity risk with certain agents and manage bone health with endocrine therapy. Ensure contraception during teratogenic treatments.",
        },
    },
    {
        name: "Iron-Deficiency Anemia (Adult)",
        department: "Hematology",
        sections: {
            "Purpose":
                "Standardize diagnosis, source evaluation, and iron repletion for iron-deficiency anemia.",
            "Scope":
                "For outpatient and inpatient evaluation of adults with microcytic or hypochromic anemia.",
            "Indications":
                "Fatigue, exertional dyspnea, pica, or brittle nails; labs show low ferritin and iron indices consistent with deficiency.",
            "Diagnosis":
                "Confirm iron deficiency with ferritin and transferrin saturation; investigate sources such as menstrual loss, GI bleeding, or malabsorption. Consider celiac testing and colon evaluation per age and risk.",
            "Treatment/Management":
                "Replete iron orally with optimized dosing or use IV iron when intolerance, malabsorption, or severe deficiency exists. Treat the underlying cause to prevent recurrence.",
            "Monitoring & Follow-up":
                "Recheck hemoglobin and ferritin to confirm response and continue supplementation to restore stores. Educate on adherence and absorption strategies.",
            "When to Escalate":
                "Escalate for hemodynamic instability from bleeding, refractory anemia, or unclear source. Coordinate GI or gynecologic evaluation as indicated.",
            "Safety Notes":
                "Avoid unnecessary transfusions in stable patients and watch for hypersensitivity with IV formulations. Counsel on constipation and stool discoloration with oral iron.",
        },
    },
    {
        name: "Hypothyroidism (Primary)",
        department: "Endocrinology",
        sections: {
            "Purpose":
                "Provide a consistent approach to diagnosis confirmation and safe levothyroxine titration in primary hypothyroidism.",
            "Scope":
                "For outpatient care with special consideration for pregnancy and elderly patients.",
            "Indications":
                "Fatigue, weight gain, cold intolerance, constipation, and dry skin with elevated TSH and low free T4 on testing.",
            "Diagnosis":
                "Confirm persistent biochemical abnormalities and evaluate for autoimmune thyroiditis; review medications that influence thyroid tests.",
            "Treatment/Management":
                "Initiate levothyroxine with weight- and age-adjusted dosing and titrate by TSH at appropriate intervals. Educate on dosing timing and interactions with calcium or iron.",
            "Monitoring & Follow-up":
                "Monitor TSH to target and reassess symptoms; adjust for pregnancy and major weight changes. Evaluate adherence before large dose changes.",
            "When to Escalate":
                "Escalate for myxedema features, refractory symptoms despite normalized labs, or cardiac disease complicating initiation. Consult endocrinology when etiology or goals are uncertain.",
            "Safety Notes":
                "Avoid overtreatment to reduce risk of atrial fibrillation and bone loss. Separate dosing from binding agents and PPIs where possible.",
        },
    },
    {
        name: "Bacterial Meningitis (Adult)",
        department: "Infectious Diseases",
        sections: {
            "Purpose":
                "Facilitate rapid empiric therapy and diagnostic workup for suspected acute bacterial meningitis.",
            "Scope":
                "For emergency and inpatient settings with adults presenting with meningeal symptoms or sepsis.",
            "Indications":
                "Fever, severe headache, neck stiffness, photophobia, or altered mental status, sometimes preceded by respiratory infection.",
            "Diagnosis":
                "Obtain blood cultures and consider head imaging based on risk before lumbar puncture; analyze CSF for cell count, glucose, protein, and culture. Do not delay antibiotics when suspicion is high.",
            "Treatment/Management":
                "Administer empiric IV antibiotics and adjunctive corticosteroids per age and risk factors; tailor therapy with CSF results. Implement droplet precautions until non-meningococcal infection is confirmed.",
            "Monitoring & Follow-up":
                "Monitor neurologic status, hemodynamics, and laboratory trends; manage complications such as seizures and SIADH. Provide public health notifications for meningococcal disease.",
            "When to Escalate":
                "Escalate for refractory shock, impending herniation, or persistent seizures. Engage critical care for ventilatory and hemodynamic support.",
            "Safety Notes":
                "Review allergies and local resistance when choosing empiric regimens. Counsel close contacts about prophylaxis when indicated.",
        },
    },
    {
        name: "Gout (Acute Flare)",
        department: "Rheumatology",
        sections: {
            "Purpose":
                "Guide prompt pain control and inflammation reduction during acute gout flares and plan prophylaxis.",
            "Scope":
                "For outpatient and emergency treatment of monoarthritis consistent with crystal arthropathy.",
            "Indications":
                "Abrupt, severe joint pain, warmth, and swelling, commonly at the first MTP joint; triggers include dietary excess or diuretics.",
            "Diagnosis":
                "Clinical diagnosis is common; confirm with crystal analysis when feasible or when atypical features exist. Consider septic arthritis in febrile or high-risk patients.",
            "Treatment/Management":
                "Start NSAIDs, colchicine, or corticosteroids based on contraindications and timing; continue urate-lowering therapy if already established. Address precipitating factors and counsel on diet and alcohol.",
            "Monitoring & Follow-up":
                "Reassess pain relief within days and plan urate-lowering initiation or titration after flare resolution. Use prophylaxis during urate-lowering initiation to prevent rebound flares.",
            "When to Escalate":
                "Escalate for polyarticular involvement, systemic toxicity, or suspected septic arthritis. Seek joint aspiration and specialist input when diagnosis is uncertain.",
            "Safety Notes":
                "Adjust medications in renal impairment and avoid NSAIDs where bleeding risk is high. Screen for interactions with colchicine and strong CYP3A4 inhibitors.",
        },
    },
    {
        name: "Rheumatoid Arthritis (RA) – Initial Management",
        department: "Rheumatology",
        sections: {
            "Purpose":
                "Provide an approach to early diagnosis and disease-modifying therapy initiation in rheumatoid arthritis.",
            "Scope":
                "For outpatient evaluation of persistent inflammatory polyarthritis suggestive of RA.",
            "Indications":
                "Symmetric small-joint pain and stiffness worse in the morning with swelling over weeks to months; extra-articular features may occur.",
            "Diagnosis":
                "Use clinical criteria with serology and imaging to confirm disease and assess activity. Screen for latent infections before biologic therapy.",
            "Treatment/Management":
                "Initiate DMARD therapy, typically methotrexate, and add or switch agents based on activity and tolerance. Provide short steroid tapers as bridges and supportive therapies.",
            "Monitoring & Follow-up":
                "Track disease activity scores, function, and medication labs; adjust treatment to achieve remission or low activity. Address vaccinations and bone health.",
            "When to Escalate":
                "Escalate for high activity despite combination therapy or aggressive extra-articular involvement. Refer for biologics or targeted synthetic agents.",
            "Safety Notes":
                "Monitor for hepatotoxicity, cytopenias, and infection risk with DMARDs. Ensure contraception with teratogenic agents and avoid live vaccines on biologics.",
        },
    },
    {
        name: "Peptic Ulcer Disease (PUD)",
        department: "Gastroenterology",
        sections: {
            "Purpose":
                "Standardize evaluation and eradication therapy for H. pylori–related or NSAID-related ulcer disease.",
            "Scope":
                "For outpatient and inpatient care of dyspepsia or bleeding related to ulcers.",
            "Indications":
                "Epigastric pain, nausea, or dyspepsia sometimes relieved by food; complications include bleeding or perforation.",
            "Diagnosis":
                "Test for H. pylori with appropriate assays and consider endoscopy for alarm features or refractory symptoms. Review NSAID and aspirin use.",
            "Treatment/Management":
                "Provide acid suppression and eradicate H. pylori with guideline-based regimens; stop or modify NSAIDs when feasible. Address gastroprotection in high-risk users.",
            "Monitoring & Follow-up":
                "Confirm H. pylori cure with noninvasive testing after therapy and reassess symptoms. Schedule surveillance for complicated or high-risk ulcers per local practice.",
            "When to Escalate":
                "Escalate for bleeding, perforation, or obstruction. Coordinate endoscopic therapy or surgery for complications.",
            "Safety Notes":
                "Consider drug interactions with eradication regimens and reinforce adherence. Avoid long-term high-dose PPIs unless clearly indicated.",
        },
    },
    {
        name: "Anxiety Disorder (Panic Presentations)",
        department: "Behavioral Health",
        sections: {
            "Purpose":
                "Provide brief stabilization and follow-up planning for acute panic presentations while screening for medical mimics.",
            "Scope":
                "For emergency and primary care settings managing paroxysmal anxiety and somatic symptoms.",
            "Indications":
                "Sudden episodes of intense fear with palpitations, shortness of breath, dizziness, or paresthesias; anticipatory anxiety is common.",
            "Diagnosis":
                "Rule out acute cardiopulmonary conditions based on history and exam; use targeted tests as indicated. Confirm panic disorder when recurrent attacks and behavioral changes are present.",
            "Treatment/Management":
                "Offer reassurance, breathing strategies, and short-term pharmacotherapy when appropriate; initiate or refer for CBT. Address sleep, caffeine, and substance use.",
            "Monitoring & Follow-up":
                "Track frequency and impairment; adjust therapy and consider SSRIs or SNRIs for maintenance. Provide crisis resources and relapse plans.",
            "When to Escalate":
                "Escalate for suicidality, severe functional decline, or suspected substance withdrawal. Refer urgently if medical red flags emerge.",
            "Safety Notes":
                "Use benzodiazepines cautiously for short periods and avoid with high substance-use risk. Discuss activation side effects when starting antidepressants.",
        },
    },
    {
        name: "Lower UTI (Cystitis) – Adult Female",
        department: "Urology/Primary Care",
        sections: {
            "Purpose":
                "Streamline diagnosis and short-course treatment of uncomplicated cystitis in adult females.",
            "Scope":
                "For outpatient management of dysuria and frequency in otherwise healthy women.",
            "Indications":
                "New-onset dysuria, frequency, and urgency without vaginal symptoms; hematuria may occur.",
            "Diagnosis":
                "Clinical diagnosis is typical; use dipstick or culture when presentation is atypical or recurrent. Review sexual and contraceptive history that may influence risk.",
            "Treatment/Management":
                "Provide short-course antibiotics per local resistance data and counsel on symptom relief. Avoid unnecessary broad-spectrum agents.",
            "Monitoring & Follow-up":
                "Expect improvement within 48 hours; reassess if symptoms persist or recur. Discuss behavioral strategies and post-coital prophylaxis where relevant.",
            "When to Escalate":
                "Escalate for pregnancy, systemic symptoms, or suspected pyelonephritis. Evaluate for anatomic abnormalities in recurrent cases.",
            "Safety Notes":
                "Consider allergies and drug interactions; adjust dosing for renal function. Encourage hydration and bladder habits that lower recurrence risk.",
        },
    },
    {
        name: "Clostridioides difficile Infection (CDI)",
        department: "Infectious Diseases",
        sections: {
            "Purpose":
                "Guide accurate diagnosis and tiered therapy for C. difficile infection while preventing transmission.",
            "Scope":
                "For inpatient and outpatient care of adults with antibiotic-associated diarrhea or recent healthcare exposure.",
            "Indications":
                "Watery diarrhea with abdominal cramping and leukocytosis after antibiotic exposure or hospitalization.",
            "Diagnosis":
                "Use a two-step test algorithm per local policy; avoid testing formed stool or asymptomatic patients. Assess severity and risk for recurrence.",
            "Treatment/Management":
                "Initiate guideline-based oral therapy and stop inciting antibiotics when possible; consider fecal microbiota–based options for multiple recurrences. Implement isolation and hand hygiene with soap and water.",
            "Monitoring & Follow-up":
                "Monitor stool frequency, hydration, and electrolytes; avoid test of cure. Educate on recurrence risk and early return if symptoms recur.",
            "When to Escalate":
                "Escalate for fulminant colitis with ileus or megacolon. Involve surgery early for signs of perforation or refractory sepsis.",
            "Safety Notes":
                "Avoid antiperistaltic agents in severe disease. Ensure environmental cleaning with sporicidal agents to limit spread.",
        },
    },
    {
        name: "Preeclampsia (Recognition and Initial Management)",
        department: "Obstetrics",
        sections: {
            "Purpose":
                "Support early recognition and stabilization of preeclampsia and severe features in pregnant patients.",
            "Scope":
                "For obstetric triage and inpatient care after 20 weeks’ gestation.",
            "Indications":
                "New-onset hypertension with proteinuria or end-organ symptoms such as headache, visual changes, or epigastric pain.",
            "Diagnosis":
                "Confirm blood pressure elevations and assess labs for hemolysis, liver dysfunction, and thrombocytopenia; evaluate fetal status. Distinguish from chronic hypertension and other mimics.",
            "Treatment/Management":
                "Control severe blood pressure, prevent eclampsia with magnesium sulfate when indicated, and plan timing of delivery with obstetrics. Provide corticosteroids for fetal benefit when appropriate.",
            "Monitoring & Follow-up":
                "Monitor maternal symptoms, reflexes, urine output, and labs; provide continuous fetal surveillance as indicated. Plan postpartum blood pressure follow-up.",
            "When to Escalate":
                "Escalate for persistent severe hypertension, neurologic symptoms, pulmonary edema, or HELLP features. Transfer to higher-level care if deterioration occurs.",
            "Safety Notes":
                "Use antihypertensives compatible with pregnancy and avoid ACE inhibitors. Watch for magnesium toxicity with appropriate monitoring.",
        },
    },
    {
        name: "Asthma Exacerbation (Severe)",
        department: "Pulmonology Unit",
        sections: {
            "Purpose":
                "Direct rapid bronchodilation, oxygenation, and steroid therapy during severe asthma attacks.",
            "Scope":
                "For emergency and inpatient teams treating adults with marked respiratory distress from asthma.",
            "Indications":
                "Severe dyspnea, accessory muscle use, inability to speak full sentences, or silent chest with hypoxemia.",
            "Diagnosis":
                "Clinical severity assessment with peak flow when feasible; exclude pneumothorax and pneumonia if atypical features present.",
            "Treatment/Management":
                "Administer repeated short-acting bronchodilators with anticholinergic agents, systemic corticosteroids, and oxygen to targets. Consider magnesium sulfate IV and noninvasive ventilation where appropriate.",
            "Monitoring & Follow-up":
                "Reassess frequently for response and fatigue; plan step-up controller strategy and trigger mitigation on discharge. Provide an individualized action plan.",
            "When to Escalate":
                "Escalate for rising CO2, exhaustion, or persistent hypoxemia. Involve ICU for impending respiratory failure and advanced support.",
            "Safety Notes":
                "Avoid sedatives that depress respiration. Monitor potassium and lactate with high-dose beta-agonists.",
        },
    },
    {
        name: "COPD Exacerbation",
        department: "Pulmonology Unit",
        sections: {
            "Purpose":
                "Standardize acute bronchodilation, steroid use, and antibiotic selection when indicated for COPD exacerbations.",
            "Scope":
                "For emergency and inpatient care of adults with worsening dyspnea and sputum changes.",
            "Indications":
                "Increased breathlessness, cough, and sputum purulence often following viral illness or exposure.",
            "Diagnosis":
                "Clinical diagnosis supplemented by blood gases and chest imaging when needed; exclude PE, heart failure, and pneumonia.",
            "Treatment/Management":
                "Provide short-acting bronchodilators, systemic corticosteroids, and antibiotics when purulence or severe illness is present; use controlled oxygen aiming for safe saturations.",
            "Monitoring & Follow-up":
                "Monitor gas exchange, symptom relief, and steroid effects; arrange pulmonary rehabilitation referral and inhaler optimization.",
            "When to Escalate":
                "Escalate for acute hypercapnic respiratory failure or shock. Consider noninvasive ventilation early in appropriate patients.",
            "Safety Notes":
                "Avoid excessive oxygen that may worsen CO2 retention. Review interactions and infection risk with steroids.",
        },
    },
    {
        name: "Alcohol Withdrawal (Moderate–Severe)",
        department: "Addiction Medicine",
        sections: {
            "Purpose":
                "Provide symptom-triggered management and seizure prevention during alcohol withdrawal.",
            "Scope":
                "For inpatient and emergency settings treating patients with recent heavy alcohol cessation.",
            "Indications":
                "Tremor, anxiety, tachycardia, hypertension, diaphoresis, insomnia, or hallucinations within days of last drink.",
            "Diagnosis":
                "Use clinical scales to assess severity and risk; identify comorbid liver disease, electrolyte issues, and infection. Review concurrent sedative use.",
            "Treatment/Management":
                "Administer benzodiazepines via symptom-triggered or fixed protocols; give thiamine and correct electrolytes. Consider adjuncts for refractory symptoms and initiate relapse-prevention planning.",
            "Monitoring & Follow-up":
                "Monitor vitals, mental status, and withdrawal scores; prevent aspiration and falls. Arrange addiction follow-up and social support.",
            "When to Escalate":
                "Escalate for delirium tremens, seizures, or refractory autonomic instability. Consider ICU care and alternative agents if benzodiazepines are insufficient.",
            "Safety Notes":
                "Give thiamine before glucose to reduce Wernicke risk. Avoid oversedation and carefully manage respiratory status.",
        },
    },
    {
        name: "Pulmonary Edema (Cardiogenic, Acute)",
        department: "Cardiology Unit",
        sections: {
            "Purpose":
                "Guide rapid reduction of pulmonary congestion and afterload in acute cardiogenic pulmonary edema.",
            "Scope":
                "For emergency and inpatient teams managing acute dyspnea with pulmonary fluid overload.",
            "Indications":
                "Severe dyspnea, orthopnea, pink frothy sputum, and rales with hypertension or ischemia as precipitants.",
            "Diagnosis":
                "Clinical exam with chest imaging and labs to assess heart failure status; evaluate precipitating causes like ACS or arrhythmia.",
            "Treatment/Management":
                "Provide oxygen support, diuretics, and vasodilators for hypertensive crises; consider noninvasive ventilation to improve oxygenation and preload.",
            "Monitoring & Follow-up":
                "Track oxygenation, diuresis, and blood pressure response; optimize chronic heart failure therapy after stabilization.",
            "When to Escalate":
                "Escalate for refractory hypoxemia, hypotension, or shock. Involve critical care for advanced hemodynamic support.",
            "Safety Notes":
                "Avoid aggressive diuresis in hypotensive patients and monitor electrolytes closely. Watch for ischemia or arrhythmia during treatment.",
        },
    },
    {
        name: "Syncope (Adult)",
        department: "Emergency Medicine",
        sections: {
            "Purpose":
                "Standardize risk stratification and targeted workup for transient loss of consciousness.",
            "Scope":
                "For emergency and outpatient assessment of adults with suspected syncope.",
            "Indications":
                "Brief loss of consciousness with spontaneous recovery, often with prodrome or postural triggers; consider cardiac or neurologic causes.",
            "Diagnosis":
                "Obtain ECG and focused history to categorize reflex, orthostatic, or cardiac etiologies; use selective testing including ambulatory monitoring when indicated.",
            "Treatment/Management":
                "Treat identified cause, provide hydration and education for reflex syncope, and manage orthostatic hypotension with medication review and compression strategies.",
            "Monitoring & Follow-up":
                "Arrange follow-up for recurrent episodes or abnormal testing; provide driving advice per local guidance. Consider implantable monitors for unexplained high-risk cases.",
            "When to Escalate":
                "Escalate for exertional syncope, structural heart disease, abnormal ECG, or significant injury from events. Admit for observation when high-risk features are present.",
            "Safety Notes":
                "Avoid QT-prolonging medications in susceptible patients and review anticoagulants when trauma occurs. Counsel on hydration and counterpressure maneuvers.",
        },
    },
    {
        name: "Acute Otitis Media (Adult)",
        department: "ENT",
        sections: {
            "Purpose":
                "Provide diagnostic clarity and analgesia-first management for adult acute otitis media.",
            "Scope":
                "For outpatient care of adults with ear pain and recent upper respiratory symptoms.",
            "Indications":
                "Acute ear pain, fever, and conductive hearing changes with erythematous, bulging tympanic membrane on otoscopy.",
            "Diagnosis":
                "Confirm middle ear effusion and inflammation; differentiate from otitis externa or referred dental pain. Review recent flights or barotrauma.",
            "Treatment/Management":
                "Prioritize adequate analgesia; consider delayed antibiotics in mild cases and immediate therapy when severe or high risk. Educate on nasal decongestant timing and supportive care.",
            "Monitoring & Follow-up":
                "Reassess if pain or fever persists after initial management; evaluate for mastoiditis in worsening cases. Address recurrent infections and risk factors such as smoking.",
            "When to Escalate":
                "Escalate for severe systemic illness, complications, or immunocompromise. Refer to ENT for recurrent or refractory cases.",
            "Safety Notes":
                "Check allergies and avoid ototoxic drops with tympanic membrane perforation. Counsel on safe use of decongestants in hypertension.",
        },
    },
    {
        name: "Erysipelas",
        department: "Infectious Diseases",
        sections: {
            "Purpose":
                "Guide recognition and targeted antibiotic therapy for erysipelas, a superficial streptococcal skin infection.",
            "Scope":
                "For outpatient and inpatient care of adults with acute, well-demarcated erythema and fever.",
            "Indications":
                "Painful, bright red, sharply demarcated plaque with warmth and edema, commonly on the face or lower extremities.",
            "Diagnosis":
                "Clinical diagnosis based on lesion characteristics; evaluate for portals of entry such as tinea pedis or wounds. Differentiate from cellulitis and zoster.",
            "Treatment/Management":
                "Start empiric therapy targeting streptococci and elevate the affected limb; treat skin breaks and edema. Provide analgesia and fever control.",
            "Monitoring & Follow-up":
                "Outline lesion margins to monitor response and reassess within 48–72 hours. Discuss recurrence prevention through skin care and edema management.",
            "When to Escalate":
                "Escalate for systemic toxicity, rapid spread, or periorbital involvement. Consider hospitalization for severe comorbidity or failure of oral therapy.",
            "Safety Notes":
                "Review beta-lactam allergy and adjust dosing for renal impairment. Encourage footwear and interdigital hygiene to prevent reinfection.",
        },
    },
    {
        name: "Tension-Type Headache (Frequent Episodic)",
        department: "Neurology",
        sections: {
            "Purpose":
                "Provide non-opioid analgesic strategies and lifestyle measures for frequent episodic tension-type headache.",
            "Scope":
                "For outpatient care with emphasis on trigger management and stress reduction.",
            "Indications":
                "Bilateral, pressing or tightening pain of mild to moderate intensity without nausea or prominent photophobia.",
            "Diagnosis":
                "Clinical criteria based on frequency and characteristics; exclude secondary causes with red flags. Screen for medication overuse.",
            "Treatment/Management":
                "Use simple analgesics with limits to avoid overuse and incorporate relaxation, ergonomics, and sleep hygiene. Consider preventive therapy if frequent and disabling.",
            "Monitoring & Follow-up":
                "Track headache days and medication use; adjust strategies based on response. Reinforce stress management techniques.",
            "When to Escalate":
                "Escalate for refractory headaches, neurologic deficits, or red-flag features. Refer for multidisciplinary pain management if needed.",
            "Safety Notes":
                "Avoid opioids and limit combination analgesics. Educate on posture and regular breaks for desk-based work.",
        },
    },
    {
        name: "Sciatica (Lumbar Radiculopathy)",
        department: "Orthopedics/Spine",
        sections: {
            "Purpose":
                "Offer conservative care guidance and red-flag recognition for lumbar radicular pain.",
            "Scope":
                "For outpatient evaluation of adults with lower back pain radiating below the knee.",
            "Indications":
                "Unilateral leg pain, paresthesias, or weakness in a dermatomal pattern; onset often after lifting or twisting.",
            "Diagnosis":
                "Clinical diagnosis supported by neurologic exam; reserve imaging for severe deficits or persistent symptoms. Screen for cauda equina and infection or malignancy.",
            "Treatment/Management":
                "Provide activity modification, NSAIDs or neuropathic agents, and physical therapy; consider epidural steroid injections for persistent radicular pain.",
            "Monitoring & Follow-up":
                "Monitor function and pain scores; escalate imaging or interventions if deficits progress. Support graded return to work and core strengthening.",
            "When to Escalate":
                "Escalate for progressive weakness, bowel or bladder dysfunction, or intractable pain. Refer for surgical evaluation when indicated.",
            "Safety Notes":
                "Avoid prolonged bed rest and counsel on safe lifting. Review NSAID risks and neuropathic medication side effects.",
        },
    },
];

// Ensure we have exactly 30 entries
const entries = diseaseData.slice(0, 30);

// Build output text for one disease
function buildOutput(d) {
    const lines = [];

    // 1) Document Information (minimal, no Version, dynamic Date)
    lines.push("Document Information:");
    lines.push(`Disease - ${d.name}`);
    lines.push(`Date - ${DATE_STR}`);
    lines.push(`Responsible Department - ${d.department}`);
    lines.push(""); // blank line after first chunk

    // Remaining sections in fixed order
    for (const section of SECTION_ORDER.slice(1)) {
        const content = (d.sections && d.sections[section]) ? d.sections[section].trim() : "";
        lines.push(`${section}:`);
        lines.push(content.length ? content : "Content pending.");
        lines.push(""); // blank line between sections
    }

    return lines.join("\n").trim() + "\n";
}

// =================== WRITE FILES ===================
for (const d of entries) {
    const fileText = buildOutput(d);
    fs.writeFileSync(path.join(OUT_DIR, `${safe(d.name)}.txt`), fileText, "utf8");
}

console.log(`Generated ${entries.length} medical guidelines in ${OUT_DIR}`);
