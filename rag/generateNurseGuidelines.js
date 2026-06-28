// generateNursingGuidelines.js
// Creates 30 detailed, disease-specific *nursing* clinical guidelines (one .txt per disease),
// formatted for colon-based chunking.
//
// EXACT SECTIONS (in order):
// 1) Document Information
// 2) Overview
// 3) Nursing Assessment
// 4) Key Monitoring
// 5) Nursing Interventions
// 6) Patient Education
// 7) When to Escalate
// 8) Documentation & Coordination
// 9) Prognosis
//
// Rules:
// - Do NOT include TITLE, Version, or any header lines in the content.
// - Date is random, realistic (between 2023-01-01 and today) and appears ONLY in "Document Information".
// - File name (disease) functions as the title outside the document.
// - Each section contains ≥ 1–2 sentences and is disease-specific.
// - Headers end with ":" and content follows on the next line.
//
// ⚠️ Fictional content for a game. Not for clinical use.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "nursing_guidelines");

// Fresh output folder each run
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// ---- Random realistic date (YYYY-MM-DD) between 2023-01-01 and today ----
function randomDateISO(minISO = "2023-01-01") {
    const start = new Date(minISO).getTime();
    const end = Date.now();
    const t = Math.random() * (end - start) + start;
    return new Date(t).toISOString().slice(0, 10);
}

// Fixed section order
const SECTION_ORDER = [
    "Document Information",
    "Overview",
    "Nursing Assessment",
    "Key Monitoring",
    "Nursing Interventions",
    "Patient Education",
    "When to Escalate",
    "Documentation & Coordination",
    "Prognosis",
];

// -------------------- 30 Nursing Guidelines (disease-specific) --------------------
const guidelines = [
    {
        name: "Asthma",
        department: "Pulmonology Unit",
        sections: {
            "Overview":
                "Asthma is a chronic inflammatory airway disorder with variable airflow limitation and hyperresponsiveness. Nursing priorities are to support bronchodilation, oxygenation, and education on trigger control and inhaler technique.",
            "Nursing Assessment":
                "Assess severity: speech in sentences, accessory muscle use, posture, agitation, and fatigue. Review triggers, controller adherence, prior ICU/intubations, and recent infections; check PEFR if available.",
            "Key Monitoring":
                "Monitor SpO₂ and work of breathing frequently, observing for silent chest or rising fatigue. Track response to each bronchodilator dose and record PEFR trends when used.",
            "Nursing Interventions":
                "Position upright, provide calm reassurance, and administer prescribed bronchodilators via spacer/nebulizer. Titrate oxygen to ordered targets and prepare/assist with systemic corticosteroids per orders.",
            "Patient Education":
                "Teach correct inhaler and spacer technique and review the written action plan. Counsel on trigger reduction including smoke exposure, dust mites, viral hygiene, and pre-exercise reliever use if prescribed.",
            "When to Escalate":
                "Escalate for SpO₂ below ordered targets, silent chest, exhaustion, or failure to respond to initial therapy. Alert the team immediately if patient cannot speak in full sentences or shows cyanosis.",
            "Documentation & Coordination":
                "Document pre/post SpO₂, RR, PEFR, medications given, and clinical response. Handover trigger profile, action plan status, and follow-up needs to the next shift or community team.",
            "Prognosis":
                "Prognosis is good with consistent controller use and technique; nursing vigilance reduces exacerbation severity. Early education and action plans lower emergency presentations.",
        },
    },
    {
        name: "Chronic Obstructive Pulmonary Disease (COPD)",
        department: "Pulmonology Unit",
        sections: {
            "Overview":
                "COPD involves persistent airflow limitation with symptom burden and exacerbation risk. Nursing care focuses on dyspnea relief, safe oxygen delivery, infection surveillance, and inhaler optimization.",
            "Nursing Assessment":
                "Assess baseline function, activity tolerance, and exacerbation history. Evaluate cough, sputum purulence, accessory muscle use, and pursed-lip breathing; note home oxygen or NIV use.",
            "Key Monitoring":
                "Track SpO₂ with ordered targets and observe for CO₂ retention signs such as drowsiness or tremor. Monitor frequency of rescue inhaler use and response to therapy.",
            "Nursing Interventions":
                "Administer prescribed bronchodilators and systemic steroids when indicated; provide controlled oxygen to avoid hypercapnia. Encourage effective coughing, airway clearance, and energy conservation techniques.",
            "Patient Education":
                "Reinforce vaccination, smoking cessation support, and inhaler technique with demonstration and return-demo. Teach early exacerbation recognition and when to seek care.",
            "When to Escalate":
                "Escalate for rising CO₂, worsening hypoxemia, or increasing work of breathing despite therapy. Notify the team for altered mental status or hemodynamic instability.",
            "Documentation & Coordination":
                "Record ABG results, oxygen settings, and therapy responses. Coordinate pulmonary rehab referrals and community follow-up for inhaler supply and adherence.",
            "Prognosis":
                "Prognosis depends on severity and exacerbation control; pulmonary rehab improves function. Nursing support reduces readmissions and enhances self-management.",
        },
    },
    {
        name: "Community-Acquired Pneumonia",
        department: "Respiratory/ED Unit",
        sections: {
            "Overview":
                "Community-acquired pneumonia presents with acute lower respiratory infection and radiographic infiltrate. Nursing care prioritizes oxygenation, fever control, early antibiotics, and mobilization.",
            "Nursing Assessment":
                "Assess cough, sputum, pleuritic pain, fever, and dyspnea; evaluate respiratory pattern and accessory use. Review aspiration risk, vaccination status, and comorbidities.",
            "Key Monitoring":
                "Monitor SpO₂, temperature curve, and respiratory rate; evaluate response to oxygen and antibiotics. Track fluid balance and delirium risk in older adults.",
            "Nursing Interventions":
                "Administer prescribed antibiotics promptly, provide antipyretics, and titrate oxygen to targets. Encourage incentive spirometry and early ambulation when safe.",
            "Patient Education":
                "Explain antibiotic adherence, hydration, and airway clearance strategies. Reinforce vaccination and smoking cessation to reduce recurrence.",
            "When to Escalate":
                "Escalate for worsening hypoxemia, persistent tachypnea, hypotension, or confusion. Seek urgent review if sepsis criteria develop or oxygen needs rise quickly.",
            "Documentation & Coordination":
                "Document oxygen delivery, SpO₂, temperatures, and antibiotic timing. Coordinate follow-up imaging or visits for high-risk patients.",
            "Prognosis":
                "Most patients recover with timely therapy; frail or comorbid patients have higher complication risk. Nursing mobilization and hydration reduce deconditioning.",
        },
    },
    {
        name: "Heart Failure (Acute Decompensation)",
        department: "Cardiology Unit",
        sections: {
            "Overview":
                "Acute decompensated heart failure causes congestion and hypoperfusion symptoms. Nursing priorities are diuresis support, fluid balance, and recognition of hemodynamic instability.",
            "Nursing Assessment":
                "Assess dyspnea, orthopnea, edema, weight change, and urine output. Evaluate lung sounds, JVP surrogates, skin perfusion, and presence of S3 or crackles.",
            "Key Monitoring":
                "Track strict intake/output, daily weights, electrolytes, and renal function. Monitor vital signs and tele for arrhythmias during diuresis or vasodilator therapy.",
            "Nursing Interventions":
                "Administer loop diuretics as ordered, reinforce sodium/fluid limits, and position upright. Support oxygen therapy and assist with vasodilators per protocol.",
            "Patient Education":
                "Teach daily weights, low-sodium diet, and when to seek care for rapid gain or swelling. Review medication adherence and follow-up plans.",
            "When to Escalate":
                "Escalate for hypotension, declining urine output, new confusion, or refractory hypoxemia. Notify cardiology for suspected shock or chest pain suggestive of ischemia.",
            "Documentation & Coordination":
                "Record diuretic dosing, outputs, electrolyte changes, and patient education. Coordinate discharge planning with heart failure clinic.",
            "Prognosis":
                "Outcome improves with guideline therapy and early follow-up. Nursing surveillance helps prevent readmission and fluid overload.",
        },
    },
    {
        name: "Acute Coronary Syndrome (NSTEMI/UA)",
        department: "Cardiology Unit",
        sections: {
            "Overview":
                "NSTEMI/UA presents with ischemic chest discomfort without persistent ST elevation. Nursing care centers on pain relief, antithrombotic safety, and rapid deterioration detection.",
            "Nursing Assessment":
                "Assess chest pain quality, radiation, and associated dyspnea or diaphoresis. Review risk factors, recent exertion, and medication history including anticoagulants.",
            "Key Monitoring":
                "Monitor telemetry, vitals, and serial pain scores; track troponin draws and ECG timing. Observe for bleeding signs with antithrombotics.",
            "Nursing Interventions":
                "Administer antiplatelet and anticoagulant therapy as ordered and provide nitrates or beta-blockers when prescribed. Maintain IV access and prepare for imaging or catheterization.",
            "Patient Education":
                "Explain the plan for monitoring, procedures, and medication effects. Reinforce activity restriction until cleared and risk-factor modification.",
            "When to Escalate":
                "Escalate for recurrent chest pain, hypotension, arrhythmias, or new heart failure signs. Alert the interventional team for rapid changes.",
            "Documentation & Coordination":
                "Document symptom onset times, ECGs, troponin results, and medications administered. Coordinate handover to cath lab or step-down with clear anticoagulant status.",
            "Prognosis":
                "Early detection and therapy improve outcomes. Nursing vigilance reduces time to intervention and bleeding complications.",
        },
    },
    {
        name: "Ischemic Stroke (Acute)",
        department: "Neurology/Stroke Unit",
        sections: {
            "Overview":
                "Acute ischemic stroke requires rapid imaging and reperfusion eligibility assessment. Nursing care focuses on airway protection, BP parameters, and prevention of complications.",
            "Nursing Assessment":
                "Assess time last known well, focal deficits, glucose, and anticoagulant use. Screen for dysphagia before oral intake.",
            "Key Monitoring":
                "Monitor neuro checks per protocol, BP targets, and temperature; watch for worsening deficits. Track thrombolysis or thrombectomy timelines if pursued.",
            "Nursing Interventions":
                "Maintain head midline with aspiration precautions, and manage oxygenation. Prepare for thrombolysis screening, administer ordered meds, and start DVT prophylaxis when appropriate.",
            "Patient Education":
                "Explain stroke symptoms, time sensitivity, and rehabilitation goals. Involve family in positioning and safety education.",
            "When to Escalate":
                "Escalate for decreased level of consciousness, rising BP beyond parameters, or new severe headache. Notify the team for signs of hemorrhagic conversion.",
            "Documentation & Coordination":
                "Document NIHSS or local scores, swallow screen, therapy times, and neuro trends. Coordinate PT/OT/SLT referrals and discharge planning early.",
            "Prognosis":
                "Timely reperfusion and rehab improve function. Nursing complication prevention reduces pneumonia and DVT risk.",
        },
    },
    {
        name: "Diabetic Ketoacidosis (DKA)",
        department: "Endocrinology Unit",
        sections: {
            "Overview":
                "DKA is a hyperglycemic emergency with ketonemia and acidosis. Nursing priorities are fluid resuscitation, insulin protocol adherence, and electrolyte safety.",
            "Nursing Assessment":
                "Assess dehydration, Kussmaul respirations, abdominal pain, and mental status. Review possible triggers such as infection or insulin omission.",
            "Key Monitoring":
                "Monitor glucose, ketones, electrolytes (especially potassium), anion gap, and urine output. Track vitals closely for perfusion changes.",
            "Nursing Interventions":
                "Start isotonic fluids per protocol, ensure potassium is safe before insulin, and initiate insulin infusion as ordered. Prevent hypoglycemia and replace electrolytes guided by labs.",
            "Patient Education":
                "Teach sick-day rules, ketone testing, hydration, and when to seek urgent care. Review insulin storage, dosing, and adherence tools.",
            "When to Escalate":
                "Escalate for refractory acidosis, altered consciousness, or shock. Seek ICU review for frequent titration needs or severe comorbidity.",
            "Documentation & Coordination":
                "Document fluid volumes, insulin rates, lab trends, and responses. Coordinate diabetes education before discharge.",
            "Prognosis":
                "Outcomes are excellent with timely protocol use. Nursing precision prevents electrolyte injury and hypoglycemia.",
        },
    },
    {
        name: "Sepsis (Adult)",
        department: "Acute Medicine/ICU",
        sections: {
            "Overview":
                "Sepsis is life-threatening organ dysfunction from dysregulated infection response. Nursing care emphasizes rapid recognition, timely antibiotics, and hemodynamic support.",
            "Nursing Assessment":
                "Assess for fever or hypothermia, tachycardia, tachypnea, hypotension, altered mentation, and oliguria. Identify likely source through history and focused exam.",
            "Key Monitoring":
                "Monitor lactate, urine output, mental status, and hemodynamics. Track antibiotic timing and fluid responsiveness.",
            "Nursing Interventions":
                "Obtain cultures before antibiotics when feasible without delay, administer antibiotics promptly, and give fluids per orders. Prepare for vasopressors and central access if hypotension persists.",
            "Patient Education":
                "Explain infection source control and the need for monitoring. Provide family updates and discuss early mobilization when stable.",
            "When to Escalate":
                "Escalate for persistent hypotension, escalating oxygen needs, or multiorgan dysfunction. Notify ICU for advanced monitoring or support.",
            "Documentation & Coordination":
                "Record sepsis screening time, antibiotic start, fluid totals, and response. Coordinate source control procedures and consults.",
            "Prognosis":
                "Early bundle adherence improves survival. Nursing timing and reassessment are critical to outcomes.",
        },
    },
    {
        name: "Primary Hypertension (Adult)",
        department: "Internal Medicine",
        sections: {
            "Overview":
                "Primary hypertension is sustained blood pressure elevation without secondary cause. Nursing focus is confirmation, lifestyle support, and safe medication titration.",
            "Nursing Assessment":
                "Assess repeated readings with correct cuff and positioning; review medications, sleep apnea risk, and lifestyle factors. Screen for symptoms suggesting end-organ damage.",
            "Key Monitoring":
                "Monitor home and clinic BP logs, electrolytes, and renal function with dose changes. Watch for orthostatic hypotension in older adults.",
            "Nursing Interventions":
                "Reinforce diet, exercise, and adherence strategies; assist with home BP technique and targets. Support gradual medication adjustments per plan.",
            "Patient Education":
                "Teach the importance of consistent measurement, salt reduction, weight control, and sleep hygiene. Discuss medication effects and side effects to expect.",
            "When to Escalate":
                "Escalate for hypertensive emergency signs or refractory hypertension on combination therapy. Refer for secondary causes when indicated.",
            "Documentation & Coordination":
                "Document baseline risk factors, readings, and education provided. Coordinate pharmacist or nutrition referrals and follow-up schedules.",
            "Prognosis":
                "Most patients achieve control with lifestyle and medications. Nursing reinforcement improves adherence and cardiovascular risk reduction.",
        },
    },
    {
        name: "Atrial Fibrillation (New Onset)",
        department: "Cardiology Unit",
        sections: {
            "Overview":
                "New-onset atrial fibrillation can cause palpitations and hemodynamic instability. Nursing care prioritizes rate control safety, anticoagulation checks, and symptom relief.",
            "Nursing Assessment":
                "Assess hemodynamic stability, chest discomfort, dyspnea, and fatigue. Review precipitating illness, thyroid status, alcohol intake, and medication history.",
            "Key Monitoring":
                "Monitor telemetry, BP, and heart rate response to therapy; observe for bleeding if anticoagulated. Track symptom change with rate control or cardioversion plans.",
            "Nursing Interventions":
                "Prepare for rate control medications and potential cardioversion; maintain NPO as ordered. Educate on anticoagulation rationale and precautions.",
            "Patient Education":
                "Discuss triggers, stroke risk, and adherence to anticoagulants when indicated. Provide guidance on heart rate monitoring and activity limits until stabilized.",
            "When to Escalate":
                "Escalate for hypotension, chest pain, syncope, or pre-excited AF patterns. Notify cardiology for rapid deterioration or failed rate control.",
            "Documentation & Coordination":
                "Document rhythm strips, medication timing, and responses. Coordinate anticoagulation counseling and outpatient rhythm evaluation.",
            "Prognosis":
                "Many patients stabilize with rate or rhythm control. Nursing education reduces recurrence triggers and embolic events.",
        },
    },
    {
        name: "Pulmonary Embolism (PE)",
        department: "Respiratory/ED Unit",
        sections: {
            "Overview":
                "Pulmonary embolism is acute obstruction of pulmonary arteries causing hypoxemia and strain. Nursing care supports oxygenation, anticoagulation safety, and rapid risk escalation.",
            "Nursing Assessment":
                "Assess sudden dyspnea, pleuritic pain, hemoptysis, or syncope; review recent immobility, surgery, cancer, or prior VTE. Evaluate calf symptoms and oxygen needs.",
            "Key Monitoring":
                "Monitor SpO₂, hemodynamics, and pain; observe for bleeding on anticoagulation. Track signs of right heart strain such as hypotension or rising lactate.",
            "Nursing Interventions":
                "Administer anticoagulants as ordered and maintain oxygen to target. Prepare for thrombolysis or catheter therapy if high-risk features develop.",
            "Patient Education":
                "Teach anticoagulant adherence, bleeding precautions, and activity guidance. Discuss provoking factors and prevention strategies for travel and immobility.",
            "When to Escalate":
                "Escalate for hypotension, worsening hypoxemia, or syncope. Activate PE response pathways per local policy.",
            "Documentation & Coordination":
                "Document oxygen settings, anticoagulant dose/times, and symptom trends. Coordinate follow-up for duration planning and risk assessment.",
            "Prognosis":
                "Risk varies with clot burden and comorbidity; early therapy improves outcomes. Nursing monitoring mitigates bleeding and deterioration.",
        },
    },
    {
        name: "Deep Vein Thrombosis (DVT)",
        department: "Vascular Medicine",
        sections: {
            "Overview":
                "DVT is thrombus formation in deep veins, typically of the legs. Nursing care focuses on anticoagulant safety, ambulation guidance, and PE prevention.",
            "Nursing Assessment":
                "Assess unilateral swelling, pain, warmth, and dilated superficial veins. Review recent immobility, surgery, hormone therapy, or cancer history.",
            "Key Monitoring":
                "Monitor for new chest symptoms suggestive of PE and watch for bleeding on therapy. Track limb circumference and pain changes.",
            "Nursing Interventions":
                "Administer anticoagulants as prescribed, encourage ambulation as tolerated, and apply compression for symptoms if ordered. Educate on leg elevation and hydration.",
            "Patient Education":
                "Explain medication adherence and bleeding precautions, including when to seek help. Discuss prevention during travel and periods of immobility.",
            "When to Escalate":
                "Escalate for suspected PE, phlegmasia, or severe pain and swelling. Seek urgent review for contraindications or complications of therapy.",
            "Documentation & Coordination":
                "Document anticoagulant timing, patient response, and education delivered. Coordinate duration planning and specialty referral when needed.",
            "Prognosis":
                "Most patients improve with anticoagulation; recurrence risk persists without addressing provoking factors. Nursing education reduces complications.",
        },
    },
    {
        name: "Spontaneous Pneumothorax",
        department: "Respiratory/ED Unit",
        sections: {
            "Overview":
                "Spontaneous pneumothorax is air in the pleural space causing lung collapse. Nursing care emphasizes oxygenation, pain control, and drain system safety when used.",
            "Nursing Assessment":
                "Assess acute pleuritic pain, dyspnea, and asymmetry of breath sounds. Review precipitating events and prior episodes; evaluate stability.",
            "Key Monitoring":
                "Monitor SpO₂, respiratory effort, and chest pain. If a drain is placed, check for bubbling/air leak, water seal level, and subcutaneous emphysema.",
            "Nursing Interventions":
                "Provide oxygen per orders, optimize analgesia, and assist with needle aspiration or chest drain setup using sterile technique. Keep the system below chest level and ensure secure connections.",
            "Patient Education":
                "Educate on avoiding valsalva/strain and when to seek urgent care for sudden dyspnea. Discuss air travel and diving restrictions until cleared.",
            "When to Escalate":
                "Escalate immediately for tension signs: severe distress, hypotension, or tracheal deviation. Notify respiratory or surgical teams for persistent air leak.",
            "Documentation & Coordination":
                "Record respiratory status, drain details, and analgesia effectiveness. Coordinate surgical follow-up for recurrence risk.",
            "Prognosis":
                "Primary cases often resolve with simple measures; recurrence is possible. Nursing drain care reduces complications.",
        },
    },
    {
        name: "Appendicitis (Acute)",
        department: "General Surgery",
        sections: {
            "Overview":
                "Appendicitis is acute inflammation of the appendix requiring timely diagnosis and usually surgery. Nursing care supports pain control, NPO status, and perioperative safety.",
            "Nursing Assessment":
                "Assess pain migration to the right lower quadrant, fever, nausea, and guarding. Review pregnancy status and last oral intake.",
            "Key Monitoring":
                "Monitor vitals, pain scores, and signs of perforation such as worsening tenderness or sepsis. Track fluids and antibiotics timing.",
            "Nursing Interventions":
                "Maintain NPO, establish IV access, and administer fluids and antibiotics per orders. Provide analgesia and assist with surgical preparation.",
            "Patient Education":
                "Explain the surgical plan and recovery expectations. Reinforce early mobilization and wound care after surgery.",
            "When to Escalate":
                "Escalate for signs of peritonitis, hemodynamic instability, or uncontrolled pain. Notify the team for suspected abscess or deterioration.",
            "Documentation & Coordination":
                "Document exam changes, analgesia response, and antibiotic timing. Coordinate handover to operating room and postoperative unit.",
            "Prognosis":
                "Outcomes are excellent with early intervention. Nursing NPO adherence and antibiotic timing reduce complications.",
        },
    },
    {
        name: "Acute Pancreatitis",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "Acute pancreatitis presents with severe epigastric pain and elevated enzymes. Nursing care focuses on fluids, analgesia, and early complication surveillance.",
            "Nursing Assessment":
                "Assess pain radiation to the back, nausea/vomiting, and risk factors such as alcohol use or gallstones. Evaluate volume status and abdominal tenderness.",
            "Key Monitoring":
                "Monitor vitals, urine output, and pain control; track labs including electrolytes and hematocrit. Watch for hypoxia and infection signs.",
            "Nursing Interventions":
                "Administer isotonic fluids per protocol, provide multimodal analgesia, and support early enteral nutrition when ordered. Prepare for ERCP if biliary obstruction is suspected.",
            "Patient Education":
                "Counsel on alcohol cessation and gallstone management plans. Explain dietary progression and the importance of follow-up.",
            "When to Escalate":
                "Escalate for organ failure, persistent vomiting, or uncontrolled pain. Notify team for suspected necrosis or sepsis.",
            "Documentation & Coordination":
                "Document fluid totals, pain scores, nutrition status, and procedures performed. Coordinate surgical or GI consults as needed.",
            "Prognosis":
                "Most mild cases resolve with supportive care; severe cases carry complication risk. Nursing vigilance detects deterioration early.",
        },
    },
    {
        name: "Acute Cholecystitis",
        department: "General Surgery",
        sections: {
            "Overview":
                "Acute cholecystitis is gallbladder inflammation from cystic duct obstruction. Nursing care emphasizes analgesia, antibiotics, and preparation for early surgery.",
            "Nursing Assessment":
                "Assess right upper quadrant pain, fever, and Murphy sign; note nausea and vomiting. Review past gallstone events and comorbidities.",
            "Key Monitoring":
                "Monitor vitals, pain control, and liver tests when available. Watch for cholangitis signs such as jaundice or hypotension.",
            "Nursing Interventions":
                "Maintain NPO, start IV fluids and antibiotics as ordered, and manage analgesia. Prepare for laparoscopic cholecystectomy or drainage in high-risk patients.",
            "Patient Education":
                "Explain procedure expectations, fasting rationale, and postoperative care. Discuss diet advancement and wound care.",
            "When to Escalate":
                "Escalate for sepsis, uncontrolled pain, or suspected perforation. Alert the team for worsening jaundice or hypotension.",
            "Documentation & Coordination":
                "Record antibiotic timing, pain scores, and surgical plans. Coordinate imaging and OR transfer.",
            "Prognosis":
                "Timely surgery usually resolves symptoms. Nursing support prevents dehydration and delays to treatment.",
        },
    },
    {
        name: "Pyelonephritis (Acute)",
        department: "Urology/Medicine",
        sections: {
            "Overview":
                "Acute pyelonephritis is a systemic urinary tract infection affecting the renal parenchyma. Nursing care supports timely antibiotics, hydration, and pain control.",
            "Nursing Assessment":
                "Assess fever, flank pain, CVA tenderness, and urinary symptoms. Review pregnancy status, obstruction risk, and recent instrumentation.",
            "Key Monitoring":
                "Monitor temperature curve, renal function, and response to therapy. Track hydration status and nausea control.",
            "Nursing Interventions":
                "Administer empiric antibiotics promptly and ensure adequate fluids; provide analgesia and antiemetics. Prepare for imaging if obstruction is suspected.",
            "Patient Education":
                "Reinforce antibiotic adherence, hydration, and early return if symptoms persist. Discuss UTI prevention strategies.",
            "When to Escalate":
                "Escalate for sepsis, persistent fever after therapy initiation, or obstruction signs. Seek urgent urologic input for hydronephrosis.",
            "Documentation & Coordination":
                "Document antibiotic start time, vitals, and symptom changes. Coordinate follow-up cultures in high-risk cases.",
            "Prognosis":
                "Most patients improve within days of therapy. Nursing hydration and adherence coaching reduce recurrence.",
        },
    },
    {
        name: "Cellulitis (Non-purulent)",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Non-purulent cellulitis is diffuse bacterial skin infection, often streptococcal. Nursing care focuses on antibiotics, edema control, and portal-of-entry treatment.",
            "Nursing Assessment":
                "Assess erythema, warmth, tenderness, and edema; evaluate interdigital maceration or tinea. Review systemic symptoms and allergy history.",
            "Key Monitoring":
                "Monitor temperature and outline borders to assess spread. Track pain and function, and reassess within 48–72 hours.",
            "Nursing Interventions":
                "Administer antibiotics as ordered, elevate the limb, and treat skin breaks. Provide analgesia and wound care.",
            "Patient Education":
                "Teach skin hygiene, edema management, and footwear care. Explain when to return for worsening redness or fever.",
            "When to Escalate":
                "Escalate for rapid progression, necrosis, or systemic toxicity. Consider alternative diagnoses if no improvement.",
            "Documentation & Coordination":
                "Document lesion size, antibiotic timing, and education. Coordinate follow-up and community wound services if needed.",
            "Prognosis":
                "Most cases respond quickly to therapy. Nursing border tracking helps verify improvement.",
        },
    },
    {
        name: "Anaphylaxis",
        department: "Emergency Medicine",
        sections: {
            "Overview":
                "Anaphylaxis is a rapid, systemic hypersensitivity reaction. Nursing priorities are intramuscular epinephrine, airway support, and observation for biphasic response.",
            "Nursing Assessment":
                "Assess cutaneous signs, airway compromise, respiratory distress, hypotension, and GI symptoms. Identify likely allergen exposure and timing.",
            "Key Monitoring":
                "Monitor airway patency, SpO₂, BP, and symptom resolution after epinephrine. Track need for repeat dosing and fluid response.",
            "Nursing Interventions":
                "Administer epinephrine promptly per protocol, provide oxygen and IV fluids, and assist with adjuncts after epinephrine. Prepare for airway management if deterioration occurs.",
            "Patient Education":
                "Teach auto-injector use, trigger avoidance, and action plan steps. Arrange allergy follow-up for evaluation.",
            "When to Escalate":
                "Escalate for refractory hypotension, severe bronchospasm, or airway edema. Call for advanced airway or vasopressors as needed.",
            "Documentation & Coordination":
                "Document time of epinephrine, doses, response, and observation duration. Coordinate prescription and training for auto-injector before discharge.",
            "Prognosis":
                "Rapid epinephrine improves outcomes. Nursing observation mitigates biphasic risk.",
        },
    },
    {
        name: "Viral Gastroenteritis (Adult)",
        department: "Internal Medicine",
        sections: {
            "Overview":
                "Viral gastroenteritis causes acute nausea, vomiting, and watery diarrhea. Nursing care emphasizes hydration, electrolyte safety, and infection control.",
            "Nursing Assessment":
                "Assess volume status, frequency of vomiting/diarrhea, and exposure history. Screen for red flags such as severe tenderness or blood in stool.",
            "Key Monitoring":
                "Monitor hydration markers, electrolytes when indicated, and urine output. Track fever and tolerance of oral intake.",
            "Nursing Interventions":
                "Encourage oral rehydration solutions and administer antiemetics judiciously. Implement contact precautions and support gradual diet advancement.",
            "Patient Education":
                "Teach hand hygiene, safe food practices, and rehydration strategies. Provide return precautions for dehydration signs.",
            "When to Escalate":
                "Escalate for severe dehydration, persistent vomiting, or immunocompromised status. Initiate IV fluids if oral rehydration fails.",
            "Documentation & Coordination":
                "Document stool and emesis frequency, intake/output, and education provided. Coordinate work/school notes and follow-up if needed.",
            "Prognosis":
                "Most cases resolve within days. Nursing hydration guidance reduces ED returns.",
        },
    },
    {
        name: "COVID-19 (Adult, Acute)",
        department: "Respiratory/ID Unit",
        sections: {
            "Overview":
                "Acute COVID-19 ranges from mild illness to hypoxemic respiratory failure. Nursing priorities include oxygen support, isolation, and monitoring for rapid decline.",
            "Nursing Assessment":
                "Assess respiratory rate, SpO₂, cough, and fatigue; review risk factors for progression. Note onset timeline and exposure history.",
            "Key Monitoring":
                "Monitor oxygenation trends, work of breathing, and fever. Track anticoagulation and anti-inflammatory therapy effects when used.",
            "Nursing Interventions":
                "Titrate oxygen, encourage prone positioning when appropriate, and implement isolation precautions. Administer antivirals or steroids per orders and prevent VTE.",
            "Patient Education":
                "Explain isolation, symptom monitoring, and home pulse oximetry if discharged. Reinforce vaccination and follow-up for persistent symptoms.",
            "When to Escalate":
                "Escalate for rising oxygen requirements, confusion, or hemodynamic instability. Notify ICU for high-flow or ventilatory support needs.",
            "Documentation & Coordination":
                "Document oxygen devices and settings, escalation steps, and response to therapy. Coordinate discharge with clear return precautions.",
            "Prognosis":
                "Prognosis varies with age and comorbidity; early support improves outcomes. Nursing surveillance detects deterioration promptly.",
        },
    },
    {
        name: "Seasonal Influenza (Adult)",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Seasonal influenza causes abrupt fever, myalgias, and respiratory symptoms. Nursing care focuses on supportive therapy, antiviral eligibility, and isolation.",
            "Nursing Assessment":
                "Assess symptom onset timing, exposure history, and risk factors for complications. Evaluate for secondary pneumonia if relapse occurs.",
            "Key Monitoring":
                "Monitor oxygenation, hydration, and temperature trends. Watch for myocarditis or encephalopathy in severe cases.",
            "Nursing Interventions":
                "Provide antipyretics, fluids, and rest; administer antivirals when indicated by risk and timing. Implement droplet precautions.",
            "Patient Education":
                "Counsel on isolation, hydration, and when to seek care. Reinforce annual vaccination.",
            "When to Escalate":
                "Escalate for hypoxemia, severe dehydration, or decompensation of comorbid conditions. Consider admission for high-risk patients.",
            "Documentation & Coordination":
                "Document symptom chronology, therapies given, and response. Coordinate follow-up and work/school guidance.",
            "Prognosis":
                "Most recover in days to a week. Nursing support mitigates complications in vulnerable groups.",
        },
    },
    {
        name: "Migraine (Acute Care)",
        department: "Neurology",
        sections: {
            "Overview":
                "Migraine produces recurrent, disabling headaches with sensory symptoms. Nursing care reduces stimuli, administers abortive therapy, and prevents medication overuse.",
            "Nursing Assessment":
                "Assess aura, photophobia/phonophobia, nausea, and triggers. Screen for red flags suggesting secondary causes.",
            "Key Monitoring":
                "Monitor pain scores, hydration, and response to therapy. Track adverse effects from triptans, antiemetics, or NSAIDs.",
            "Nursing Interventions":
                "Provide a low-stimulus environment, administer prescribed analgesics and antiemetics, and encourage sleep hygiene. Offer non-pharmacologic measures like hydration and cold packs.",
            "Patient Education":
                "Teach trigger tracking, limits on acute medications, and preventive options discussion. Provide headache diary templates.",
            "When to Escalate":
                "Escalate for status migrainosus, new neurological deficits, or atypical features. Seek specialist input for refractory attacks.",
            "Documentation & Coordination":
                "Document onset, treatments, and response trajectory. Coordinate outpatient neurology referral when frequent.",
            "Prognosis":
                "Most episodes resolve with appropriate therapy. Nursing education curbs rebound headaches.",
        },
    },
    {
        name: "Epilepsy (Seizure Care in ED)",
        department: "Neurology",
        sections: {
            "Overview":
                "Emergency seizure care centers on airway protection and timely termination of convulsions. Nursing care ensures safety, medication delivery, and post-ictal monitoring.",
            "Nursing Assessment":
                "Assess seizure type, duration, injuries, and medication adherence. Check glucose and pregnancy status where relevant.",
            "Key Monitoring":
                "Monitor airway, SpO₂, and hemodynamics during and after events. Track post-ictal recovery and recurrence.",
            "Nursing Interventions":
                "Protect from injury, position laterally, and administer benzodiazepines per protocol; load antiseizure meds if ordered. Avoid restraining limbs and ensure suction availability.",
            "Patient Education":
                "Reinforce adherence, trigger avoidance (sleep deprivation, alcohol), and rescue plan use. Provide driving and safety counseling per local rules.",
            "When to Escalate":
                "Escalate for status epilepticus, persistent altered consciousness, or trauma. Notify ICU for refractory seizures needing continuous EEG.",
            "Documentation & Coordination":
                "Document timings, meds, responses, and injuries. Coordinate neurology follow-up and medication reconciliation.",
            "Prognosis":
                "Many patients achieve control with therapy. Nursing adherence support reduces recurrence risk.",
        },
    },
    {
        name: "Chronic Kidney Disease (CKD) – Adult",
        department: "Nephrology",
        sections: {
            "Overview":
                "CKD involves gradual loss of kidney function with systemic complications. Nursing care supports risk reduction, medication safety, and education on kidney-protective behaviors.",
            "Nursing Assessment":
                "Assess eGFR trends, albuminuria, blood pressure control, and anemia symptoms. Review nephrotoxin exposure and fluid status.",
            "Key Monitoring":
                "Monitor electrolytes, hemoglobin, and BP; ensure dose adjustments for renally cleared drugs. Track vaccination status.",
            "Nursing Interventions":
                "Reinforce RAAS and SGLT2 adherence when prescribed, encourage hydration balance, and avoid NSAIDs. Provide nutrition counseling coordination.",
            "Patient Education":
                "Teach sick-day rules, medication lists, and when to seek care for edema or dyspnea. Discuss dialysis options early if progression occurs.",
            "When to Escalate":
                "Escalate for rapid eGFR decline, refractory hyperkalemia, or uremic symptoms. Refer for vascular access planning when indicated.",
            "Documentation & Coordination":
                "Record lab trends, blood pressure logs, and education delivered. Coordinate nephrology visits and anemia management services.",
            "Prognosis":
                "Progression varies; risk reduction slows decline. Nursing monitoring prevents medication-related harm.",
        },
    },
    {
        name: "Acute Kidney Injury (AKI)",
        department: "Nephrology",
        sections: {
            "Overview":
                "AKI is an abrupt decline in renal function that may be prerenal, intrinsic, or postrenal. Nursing priorities include volume optimization, nephrotoxin avoidance, and electrolyte safety.",
            "Nursing Assessment":
                "Assess fluid status, urine output, medications, and potential obstruction. Review recent illness, contrast exposure, and sepsis indicators.",
            "Key Monitoring":
                "Monitor intake/output, electrolytes (especially potassium), acid–base status, and weight. Track response to fluids or diuretics when used.",
            "Nursing Interventions":
                "Hold nephrotoxins as ordered, administer fluids judiciously, and prepare for renal replacement therapy if indicated. Support safe medication dosing.",
            "Patient Education":
                "Explain AKI causes, avoidance of NSAIDs, and follow-up labs. Discuss hydration targets and when to return for worsening symptoms.",
            "When to Escalate":
                "Escalate for refractory hyperkalemia, severe acidosis, pulmonary edema, or uremic signs. Notify nephrology if etiology is unclear or severe.",
            "Documentation & Coordination":
                "Document fluid balances, lab changes, and medication adjustments. Coordinate follow-up creatinine checks after discharge.",
            "Prognosis":
                "Many cases recover if causes are reversed. Nursing vigilance prevents electrolyte complications.",
        },
    },
    {
        name: "Upper Gastrointestinal Bleed (UGIB)",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "UGIB presents with hematemesis or melena and can be life-threatening. Nursing care emphasizes resuscitation, transfusion safety, and endoscopy coordination.",
            "Nursing Assessment":
                "Assess hemodynamics, stool color, and bleeding history including anticoagulants or NSAIDs. Evaluate comorbid liver disease.",
            "Key Monitoring":
                "Monitor vitals, orthostatics, hemoglobin trends, and mental status. Track transfusions and response to therapy.",
            "Nursing Interventions":
                "Establish large-bore IV access, administer fluids and PPIs as ordered, and prepare for endoscopy. Position appropriately and manage aspiration risk.",
            "Patient Education":
                "Explain fasting, procedure steps, and medication adjustments. Counsel on avoiding NSAIDs and alcohol if relevant.",
            "When to Escalate":
                "Escalate for persistent hypotension, ongoing bleeding, or variceal suspicion. Notify the team for massive transfusion protocols.",
            "Documentation & Coordination":
                "Record estimated blood loss, transfusion details, and endoscopy timing. Coordinate with endoscopy unit and anesthesia.",
            "Prognosis":
                "Outcomes depend on source and comorbidity; early endoscopy improves control. Nursing resuscitation limits complications.",
        },
    },
    {
        name: "Osteoarthritis (Knee/Hip)",
        department: "Rheumatology",
        sections: {
            "Overview":
                "Osteoarthritis causes degenerative joint pain and functional limitation. Nursing care promotes analgesia safety, exercise adherence, and fall prevention.",
            "Nursing Assessment":
                "Assess pain pattern, stiffness after rest, mobility aids, and impact on ADLs. Evaluate gait and home safety risks.",
            "Key Monitoring":
                "Monitor pain/function scores, response to therapies, and medication side effects. Track weight and activity goals.",
            "Nursing Interventions":
                "Support exercise therapy referrals, teach joint protection techniques, and coach on topical/oral analgesic use. Encourage heat/cold modalities as appropriate.",
            "Patient Education":
                "Educate on weight management, pacing activities, and safe footwear. Discuss when to consider injections or surgery.",
            "When to Escalate":
                "Escalate for rapidly worsening function, night pain, or falls. Refer to orthopedics when conservative care fails.",
            "Documentation & Coordination":
                "Document mobility aids, home safety recommendations, and therapy attendance. Coordinate PT and community resources.",
            "Prognosis":
                "Symptoms fluctuate but are manageable with multimodal care. Nursing coaching improves quality of life and independence.",
        },
    },
    {
        name: "Major Depressive Disorder (Adult)",
        department: "Behavioral Health",
        sections: {
            "Overview":
                "Major depression impairs mood, energy, and function. Nursing care prioritizes safety assessment, adherence support, and activation of protective routines.",
            "Nursing Assessment":
                "Assess mood, anhedonia, sleep, appetite, and concentration; screen for suicidality and comorbid anxiety or substance use. Use validated scales if available.",
            "Key Monitoring":
                "Monitor activation or suicidality after medication starts or dose changes. Track adherence, side effects, and functional recovery.",
            "Nursing Interventions":
                "Support structured daily routines, gentle physical activity, and sleep hygiene. Reinforce medication and therapy engagement; offer crisis resources.",
            "Patient Education":
                "Explain time-to-effect for antidepressants, common side effects, and relapse warning signs. Encourage social reconnection and problem-solving strategies.",
            "When to Escalate":
                "Escalate for active suicidal ideation/plan, psychosis, or inability to care for self. Arrange urgent psychiatric evaluation when needed.",
            "Documentation & Coordination":
                "Document safety plans, contacts, and follow-up scheduling. Coordinate with therapists and primary care on care plans.",
            "Prognosis":
                "Most improve with combined treatments; maintenance reduces relapse. Nursing continuity helps adherence and coping.",
        },
    },
    {
        name: "Prostate Cancer (Initial Care)",
        department: "Urology/Oncology Unit",
        sections: {
            "Overview":
                "Newly diagnosed prostate cancer requires risk stratification and shared decision-making. Nursing care supports education, symptom control, and care coordination.",
            "Nursing Assessment":
                "Assess urinary symptoms, pain, and anxiety; review biopsy results and planned imaging. Identify information needs and support systems.",
            "Key Monitoring":
                "Monitor treatment side effects including urinary, bowel, and sexual function changes. Track adherence to appointments and labs.",
            "Nursing Interventions":
                "Provide decision aids, set expectations for surveillance or definitive therapy, and coordinate referrals. Offer continence and sexual function resources.",
            "Patient Education":
                "Explain risk categories, treatment options, and potential side effects. Discuss exercise, nutrition, and bone health if androgen deprivation is planned.",
            "When to Escalate":
                "Escalate for severe pain, urinary retention, or neurological symptoms suggesting cord compression. Notify oncology for rapid PSA rise or systemic symptoms.",
            "Documentation & Coordination":
                "Document preferences, consent discussions, and side-effect logs. Coordinate multidisciplinary meetings and survivorship planning.",
            "Prognosis":
                "Prognosis varies by risk group; many localized cases have excellent outcomes. Nursing navigation improves experience and adherence.",
        },
    },
    {
        name: "Breast Cancer (Early-Stage)",
        department: "Breast Surgery/Oncology",
        sections: {
            "Overview":
                "Early-stage breast cancer management includes surgery, radiation, and systemic therapy tailored to subtype. Nursing care focuses on symptom control and education across the pathway.",
            "Nursing Assessment":
                "Assess pain, wound concerns, lymphedema risk, and treatment toxicities. Review psychosocial stressors and support networks.",
            "Key Monitoring":
                "Monitor for infection, seroma, and lymphedema; track chemo or endocrine side effects. Observe fatigue and mood changes.",
            "Nursing Interventions":
                "Support drain care, wound care, and ROM exercises as instructed. Provide antiemetic regimens and skin care guidance during radiation.",
            "Patient Education":
                "Teach signs of infection, lymphedema precautions, and contraception needs with teratogenic therapies. Offer resources for wigs and prostheses when desired.",
            "When to Escalate":
                "Escalate for febrile neutropenia, uncontrolled pain, or severe skin reactions. Notify oncology for cardiotoxic symptoms on certain agents.",
            "Documentation & Coordination":
                "Document toxicity grades, interventions, and referrals. Coordinate rehab, psychosocial services, and survivorship planning.",
            "Prognosis":
                "Many patients achieve cure with multimodal therapy. Nursing support mitigates side effects and improves quality of life.",
        },
    },
    {
        name: "Iron-Deficiency Anemia (Adult)",
        department: "Hematology",
        sections: {
            "Overview":
                "Iron-deficiency anemia reduces oxygen-carrying capacity and functional status. Nursing care supports replenishment, source evaluation, and adherence.",
            "Nursing Assessment":
                "Assess fatigue, dyspnea on exertion, pica, and brittle nails; review bleeding history and diet. Note comorbidities affecting absorption.",
            "Key Monitoring":
                "Monitor hemoglobin and ferritin recovery and tolerance of iron therapy. Track constipation or GI upset from oral iron.",
            "Nursing Interventions":
                "Administer oral or IV iron as ordered and provide strategies to minimize GI effects. Coordinate evaluation for potential bleeding sources.",
            "Patient Education":
                "Teach dosing with vitamin C, spacing from calcium, and expected stool changes. Emphasize completion of therapy to restore stores.",
            "When to Escalate":
                "Escalate for hemodynamic instability, suspected significant bleeding, or intolerance to oral and IV options. Notify providers for non-response to therapy.",
            "Documentation & Coordination":
                "Document lab trends, side effects, and adherence counseling. Coordinate GI or gynecologic referrals when appropriate.",
            "Prognosis":
                "Most patients recover with repletion and source control. Nursing adherence support prevents recurrence.",
        },
    },
    {
        name: "Hypothyroidism (Primary)",
        department: "Endocrinology",
        sections: {
            "Overview":
                "Primary hypothyroidism causes metabolic slowing and fatigue. Nursing care ensures safe levothyroxine initiation and symptom follow-up.",
            "Nursing Assessment":
                "Assess weight gain, cold intolerance, constipation, and dry skin; review labs confirming biochemical diagnosis. Note pregnancy intent or status.",
            "Key Monitoring":
                "Monitor symptom change and adherence; ensure TSH rechecks at appropriate intervals per plan. Watch for over-replacement signs such as palpitations.",
            "Nursing Interventions":
                "Reinforce correct dosing timing and separation from calcium/iron. Support gradual dose titration and medication reconciliation.",
            "Patient Education":
                "Teach expectations for symptom improvement timelines and the importance of consistent daily dosing. Discuss interactions with other medications and supplements.",
            "When to Escalate":
                "Escalate for myxedema features, chest pain, or persistent symptoms despite normalized labs. Seek endocrinology review for complex cases.",
            "Documentation & Coordination":
                "Document education provided, dose changes, and lab dates. Coordinate pregnancy-specific management if needed.",
            "Prognosis":
                "Most patients achieve symptom control with appropriate dosing. Nursing follow-through prevents under- or over-treatment.",
        },
    },
    {
        name: "Bacterial Meningitis (Adult)",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Bacterial meningitis is a medical emergency requiring immediate antibiotics. Nursing care emphasizes airway protection, droplet precautions, and neurologic monitoring.",
            "Nursing Assessment":
                "Assess severe headache, fever, neck stiffness, photophobia, and altered mental status. Review recent infections and vaccine status.",
            "Key Monitoring":
                "Monitor neuro status, vitals, and fluid balance; observe for seizures and SIADH. Track antibiotic and steroid timing.",
            "Nursing Interventions":
                "Administer empiric antibiotics and adjunctive steroids as ordered without delay. Maintain droplet precautions until cleared.",
            "Patient Education":
                "Provide family education on urgency and infection control. Discuss potential hearing changes and follow-up needs.",
            "When to Escalate":
                "Escalate for refractory shock, decreased consciousness, or seizures. Notify ICU for deteriorating patients.",
            "Documentation & Coordination":
                "Document therapy times, neuro checks, and fluid balances. Coordinate public health notifications for meningococcal cases.",
            "Prognosis":
                "Rapid therapy improves survival and reduces sequelae. Nursing timing and monitoring are pivotal.",
        },
    },
    {
        name: "Gout (Acute Flare)",
        department: "Rheumatology",
        sections: {
            "Overview":
                "Acute gout causes sudden, severe inflammatory arthritis. Nursing care provides pain relief, education on triggers, and support for prophylaxis planning.",
            "Nursing Assessment":
                "Assess joint swelling, erythema, warmth, and pain severity; review diet, alcohol, and diuretics. Consider aspiration history or infection risk.",
            "Key Monitoring":
                "Monitor pain response and mobility; watch for GI effects of NSAIDs or steroids. Track blood pressure and glucose where relevant.",
            "Nursing Interventions":
                "Administer NSAIDs, colchicine, or corticosteroids as ordered and provide joint rest and elevation. Apply ice and ensure hydration unless contraindicated.",
            "Patient Education":
                "Teach flare management, limits on alcohol and purine-rich foods, and importance of urate-lowering adherence if prescribed. Explain prophylaxis during titration.",
            "When to Escalate":
                "Escalate for polyarticular involvement, fever, or suspected septic arthritis. Seek urgent review if pain remains uncontrolled.",
            "Documentation & Coordination":
                "Document pain scores, medications, and response. Coordinate rheumatology follow-up for recurrent flares.",
            "Prognosis":
                "Most flares resolve with therapy; prevention reduces recurrence. Nursing coaching improves adherence and lifestyle changes.",
        },
    },
    {
        name: "Rheumatoid Arthritis (Initial Care)",
        department: "Rheumatology",
        sections: {
            "Overview":
                "Rheumatoid arthritis is a chronic inflammatory polyarthritis requiring DMARD therapy. Nursing care supports early treatment, vaccine review, and infection risk counseling.",
            "Nursing Assessment":
                "Assess joint pain, swelling, morning stiffness, and functional limitations. Review labs, serology, and comorbidities.",
            "Key Monitoring":
                "Monitor disease activity scores and medication labs for toxicity. Track pain and function changes across visits.",
            "Nursing Interventions":
                "Reinforce DMARD adherence, provide injection teaching when needed, and coordinate vaccine updates. Offer joint protection and activity guidance.",
            "Patient Education":
                "Discuss treatment goals, infection precautions with immunosuppression, and family planning if teratogenic drugs are used. Encourage exercise and smoking cessation.",
            "When to Escalate":
                "Escalate for high disease activity despite therapy or severe extra-articular signs. Notify rheumatology for biologic side effects.",
            "Documentation & Coordination":
                "Document activity scores, labs, and education. Coordinate specialty pharmacy and monitoring schedules.",
            "Prognosis":
                "Early aggressive therapy improves outcomes. Nursing engagement supports sustained control.",
        },
    },
    {
        name: "Peptic Ulcer Disease (PUD)",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "PUD results from acid injury often linked to H. pylori or NSAIDs. Nursing care supports symptom control, eradication therapy adherence, and bleeding prevention.",
            "Nursing Assessment":
                "Assess epigastric pain pattern, NSAID use, and alarm features such as weight loss or bleeding. Review prior H. pylori testing.",
            "Key Monitoring":
                "Monitor pain response, hemoglobin if bleeding risk, and adherence to therapy. Track adverse effects of eradication regimens.",
            "Nursing Interventions":
                "Administer PPIs and antibiotics as ordered; counsel on stopping NSAIDs when feasible. Support gastroprotection for high-risk users.",
            "Patient Education":
                "Teach completion of eradication therapy, avoidance of triggers, and when to seek urgent care. Explain test-of-cure timing if indicated.",
            "When to Escalate":
                "Escalate for bleeding, perforation signs, or obstruction. Notify endoscopy service for complications.",
            "Documentation & Coordination":
                "Document medication start dates, side effects, and follow-up plans. Coordinate H. pylori testing and results.",
            "Prognosis":
                "Most ulcers heal with therapy and risk modification. Nursing adherence support prevents recurrence.",
        },
    },
    {
        name: "Anxiety Disorder (Panic Presentations)",
        department: "Behavioral Health",
        sections: {
            "Overview":
                "Panic presentations involve sudden intense fear with somatic symptoms. Nursing care provides stabilization, reassurance, and aftercare planning.",
            "Nursing Assessment":
                "Assess symptom onset, triggers, and medical mimics; review substance use and sleep. Screen for suicidality and functional impact.",
            "Key Monitoring":
                "Monitor vitals during acute episodes and response to interventions. Track frequency and severity across visits.",
            "Nursing Interventions":
                "Coach paced breathing, grounding techniques, and stimulus reduction. Support brief pharmacotherapy when prescribed and arrange therapy referrals.",
            "Patient Education":
                "Teach panic cycle understanding, caffeine reduction, and sleep hygiene. Provide resources for CBT and self-help tools.",
            "When to Escalate":
                "Escalate for suicidality, severe impairment, or suspected withdrawal. Refer urgently if red flags for medical illness appear.",
            "Documentation & Coordination":
                "Document safety assessments, coping plans, and referrals. Coordinate communication with therapists and primary care.",
            "Prognosis":
                "Many improve with CBT and medication when needed. Nursing coaching reduces recurrence and ED use.",
        },
    },
    {
        name: "Lower UTI (Cystitis) – Adult Female",
        department: "Urology/Primary Care",
        sections: {
            "Overview":
                "Uncomplicated cystitis presents with dysuria and frequency without systemic features. Nursing care supports short-course therapy and symptom relief.",
            "Nursing Assessment":
                "Assess urinary symptoms, hematuria, and vaginal symptoms that may suggest alternate diagnoses. Review sexual activity and contraceptive methods affecting risk.",
            "Key Monitoring":
                "Monitor symptom improvement within 48 hours and tolerance of antibiotics. Track recurrence patterns and adverse effects.",
            "Nursing Interventions":
                "Provide analgesics and antibiotics as ordered; encourage hydration and timed voiding. Counsel on post-coital voiding where relevant.",
            "Patient Education":
                "Teach antibiotic adherence, perineal hygiene, and when to return if symptoms persist or worsen. Discuss prevention strategies for recurrent UTIs.",
            "When to Escalate":
                "Escalate for pregnancy, systemic features, or suspected pyelonephritis. Refer for anatomic evaluation in frequent recurrences.",
            "Documentation & Coordination":
                "Document symptom scores, UA results, and therapy start times. Coordinate follow-up if cultures are obtained.",
            "Prognosis":
                "Most cases resolve with short courses. Nursing guidance improves comfort and reduces recurrence.",
        },
    },
    {
        name: "Clostridioides difficile Infection (CDI)",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "CDI causes antibiotic-associated diarrhea with potential complications. Nursing care ensures isolation, hydration, and adherence to tiered therapy.",
            "Nursing Assessment":
                "Assess stool frequency, abdominal pain, recent antibiotics, and hospitalization. Evaluate dehydration and fever.",
            "Key Monitoring":
                "Monitor electrolytes, renal function, and stool counts. Track response to therapy and recurrence risk.",
            "Nursing Interventions":
                "Implement contact precautions and handwashing with soap and water; administer therapy as ordered. Stop inciting antibiotics when possible and avoid antimotility agents in severe disease.",
            "Patient Education":
                "Teach infection control at home, medication adherence, and recurrence warning signs. Discuss probiotic considerations if advised locally.",
            "When to Escalate":
                "Escalate for ileus, severe abdominal distension, or hypotension. Notify surgery for suspected megacolon or perforation.",
            "Documentation & Coordination":
                "Document isolation start time, stool counts, and therapy. Coordinate environmental cleaning with sporicidal agents.",
            "Prognosis":
                "Most improve with appropriate therapy; recurrence is common. Nursing prevention measures reduce transmission.",
        },
    },
    {
        name: "Preeclampsia (Recognition & Initial Care)",
        department: "Obstetrics",
        sections: {
            "Overview":
                "Preeclampsia is new-onset hypertension with end-organ signs after 20 weeks’ gestation. Nursing care prioritizes BP control, seizure prophylaxis, and fetal surveillance.",
            "Nursing Assessment":
                "Assess BP accurately, headaches, visual changes, RUQ pain, and edema. Review reflexes, urine output, and fetal movement concerns.",
            "Key Monitoring":
                "Monitor BP within set targets, reflexes on magnesium therapy, and maternal/fetal status. Track urine output and labs per protocol.",
            "Nursing Interventions":
                "Administer antihypertensives and magnesium sulfate as ordered; maintain seizure precautions. Prepare for delivery planning with obstetrics.",
            "Patient Education":
                "Explain symptoms requiring urgent review and medication side effects. Discuss postpartum blood pressure follow-up.",
            "When to Escalate":
                "Escalate for severe hypertension, neurological symptoms, pulmonary edema, or HELLP features. Notify high-risk obstetrics and ICU early if deterioration occurs.",
            "Documentation & Coordination":
                "Document BP trends, magnesium checks, and fetal monitoring summaries. Coordinate neonatal and anesthesia teams when delivery is planned.",
            "Prognosis":
                "Timely management reduces morbidity for mother and fetus. Nursing vigilance prevents eclampsia and complications.",
        },
    },
    {
        name: "Asthma Exacerbation (Severe)",
        department: "Pulmonology Unit",
        sections: {
            "Overview":
                "Severe asthma attacks require rapid bronchodilation and steroid therapy. Nursing care focuses on airway support and frequent reassessment.",
            "Nursing Assessment":
                "Assess ability to speak, accessory muscle use, cyanosis, and mental status. Review recent triggers and controller adherence.",
            "Key Monitoring":
                "Monitor SpO₂, RR, and peak flow when feasible; reassess after each treatment cycle. Watch for rising CO₂ or exhaustion.",
            "Nursing Interventions":
                "Administer repeated bronchodilators with anticholinergic agents and systemic corticosteroids as ordered. Provide oxygen to target and prepare magnesium therapy per protocol.",
            "Patient Education":
                "Reinforce action plan steps and controller step-up after discharge. Teach spacer technique and trigger management.",
            "When to Escalate":
                "Escalate for persistent hypoxemia, silent chest, or fatigue with declining mental status. Notify ICU for impending respiratory failure.",
            "Documentation & Coordination":
                "Record serial assessments, treatments, and responses. Arrange follow-up and equipment supply checks.",
            "Prognosis":
                "With prompt therapy, most recover quickly. Nursing monitoring prevents late deterioration.",
        },
    },
    {
        name: "COPD Exacerbation",
        department: "Pulmonology Unit",
        sections: {
            "Overview":
                "COPD exacerbations present with increased dyspnea and sputum changes. Nursing care supports bronchodilation, steroid use, antibiotics when indicated, and safe oxygen targets.",
            "Nursing Assessment":
                "Assess change from baseline, sputum character, and infection symptoms. Review inhaler access and use technique.",
            "Key Monitoring":
                "Monitor SpO₂, work of breathing, and gas exchange if available. Track steroid and antibiotic effects and adverse events.",
            "Nursing Interventions":
                "Administer short-acting bronchodilators frequently, systemic steroids, and antibiotics when ordered. Provide controlled oxygen and coach on breathing techniques.",
            "Patient Education":
                "Teach inhaler technique, action plans, and vaccination importance. Discuss early contact strategies for future flares.",
            "When to Escalate":
                "Escalate for acute hypercapnic failure, shock, or severe hypoxemia. Consider NIV early where appropriate.",
            "Documentation & Coordination":
                "Document oxygen settings, therapy timing, and responses. Coordinate pulmonary rehab and discharge planning.",
            "Prognosis":
                "Timely therapy improves outcomes; recurrent flares worsen trajectory. Nursing self-management support reduces readmissions.",
        },
    },
    {
        name: "Alcohol Withdrawal (Moderate–Severe)",
        department: "Addiction Medicine",
        sections: {
            "Overview":
                "Alcohol withdrawal can progress to seizures or delirium tremens. Nursing care applies symptom-triggered protocols, thiamine, and safety measures.",
            "Nursing Assessment":
                "Assess last drink time, prior severe withdrawal, and comorbid liver or electrolyte disorders. Evaluate CIWA-Ar or local scale scores regularly.",
            "Key Monitoring":
                "Monitor vitals, mental status, and hydration; watch for seizures and arrhythmias. Track benzodiazepine requirements.",
            "Nursing Interventions":
                "Administer benzodiazepines per protocol, give thiamine before glucose, and correct electrolytes. Provide low-stimulus environment and fall precautions.",
            "Patient Education":
                "Discuss relapse prevention options and community resources. Encourage nutrition and sleep restoration.",
            "When to Escalate":
                "Escalate for delirium tremens, persistent agitation, or refractory vital sign instability. Consider ICU and adjunctive agents.",
            "Documentation & Coordination":
                "Document scores, doses, responses, and safety checks. Coordinate addiction consults and discharge supports.",
            "Prognosis":
                "With protocolized care most recover safely. Nursing prevention of complications reduces length of stay.",
        },
    },
    {
        name: "Pulmonary Edema (Cardiogenic, Acute)",
        department: "Cardiology Unit",
        sections: {
            "Overview":
                "Cardiogenic pulmonary edema causes acute hypoxemia from fluid overload. Nursing care rapidly improves oxygenation and reduces preload/afterload per orders.",
            "Nursing Assessment":
                "Assess severe dyspnea, orthopnea, frothy sputum, and crackles; check BP and perfusion. Review heart failure history and precipitants.",
            "Key Monitoring":
                "Monitor SpO₂, BP, urine output, and response to diuretics/vasodilators. Track arrhythmias on telemetry.",
            "Nursing Interventions":
                "Provide oxygen or NIV per protocol, administer loop diuretics, and assist with vasodilators if hypertensive. Position upright and minimize exertion.",
            "Patient Education":
                "Explain medication effects and when to seek care for weight gain or swelling. Reinforce sodium restriction and daily weights after stabilization.",
            "When to Escalate":
                "Escalate for refractory hypoxemia, hypotension, or shock. Notify critical care for advanced support.",
            "Documentation & Coordination":
                "Document diuresis, oxygen settings, and BP responses. Coordinate heart failure follow-up and education.",
            "Prognosis":
                "Rapid response improves outcomes. Nursing titration and observation are key to stabilization.",
        },
    },
    {
        name: "Syncope (Adult)",
        department: "Emergency Medicine",
        sections: {
            "Overview":
                "Syncope is transient loss of consciousness with spontaneous recovery. Nursing care focuses on risk stratification and injury prevention.",
            "Nursing Assessment":
                "Assess prodrome, posture, exertion, cardiac history, and medications. Obtain ECG and orthostatic vitals if ordered.",
            "Key Monitoring":
                "Monitor telemetry in higher-risk cases and observe for recurrent episodes. Track hydration and symptom triggers.",
            "Nursing Interventions":
                "Ensure safe positioning, rehydrate as needed, and educate on counterpressure maneuvers. Assist with ambulatory monitoring setup when planned.",
            "Patient Education":
                "Teach warning signs, hydration, and gradual position changes. Provide return precautions for exertional or injury-associated events.",
            "When to Escalate":
                "Escalate for abnormal ECG, structural heart disease, or syncope during exertion. Admit for observation when high-risk features present.",
            "Documentation & Coordination":
                "Document event details, vitals, ECG timing, and education. Coordinate cardiology follow-up if indicated.",
            "Prognosis":
                "Reflex syncope is usually benign; cardiac syncope carries higher risk. Nursing screening helps target workup.",
        },
    },
    {
        name: "Acute Otitis Media (Adult)",
        department: "ENT",
        sections: {
            "Overview":
                "Adult AOM is acute middle ear inflammation with effusion. Nursing care emphasizes analgesia, watchful waiting versus antibiotics, and complication surveillance.",
            "Nursing Assessment":
                "Assess ear pain, fever, hearing changes, and recent URI. Review barotrauma or flight history and examine for TM bulging if documented.",
            "Key Monitoring":
                "Monitor pain scores, fever, and symptom progression over 48–72 hours. Watch for mastoid tenderness or spreading infection.",
            "Nursing Interventions":
                "Provide adequate analgesia and supportive care; administer antibiotics when indicated by severity or risk. Offer decongestant timing guidance as appropriate.",
            "Patient Education":
                "Discuss expectations for recovery, safe use of decongestants, and when to return. Reinforce adherence to antibiotics if prescribed.",
            "When to Escalate":
                "Escalate for severe systemic illness, complications, or immunocompromise. Refer to ENT for recurrent or refractory cases.",
            "Documentation & Coordination":
                "Document symptom onset, meds given, and response. Coordinate follow-up with primary care or ENT.",
            "Prognosis":
                "Most recover without sequelae. Nursing analgesia and monitoring improve comfort and safety.",
        },
    },
    {
        name: "Erysipelas",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Erysipelas is a sharply demarcated streptococcal skin infection. Nursing care prioritizes antibiotics, edema control, and prevention education.",
            "Nursing Assessment":
                "Assess bright red, raised borders with warmth and tenderness; note fever. Evaluate portals of entry such as interdigital fungal infection.",
            "Key Monitoring":
                "Monitor temperature, lesion border progression, and pain. Reassess within 48–72 hours for response.",
            "Nursing Interventions":
                "Administer antibiotics as ordered and elevate the limb. Treat skin breaks and provide analgesia.",
            "Patient Education":
                "Teach skin care, edema management, and footwear hygiene. Explain when to return for worsening redness or systemic symptoms.",
            "When to Escalate":
                "Escalate for periorbital involvement, rapid spread, or systemic toxicity. Consider admission for severe comorbidities.",
            "Documentation & Coordination":
                "Document lesion measurements, therapy timing, and education. Coordinate community nursing if wound care is needed.",
            "Prognosis":
                "Most cases respond rapidly to therapy. Nursing attention to portals of entry prevents recurrence.",
        },
    },
    {
        name: "Tension-Type Headache (Frequent Episodic)",
        department: "Neurology",
        sections: {
            "Overview":
                "Frequent episodic tension-type headache presents with bilateral pressing pain without nausea. Nursing care focuses on non-opioid analgesia and lifestyle coaching.",
            "Nursing Assessment":
                "Assess frequency, triggers, posture, and eye strain. Screen for medication overuse.",
            "Key Monitoring":
                "Monitor pain scores and medication days per month. Track response to ergonomic and stress interventions.",
            "Nursing Interventions":
                "Provide guidance on ergonomics, breaks, and relaxation techniques. Administer simple analgesics within safe limits and encourage hydration and sleep hygiene.",
            "Patient Education":
                "Teach limits on combination analgesics and avoidance of opioids. Provide stretching routines and mindfulness resources.",
            "When to Escalate":
                "Escalate for refractory symptoms, neurological deficits, or red-flag features. Consider multidisciplinary pain referral.",
            "Documentation & Coordination":
                "Document headache diary use, treatments, and outcomes. Coordinate primary care follow-up for prevention options.",
            "Prognosis":
                "Most improve with lifestyle changes and judicious analgesia. Nursing coaching reduces recurrence.",
        },
    },
    {
        name: "Sciatica (Lumbar Radiculopathy)",
        department: "Orthopedics/Spine",
        sections: {
            "Overview":
                "Lumbar radiculopathy causes unilateral leg pain along a nerve root distribution. Nursing care supports analgesia, mobilization, and red-flag surveillance.",
            "Nursing Assessment":
                "Assess dermatomal pain, paresthesias, and weakness; review precipitating strain. Screen for bowel/bladder symptoms and saddle anesthesia.",
            "Key Monitoring":
                "Monitor pain and function, noting neurologic changes. Track response to physical therapy and medications.",
            "Nursing Interventions":
                "Encourage activity as tolerated, posture correction, and core engagement; administer analgesics as ordered. Facilitate PT and educate on safe lifting.",
            "Patient Education":
                "Teach pacing, proper mechanics, and return-to-work planning. Discuss realistic recovery timelines and warning signs.",
            "When to Escalate":
                "Escalate for progressive weakness, intractable pain, or cauda equina signs. Notify spine services for urgent evaluation.",
            "Documentation & Coordination":
                "Document neuro checks, analgesia response, and PT participation. Coordinate imaging or specialist appointments if needed.",
            "Prognosis":
                "Most cases improve conservatively. Nursing reassurance and guidance aid recovery.",
        },
    },
];

// Ensure exactly 30 guidelines (trim if somehow more)
const entries = guidelines.slice(0, 30);

// Build output text for one disease in chunk format
function buildOutput(d) {
    const lines = [];

    // 1) Document Information (no Title/Version; random realistic Date)
    lines.push("Document Information:");
    lines.push(`Disease - ${d.name}`);
    lines.push(`Date - ${randomDateISO()}`);
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

console.log(`Generated ${entries.length} nursing guidelines in ${OUT_DIR}`);
