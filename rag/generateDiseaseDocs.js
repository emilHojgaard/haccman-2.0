// generateDiseaseDocs.js
// Generates 30 detailed, patient-facing disease info documents (one .txt per disease),
// formatted for colon-based chunking with a single "Document Information" block.
//
// EXACT SECTIONS (in order):
// 1) Document Information
// 2) Overview
// 3) Causes and Risk Factors
// 4) Common Symptoms
// 5) Diagnosis
// 6) Treatment
// 7) Self-Management and Lifestyle
// 8) When to Seek Medical Help
// 9) Prognosis
//
// Rules:
// - Do NOT include TITLE or Version lines inside the content.
// - Date is random, realistic (between 2023-01-01 and today) and appears ONLY in "Document Information".
// - File name (disease name) functions as the title outside the document.
// - Each section is patient-facing and ≥ 1–2 sentences.
// - Headers end with ":" and content starts on the very next line.


import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, "general_guidelines");
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper
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
    "Overview",
    "Causes and Risk Factors",
    "Common Symptoms",
    "Diagnosis",
    "Treatment",
    "Self-Management and Lifestyle",
    "When to Seek Medical Help",
    "Prognosis",
];

// =================== RICH, DISEASE-SPECIFIC DOCUMENTS (30) ===================
const diseaseDocs = [
    {
        name: "Asthma",
        department: "Pulmonology",
        sections: {
            "Overview":
                "Asthma is a long-term condition where the airways become inflamed and sensitive, making them narrow at times. Symptoms tend to come and go and can be triggered by infections, allergens, or exercise.",
            "Causes and Risk Factors":
                "Family history of asthma or allergies, exposure to dust mites, pollen, pets, smoke, and air pollution increase risk. Viral infections and cold air can also trigger attacks.",
            "Common Symptoms":
                "Wheezing, shortness of breath, chest tightness, and coughing, especially at night or early morning. Symptoms may worsen with exercise or colds.",
            "Diagnosis":
                "Doctors ask about symptoms and triggers and perform breathing tests like spirometry to look for variable airflow. Allergy testing may be used to identify triggers.",
            "Treatment":
                "Reliever inhalers quickly open the airways for symptoms, while preventer inhalers reduce inflammation over time. Some people need combination inhalers or add-on medicines if symptoms persist.",
            "Self-Management and Lifestyle":
                "Use a written action plan, practice correct inhaler technique, and avoid triggers such as smoke. Warm up before exercise and keep vaccinations up to date.",
            "When to Seek Medical Help":
                "Seek help if you need your reliever more than a few times a week, or if breathing is difficult and you cannot speak full sentences. Call emergency services for blue lips, severe breathlessness, or no response to reliever.",
            "Prognosis":
                "With regular preventer use and trigger control, most people live fully active lives with few attacks.",
        },
    },
    {
        name: "Chronic Obstructive Pulmonary Disease (COPD)",
        department: "Pulmonology",
        sections: {
            "Overview":
                "COPD is a lung condition that makes it harder to breathe over time due to narrowed airways and damage to air sacs. It commonly affects people with a history of smoking or long-term exposure to fumes.",
            "Causes and Risk Factors":
                "Cigarette smoking is the main cause. Other risks include biomass fuel exposure, dusts and chemicals at work, and rare genetic conditions.",
            "Common Symptoms":
                "Breathlessness on exertion, chronic cough, and mucus production. Flare-ups may cause sudden worsening of breathing.",
            "Diagnosis":
                "Spirometry confirms persistent airflow limitation. Doctors also assess symptom burden and flare-up history.",
            "Treatment":
                "Daily inhalers help open the airways and reduce flare-ups; some people benefit from pulmonary rehab and oxygen therapy. Vaccinations and stopping smoking are key parts of care.",
            "Self-Management and Lifestyle":
                "Stop smoking, stay active, and practice breathing techniques. Keep rescue medicines available and have a plan for flare-ups.",
            "When to Seek Medical Help":
                "Get urgent help for worsening breathlessness, chest pain, lips turning blue, or confusion. Call promptly if your usual medicines are not helping.",
            "Prognosis":
                "Symptoms can be managed and quality of life improved with treatment and rehab, though the condition is long-term.",
        },
    },
    {
        name: "Community-Acquired Pneumonia",
        department: "Respiratory Medicine",
        sections: {
            "Overview":
                "Pneumonia is an infection of the lungs that causes inflammation and fluid in the air spaces. It often starts suddenly with fever and cough.",
            "Causes and Risk Factors":
                "Common germs include bacteria and viruses. Older age, smoking, chronic illnesses, and weak immunity raise risk.",
            "Common Symptoms":
                "Cough with phlegm, fever or chills, chest pain with deep breaths, and breathlessness. Tiredness and poor appetite are common.",
            "Diagnosis":
                "Doctors listen to the chest, check oxygen levels, and may order a chest X-ray and blood tests. A sputum sample may help choose antibiotics.",
            "Treatment":
                "Antibiotics are used for bacterial pneumonia; rest, fluids, and fever control support recovery. Oxygen may be needed if levels are low.",
            "Self-Management and Lifestyle":
                "Drink fluids, take medicines as prescribed, and gradually return to activity. Avoid smoking and consider recommended vaccines.",
            "When to Seek Medical Help":
                "Seek help for worsening breathlessness, high fever, confusion, or chest pain. Go to emergency care if your lips turn blue or you struggle to breathe.",
            "Prognosis":
                "Most people recover in a few weeks, though fatigue can last longer. Older adults or those with other illnesses may take more time.",
        },
    },
    {
        name: "Heart Failure with Preserved Ejection Fraction (HFpEF)",
        department: "Cardiology",
        sections: {
            "Overview":
                "HFpEF is a type of heart failure where the heart squeezes normally but is stiff and does not fill well. This leads to fluid buildup and breathlessness, especially with activity.",
            "Causes and Risk Factors":
                "High blood pressure, older age, obesity, diabetes, and atrial fibrillation are common contributors. Sleep apnea and kidney disease also play a role.",
            "Common Symptoms":
                "Shortness of breath with exertion, swollen ankles, and fatigue. Needing extra pillows at night is common.",
            "Diagnosis":
                "An echocardiogram shows normal squeeze but signs of stiffness. Blood tests and a physical exam help assess fluid and rule out other causes.",
            "Treatment":
                "Diuretics relieve fluid; other medicines target blood pressure, diabetes, and weight. Some patients benefit from SGLT2 inhibitors and treatment of sleep apnea.",
            "Self-Management and Lifestyle":
                "Limit salt, monitor daily weight, and stay active within your limits. Track swelling and call if weight rises quickly.",
            "When to Seek Medical Help":
                "Seek help for sudden weight gain, worsening breathlessness, chest pain, or fainting. Call urgently if you cannot lie flat due to breathlessness.",
            "Prognosis":
                "Symptoms can be controlled and quality of life improved with careful management of risk factors.",
        },
    },
    {
        name: "Heart Failure with Reduced Ejection Fraction (HFrEF)",
        department: "Cardiology",
        sections: {
            "Overview":
                "HFrEF occurs when the heart’s pumping ability is weakened, reducing blood flow to the body. Fluid can build up in the lungs and legs.",
            "Causes and Risk Factors":
                "Prior heart attack, high blood pressure, heart valve disease, viral infections, and alcohol or drug toxicity are common causes.",
            "Common Symptoms":
                "Breathlessness, fatigue, ankle swelling, and waking at night short of breath. Reduced exercise capacity is typical.",
            "Diagnosis":
                "Echocardiogram measures reduced ejection fraction. Blood tests and ECG help identify causes and guide treatment.",
            "Treatment":
                "Standard medicines (ACEi/ARB/ARNI, beta-blockers, MRA, SGLT2 inhibitors) improve symptoms and survival. Devices or procedures may be recommended for some people.",
            "Self-Management and Lifestyle":
                "Daily weights, low-salt diet, medication adherence, and regular activity help control symptoms. Avoid smoking and limit alcohol.",
            "When to Seek Medical Help":
                "Seek help for sudden weight gain, worsening swelling or breathlessness, fainting, or chest pain. Go to emergency care if symptoms escalate quickly.",
            "Prognosis":
                "Outcomes have improved with modern therapy, especially when medicines are taken consistently and lifestyle changes are followed.",
        },
    },
    {
        name: "Acute Coronary Syndrome (NSTEMI/Unstable Angina)",
        department: "Cardiology",
        sections: {
            "Overview":
                "This condition happens when a heart artery is partly blocked, reducing blood flow to the heart muscle. It can cause chest pain and increase the risk of a heart attack.",
            "Causes and Risk Factors":
                "Buildup of cholesterol plaque in the arteries is the main cause. Smoking, high blood pressure, diabetes, and family history raise risk.",
            "Common Symptoms":
                "Chest pressure or tightness that may spread to the arm, neck, jaw, or back. Shortness of breath, sweating, or nausea can occur.",
            "Diagnosis":
                "ECGs and blood tests for heart damage (troponins) help confirm the problem. Doctors also assess overall risk to guide treatment.",
            "Treatment":
                "Medicines that thin the blood and reduce strain on the heart are started quickly. Many people need a heart catheter test and possibly a stent.",
            "Self-Management and Lifestyle":
                "Stop smoking, take medicines as prescribed, and attend cardiac rehab. Focus on diet, exercise, and stress management.",
            "When to Seek Medical Help":
                "Call emergency services for chest pain lasting more than a few minutes, especially with sweating or breathlessness. Do not drive yourself.",
            "Prognosis":
                "Prompt treatment lowers the risk of heart damage and future events. Long-term success depends on risk-factor control.",
        },
    },
    {
        name: "Ischemic Stroke (Acute)",
        department: "Neurology/Stroke",
        sections: {
            "Overview":
                "An ischemic stroke occurs when a blood vessel supplying the brain is blocked, causing brain cells to lose oxygen. Fast treatment can limit damage.",
            "Causes and Risk Factors":
                "High blood pressure, atrial fibrillation, diabetes, smoking, and carotid artery disease raise risk. Prior stroke or TIA increases chances.",
            "Common Symptoms":
                "Sudden weakness or numbness on one side, facial droop, trouble speaking or understanding, vision problems, or loss of balance.",
            "Diagnosis":
                "A brain scan (CT or MRI) distinguishes stroke types and guides therapy. Blood tests and heart rhythm checks look for causes.",
            "Treatment":
                "Some people are eligible for clot-busting medicine or a procedure to remove the clot. Blood pressure, sugar, and temperature are carefully managed.",
            "Self-Management and Lifestyle":
                "After stabilization, rehab helps regain strength and speech. Controlling blood pressure, cholesterol, and rhythm problems lowers future risk.",
            "When to Seek Medical Help":
                "Call emergency services immediately if symptoms start — time lost is brain lost. Do not wait to see if symptoms improve.",
            "Prognosis":
                "Recovery varies by stroke size and location; early treatment and rehab improve outcomes.",
        },
    },
    {
        name: "Diabetic Ketoacidosis (DKA)",
        department: "Endocrinology",
        sections: {
            "Overview":
                "DKA is a serious complication of diabetes where the body runs out of insulin, leading to high sugar, dehydration, and acid buildup. It requires urgent treatment.",
            "Causes and Risk Factors":
                "Infections, missed insulin doses, faulty pumps, or new-onset diabetes are common triggers. Dehydration and certain medications can contribute.",
            "Common Symptoms":
                "Thirst, frequent urination, nausea, abdominal pain, deep breathing, and drowsiness. Breath may smell fruity.",
            "Diagnosis":
                "Blood tests show high sugar, acid in the blood (ketones), and electrolyte changes. Doctors look for the trigger as well.",
            "Treatment":
                "Fluids, insulin, and careful electrolyte replacement are given in hospital. The underlying trigger is treated at the same time.",
            "Self-Management and Lifestyle":
                "Follow sick-day rules, check ketones when unwell, and never stop insulin without advice. Keep supplies and backup plans ready.",
            "When to Seek Medical Help":
                "Seek urgent care for high sugars with vomiting, positive ketones, or signs of dehydration. Do not delay.",
            "Prognosis":
                "Most people recover fully with prompt treatment. Preventing future episodes depends on education and access to supplies.",
        },
    },
    {
        name: "Sepsis (Adult)",
        department: "Acute Medicine/ICU",
        sections: {
            "Overview":
                "Sepsis is a life-threatening reaction to infection that can damage organs. Early recognition and treatment save lives.",
            "Causes and Risk Factors":
                "Any infection can lead to sepsis, including pneumonia, urinary, and abdominal infections. Older age, weak immunity, and chronic illness increase risk.",
            "Common Symptoms":
                "Fever or low temperature, fast heart rate, fast breathing, confusion, extreme weakness, or low urine output.",
            "Diagnosis":
                "Doctors use blood tests, cultures, and scans to find the infection and measure organ function. They monitor blood pressure and oxygen closely.",
            "Treatment":
                "Antibiotics and fluids are started urgently; oxygen and medications to support blood pressure may be needed. Source control (like draining an abscess) is important.",
            "Self-Management and Lifestyle":
                "Complete all antibiotics as prescribed and attend follow-ups. Ask about vaccines and ways to reduce future infection risk.",
            "When to Seek Medical Help":
                "Seek urgent help for confusion, very fast breathing, severe chills, or dizziness, especially if you recently had an infection.",
            "Prognosis":
                "Sepsis is serious but outcomes improve with early treatment. Recovery may take weeks, and fatigue is common afterward.",
        },
    },
    {
        name: "Primary Hypertension (High Blood Pressure)",
        department: "Internal Medicine",
        sections: {
            "Overview":
                "High blood pressure is when the force of blood against artery walls stays too high over time. It often causes no symptoms but damages organs silently.",
            "Causes and Risk Factors":
                "Age, family history, obesity, high salt intake, alcohol, inactivity, and sleep apnea raise risk. Some medicines can increase pressure.",
            "Common Symptoms":
                "Usually none. Severe or sudden spikes may cause headache, nosebleeds, or dizziness.",
            "Diagnosis":
                "Multiple readings on different days or ambulatory monitoring confirm the diagnosis. Doctors also assess overall heart and kidney risk.",
            "Treatment":
                "Lifestyle changes plus medicines when needed help reach targets. Many people require more than one medicine.",
            "Self-Management and Lifestyle":
                "Check pressure at home, reduce salt, stay active, manage weight, and limit alcohol. Take medicines at the same time daily.",
            "When to Seek Medical Help":
                "Seek care for severe headache, chest pain, breathlessness, or vision changes. Contact your doctor if readings remain high despite treatment.",
            "Prognosis":
                "Good control prevents strokes, heart attacks, and kidney disease. Most people reach goals with a consistent plan.",
        },
    },
    {
        name: "Atrial Fibrillation (AF)",
        department: "Cardiology",
        sections: {
            "Overview":
                "AF is an irregular heart rhythm that can cause a fast pulse and raise the risk of stroke. Some people feel palpitations; others have no symptoms.",
            "Causes and Risk Factors":
                "High blood pressure, heart disease, sleep apnea, thyroid problems, alcohol, and age increase risk.",
            "Common Symptoms":
                "Palpitations, shortness of breath, chest discomfort, tiredness, or lightheadedness. Some people notice only reduced stamina.",
            "Diagnosis":
                "An ECG confirms AF; monitors may be used to capture intermittent episodes. Blood tests and an echo look for causes.",
            "Treatment":
                "Treatment focuses on controlling heart rate or restoring rhythm and preventing stroke with blood thinners when appropriate.",
            "Self-Management and Lifestyle":
                "Limit alcohol, treat sleep apnea, and exercise regularly. Take medicines as prescribed and track pulse if advised.",
            "When to Seek Medical Help":
                "Seek urgent care for severe chest pain, fainting, or sudden worsening breathlessness. Report unexplained bleeding when on blood thinners.",
            "Prognosis":
                "Many live well with AF when stroke risk is addressed and symptoms are controlled.",
        },
    },
    {
        name: "Pulmonary Embolism (PE)",
        department: "Respiratory/ED",
        sections: {
            "Overview":
                "A PE is a blood clot in the lungs that blocks blood flow and lowers oxygen. It can be life-threatening and needs prompt treatment.",
            "Causes and Risk Factors":
                "Clots often come from leg veins after immobility, surgery, pregnancy, cancer, or hormone therapy. Prior clots increase risk.",
            "Common Symptoms":
                "Sudden shortness of breath, sharp chest pain that worsens with deep breaths, cough, or coughing up blood. Some people faint.",
            "Diagnosis":
                "Doctors use risk scores, blood tests, and imaging such as a CT scan to confirm the diagnosis. Heart strain is checked with tests.",
            "Treatment":
                "Blood thinners prevent the clot from growing and new clots from forming. Severe cases may need clot-busting drugs or procedures.",
            "Self-Management and Lifestyle":
                "Take anticoagulants exactly as prescribed and avoid activities that increase bleeding risk. Stay active and follow travel precautions.",
            "When to Seek Medical Help":
                "Call emergency services for sudden breathlessness, chest pain, or fainting. Seek help for any heavy bleeding while on blood thinners.",
            "Prognosis":
                "Most people improve over weeks to months. Long-term treatment depends on whether the clot was provoked and personal risk.",
        },
    },
    {
        name: "Deep Vein Thrombosis (DVT)",
        department: "Vascular Medicine",
        sections: {
            "Overview":
                "A DVT is a blood clot in a deep vein, usually in the leg. It can cause swelling and pain and may lead to a lung clot if untreated.",
            "Causes and Risk Factors":
                "Recent surgery, immobility, pregnancy, cancer, hormones, and prior clots raise risk. Long flights can contribute.",
            "Common Symptoms":
                "Leg swelling, pain, warmth, and redness, usually on one side. Some clots cause few symptoms.",
            "Diagnosis":
                "Doctors assess risk and use an ultrasound scan to look for a clot. Blood tests may help in low-risk cases.",
            "Treatment":
                "Blood thinners are the main treatment. Compression and walking help symptoms once therapy is started.",
            "Self-Management and Lifestyle":
                "Wear compression if advised, keep moving, and follow medication instructions carefully. Know bleeding precautions.",
            "When to Seek Medical Help":
                "Seek urgent help for chest pain, sudden breathlessness, or coughing blood. Report severe leg pain or swelling that worsens.",
            "Prognosis":
                "Most clots resolve with treatment, though some people develop long-term leg swelling. Preventing future clots is key.",
        },
    },
    {
        name: "Spontaneous Pneumothorax",
        department: "Respiratory/ED",
        sections: {
            "Overview":
                "A pneumothorax is air trapped between the lung and chest wall, causing part of the lung to collapse. It can occur without an injury in otherwise healthy people or those with lung disease.",
            "Causes and Risk Factors":
                "Tall, slim young adults and smokers are at higher risk for primary cases. Underlying lung diseases such as COPD raise risk for secondary cases.",
            "Common Symptoms":
                "Sudden sharp chest pain and shortness of breath on one side. Some feel only mild discomfort.",
            "Diagnosis":
                "A chest X-ray or ultrasound confirms the diagnosis. A CT scan may be used when the picture is unclear.",
            "Treatment":
                "Small, stable pneumothoraces may resolve with observation and oxygen. Larger or more symptomatic cases may need aspiration or a small chest drain.",
            "Self-Management and Lifestyle":
                "Avoid air travel and diving until cleared. Stop smoking to reduce recurrence risk.",
            "When to Seek Medical Help":
                "Seek emergency help for worsening breathlessness, severe chest pain, or fainting. Report increasing symptoms after initial treatment.",
            "Prognosis":
                "Many cases resolve fully, but recurrences can occur. Surgery may be suggested after repeated episodes.",
        },
    },
    {
        name: "Appendicitis",
        department: "General Surgery",
        sections: {
            "Overview":
                "Appendicitis is inflammation of the appendix that often requires surgery. It typically starts with belly pain that moves to the lower right side.",
            "Causes and Risk Factors":
                "Blockage of the appendix by stool or swelling can trigger inflammation. It can occur at any age.",
            "Common Symptoms":
                "Pain that shifts to the right lower abdomen, loss of appetite, nausea, and fever. Coughing or movement can worsen pain.",
            "Diagnosis":
                "Doctors examine the abdomen and may use blood tests and imaging such as ultrasound or CT scans.",
            "Treatment":
                "Most people have surgery to remove the appendix; antibiotics are given before and sometimes after. Selected mild cases may be treated with antibiotics alone.",
            "Self-Management and Lifestyle":
                "Follow post-op instructions on activity and wound care. Gradually return to normal diet as advised.",
            "When to Seek Medical Help":
                "Seek urgent care for sudden worsening pain, high fever, vomiting, or swelling after surgery.",
            "Prognosis":
                "Recovery is usually quick after surgery. Complications are uncommon when treated early.",
        },
    },
    {
        name: "Acute Pancreatitis",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "Acute pancreatitis is sudden inflammation of the pancreas that causes severe upper tummy pain. Most cases improve with hospital care and rest.",
            "Causes and Risk Factors":
                "Gallstones and alcohol are the most common causes. High triglycerides and some medicines can also trigger it.",
            "Common Symptoms":
                "Severe upper abdominal pain that may spread to the back, nausea, and vomiting. Pain often worsens after eating.",
            "Diagnosis":
                "Blood tests for pancreatic enzymes and imaging help confirm the diagnosis and look for causes. Doctors also assess severity.",
            "Treatment":
                "Fluids, pain control, and careful feeding support recovery. Gallstone-related cases may need procedures to clear the duct.",
            "Self-Management and Lifestyle":
                "Avoid alcohol and follow dietary advice during recovery. Manage cholesterol and gallbladder issues to prevent recurrence.",
            "When to Seek Medical Help":
                "Seek urgent help for severe pain, fever, or vomiting that does not settle. Report yellowing of the eyes or skin.",
            "Prognosis":
                "Most cases are mild and resolve in days; severe cases may have complications and take longer.",
        },
    },
    {
        name: "Acute Cholecystitis",
        department: "General Surgery",
        sections: {
            "Overview":
                "Acute cholecystitis is inflammation of the gallbladder, usually due to a gallstone blocking the duct. It causes right-sided upper abdominal pain and fever.",
            "Causes and Risk Factors":
                "Gallstones are the main cause. Older age, obesity, and female sex raise the chance of stones.",
            "Common Symptoms":
                "Persistent right upper abdominal pain, fever, and nausea. Pain may worsen after fatty meals.",
            "Diagnosis":
                "An ultrasound scan typically confirms the diagnosis. Blood tests look for inflammation and bile duct blockage.",
            "Treatment":
                "Pain relief, antibiotics, and early surgery to remove the gallbladder are common. High-risk patients may need a drain temporarily.",
            "Self-Management and Lifestyle":
                "After recovery, choose a balanced diet and limit very fatty foods initially. Stay active to support digestion.",
            "When to Seek Medical Help":
                "Seek urgent help for increasing pain, jaundice, or fever. After surgery, report redness, swelling, or persistent vomiting.",
            "Prognosis":
                "Most people recover fully after gallbladder removal. Recurrence is unlikely once the gallbladder is gone.",
        },
    },
    {
        name: "Pyelonephritis (Kidney Infection)",
        department: "Urology/Medicine",
        sections: {
            "Overview":
                "Pyelonephritis is a kidney infection that usually starts as a bladder infection and travels upward. It can make you feel very unwell and needs antibiotics.",
            "Causes and Risk Factors":
                "Female anatomy, pregnancy, kidney stones, and urinary tract blockages raise risk. Catheters and diabetes also contribute.",
            "Common Symptoms":
                "Fever, chills, back or side pain, nausea, and urinary symptoms such as burning or urgency.",
            "Diagnosis":
                "Urine tests confirm infection; doctors may order blood tests or scans when complications are suspected.",
            "Treatment":
                "Antibiotics are started promptly, sometimes in hospital if vomiting or severe illness is present. Pain relief and fluids help recovery.",
            "Self-Management and Lifestyle":
                "Finish the full antibiotic course and drink plenty of fluids. Prevent future infections with good hydration and bladder habits.",
            "When to Seek Medical Help":
                "Seek help if fever persists beyond a couple of days of treatment or pain worsens. Pregnant people should seek care early.",
            "Prognosis":
                "Most recover fully with treatment. Recurrent infections should be evaluated for underlying causes.",
        },
    },
    {
        name: "Cellulitis",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Cellulitis is a bacterial skin infection that causes redness, warmth, and swelling. It usually affects one area of a limb.",
            "Causes and Risk Factors":
                "Breaks in the skin, athlete’s foot, edema, and obesity raise risk. Diabetes and poor circulation contribute.",
            "Common Symptoms":
                "Spreading redness, tenderness, warmth, and sometimes fever. The border may be hard to define.",
            "Diagnosis":
                "Doctors diagnose cellulitis based on the skin’s appearance and symptoms. Tests are rarely needed unless severe.",
            "Treatment":
                "Antibiotics treat the infection; elevation and pain relief speed recovery. Treating skin breaks or fungal infections prevents recurrence.",
            "Self-Management and Lifestyle":
                "Keep the area clean and raised when possible. Wear supportive footwear and moisturize dry skin to reduce cracking.",
            "When to Seek Medical Help":
                "Seek help if redness spreads quickly, you develop a fever, or pain worsens. Go urgently if the infection is near the eye or genital area.",
            "Prognosis":
                "Most cases improve within a few days of antibiotics. Recurrent cellulitis may need preventive steps.",
        },
    },
    {
        name: "Anaphylaxis",
        department: "Emergency Medicine",
        sections: {
            "Overview":
                "Anaphylaxis is a severe, rapid allergic reaction that can affect breathing and blood pressure. It is a medical emergency.",
            "Causes and Risk Factors":
                "Foods, insect stings, and medicines are common triggers. People with prior reactions are at higher risk.",
            "Common Symptoms":
                "Hives, swelling of lips or tongue, wheezing, shortness of breath, vomiting, and dizziness or fainting.",
            "Diagnosis":
                "Diagnosis is based on symptoms and timing after exposure to a likely trigger. No test can confirm it during the emergency.",
            "Treatment":
                "Epinephrine (adrenaline) is given immediately and may be repeated. Oxygen, fluids, and other medicines support recovery.",
            "Self-Management and Lifestyle":
                "Carry an epinephrine auto-injector if prescribed and learn how to use it. Work with an allergy clinic to identify triggers and create an action plan.",
            "When to Seek Medical Help":
                "Use epinephrine and call emergency services at once if you have trouble breathing, swelling of the tongue, or feel faint after exposure.",
            "Prognosis":
                "Most people recover quickly with prompt treatment. Avoiding triggers and carrying rescue medicine are key to safety.",
        },
    },
    {
        name: "Viral Gastroenteritis (Stomach Flu)",
        department: "Internal Medicine",
        sections: {
            "Overview":
                "Viral gastroenteritis causes sudden nausea, vomiting, and watery diarrhea. It is usually short-lived but very contagious.",
            "Causes and Risk Factors":
                "Norovirus and rotavirus are common causes. Outbreaks can occur in households, schools, and care homes.",
            "Common Symptoms":
                "Nausea, vomiting, diarrhea, stomach cramps, and occasionally fever or aches.",
            "Diagnosis":
                "Most cases are diagnosed by symptoms and do not need tests. Dehydration risk is assessed by exam.",
            "Treatment":
                "Fluids and rest are the main treatments. Some people may benefit from anti-nausea medicines.",
            "Self-Management and Lifestyle":
                "Sip fluids frequently and gradually reintroduce food. Wash hands carefully and avoid preparing food for others until well.",
            "When to Seek Medical Help":
                "Seek care for signs of dehydration, blood in stool, persistent high fever, or symptoms lasting more than a few days.",
            "Prognosis":
                "Most people feel better within 1–3 days. Good hygiene prevents spread to others.",
        },
    },
    {
        name: "COVID-19 (Acute)",
        department: "Respiratory/Infectious Diseases",
        sections: {
            "Overview":
                "COVID-19 is a viral infection that ranges from mild cold-like illness to serious lung disease. Some people develop low oxygen levels and need hospital care.",
            "Causes and Risk Factors":
                "Close contact with an infected person spreads the virus. Older age, chronic illness, and weak immunity raise risk for severe disease.",
            "Common Symptoms":
                "Fever, cough, sore throat, runny nose, loss of smell or taste, fatigue, and shortness of breath.",
            "Diagnosis":
                "Rapid antigen or PCR tests confirm infection. Doctors may check oxygen levels and order imaging if symptoms are severe.",
            "Treatment":
                "Rest, fluids, and fever control help in mild cases. Higher-risk patients may receive antivirals or oxygen depending on symptoms.",
            "Self-Management and Lifestyle":
                "Follow isolation and mask guidance when contagious. Stay hydrated and monitor symptoms; use a pulse oximeter if advised.",
            "When to Seek Medical Help":
                "Seek urgent care for chest pain, trouble breathing, confusion, or oxygen levels below guidance. Call emergency services if symptoms escalate quickly.",
            "Prognosis":
                "Most recover fully, though some experience prolonged symptoms. Vaccination lowers the risk of severe illness.",
        },
    },
    {
        name: "Seasonal Influenza",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Influenza is a contagious respiratory illness that causes fever, aches, and cough. It spreads easily during seasonal outbreaks.",
            "Causes and Risk Factors":
                "Flu viruses spread by droplets. Young children, older adults, pregnant people, and those with chronic disease are at higher risk.",
            "Common Symptoms":
                "Sudden fever, chills, muscle aches, headache, sore throat, cough, and tiredness.",
            "Diagnosis":
                "Doctors often diagnose by symptoms during flu season; a rapid test may confirm it when it changes management.",
            "Treatment":
                "Most people recover with rest and fluids; antivirals may be offered early to high-risk patients. Pain relievers ease discomfort.",
            "Self-Management and Lifestyle":
                "Stay home to avoid spreading infection, cover coughs, and wash hands. Annual vaccination is the best prevention.",
            "When to Seek Medical Help":
                "Seek care for breathing difficulties, chest pain, persistent high fever, or if symptoms suddenly worsen after initial improvement.",
            "Prognosis":
                "Symptoms usually improve within a week, though cough and fatigue may linger. Complications are more likely in high-risk groups.",
        },
    },
    {
        name: "Migraine",
        department: "Neurology",
        sections: {
            "Overview":
                "Migraine is a recurring headache disorder that can cause throbbing pain, nausea, and sensitivity to light or sound. Attacks can be disabling.",
            "Causes and Risk Factors":
                "Family history, hormonal changes, stress, lack of sleep, and certain foods may trigger attacks. Triggers vary widely.",
            "Common Symptoms":
                "One-sided throbbing headache, nausea or vomiting, and sensitivity to light and noise. Some people experience an aura before pain.",
            "Diagnosis":
                "Doctors diagnose migraine by patterns of symptoms and exam. Scans are rarely needed unless red flags exist.",
            "Treatment":
                "Pain relievers, triptans, or anti-nausea medicines are used for attacks. Preventive medicines or devices may reduce frequency.",
            "Self-Management and Lifestyle":
                "Keep a headache diary to identify triggers, maintain regular sleep and meals, and manage stress. Limit use of acute medicines to avoid rebound.",
            "When to Seek Medical Help":
                "Seek help for very severe or new-type headaches, neurological symptoms, or headaches that do not respond to usual treatment.",
            "Prognosis":
                "Migraine tends to come and go over a lifetime, but many people achieve good control with treatment and trigger management.",
        },
    },
    {
        name: "Epilepsy",
        department: "Neurology",
        sections: {
            "Overview":
                "Epilepsy is a condition where someone has a tendency to have recurrent seizures. Many people live full lives with the right treatment plan.",
            "Causes and Risk Factors":
                "Causes include prior brain injury, stroke, genetic factors, infections, or may be unknown. Missed medicines and sleep loss can trigger seizures.",
            "Common Symptoms":
                "Seizures can involve shaking, staring spells, confusion, or brief loss of awareness. Recovery time varies.",
            "Diagnosis":
                "Doctors review events, perform an EEG, and may order brain imaging. Blood tests help look for contributing problems.",
            "Treatment":
                "Most seizures are controlled with daily medicines. Some people benefit from devices or surgery if medicines are not enough.",
            "Self-Management and Lifestyle":
                "Take medicines on schedule, get consistent sleep, and avoid known triggers like heavy alcohol. Have a safety plan with family or friends.",
            "When to Seek Medical Help":
                "Call emergency services for seizures lasting more than 5 minutes, repeated seizures without full recovery, or injury during a seizure.",
            "Prognosis":
                "Many people become seizure-free with treatment. Regular follow-up improves safety and quality of life.",
        },
    },
    {
        name: "Chronic Kidney Disease (CKD)",
        department: "Nephrology",
        sections: {
            "Overview":
                "CKD is a gradual loss of kidney function over months to years. Early identification and treatment slow progression.",
            "Causes and Risk Factors":
                "Diabetes, high blood pressure, and vascular disease are common causes. Family history and certain medicines can contribute.",
            "Common Symptoms":
                "Often none at first; later, swelling, tiredness, or changes in urination may appear.",
            "Diagnosis":
                "Blood and urine tests measure kidney function and protein loss. Ultrasound may assess kidney size and structure.",
            "Treatment":
                "Blood pressure and sugar control, medicines that protect the kidneys, and avoiding harmful drugs help preserve function.",
            "Self-Management and Lifestyle":
                "Follow a kidney-friendly diet as advised, stop smoking, and keep active. Review all medicines with your care team.",
            "When to Seek Medical Help":
                "Contact your doctor for rapid swelling, breathlessness, or very high blood pressure. Seek advice before using NSAIDs or contrast dyes.",
            "Prognosis":
                "Many people live well for years with CKD when risks are controlled. Planning ahead helps if function declines.",
        },
    },
    {
        name: "Acute Kidney Injury (AKI)",
        department: "Nephrology",
        sections: {
            "Overview":
                "AKI is a sudden drop in kidney function that can happen over hours to days. It may occur during illness, dehydration, or after certain medicines.",
            "Causes and Risk Factors":
                "Sepsis, vomiting/diarrhea, heart failure, contrast dye, and NSAIDs can trigger AKI. Older age and CKD increase risk.",
            "Common Symptoms":
                "Reduced urine, swelling, fatigue, or confusion; sometimes there are no symptoms, only abnormal blood tests.",
            "Diagnosis":
                "Blood and urine tests confirm the problem, and scans may check for blockage. Doctors review medicines closely.",
            "Treatment":
                "Fluids, stopping harmful medicines, and treating the underlying cause usually help. Some people need temporary dialysis.",
            "Self-Management and Lifestyle":
                "Stay hydrated during illness, avoid NSAIDs unless advised, and follow medical plans for chronic conditions.",
            "When to Seek Medical Help":
                "Seek care for persistent vomiting, severe dehydration, or sudden swelling/shortness of breath.",
            "Prognosis":
                "Many recover fully, though some have lasting changes. Future episodes can be prevented with early action.",
        },
    },
    {
        name: "Upper Gastrointestinal Bleed (UGIB)",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "UGIB means bleeding from the esophagus, stomach, or upper small intestine. It can be serious and needs urgent evaluation.",
            "Causes and Risk Factors":
                "Common causes include ulcers, stomach irritation from medicines, and enlarged veins from liver disease. Alcohol and H. pylori infection contribute.",
            "Common Symptoms":
                "Vomiting blood or coffee-ground material, black stools, weakness, and dizziness. Some people have chest or belly discomfort.",
            "Diagnosis":
                "Doctors assess blood counts and perform an endoscopy to find and treat the source. Medicines reduce stomach acid.",
            "Treatment":
                "Fluids and blood support may be needed. Endoscopy can seal bleeding vessels; specific treatments target the cause.",
            "Self-Management and Lifestyle":
                "Avoid NSAIDs and limit alcohol. Take ulcer medicines as prescribed and complete H. pylori treatment if present.",
            "When to Seek Medical Help":
                "Seek emergency care for vomiting blood, black stools, fainting, or severe weakness.",
            "Prognosis":
                "Most bleeds can be controlled, but recurrence depends on the cause and risk factors.",
        },
    },
    {
        name: "Osteoarthritis (Knee/Hip)",
        department: "Rheumatology",
        sections: {
            "Overview":
                "Osteoarthritis is wear-and-tear arthritis that affects joint cartilage and surrounding bone. It can limit mobility and daily activities.",
            "Causes and Risk Factors":
                "Age, previous injury, excess weight, and family history increase risk. Physically demanding work may contribute.",
            "Common Symptoms":
                "Joint pain that worsens with activity, stiffness after rest, and grinding or clicking. Swelling may occur.",
            "Diagnosis":
                "Doctors assess symptoms and exam; X-rays may show joint space loss and bone spurs.",
            "Treatment":
                "Exercise therapy, weight management, and pain relievers help symptoms. Injections or joint replacement may be considered in advanced cases.",
            "Self-Management and Lifestyle":
                "Strengthen supporting muscles, use heat/cold packs, and pace activities. Use canes or braces if recommended.",
            "When to Seek Medical Help":
                "Seek help for persistent pain, night pain, or sudden swelling and redness. Discuss options if activity becomes very limited.",
            "Prognosis":
                "Symptoms often fluctuate; many people manage well with a combination of lifestyle measures and medicines.",
        },
    },
    {
        name: "Peptic Ulcer Disease",
        department: "Gastroenterology",
        sections: {
            "Overview":
                "Peptic ulcers are sores in the stomach or duodenum that can cause burning pain. They may bleed if untreated.",
            "Causes and Risk Factors":
                "Infection with H. pylori and regular NSAID/aspirin use are common causes. Smoking and heavy alcohol increase risk.",
            "Common Symptoms":
                "Burning upper abdominal pain often related to meals, bloating, and nausea. Some people develop anemia or black stools.",
            "Diagnosis":
                "Endoscopy confirms the ulcer and can treat bleeding. Non-invasive tests detect H. pylori infection.",
            "Treatment":
                "Stomach acid medicines help healing; eradication therapy cures H. pylori. Stopping NSAIDs reduces recurrence.",
            "Self-Management and Lifestyle":
                "Avoid smoking and excess alcohol and take medicines exactly as prescribed. Eat smaller, more frequent meals if it helps.",
            "When to Seek Medical Help":
                "Seek urgent help for vomiting blood, black stools, or severe persistent pain.",
            "Prognosis":
                "Healing rates are high with modern therapy. Recurrence is uncommon once the cause is addressed.",
        },
    },
    {
        name: "Anxiety Disorder (Panic)",
        department: "Behavioral Health",
        sections: {
            "Overview":
                "Panic disorder involves sudden waves of intense fear with physical symptoms that can feel like a medical emergency. Attacks are scary but not dangerous.",
            "Causes and Risk Factors":
                "Family history, stress, and sensitive body alarm systems contribute. Caffeine and sleep loss can trigger episodes.",
            "Common Symptoms":
                "Racing heart, shortness of breath, chest tightness, dizziness, trembling, and a sense of doom that peaks within minutes.",
            "Diagnosis":
                "Diagnosis is based on repeated attacks and worry about future episodes. Doctors also rule out medical mimics.",
            "Treatment":
                "Talking therapies and certain medicines reduce attack frequency and fear of symptoms. Breathing and grounding techniques help during attacks.",
            "Self-Management and Lifestyle":
                "Limit caffeine, practice relaxation, and maintain regular sleep and exercise. Use a plan for early symptoms.",
            "When to Seek Medical Help":
                "Seek help if attacks are frequent, interfere with life, or come with depression or thoughts of self-harm.",
            "Prognosis":
                "Most people improve significantly with therapy and self-management skills.",
        },
    },
    {
        name: "Lower UTI (Cystitis) – Adult Female",
        department: "Urology/Primary Care",
        sections: {
            "Overview":
                "Cystitis is a bladder infection that causes painful and frequent urination. It is common and usually straightforward to treat.",
            "Causes and Risk Factors":
                "Bacteria from the bowel entering the urinary tract, sexual activity, certain contraceptives, and low estrogen after menopause increase risk.",
            "Common Symptoms":
                "Burning with urination, frequent urges, lower abdominal discomfort, and sometimes blood in the urine.",
            "Diagnosis":
                "Doctors can often diagnose by symptoms; urine testing may confirm infection and guide antibiotics.",
            "Treatment":
                "Short courses of antibiotics usually work well. Pain relief and fluids improve comfort.",
            "Self-Management and Lifestyle":
                "Drink water, urinate regularly, and consider preventive steps if infections recur. Vaginal estrogen may help after menopause if appropriate.",
            "When to Seek Medical Help":
                "Seek help for fever, back pain, vomiting, or symptoms not improving after treatment. Pregnant patients should contact a clinician promptly.",
            "Prognosis":
                "Most infections clear quickly. Recurrences can be reduced with tailored prevention strategies.",
        },
    },
    {
        name: "Clostridioides difficile Infection (CDI)",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "CDI is a gut infection that can occur after antibiotics disturb normal bacteria. It causes diarrhea and abdominal cramps.",
            "Causes and Risk Factors":
                "Recent antibiotics, hospitalization, older age, and weak immunity raise risk. Acid-reducing medicines may contribute.",
            "Common Symptoms":
                "Watery diarrhea, stomach cramps, fever, and nausea. Severe cases may cause dehydration and bloating.",
            "Diagnosis":
                "Stool tests confirm the infection. Doctors check for complications if symptoms are severe.",
            "Treatment":
                "Specific antibiotics treat CDI, and stopping the triggering antibiotic helps. Recurrent cases may need specialized treatments.",
            "Self-Management and Lifestyle":
                "Wash hands with soap and water and clean surfaces carefully to prevent spread. Stay hydrated and follow the treatment plan.",
            "When to Seek Medical Help":
                "Seek care for persistent diarrhea, severe belly pain, or signs of dehydration. Go urgently if the abdomen becomes very swollen.",
            "Prognosis":
                "Most people improve with treatment, though some have recurrences that need further care.",
        },
    },
    {
        name: "Preeclampsia",
        department: "Obstetrics",
        sections: {
            "Overview":
                "Preeclampsia is a pregnancy condition with high blood pressure and signs of organ stress after 20 weeks. It needs close monitoring to protect parent and baby.",
            "Causes and Risk Factors":
                "First pregnancy, multiple gestation, prior preeclampsia, chronic hypertension, diabetes, kidney disease, and autoimmune conditions increase risk.",
            "Common Symptoms":
                "Headache, vision changes, swelling, pain under the ribs, and sudden weight gain. Some people have no symptoms.",
            "Diagnosis":
                "Blood pressure checks, urine and blood tests, and fetal monitoring confirm the condition and guide timing of delivery.",
            "Treatment":
                "Blood pressure control and medications to prevent seizures may be used. Delivery is the only cure and is timed based on severity and gestation.",
            "Self-Management and Lifestyle":
                "Attend all prenatal visits and report new symptoms promptly. Follow advice on rest and monitoring.",
            "When to Seek Medical Help":
                "Seek urgent care for severe headache, vision loss, shortness of breath, or severe belly pain.",
            "Prognosis":
                "Most recover after delivery, though blood pressure may stay high for a while. Future pregnancy planning reduces risk.",
        },
    },
    {
        name: "Asthma Exacerbation (Severe)",
        department: "Pulmonology/ED",
        sections: {
            "Overview":
                "A severe asthma attack is a sudden worsening of symptoms that can be dangerous. Quick treatment helps reopen the airways.",
            "Causes and Risk Factors":
                "Viral colds, smoke, allergens, and poor controller use can trigger attacks. Prior ICU or intubation raises risk.",
            "Common Symptoms":
                "Severe breathlessness, difficulty speaking, chest tightness, and wheezing or a ‘silent chest’.",
            "Diagnosis":
                "Doctors assess breathing, oxygen levels, and response to inhaled medicines. Peak flow may be checked when possible.",
            "Treatment":
                "Repeated rescue inhalers, steroids, and oxygen are used. Some people need additional medicines or breathing support.",
            "Self-Management and Lifestyle":
                "Keep an action plan and use preventer inhalers daily. Avoid triggers and check inhaler technique regularly.",
            "When to Seek Medical Help":
                "Call emergency services for severe breathlessness, blue lips, or no response to rescue inhaler.",
            "Prognosis":
                "Most recover fully with prompt care. Preventer adherence lowers the chance of future attacks.",
        },
    },
    {
        name: "COPD Exacerbation",
        department: "Pulmonology/ED",
        sections: {
            "Overview":
                "A COPD flare-up is a sudden worsening of cough, mucus, and breathlessness. Infections often trigger it.",
            "Causes and Risk Factors":
                "Viral and bacterial infections, air pollution, and smoking are common triggers. Prior frequent flare-ups increase risk.",
            "Common Symptoms":
                "Increased breathlessness, thicker or discolored mucus, and tiredness. Fever may occur.",
            "Diagnosis":
                "Doctors assess symptoms, oxygen levels, and may order chest X-rays or blood tests. They rule out pneumonia or clots.",
            "Treatment":
                "Inhalers are stepped up, short courses of steroids are common, and antibiotics may be used when infection is suspected.",
            "Self-Management and Lifestyle":
                "Keep rescue medicines available and start the action plan early. Pulmonary rehab and smoking cessation reduce future flares.",
            "When to Seek Medical Help":
                "Seek urgent care for worsening breathlessness, confusion, or if home treatments fail.",
            "Prognosis":
                "Most flares settle within days to weeks. Preventing future episodes improves long-term wellbeing.",
        },
    },
    {
        name: "Alcohol Withdrawal",
        department: "Addiction Medicine",
        sections: {
            "Overview":
                "Alcohol withdrawal happens when someone who drinks heavily stops suddenly. Symptoms range from tremor and anxiety to seizures and delirium.",
            "Causes and Risk Factors":
                "Daily heavy drinking and previous severe withdrawal raise risk. Poor nutrition and illness make symptoms worse.",
            "Common Symptoms":
                "Shaking, sweating, fast heartbeat, trouble sleeping, and feeling on edge. Severe cases may cause confusion and hallucinations.",
            "Diagnosis":
                "Clinicians assess recent drinking and use a scoring scale to track symptoms. Blood tests may check hydration and salt levels.",
            "Treatment":
                "Medicines help control symptoms and prevent seizures; vitamins and fluids support recovery. Counseling and follow-up reduce relapse.",
            "Self-Management and Lifestyle":
                "Do not stop heavy drinking alone; seek medical help to taper safely. Build a support plan for aftercare.",
            "When to Seek Medical Help":
                "Seek urgent care for seizures, confusion, or severe shaking. Call emergency services if breathing becomes difficult.",
            "Prognosis":
                "Most people improve within days with proper support. Long-term recovery is best with ongoing treatment and community support.",
        },
    },
    {
        name: "Pulmonary Edema (Cardiogenic)",
        department: "Cardiology/ED",
        sections: {
            "Overview":
                "Pulmonary edema is fluid in the lungs that makes breathing very difficult and usually results from the heart struggling to pump effectively.",
            "Causes and Risk Factors":
                "Worsening heart failure, heart attack, and severe high blood pressure are common causes. Kidney disease and fluid overload contribute.",
            "Common Symptoms":
                "Severe breathlessness, coughing frothy or pink sputum, and waking at night short of breath.",
            "Diagnosis":
                "Doctors check oxygen levels, chest X-ray, and heart tests to confirm fluid overload. They look for triggers.",
            "Treatment":
                "Oxygen, medicines to remove fluid and reduce heart strain, and sometimes noninvasive ventilation are used.",
            "Self-Management and Lifestyle":
                "Follow heart failure advice on low salt, daily weights, and medicines. Report fast weight gain early.",
            "When to Seek Medical Help":
                "Call emergency services for severe breathlessness or blue lips. Seek urgent help if symptoms rapidly worsen.",
            "Prognosis":
                "Most people improve quickly with treatment, but managing heart failure long term is essential to prevent recurrences.",
        },
    },
    {
        name: "Syncope (Fainting)",
        department: "Emergency/Primary Care",
        sections: {
            "Overview":
                "Syncope is a brief loss of consciousness from reduced blood flow to the brain. Many causes are benign, but some relate to the heart.",
            "Causes and Risk Factors":
                "Dehydration, standing quickly, strong emotions, and heart rhythm problems can trigger episodes. Some medicines lower blood pressure too much.",
            "Common Symptoms":
                "Lightheadedness, dimming vision, nausea, and brief loss of consciousness with quick recovery.",
            "Diagnosis":
                "Doctors review the event, check vital signs and ECG, and may order further tests if a heart cause is suspected.",
            "Treatment":
                "Treatment addresses the cause: fluids, medication changes, or heart rhythm care. Learning counter-pressure maneuvers helps some people.",
            "Self-Management and Lifestyle":
                "Stay hydrated, rise slowly, and avoid triggers like standing still for long periods. Use support stockings if advised.",
            "When to Seek Medical Help":
                "Seek urgent care after fainting with chest pain, during exercise, or with injury. Report frequent recurrences.",
            "Prognosis":
                "Most fainting is benign; heart-related causes need targeted care. Avoiding triggers reduces episodes.",
        },
    },
    {
        name: "Acute Otitis Media (Adult)",
        department: "ENT",
        sections: {
            "Overview":
                "Middle ear infection causes ear pain and temporary hearing changes. Adults can also be affected, often after a cold.",
            "Causes and Risk Factors":
                "Recent viral infections, allergies, smoking, and barotrauma increase risk. Eustachian tube problems can contribute.",
            "Common Symptoms":
                "Ear pain, fever, muffled hearing, and a feeling of fullness. Occasionally, fluid drains from the ear.",
            "Diagnosis":
                "Doctors examine the eardrum for redness, bulging, and fluid. Tests are rarely needed.",
            "Treatment":
                "Pain relief is the main treatment; some cases need antibiotics depending on severity. Decongestants may help short term.",
            "Self-Management and Lifestyle":
                "Use pain relievers as directed and avoid inserting objects into the ear. Protect the ear from water if it drains.",
            "When to Seek Medical Help":
                "Seek help for severe pain, high fever, or swelling behind the ear. Return if symptoms do not improve after a few days.",
            "Prognosis":
                "Most infections resolve fully. Temporary hearing changes usually improve as fluid clears.",
        },
    },
    {
        name: "Erysipelas",
        department: "Infectious Diseases",
        sections: {
            "Overview":
                "Erysipelas is a skin infection with a bright red, sharply edged rash, often on the face or legs. It spreads in the upper layers of skin.",
            "Causes and Risk Factors":
                "Streptococcal bacteria enter through small skin breaks. Lymphedema, athlete’s foot, and older age increase risk.",
            "Common Symptoms":
                "Painful, warm, red area with a raised border and fever or chills. The area can spread quickly.",
            "Diagnosis":
                "Doctors diagnose by examining the skin. Tests are not usually needed unless severe.",
            "Treatment":
                "Antibiotics treat the infection; elevating the limb and pain relief help symptoms. Treat any skin entry points to prevent relapse.",
            "Self-Management and Lifestyle":
                "Keep skin clean and moisturized, and manage swelling with compression if advised. Wear proper footwear to reduce injuries.",
            "When to Seek Medical Help":
                "Seek care if redness spreads rapidly, fever develops, or pain worsens. Eye involvement needs urgent attention.",
            "Prognosis":
                "Most cases respond quickly to antibiotics. Some people experience recurrences and benefit from prevention strategies.",
        },
    },
    {
        name: "Tension-Type Headache (Frequent Episodic)",
        department: "Neurology",
        sections: {
            "Overview":
                "Tension-type headache causes a pressing, band-like pain on both sides of the head. It is usually mild to moderate but can be frequent.",
            "Causes and Risk Factors":
                "Stress, poor sleep, eye strain, and posture problems are common triggers. Some medicines can contribute to overuse headaches.",
            "Common Symptoms":
                "Steady, non-throbbing pain without nausea or strong sensitivity to light and sound. The neck and scalp may feel tight.",
            "Diagnosis":
                "Doctors diagnose by symptoms and exam. Scans are seldom needed unless there are red flags.",
            "Treatment":
                "Simple pain relievers and relaxation techniques help most people. Preventive strategies are considered if headaches are frequent.",
            "Self-Management and Lifestyle":
                "Improve sleep, take screen breaks, stretch, and manage stress. Limit pain relievers to avoid rebound headaches.",
            "When to Seek Medical Help":
                "Seek care for new severe headaches, neurological changes, or headaches that do not improve with usual measures.",
            "Prognosis":
                "Most people manage well with lifestyle changes and occasional medicines.",
        },
    },
    {
        name: "Sciatica (Lumbar Radiculopathy)",
        department: "Orthopedics/Spine",
        sections: {
            "Overview":
                "Sciatica is nerve pain that travels from the lower back into the leg, often due to a disc problem. It may be sharp and can limit movement.",
            "Causes and Risk Factors":
                "Disc herniation, spinal stenosis, or muscle spasm can press on the nerve. Heavy lifting and twisting can trigger symptoms.",
            "Common Symptoms":
                "Shooting leg pain, numbness, tingling, or weakness in a specific pattern. Coughing or sitting may worsen pain.",
            "Diagnosis":
                "Doctors assess strength, reflexes, and sensation; scans are reserved for severe or persistent symptoms.",
            "Treatment":
                "Pain relief, gentle activity, and physical therapy are first steps. Injections or surgery are options if symptoms persist.",
            "Self-Management and Lifestyle":
                "Keep moving within comfort, use heat/ice, and practice safe lifting. Gradual return to normal activities is encouraged.",
            "When to Seek Medical Help":
                "Seek urgent care for worsening weakness, loss of bladder or bowel control, or severe, unrelenting pain.",
            "Prognosis":
                "Many improve over weeks with conservative care. Some need further procedures if pain continues.",
        },
    },
];

// Ensure exactly 30 entries (trim or add as needed)
const entries = diseaseDocs.slice(0, 30);

// Build output text for one disease in chunk format
function buildOutput(d) {
    const lines = [];

    // 1) Document Information (no Title/Version; random realistic Date)
    lines.push("Document Information:");
    lines.push(`Disease - ${d.name}`);
    lines.push(`Date - ${randomDateISO()}`);
    lines.push(`Responsible Department - ${d.department}`);
    lines.push(""); // blank line after first chunk

    for (const section of SECTION_ORDER.slice(1)) {
        const content = (d.sections && d.sections[section]) ? d.sections[section].trim() : "";
        lines.push(`${section}:`);
        lines.push(content.length ? content : "Content pending.");
        lines.push("");
    }

    return lines.join("\n").trim() + "\n";
}

// =================== WRITE FILES ===================
for (const d of entries) {
    fs.writeFileSync(path.join(OUT_DIR, `${safe(d.name)}.txt`), buildOutput(d), "utf8");
}

console.log(`Generated ${entries.length} rich disease docs in ${OUT_DIR}`);
