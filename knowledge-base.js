/**
 * MediSense Knowledge Base
 * Auto-generated from: Disease Symptom and Patient Profile Dataset (Kaggle)
 * Covers 116 conditions with symptom profiles and triage guidance.
 * Used by gemini.js localTriageFallback() when no API key is available.
 */

const MEDISENSE_KB = [
  {
    name: "Influenza",
    keywords: ["flu", "influenza", "fever", "body ache", "chills", "sore throat"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "moderate",
    advice: "Rest at home, stay hydrated, and take paracetamol for fever. Most cases resolve in 7–10 days. See a doctor if symptoms worsen or breathing becomes difficult.",
    redFlags: ["difficulty breathing", "chest pain", "confusion", "persistent high fever over 3 days"],
    category: "respiratory"
  },
  {
    name: "Common Cold",
    keywords: ["cold", "runny nose", "sneezing", "nasal congestion", "sore throat"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Rest, drink warm fluids, and use saline nasal drops. OTC decongestants can help. Usually resolves in 7–10 days without treatment.",
    redFlags: ["symptoms lasting more than 2 weeks", "high fever", "earache"],
    category: "respiratory"
  },
  {
    name: "Asthma",
    keywords: ["asthma", "wheeze", "wheezing", "shortness of breath", "tight chest", "inhaler"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: true },
    urgency: "moderate",
    advice: "Use your prescribed reliever inhaler immediately. Avoid known triggers. Sit upright and stay calm. If no improvement in 15 minutes, seek emergency care.",
    redFlags: ["unable to speak in full sentences", "lips turning blue", "inhaler not helping", "severe breathlessness"],
    category: "respiratory"
  },
  {
    name: "Bronchitis",
    keywords: ["bronchitis", "chest cough", "mucus", "phlegm", "persistent cough"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "moderate",
    advice: "Rest and drink plenty of fluids. Use a humidifier. Avoid smoke and irritants. Most acute bronchitis is viral and clears without antibiotics in 2–3 weeks.",
    redFlags: ["coughing blood", "breathlessness at rest", "fever over 38.5°C for more than 3 days"],
    category: "respiratory"
  },
  {
    name: "Pneumonia",
    keywords: ["pneumonia", "chest infection", "lung infection", "high fever cough"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "high",
    advice: "Pneumonia often requires medical evaluation. See a doctor as soon as possible. Treatment may include antibiotics. Rest and stay well-hydrated.",
    redFlags: ["rapid breathing", "blue lips", "confusion", "severe chest pain"],
    category: "respiratory"
  },
  {
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    keywords: ["copd", "chronic obstructive", "emphysema", "chronic bronchitis", "smoker cough"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "high",
    advice: "Use prescribed inhalers as directed. Avoid smoking and air pollution. Pulmonary rehab can help. See your doctor for regular monitoring and flare-up management.",
    redFlags: ["severe breathlessness at rest", "coughing blood", "cyanosis (blue lips/fingertips)"],
    category: "respiratory"
  },
  {
    name: "Sinusitis",
    keywords: ["sinusitis", "sinus", "facial pain", "blocked nose", "headache sinus", "sinus pressure"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Use saline nasal rinses, steam inhalation, and OTC decongestants. Most cases resolve in 10 days. See a doctor if symptoms persist beyond 3 weeks.",
    redFlags: ["severe headache", "vision changes", "swelling around eyes", "stiff neck"],
    category: "respiratory"
  },
  {
    name: "Allergic Rhinitis",
    keywords: ["allergy", "hay fever", "allergic rhinitis", "sneezing", "itchy eyes", "runny nose allergy"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Avoid known allergens. OTC antihistamines (cetirizine, loratadine) are effective. Nasal steroid sprays help long-term. See an allergist for skin testing.",
    redFlags: ["severe breathing difficulty", "anaphylaxis symptoms"],
    category: "respiratory"
  },
  {
    name: "Tuberculosis",
    keywords: ["tuberculosis", "tb", "night sweats", "blood cough", "weight loss cough"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Seek medical attention immediately. TB requires a full course of antibiotics (6 months). It is contagious — wear a mask and isolate from others until cleared by a doctor.",
    redFlags: ["coughing blood", "rapid weight loss", "prolonged fever", "night sweats"],
    category: "respiratory"
  },
  {
    name: "Diabetes",
    keywords: ["diabetes", "blood sugar", "thirsty", "frequent urination", "hyperglycemia", "glucose"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Monitor your blood glucose regularly. Follow a low-sugar, balanced diet. Take prescribed medications consistently. See your doctor for HbA1c checks every 3 months.",
    redFlags: ["blood sugar over 300 mg/dL", "confusion", "fruity breath", "extreme thirst and vomiting"],
    category: "metabolic"
  },
  {
    name: "Hypertension",
    keywords: ["hypertension", "high blood pressure", "bp high", "headache dizziness", "blood pressure"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Reduce salt intake, exercise regularly, manage stress, and take prescribed medication. Monitor blood pressure at home. Avoid smoking and alcohol.",
    redFlags: ["BP over 180/120", "severe headache", "vision loss", "chest pain", "confusion"],
    category: "cardiovascular"
  },
  {
    name: "Coronary Artery Disease",
    keywords: ["coronary", "heart disease", "angina", "chest tightness", "heart pain"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Take prescribed medications (statins, aspirin, beta-blockers). Follow a heart-healthy diet. Exercise as approved by your doctor. Quit smoking immediately.",
    redFlags: ["chest pain radiating to arm or jaw", "sudden shortness of breath", "sweating with chest pain"],
    category: "cardiovascular"
  },
  {
    name: "Myocardial Infarction (Heart Attack)",
    keywords: ["heart attack", "myocardial infarction", "chest pain severe", "jaw pain", "arm pain chest"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "emergency",
    advice: "CALL EMERGENCY SERVICES (911/112) IMMEDIATELY. Chew an aspirin (325mg) if available and not allergic. Do not drive yourself. Every minute counts.",
    redFlags: ["all symptoms are red flags — this is a medical emergency"],
    category: "cardiovascular"
  },
  {
    name: "Stroke",
    keywords: ["stroke", "slurred speech", "face drooping", "arm weakness", "sudden confusion", "facial droop"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "emergency",
    advice: "Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. CALL 911/112 NOW. Do not give food or water.",
    redFlags: ["FAST symptoms", "sudden severe headache", "vision loss", "loss of balance"],
    category: "neurological"
  },
  {
    name: "Migraine",
    keywords: ["migraine", "severe headache", "throbbing head", "headache nausea", "light sensitivity", "aura"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Rest in a dark, quiet room. Take OTC pain relief (ibuprofen, aspirin) at onset. Stay hydrated. Identify and avoid triggers (stress, certain foods, bright lights).",
    redFlags: ["worst headache of your life", "sudden onset", "fever with stiff neck", "neurological symptoms"],
    category: "neurological"
  },
  {
    name: "Epilepsy",
    keywords: ["epilepsy", "seizure", "convulsion", "fits", "blackout seizure"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Take prescribed anti-epileptic medications consistently. Avoid known triggers (sleep deprivation, alcohol). Never stop medication suddenly. Inform your doctor of any new seizures.",
    redFlags: ["seizure lasting more than 5 minutes", "multiple seizures without recovery", "first-time seizure", "injury during seizure"],
    category: "neurological"
  },
  {
    name: "Alzheimer's Disease",
    keywords: ["alzheimer", "dementia", "memory loss", "forgetfulness", "confusion elderly"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Consult a neurologist for diagnosis and care plan. Cognitive exercises and social engagement may slow progression. Caregiver support is essential.",
    redFlags: ["sudden severe memory loss", "getting lost in familiar places", "personality changes"],
    category: "neurological"
  },
  {
    name: "Parkinson's Disease",
    keywords: ["parkinson", "tremor", "shaking hands", "slow movement", "muscle stiffness"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See a neurologist for medication management (levodopa). Physical therapy improves mobility. Regular exercise is highly beneficial. Maintain a structured daily routine.",
    redFlags: ["sudden inability to move", "falls", "difficulty swallowing", "confusion"],
    category: "neurological"
  },
  {
    name: "Multiple Sclerosis",
    keywords: ["multiple sclerosis", "ms", "numbness tingling", "vision problems neurological", "muscle weakness nerve"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a neurologist for disease-modifying therapy. Physical therapy and regular exercise help. Avoid overheating. Manage fatigue with rest and activity planning.",
    redFlags: ["sudden vision loss", "paralysis", "loss of bladder control", "severe relapse"],
    category: "neurological"
  },
  {
    name: "Depression",
    keywords: ["depression", "sad", "hopeless", "no motivation", "low mood", "empty feeling"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Seek help from a mental health professional. Therapy (CBT) and medication are effective. Regular exercise, social connection, and good sleep are important. You are not alone.",
    redFlags: ["thoughts of self-harm or suicide", "inability to perform daily tasks", "psychosis"],
    category: "mental_health"
  },
  {
    name: "Anxiety Disorders",
    keywords: ["anxiety", "panic attack", "worry", "racing heart anxiety", "nervousness", "fear"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Practice deep breathing and mindfulness. Cognitive Behavioural Therapy (CBT) is highly effective. Reduce caffeine. Talk to your doctor about short-term medication if needed.",
    redFlags: ["thoughts of self-harm", "panic attacks lasting over 30 minutes", "unable to function"],
    category: "mental_health"
  },
  {
    name: "Bipolar Disorder",
    keywords: ["bipolar", "mood swings", "mania", "manic episode", "extreme highs lows"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Consistent medication (mood stabilisers) is essential. Never stop medication without doctor supervision. Maintain a regular sleep schedule. Regular therapy helps.",
    redFlags: ["severe mania", "suicidal thoughts", "psychosis", "inability to sleep for days"],
    category: "mental_health"
  },
  {
    name: "Schizophrenia",
    keywords: ["schizophrenia", "hallucination", "delusion", "paranoia", "hearing voices"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Antipsychotic medication is the primary treatment. Psychosocial support and therapy are essential. Never stop medication suddenly. Ensure a safe, supportive environment.",
    redFlags: ["danger to self or others", "severe psychotic break", "unable to care for oneself"],
    category: "mental_health"
  },
  {
    name: "Obsessive-Compulsive Disorder (OCD)",
    keywords: ["ocd", "obsessive", "compulsive", "repetitive thoughts", "rituals", "intrusive thoughts"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Cognitive Behavioural Therapy (CBT), specifically ERP, is the most effective treatment. SSRIs are also commonly prescribed. Don't try to resist compulsions alone — seek professional help.",
    redFlags: ["thoughts of harming yourself or others", "complete inability to function"],
    category: "mental_health"
  },
  {
    name: "Gastroenteritis",
    keywords: ["gastroenteritis", "stomach bug", "vomiting diarrhea", "stomach flu", "food poisoning", "nausea vomiting"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Stay hydrated with oral rehydration salts (ORS). Eat bland foods (BRAT diet). Rest. Avoid solid food if nauseous. Symptoms usually resolve in 1–3 days.",
    redFlags: ["blood in stool", "severe dehydration", "high fever over 38.5°C", "symptoms lasting more than 3 days"],
    category: "digestive"
  },
  {
    name: "Pancreatitis",
    keywords: ["pancreatitis", "pancreas pain", "upper abdominal pain severe", "stomach pain after eating"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Seek medical attention promptly. Stop eating and drinking until cleared by a doctor. Avoid alcohol entirely. IV fluids are usually required in hospital.",
    redFlags: ["severe upper abdominal pain radiating to back", "fever", "vomiting that won't stop"],
    category: "digestive"
  },
  {
    name: "Appendicitis",
    keywords: ["appendicitis", "right side stomach pain", "appendix", "pain around belly button"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "emergency",
    advice: "Go to the emergency room immediately. Appendicitis usually requires surgery. Do not eat, drink, or take painkillers that might mask symptoms before diagnosis.",
    redFlags: ["sharp pain starting near belly button moving to lower right abdomen", "fever", "vomiting"],
    category: "digestive"
  },
  {
    name: "Ulcerative Colitis",
    keywords: ["ulcerative colitis", "inflammatory bowel", "bloody diarrhea", "colitis", "bowel inflammation"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Take prescribed anti-inflammatory medications. Track food triggers and maintain a food diary. Reduce stress. See a gastroenterologist for regular colonoscopy monitoring.",
    redFlags: ["blood in stool", "severe abdominal pain", "high fever", "more than 6 bloody stools per day"],
    category: "digestive"
  },
  {
    name: "Crohn's Disease",
    keywords: ["crohns", "crohn's", "inflammatory bowel disease", "ibd", "abdominal cramps", "diarrhea abdominal"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Follow your prescribed medication plan. Identify and avoid food triggers. A gastroenterologist should monitor you. Supplements for vitamin/mineral deficiencies may be needed.",
    redFlags: ["severe abdominal pain", "blood in stool", "abscess or fistula", "intestinal obstruction symptoms"],
    category: "digestive"
  },
  {
    name: "Hepatitis",
    keywords: ["hepatitis", "liver infection", "jaundice", "yellow skin", "yellow eyes"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately for blood tests. Avoid alcohol completely. Rest and stay hydrated. Treatment depends on the hepatitis type (A, B, C, etc.).",
    redFlags: ["yellowing of skin or eyes", "severe abdominal pain", "dark urine", "confusion"],
    category: "digestive"
  },
  {
    name: "Liver Disease",
    keywords: ["liver disease", "liver failure", "cirrhosis", "fatty liver", "liver pain"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Avoid alcohol and hepatotoxic medications. Follow a low-sodium diet. See a hepatologist regularly. Monitor for complications like ascites or encephalopathy.",
    redFlags: ["yellowing skin", "swollen abdomen", "confusion", "vomiting blood", "black stools"],
    category: "digestive"
  },
  {
    name: "Urinary Tract Infection (UTI)",
    keywords: ["uti", "urinary tract infection", "burning urination", "frequent urination", "painful urination", "bladder infection"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Drink plenty of water. See a doctor for antibiotics if symptoms are significant. Cranberry juice may help prevention. Urinate after intercourse. Don't hold urine for long.",
    redFlags: ["high fever", "back or flank pain (kidney involvement)", "blood in urine", "vomiting"],
    category: "urological"
  },
  {
    name: "Kidney Disease",
    keywords: ["kidney disease", "renal failure", "kidney failure", "swollen ankles kidney", "reduced urine"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Follow a kidney-friendly diet (low sodium, low potassium if advised). Stay hydrated. Monitor blood pressure. See a nephrologist regularly for GFR tracking.",
    redFlags: ["sudden decrease in urine output", "severe swelling", "confusion", "difficulty breathing"],
    category: "urological"
  },
  {
    name: "Rheumatoid Arthritis",
    keywords: ["rheumatoid arthritis", "joint pain swelling", "morning stiffness", "autoimmune arthritis", "joint inflammation"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Take prescribed DMARDs or biologics consistently. Physiotherapy and gentle exercise (swimming, yoga) help. Avoid joint overuse. Apply warm/cold compresses for pain.",
    redFlags: ["joint deformity", "sudden loss of joint function", "fever with joint pain"],
    category: "musculoskeletal"
  },
  {
    name: "Osteoarthritis",
    keywords: ["osteoarthritis", "joint pain", "knee pain", "hip pain", "arthritis wear tear"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Low-impact exercise (walking, swimming) reduces stiffness. Maintain a healthy weight. Use OTC pain relief (paracetamol, ibuprofen). Physiotherapy can help greatly.",
    redFlags: ["sudden severe joint pain", "hot swollen joint", "inability to bear weight"],
    category: "musculoskeletal"
  },
  {
    name: "Osteoporosis",
    keywords: ["osteoporosis", "brittle bones", "bone density", "fracture risk", "weak bones"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Take calcium and Vitamin D supplements as directed. Weight-bearing exercise strengthens bones. Avoid smoking and excessive alcohol. Fall prevention at home is crucial.",
    redFlags: ["fracture from minor injury", "sudden severe back pain (vertebral fracture)", "loss of height"],
    category: "musculoskeletal"
  },
  {
    name: "Gout",
    keywords: ["gout", "gout attack", "swollen big toe", "uric acid", "joint pain sudden"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Avoid purine-rich foods (red meat, shellfish, alcohol). Stay well-hydrated. NSAIDs or colchicine help during attacks. See a doctor for long-term uric acid management.",
    redFlags: ["infection in joint", "multiple joint involvement", "kidney stones with gout"],
    category: "musculoskeletal"
  },
  {
    name: "Fibromyalgia",
    keywords: ["fibromyalgia", "widespread pain", "chronic pain", "tender points", "pain everywhere"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Gentle aerobic exercise is the most effective treatment. Cognitive Behavioural Therapy helps. Maintain a good sleep schedule. Pain medications and antidepressants may be prescribed.",
    redFlags: ["severe disability", "progressive weakness", "weight loss with pain"],
    category: "musculoskeletal"
  },
  {
    name: "Eczema",
    keywords: ["eczema", "atopic dermatitis", "itchy skin", "skin rash", "dry itchy skin", "dermatitis"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Moisturise skin at least twice daily. Use mild, fragrance-free soap. Apply topical corticosteroids during flares. Identify and avoid triggers (certain soaps, foods, stress).",
    redFlags: ["infected skin (oozing, crusting, fever)", "widespread severe rash", "anaphylaxis"],
    category: "dermatological"
  },
  {
    name: "Psoriasis",
    keywords: ["psoriasis", "scaly skin", "red patches skin", "skin plaques", "silvery scales"],
    symptoms: { fever: false, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "low",
    advice: "Use prescribed topical treatments (corticosteroids, vitamin D analogues). Moisturise regularly. Phototherapy and biologics are options for severe cases. Manage stress triggers.",
    redFlags: ["psoriatic arthritis symptoms", "very widespread rash with fever", "skin peeling off (erythroderma)"],
    category: "dermatological"
  },
  {
    name: "Acne",
    keywords: ["acne", "pimples", "blackheads", "skin breakout", "zits", "cystic acne"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Wash face gently twice daily. OTC benzoyl peroxide or salicylic acid products help. Avoid squeezing pimples. See a dermatologist for persistent or severe acne (isotretinoin).",
    redFlags: ["severe cystic acne causing scarring", "signs of skin infection (warmth, fever)"],
    category: "dermatological"
  },
  {
    name: "Melanoma",
    keywords: ["melanoma", "skin cancer", "mole change", "dark spot skin", "irregular mole"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Use ABCDE: Asymmetry, Border irregularity, Colour variation, Diameter >6mm, Evolving shape/colour. See a dermatologist urgently. Early detection is critical for survival.",
    redFlags: ["rapidly changing mole", "mole that bleeds", "new dark irregular spot"],
    category: "dermatological"
  },
  {
    name: "Chickenpox",
    keywords: ["chickenpox", "chicken pox", "varicella", "itchy blisters", "blister rash"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "low",
    advice: "Use calamine lotion and antihistamines for itching. Avoid scratching blisters. Stay home until all blisters have crusted. Antiviral medication may be prescribed for high-risk individuals.",
    redFlags: ["blisters near eyes", "difficulty breathing", "severe headache or confusion", "bacterial infection of blisters"],
    category: "infectious"
  },
  {
    name: "Measles",
    keywords: ["measles", "morbilli", "koplik spots", "red rash fever", "rubeola"],
    symptoms: { fever: true, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "Isolate immediately — measles is highly contagious. See a doctor. Vitamin A supplementation is recommended. Stay hydrated and rest.",
    redFlags: ["seizures", "encephalitis symptoms", "severe breathing difficulty", "pneumonia signs"],
    category: "infectious"
  },
  {
    name: "Mumps",
    keywords: ["mumps", "swollen jaw", "parotid gland", "cheek swelling", "jaw pain swelling"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Rest and apply warm/cold compresses to swollen jaw. Pain relief with paracetamol. Eat soft foods. Isolate to prevent spread. See a doctor to confirm diagnosis.",
    redFlags: ["severe headache with stiff neck", "testicular swelling (men)", "hearing loss", "abdominal pain"],
    category: "infectious"
  },
  {
    name: "Dengue Fever",
    keywords: ["dengue", "dengue fever", "breakbone fever", "rash fever", "mosquito fever", "joint pain fever"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately. Rest and stay well-hydrated. Take paracetamol for fever — AVOID aspirin and ibuprofen (increase bleeding risk). Monitor for warning signs.",
    redFlags: ["bleeding gums or nose", "blood in vomit/stool", "severe abdominal pain", "rapid breathing", "cold clammy skin"],
    category: "infectious"
  },
  {
    name: "Malaria",
    keywords: ["malaria", "malaria fever", "cyclic fever", "chills sweating fever", "mosquito bite fever"],
    symptoms: { fever: true, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately for a blood test. Antimalarial medication must be started promptly. Stay hydrated. Prevent future infection with mosquito nets and repellent.",
    redFlags: ["altered consciousness", "seizures", "very high fever", "severe anaemia", "jaundice"],
    category: "infectious"
  },
  {
    name: "Typhoid Fever",
    keywords: ["typhoid", "typhoid fever", "enteric fever", "rose spots", "prolonged fever diarrhea"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor for antibiotic treatment. Stay hydrated with oral rehydration salts. Avoid solid foods initially. Maintain strict hygiene to prevent spread.",
    redFlags: ["intestinal perforation (sudden severe abdominal pain)", "bleeding", "encephalopathy"],
    category: "infectious"
  },
  {
    name: "Cholera",
    keywords: ["cholera", "rice water stool", "severe diarrhea", "massive dehydration", "watery diarrhea"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: true },
    urgency: "emergency",
    advice: "EMERGENCY: Seek medical care immediately. Start oral rehydration salts (ORS) right away. Severe cases need IV fluids and antibiotics in hospital.",
    redFlags: ["extreme dehydration", "sunken eyes", "no urine output", "confusion"],
    category: "infectious"
  },
  {
    name: "Ebola Virus",
    keywords: ["ebola", "hemorrhagic fever", "viral haemorrhagic"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "emergency",
    advice: "EMERGENCY: Call emergency services immediately. Isolate the patient. Ebola requires specialist hospital treatment with strict isolation protocols.",
    redFlags: ["all symptoms — this is a rare but life-threatening emergency"],
    category: "infectious"
  },
  {
    name: "Zika Virus",
    keywords: ["zika", "zika virus", "zika fever", "mosquito rash fever"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Rest and drink fluids. Paracetamol for fever. Avoid mosquito bites. Pregnant women should seek immediate medical advice — Zika can cause serious birth defects.",
    redFlags: ["pregnancy with Zika exposure", "Guillain-Barré syndrome symptoms (weakness, paralysis)"],
    category: "infectious"
  },
  {
    name: "HIV/AIDS",
    keywords: ["hiv", "aids", "hiv positive", "immunodeficiency", "antiretroviral"],
    symptoms: { fever: true, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately for testing and to start antiretroviral therapy (ART). With proper treatment, people with HIV live long, healthy lives. Avoid unprotected sex and needle sharing.",
    redFlags: ["opportunistic infections", "CD4 count below 200", "rapid unexplained weight loss", "severe infections"],
    category: "infectious"
  },
  {
    name: "Lyme Disease",
    keywords: ["lyme", "lyme disease", "tick bite", "bull's eye rash", "erythema migrans"],
    symptoms: { fever: true, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See a doctor if you had a tick bite and develop a bull's eye rash or flu-like symptoms. Antibiotics (doxycycline) are highly effective when started early.",
    redFlags: ["joint pain weeks after tick bite", "facial palsy", "heart palpitations", "neurological symptoms"],
    category: "infectious"
  },
  {
    name: "Rubella",
    keywords: ["rubella", "german measles", "rubella rash", "pink rash fever lymph nodes"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Rest and take paracetamol for fever. Isolate to prevent spread. Pregnant women must see a doctor urgently — rubella can cause serious fetal abnormalities.",
    redFlags: ["pregnancy exposure", "encephalitis symptoms", "bleeding disorders"],
    category: "infectious"
  },
  {
    name: "Sepsis",
    keywords: ["sepsis", "blood poisoning", "infection blood", "septic shock"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "emergency",
    advice: "EMERGENCY: Call 911/112 immediately. Sepsis progresses rapidly and requires IV antibiotics and fluids in hospital. Every hour of delay worsens outcomes.",
    redFlags: ["all symptoms — sepsis is life-threatening: high fever or low temperature, rapid heart rate, confusion"],
    category: "infectious"
  },
  {
    name: "Lung Cancer",
    keywords: ["lung cancer", "coughing blood", "haemoptysis", "lung tumour", "smoking cancer"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately for imaging (CT scan) and biopsy. Quit smoking now. Treatment depends on stage and type. Early detection greatly improves survival.",
    redFlags: ["coughing blood", "unexplained weight loss", "persistent cough worsening over weeks", "bone pain"],
    category: "oncological"
  },
  {
    name: "Liver Cancer",
    keywords: ["liver cancer", "hepatocellular", "liver tumour", "cancer liver"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "high",
    advice: "See a hepatologist or oncologist urgently. Treatment options include surgery, ablation, or targeted therapy. Regular screening is vital for those with cirrhosis or hepatitis B/C.",
    redFlags: ["upper right abdominal pain", "jaundice", "unexplained weight loss", "swollen abdomen"],
    category: "oncological"
  },
  {
    name: "Breast Cancer",
    keywords: ["breast cancer", "breast lump", "nipple discharge", "breast pain lump"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately for a mammogram and biopsy. Perform monthly self-exams. Treatment includes surgery, radiation, or chemotherapy. Early detection saves lives.",
    redFlags: ["new breast lump", "nipple inversion", "skin dimpling", "nipple discharge"],
    category: "oncological"
  },
  {
    name: "Colorectal Cancer",
    keywords: ["colorectal cancer", "colon cancer", "rectal cancer", "bowel cancer", "blood in stool"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Get a colonoscopy. See a gastroenterologist or oncologist. Symptoms like blood in stool, change in bowel habits, and weight loss need urgent investigation.",
    redFlags: ["blood in stool", "unexplained weight loss", "persistent change in bowel habits", "anaemia"],
    category: "oncological"
  },
  {
    name: "Pancreatic Cancer",
    keywords: ["pancreatic cancer", "pancreas cancer", "cancer pancreas", "jaundice weight loss"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor urgently. Pancreatic cancer is often detected late — any combination of jaundice, weight loss, and back pain needs immediate imaging.",
    redFlags: ["new-onset jaundice", "mid-back pain", "rapid weight loss", "new diabetes in older adults"],
    category: "oncological"
  },
  {
    name: "Lymphoma",
    keywords: ["lymphoma", "lymph node swelling", "hodgkin", "non hodgkin", "swollen lymph nodes"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "See a haematologist. Symptoms like persistent swollen lymph nodes, night sweats, and unexplained weight loss need urgent blood tests and biopsy.",
    redFlags: ["B symptoms: fever, night sweats, weight loss", "rapidly enlarging lymph nodes", "breathlessness"],
    category: "oncological"
  },
  {
    name: "Hypertensive Heart Disease",
    keywords: ["hypertensive heart disease", "heart disease blood pressure", "heart failure hypertension"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Control blood pressure aggressively with prescribed medication. Low-sodium diet, regular exercise, and no smoking are essential. Regular cardiac monitoring needed.",
    redFlags: ["chest pain", "severe breathlessness", "leg swelling", "rapid or irregular heartbeat"],
    category: "cardiovascular"
  },
  {
    name: "Atherosclerosis",
    keywords: ["atherosclerosis", "blocked arteries", "arterial plaque", "hardened arteries"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Heart-healthy diet (Mediterranean diet), regular exercise, and prescribed statins are key. Control blood pressure and blood sugar. Quit smoking immediately.",
    redFlags: ["chest pain on exertion", "leg pain while walking (claudication)", "stroke symptoms"],
    category: "cardiovascular"
  },
  {
    name: "Sleep Apnea",
    keywords: ["sleep apnea", "snoring", "stop breathing sleep", "cpap", "daytime sleepiness"],
    symptoms: { fever: true, cough: false, fatigue: true, breathingDifficulty: true },
    urgency: "moderate",
    advice: "See a doctor for a sleep study. CPAP therapy is highly effective. Lose weight if applicable. Sleep on your side. Avoid alcohol before bed.",
    redFlags: ["severe daytime sleepiness affecting driving/work", "heart rhythm problems", "morning headaches"],
    category: "respiratory"
  },
  {
    name: "Hypothyroidism",
    keywords: ["hypothyroidism", "underactive thyroid", "thyroid low", "fatigue weight gain cold", "tsh high"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Take levothyroxine as prescribed and consistently. Regular TSH blood tests to monitor levels. Avoid taking it with calcium or antacids. Weight and energy levels should improve with treatment.",
    redFlags: ["myxoedema coma (extreme hypothyroidism)", "severe slowing of all body functions"],
    category: "endocrine"
  },
  {
    name: "Hyperthyroidism",
    keywords: ["hyperthyroidism", "overactive thyroid", "thyroid high", "weight loss fast heart", "graves disease"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See an endocrinologist. Treatment options include antithyroid drugs, radioactive iodine, or surgery. Avoid excess iodine (seaweed). Beta-blockers can help symptoms while awaiting treatment.",
    redFlags: ["thyroid storm: extremely rapid heart rate, fever, confusion — EMERGENCY"],
    category: "endocrine"
  },
  {
    name: "Hyperglycemia",
    keywords: ["hyperglycemia", "high blood sugar", "glucose high", "diabetic ketoacidosis", "dka"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Check blood glucose immediately. If very high (over 300 mg/dL), seek medical care. Take prescribed insulin or medication. Drink water and avoid sugary foods.",
    redFlags: ["fruity breath", "extreme thirst with vomiting", "confusion (diabetic ketoacidosis or HHS)"],
    category: "metabolic"
  },
  {
    name: "Hypoglycemia",
    keywords: ["hypoglycemia", "low blood sugar", "glucose low", "sugar crash", "shakiness hunger"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Eat 15g of fast-acting carbohydrates (glucose tablets, juice, candy) immediately. Recheck blood sugar after 15 minutes. If unconscious, call emergency services immediately.",
    redFlags: ["loss of consciousness", "seizures", "unresponsive to glucose intake"],
    category: "metabolic"
  },
  {
    name: "Anemia",
    keywords: ["anemia", "anaemia", "low iron", "pale skin tired", "haemoglobin low", "iron deficiency"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Iron-rich foods (red meat, leafy greens, beans) and iron supplements help iron-deficiency anaemia. See a doctor to find the underlying cause. Vitamin B12 shots may be needed.",
    redFlags: ["very low haemoglobin (below 7)", "shortness of breath at rest", "heart palpitations"],
    category: "haematological"
  },
  {
    name: "Sickle Cell Anemia",
    keywords: ["sickle cell", "sickle cell anemia", "sickle cell disease", "vaso-occlusive crisis"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Stay hydrated, avoid extreme temperatures, and manage pain during crises. Take prescribed medications (hydroxyurea). See a haematologist regularly. Vaccinations are essential.",
    redFlags: ["sickle cell crisis (sudden severe pain)", "priapism", "stroke", "acute chest syndrome"],
    category: "haematological"
  },
  {
    name: "Polycystic Ovary Syndrome (PCOS)",
    keywords: ["pcos", "polycystic ovary", "irregular periods", "ovarian cysts", "hormonal imbalance"],
    symptoms: { fever: true, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "low",
    advice: "Maintain a healthy weight through diet and exercise. Metformin or hormonal contraceptives may be prescribed. Regular monitoring for diabetes and endometrial cancer is important.",
    redFlags: ["infertility concerns", "signs of insulin resistance", "unusual hair growth or hair loss"],
    category: "reproductive"
  },
  {
    name: "Endometriosis",
    keywords: ["endometriosis", "period pain severe", "pelvic pain", "pain during periods"],
    symptoms: { fever: true, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See a gynaecologist. Pain management with NSAIDs. Hormonal therapy (contraceptive pills) can reduce symptoms. Laparoscopy may be needed for diagnosis and treatment.",
    redFlags: ["severe pelvic pain", "painful intercourse", "infertility", "ovarian cyst rupture"],
    category: "reproductive"
  },
  {
    name: "Pneumothorax",
    keywords: ["pneumothorax", "collapsed lung", "sudden chest pain breathlessness", "sharp chest pain"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: true },
    urgency: "emergency",
    advice: "Go to the emergency room immediately. A collapsed lung requires urgent medical treatment (chest drain or needle aspiration).",
    redFlags: ["sudden sharp chest pain with breathlessness — this is a medical emergency"],
    category: "respiratory"
  },
  {
    name: "Tonsillitis",
    keywords: ["tonsillitis", "sore throat severe", "swollen tonsils", "strep throat", "white spots throat"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Rest, warm fluids, and salt water gargles. OTC pain relief helps. If bacterial (strep), antibiotics are needed. See a doctor if symptoms persist more than 5 days.",
    redFlags: ["difficulty swallowing or breathing", "drooling", "severe throat swelling (quinsy)"],
    category: "ENT"
  },
  {
    name: "Otitis Media (Ear Infection)",
    keywords: ["ear infection", "otitis media", "earache", "ear pain", "muffled hearing"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Paracetamol or ibuprofen for pain. Many ear infections resolve without antibiotics. See a doctor if pain is severe, persists beyond 3 days, or there is discharge from the ear.",
    redFlags: ["discharge from ear", "hearing loss", "dizziness", "swelling behind ear"],
    category: "ENT"
  },
  {
    name: "Conjunctivitis (Pink Eye)",
    keywords: ["conjunctivitis", "pink eye", "red eye", "eye discharge", "itchy red eye"],
    symptoms: { fever: false, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "low",
    advice: "Wash hands frequently. Use clean cloths for the eyes. Bacterial conjunctivitis needs antibiotic eye drops. Viral resolves on its own. Avoid contact lenses until healed.",
    redFlags: ["vision loss", "severe eye pain", "photophobia", "corneal involvement"],
    category: "ophthalmological"
  },
  {
    name: "Glaucoma",
    keywords: ["glaucoma", "eye pressure", "vision loss", "optic nerve", "peripheral vision loss"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See an ophthalmologist urgently. Eye drop medications lower pressure. Surgery or laser may be needed. Regular monitoring is essential — damage is irreversible.",
    redFlags: ["sudden eye pain with redness", "halos around lights", "nausea with eye pain (acute glaucoma)"],
    category: "ophthalmological"
  },
  {
    name: "Cataracts",
    keywords: ["cataracts", "cloudy vision", "blurry vision", "cataract surgery", "lens opacity"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "See an ophthalmologist. Cataract surgery is safe and highly effective. Wear UV-protective sunglasses. Stronger glasses may help temporarily.",
    redFlags: ["sudden vision change", "double vision", "significant impact on daily life"],
    category: "ophthalmological"
  },
  {
    name: "Dementia",
    keywords: ["dementia", "memory loss elderly", "cognitive decline", "vascular dementia", "lewy body"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See a neurologist or geriatrician for assessment. Cognitive stimulation, social engagement, and physical activity help. Caregiver support and a structured environment are vital.",
    redFlags: ["sudden worsening (stroke)", "delusions or hallucinations", "significant functional decline", "safety risks"],
    category: "neurological"
  },
  {
    name: "Cirrhosis",
    keywords: ["cirrhosis", "liver cirrhosis", "liver scarring", "ascites", "portal hypertension"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Avoid alcohol completely. Follow a low-sodium diet. See a hepatologist regularly. Liver transplant may be needed in advanced cases. Treat the underlying cause (hepatitis, alcohol).",
    redFlags: ["vomiting blood (variceal bleeding)", "confusion (hepatic encephalopathy)", "jaundice", "severe ascites"],
    category: "digestive"
  },
  {
    name: "Diverticulitis",
    keywords: ["diverticulitis", "diverticular disease", "left side abdominal pain", "bowel inflammation pouches"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "High-fibre diet prevents diverticulosis. During flares, a liquid diet and antibiotics (if prescribed) help. Avoid foods that trigger symptoms. See a doctor if pain is severe.",
    redFlags: ["severe abdominal pain", "fever with abdominal pain", "abscess or perforation signs"],
    category: "digestive"
  },
  {
    name: "Cholecystitis",
    keywords: ["cholecystitis", "gallbladder", "gallstone pain", "right upper abdomen", "fatty food pain"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor urgently. Cholecystitis often requires surgery (cholecystectomy). Avoid fatty foods. Do not take painkillers that might mask symptoms before diagnosis.",
    redFlags: ["severe right upper abdominal pain", "fever with abdominal pain", "jaundice", "rigid abdomen"],
    category: "digestive"
  },
  {
    name: "Hemorrhoids",
    keywords: ["hemorrhoids", "haemorrhoids", "piles", "rectal bleeding", "anal pain itching"],
    symptoms: { fever: false, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "low",
    advice: "High-fibre diet and plenty of water to soften stools. Sitz baths help. OTC creams reduce discomfort. See a doctor if significant bleeding or prolapse occurs.",
    redFlags: ["heavy rectal bleeding", "prolapse that can't be pushed back", "severe pain"],
    category: "digestive"
  },
  {
    name: "Kidney Cancer",
    keywords: ["kidney cancer", "renal cell carcinoma", "blood in urine mass", "renal cancer"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a urologist or oncologist immediately. Imaging (CT/MRI) and biopsy needed. Treatment may include surgery, targeted therapy, or immunotherapy.",
    redFlags: ["blood in urine (haematuria)", "flank pain", "palpable mass", "unexplained weight loss"],
    category: "oncological"
  },
  {
    name: "Bladder Cancer",
    keywords: ["bladder cancer", "blood in urine bladder", "painless hematuria", "bladder tumour"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Blood in urine (even once, painlessly) needs urgent investigation. See a urologist for cystoscopy. Smoking is the #1 risk factor — quit now.",
    redFlags: ["blood in urine (painless)", "frequent urination urgency", "pelvic pain"],
    category: "oncological"
  },
  {
    name: "Prostate Cancer",
    keywords: ["prostate cancer", "prostate", "psa high", "urinary symptoms men", "prostate tumour"],
    symptoms: { fever: true, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "high",
    advice: "See a urologist. PSA test and biopsy for diagnosis. Many prostate cancers grow slowly — discuss active surveillance vs. treatment with your doctor.",
    redFlags: ["bone pain", "blood in urine or semen", "urinary retention", "neurological symptoms"],
    category: "oncological"
  },
  {
    name: "Thyroid Cancer",
    keywords: ["thyroid cancer", "thyroid lump", "neck lump thyroid", "thyroid nodule"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See an endocrinologist or surgeon. Thyroid cancer has a very high survival rate when caught early. Ultrasound and fine-needle biopsy are key diagnostic tools.",
    redFlags: ["rapidly growing neck lump", "voice changes", "difficulty swallowing or breathing"],
    category: "oncological"
  },
  {
    name: "Ovarian Cancer",
    keywords: ["ovarian cancer", "ovarian tumour", "bloating pelvic pain", "ovarian cyst cancer"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a gynaecologist or oncologist urgently. Symptoms are vague — persistent bloating, pelvic pain, and urinary symptoms warrant investigation with ultrasound and CA-125.",
    redFlags: ["persistent unexplained bloating", "early satiety", "urinary frequency", "unexplained weight loss"],
    category: "oncological"
  },
  {
    name: "Esophageal Cancer",
    keywords: ["esophageal cancer", "oesophageal cancer", "difficulty swallowing", "dysphagia", "food stuck throat"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a gastroenterologist or oncologist urgently. Endoscopy is needed. Dysphagia (difficulty swallowing) that progresses is a red flag needing immediate investigation.",
    redFlags: ["progressive difficulty swallowing", "weight loss", "chest pain on swallowing"],
    category: "oncological"
  },
  {
    name: "Testicular Cancer",
    keywords: ["testicular cancer", "testicular lump", "testicle pain swelling", "scrotal lump"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a urologist immediately. Testicular cancer is highly treatable when caught early. Perform monthly self-exams. Do not delay evaluation of any testicular lump.",
    redFlags: ["painless testicular lump", "sudden collection of fluid in scrotum", "heaviness in lower abdomen"],
    category: "oncological"
  },
  {
    name: "Tuberculosis (TB)",
    keywords: ["tuberculosis", "tb", "pulmonary tuberculosis", "night sweats weight loss cough"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: true },
    urgency: "high",
    advice: "Seek medical attention immediately. TB requires at least 6 months of antibiotic treatment. It is contagious — isolate and wear a mask until cleared by a doctor.",
    redFlags: ["coughing blood", "rapid weight loss", "prolonged fever", "night sweats"],
    category: "infectious"
  },
  {
    name: "Polio",
    keywords: ["polio", "poliomyelitis", "paralysis sudden", "polio vaccine", "muscle weakness sudden"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately. There is no cure — only supportive treatment. Vaccination is the only prevention. Physiotherapy is important for rehabilitation.",
    redFlags: ["sudden muscle weakness or paralysis", "breathing difficulty from muscle weakness"],
    category: "infectious"
  },
  {
    name: "Tetanus",
    keywords: ["tetanus", "lockjaw", "muscle spasm wound", "jaw stiffness after wound"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "emergency",
    advice: "EMERGENCY: Go to hospital immediately. Tetanus antitoxin and antibiotics are needed. Vaccination is the key prevention — ensure your tetanus booster is up to date.",
    redFlags: ["jaw stiffness after wound", "muscle spasms", "difficulty swallowing", "breathing difficulty"],
    category: "infectious"
  },
  {
    name: "Rabies",
    keywords: ["rabies", "animal bite", "dog bite", "bat bite", "hydrophobia"],
    symptoms: { fever: true, cough: true, fatigue: false, breathingDifficulty: false },
    urgency: "emergency",
    advice: "EMERGENCY after ANY animal bite: Wash wound thoroughly with soap and water for 15 minutes. Go to hospital immediately for post-exposure prophylaxis (PEP) — it is 100% preventable if treated before symptoms start.",
    redFlags: ["any animal bite, especially wild animals or unvaccinated pets — do not wait for symptoms"],
    category: "infectious"
  },
  {
    name: "Hepatitis B",
    keywords: ["hepatitis b", "hbv", "hepatitis b virus", "liver inflammation b"],
    symptoms: { fever: false, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor for antiviral treatment if chronic. Get vaccinated (3-dose series) if not immune. Avoid sharing needles or unprotected sex. Monitor liver function regularly.",
    redFlags: ["jaundice", "severe fatigue", "dark urine", "liver failure signs"],
    category: "infectious"
  },
  {
    name: "Pneumocystis Pneumonia (PCP)",
    keywords: ["pcp pneumonia", "pneumocystis", "hiv pneumonia", "immunocompromised pneumonia"],
    symptoms: { fever: true, cough: true, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "PCP mainly affects immunocompromised individuals (HIV/AIDS, transplant patients). Seek urgent medical care. Treatment is trimethoprim-sulfamethoxazole (TMP-SMX).",
    redFlags: ["severe breathlessness", "low oxygen saturation", "rapid progression"],
    category: "infectious"
  },
  {
    name: "Chronic Kidney Disease",
    keywords: ["chronic kidney disease", "ckd", "renal disease chronic", "kidney function declining"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Protect remaining kidney function: control BP and blood sugar, avoid NSAIDs and contrast dyes. Low-protein diet as advised. Regular nephrologist visits. Dialysis planning if GFR falls below 15.",
    redFlags: ["sudden decrease in urine", "severe swelling", "confusion", "difficulty breathing (fluid overload)"],
    category: "urological"
  },
  {
    name: "Osteomyelitis",
    keywords: ["osteomyelitis", "bone infection", "infected bone", "bone pain fever"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "See a doctor immediately. Bone infection requires prolonged antibiotic therapy (4–6 weeks). Surgery may be needed to remove infected tissue. Early treatment prevents bone destruction.",
    redFlags: ["bone pain with fever", "swelling warmth over bone", "not improving with antibiotics"],
    category: "musculoskeletal"
  },
  {
    name: "Down Syndrome",
    keywords: ["down syndrome", "trisomy 21", "chromosomal condition"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Regular medical follow-up with multiple specialists (cardiologist, thyroid, eye, hearing). Early intervention therapies (speech, occupational, physiotherapy) are essential. Life expectancy continues to improve with good care.",
    redFlags: ["cardiac symptoms", "atlantoaxial instability signs (neck pain, weakness)", "thyroid symptoms"],
    category: "genetic"
  },
  {
    name: "Autism Spectrum Disorder (ASD)",
    keywords: ["autism", "asd", "autism spectrum", "social communication"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "low",
    advice: "Early diagnosis enables early intervention (behavioural therapy, speech therapy). Structure, routine, and sensory accommodations are key. Connect with specialist support services.",
    redFlags: ["regression of previously acquired skills", "safety concerns (wandering, self-harm)"],
    category: "neurodevelopmental"
  },
  {
    name: "Cerebral Palsy",
    keywords: ["cerebral palsy", "cp movement disorder", "spastic", "motor disability congenital"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: true },
    urgency: "low",
    advice: "Physiotherapy, occupational therapy, and speech therapy are the cornerstones of management. Orthopaedic interventions may help. Assistive devices improve independence.",
    redFlags: ["new motor regression (may indicate another condition)", "severe spasticity limiting function", "respiratory complications"],
    category: "neurodevelopmental"
  },
  {
    name: "Spina Bifida",
    keywords: ["spina bifida", "neural tube defect", "myelomeningocele"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Management involves a team of specialists. Folic acid before/during pregnancy prevents spina bifida. Mobility aids, bladder care, and regular neurosurgical monitoring are important.",
    redFlags: ["shunt malfunction signs (severe headache, vomiting, drowsiness)", "loss of function", "infection"],
    category: "neurodevelopmental"
  },
  {
    name: "Cystic Fibrosis",
    keywords: ["cystic fibrosis", "cf", "thick mucus lungs", "salty skin child", "chronic lung infection"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: true },
    urgency: "high",
    advice: "Regular physiotherapy (airway clearance), enzyme supplements, and inhaled medications are essential. CFTR modulators (e.g., Trikafta) have transformed outcomes. Regular monitoring at a CF centre is vital.",
    redFlags: ["severe pulmonary exacerbation", "haemoptysis", "pneumothorax", "liver disease"],
    category: "genetic"
  },
  {
    name: "Hemophilia",
    keywords: ["hemophilia", "haemophilia", "bleeding disorder", "clotting factor", "easy bruising bleeding"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "high",
    advice: "Clotting factor replacement therapy is essential. Avoid NSAIDs and aspirin (increase bleeding). Wear a medical alert bracelet. Seek emergency care for any significant injury.",
    redFlags: ["spontaneous joint bleeding (haemarthrosis)", "intracranial bleeding (headache, confusion)", "severe uncontrolled bleeding"],
    category: "haematological"
  },
  {
    name: "Muscular Dystrophy",
    keywords: ["muscular dystrophy", "duchenne", "muscle wasting", "progressive muscle weakness"],
    symptoms: { fever: false, cough: false, fatigue: true, breathingDifficulty: false },
    urgency: "moderate",
    advice: "Physiotherapy and assistive devices preserve function. Corticosteroids may slow progression. Regular cardiac and respiratory monitoring is essential. Gene therapy is emerging.",
    redFlags: ["rapid respiratory decline", "cardiac arrhythmias", "inability to walk", "aspiration pneumonia"],
    category: "neuromuscular"
  },
  {
    name: "Lyme Disease (chronic symptoms)",
    keywords: ["lyme disease", "post lyme", "chronic lyme", "tick bite joint pain fatigue"],
    symptoms: { fever: true, cough: false, fatigue: false, breathingDifficulty: false },
    urgency: "moderate",
    advice: "See a doctor if you had a tick bite and develop symptoms. Antibiotics (doxycycline or amoxicillin) are effective when given early. Post-treatment Lyme symptoms may persist.",
    redFlags: ["facial palsy", "heart block (palpitations, syncope)", "neurological symptoms weeks after tick bite"],
    category: "infectious"
  }
];

// Export for browser window and Node modules
if (typeof window !== 'undefined') {
  window.MEDISENSE_KB = MEDISENSE_KB;
}
if (typeof module !== 'undefined') {
  module.exports = { MEDISENSE_KB };
}
