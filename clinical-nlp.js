/**
 * MediSense Advanced Clinical NLP & Context Dialogue Engine
 * 
 * Capabilities:
 * 1. Negation Scope Parsing (correctly identifies "no fever", "without cough", "not dizzy")
 * 2. Clinical Entity Extraction (Duration, Pain Intensity, Quality, Triggers, Anatomical Locations)
 * 3. Multi-Factor Differential Diagnosis Scoring with Hallmark Penalty/Reward
 * 4. Contextual Mirroring & Empathetic Dialogue State Tracking
 * 5. Comprehensive Clinical Monographs with Primary & Secondary Considerations
 */

const ClinicalNLP = {
  // Common symptom definitions & associated variations
  SYMPTOM_DICTIONARY: {
    headache: ['headache', 'head ache', 'head pain', 'temple pain', 'throbbing head', 'migraine', 'pressure in head'],
    fever: ['fever', 'high temperature', 'chills', 'shivering', 'febrile', 'burning up', 'sweats and chills'],
    cough: ['cough', 'coughing', 'phlegm', 'mucus', 'hacking', 'clearing throat'],
    sore_throat: ['sore throat', 'throat pain', 'scratchy throat', 'pain swallowing', 'tonsil pain', 'strep'],
    runny_nose: ['runny nose', 'sneezing', 'congestion', 'blocked nose', 'stuffy nose', 'nasal drip', 'sinus pressure'],
    shortness_of_breath: ['shortness of breath', 'trouble breathing', 'breathless', 'wheezing', 'can\'t catch breath', 'winded', 'dyspnea'],
    chest_discomfort: ['chest pain', 'chest tightness', 'chest pressure', 'heavy chest', 'aching chest', 'heart pounding'],
    nausea_vomiting: ['nausea', 'vomiting', 'throwing up', 'sick to stomach', 'queasy', 'gagging'],
    diarrhea: ['diarrhea', 'loose stools', 'watery stool', 'stomach bug', 'upset stomach'],
    abdominal_pain: ['stomach pain', 'belly pain', 'abdominal pain', 'stomach ache', 'cramp in stomach', 'cramps'],
    dizziness: ['dizziness', 'lightheaded', 'spinning', 'vertigo', 'woozy', 'unsteady'],
    fatigue: ['fatigue', 'tired', 'exhausted', 'drained', 'no energy', 'weakness', 'lethargic'],
    skin_rash: ['rash', 'itchy skin', 'red spots', 'hives', 'blisters', 'bumps', 'dry skin', 'eczema patch'],
    joint_pain: ['joint pain', 'swollen joint', 'knee pain', 'wrist pain', 'finger pain', 'stiff joints', 'arthritis pain'],
    back_pain: ['back pain', 'lower back pain', 'stiff back', 'lumbar pain'],
    urinary_pain: ['burning urination', 'painful urination', 'peeing burns', 'frequent urination', 'uti pain'],
    eye_irritation: ['red eyes', 'itchy eyes', 'eye discharge', 'pink eye', 'watery eyes', 'eye strain'],
    wound_scratch: ['scratch', 'scrape', 'cut', 'graze', 'wound', 'abrasion', 'bleeding cut']
  },

  // Negation indicator prefixes
  NEGATION_PATTERNS: [
    /\bno\s+([a-z\s]+)/gi,
    /\bnot\s+([a-z\s]+)/gi,
    /\bwithout\s+([a-z\s]+)/gi,
    /\bdon'?t\s+have\s+([a-z\s]+)/gi,
    /\bdo\s+not\s+have\s+([a-z\s]+)/gi,
    /\bhaven'?t\s+had\s+([a-z\s]+)/gi,
    /\bzero\s+([a-z\s]+)/gi,
    /\bnever\s+had\s+([a-z\s]+)/gi,
    /\bdenies\s+([a-z\s]+)/gi,
    /\bnegative\s+for\s+([a-z\s]+)/gi
  ],

  // Duration matchers
  DURATION_PATTERNS: [
    /(?:for|over)\s+(?:the\s+past\s+|the\s+last\s+)?(\d+\s+(?:days?|weeks?|hours?|months?))/i,
    /(?:for|about)\s+(a\s+few\s+days|a\s+few\s+hours|a\s+couple\s+of\s+days|a\s+week)/i,
    /since\s+(yesterday|this\s+morning|last\s+night|2\s+days\s+ago|a\s+few\s+days\s+ago|last\s+week|earlier\s+today)/i,
    /(started|began)\s+(today|yesterday|this\s+morning|suddenly|gradually|after\s+lunch|after\s+waking\s+up)/i,
    /(\d+)\s+days?\s+now/i
  ],

  // Severity and quality matchers
  SEVERITY_PATTERNS: [
    /\b(throbbing|pounding|sharp|dull|aching|stabbing|crushing|burning|searing|cramping)\b/i,
    /\b(severe|intense|excruciating|terrible|unbearable|awful|really\s+bad)\b/i,
    /\b(mild|slight|moderate|manageable|nagging|intermittent)\b/i,
    /\b(getting\s+worse|escalating|steady|constant|comes\s+and\s+goes)\b/i
  ],

  // Triggers & Context
  TRIGGER_PATTERNS: [
    /(after\s+(?:eating|meals|food|dinner|lunch|breakfast))/i,
    /(after\s+(?:exercise|workout|running|playing\s+\w+))/i,
    /(worse\s+when\s+(?:lying\s+down|standing\s+up|bending|walking))/i,
    /(worse\s+with\s+(?:light|sound|screens|stress))/i,
    /(poor\s+sleep|lack\s+of\s+sleep|tired\s+from\s+work)/i
  ],

  // Critical red flag emergencies
  EMERGENCY_TRIGGERS: [
    { pattern: /\b(chest\s+pain|heart\s+attack|crushing\s+chest|radiating\s+to\s+arm)\b/i, label: 'Possible Cardiac Event' },
    { pattern: /\b(stroke|slurred\s+speech|face\s+droop|arm\s+numbness|sudden\s+weakness)\b/i, label: 'Possible Neurological Stroke' },
    { pattern: /\b(can'?t\s+breathe|gasping|severe\s+breathless|blue\s+lips|suffocating)\b/i, label: 'Acute Respiratory Distress' },
    { pattern: /\b(coughing\s+blood|vomiting\s+blood|blood\s+in\s+stool|black\s+tarry\s+stool)\b/i, label: 'Acute Hemorrhage' },
    { pattern: /\b(anaphylaxis|throat\s+closing|swollen\s+tongue|severe\s+hives\s+throat)\b/i, label: 'Acute Anaphylaxis' },
    { pattern: /\b(unconscious|fainted\s+and\s+fell|passed\s+out|seizure|convulsing)\b/i, label: 'Loss of Consciousness / Seizure' }
  ],

  /**
   * Main Parsing Pipeline: Analyzes conversation context with negation and clinical entities
   */
  parseContext(historyMessages, profile = null) {
    const fullText = historyMessages.map(m => m.text).join(' ');
    const lowerText = fullText.toLowerCase();

    // 1. Detect Negations
    const negatedSymptomKeys = new Set();
    const sentences = lowerText.split(/[.?!,;]+/);

    sentences.forEach(clause => {
      const trimmed = clause.trim();
      const hasNegationWord = /\b(no|not|without|don'?t\s+have|never|zero|denies)\b/i.test(trimmed);

      if (hasNegationWord) {
        for (const [symKey, keywords] of Object.entries(this.SYMPTOM_DICTIONARY)) {
          if (keywords.some(kw => trimmed.includes(kw))) {
            negatedSymptomKeys.add(symKey);
          }
        }
      }
    });

    // 2. Detect Positive Symptoms (Exclude negated ones!)
    const positiveSymptoms = [];
    for (const [symKey, keywords] of Object.entries(this.SYMPTOM_DICTIONARY)) {
      if (negatedSymptomKeys.has(symKey)) continue;

      const foundKw = keywords.find(kw => {
        // Ensure not part of a negated subclause
        const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
        return kwRegex.test(lowerText);
      });

      if (foundKw) {
        positiveSymptoms.push({
          key: symKey,
          matchedKeyword: foundKw,
          label: this.formatSymptomLabel(symKey)
        });
      }
    }

    // 3. Extract Duration
    let extractedDuration = null;
    for (const pat of this.DURATION_PATTERNS) {
      const match = lowerText.match(pat);
      if (match) {
        extractedDuration = match[1] || match[0];
        break;
      }
    }

    // 4. Extract Severity and Quality
    const extractedSeverities = [];
    for (const pat of this.SEVERITY_PATTERNS) {
      const match = lowerText.match(pat);
      if (match) {
        extractedSeverities.push(match[1]);
      }
    }

    // 5. Extract Triggers & Aggravating Factors
    const extractedTriggers = [];
    for (const pat of this.TRIGGER_PATTERNS) {
      const match = lowerText.match(pat);
      if (match) {
        extractedTriggers.push(match[1]);
      }
    }

    // 6. Check Emergency Flags
    const activeEmergencies = [];
    for (const em of this.EMERGENCY_TRIGGERS) {
      if (em.pattern.test(lowerText)) {
        activeEmergencies.push(em.label);
      }
    }

    // 7. Negated readable labels for clinical reflection
    const negatedLabels = Array.from(negatedSymptomKeys).map(k => this.formatSymptomLabel(k));

    return {
      positiveSymptoms,
      negatedSymptoms: Array.from(negatedSymptomKeys),
      negatedLabels,
      duration: extractedDuration,
      severities: extractedSeverities,
      triggers: extractedTriggers,
      emergencies: activeEmergencies,
      rawText: lowerText,
      profile: profile || {}
    };
  },

  formatSymptomLabel(key) {
    const map = {
      headache: 'headache or head pressure',
      fever: 'fever or chills',
      cough: 'coughing or phlegm',
      sore_throat: 'sore throat',
      runny_nose: 'nasal congestion / runny nose',
      shortness_of_breath: 'breathing difficulty',
      chest_discomfort: 'chest discomfort',
      nausea_vomiting: 'nausea or vomiting',
      diarrhea: 'diarrhea or loose stools',
      abdominal_pain: 'abdominal pain',
      dizziness: 'dizziness or lightheadedness',
      fatigue: 'fatigue or exhaustion',
      skin_rash: 'rash or skin irritation',
      joint_pain: 'joint pain or stiffness',
      back_pain: 'back discomfort',
      urinary_pain: 'painful urination',
      eye_irritation: 'eye irritation',
      wound_scratch: 'surface cut or scrape'
    };
    return map[key] || key.replace(/_/g, ' ');
  }
};

/**
 * Multi-Factor Differential Diagnosis Scoring Engine
 */
const DifferentialEngine = {
  compute(parsedContext, kb = []) {
    const posKeys = new Set(parsedContext.positiveSymptoms.map(s => s.key));
    const negKeys = new Set(parsedContext.negatedSymptoms);
    const profile = parsedContext.profile || {};
    const knownConditions = (profile.conditions || []).map(c => c.toLowerCase());

    const scores = kb.map(condition => {
      let score = 0;
      let matchedFeatures = [];

      // A. Keyword matching in condition keywords
      condition.keywords.forEach(kw => {
        const kwLower = kw.toLowerCase();
        if (parsedContext.rawText.includes(kwLower)) {
          // Check if this keyword is part of a negated symptom
          const isNegated = Array.from(negKeys).some(nk => kwLower.includes(nk));
          if (!isNegated) {
            score += 3.5;
            matchedFeatures.push(kw);
          }
        }
      });

      // B. Symptom Signatures (Hallmark Reward & Negation Penalty)
      const s = condition.symptoms || {};

      // Fever
      if (s.fever) {
        if (posKeys.has('fever')) {
          score += 2.5;
          matchedFeatures.push('Fever');
        } else if (negKeys.has('fever')) {
          score -= 3.5; // Significant penalty if condition requires fever but patient denied it!
        }
      }

      // Cough
      if (s.cough) {
        if (posKeys.has('cough')) {
          score += 2.5;
          matchedFeatures.push('Cough');
        } else if (negKeys.has('cough')) {
          score -= 3.0; // Penalty if patient explicitly denied cough
        }
      }

      // Breathing difficulty
      if (s.breathingDifficulty) {
        if (posKeys.has('shortness_of_breath')) {
          score += 3.5;
          matchedFeatures.push('Breathing Difficulty');
        } else if (negKeys.has('shortness_of_breath')) {
          score -= 3.5;
        }
      }

      // Fatigue
      if (s.fatigue) {
        if (posKeys.has('fatigue')) {
          score += 1.5;
          matchedFeatures.push('Fatigue');
        }
      }

      // C. Specific hallmark boosters
      // Migraine specific
      if (condition.name === 'Migraine') {
        if (posKeys.has('headache')) score += 3.0;
        if (parsedContext.severities.some(sev => /throbbing|pulsing|light|sound/i.test(sev))) score += 3.0;
      }

      // Common cold specific
      if (condition.name === 'Common Cold') {
        if (posKeys.has('runny_nose') || posKeys.has('sore_throat')) score += 3.0;
        if (negKeys.has('fever')) score += 1.5; // Cold often presents with minimal/no high fever
      }

      // Gastroenteritis specific
      if (condition.name === 'Gastroenteritis') {
        if (posKeys.has('nausea_vomiting') || posKeys.has('diarrhea') || posKeys.has('abdominal_pain')) score += 4.0;
      }

      // Allergic rhinitis specific
      if (condition.name === 'Allergic Rhinitis') {
        if (posKeys.has('runny_nose') || posKeys.has('eye_irritation')) score += 3.5;
        if (negKeys.has('fever')) score += 2.0;
      }

      // D. Patient Chronic Profile Booster
      if (knownConditions.some(kc => condition.name.toLowerCase().includes(kc) || kc.includes(condition.name.toLowerCase()))) {
        score += 3.0;
        matchedFeatures.push('Matches Patient Chronic Profile');
      }

      return {
        condition,
        score: Math.max(0, score),
        matchedFeatures
      };
    });

    // Sort descending
    scores.sort((a, b) => b.score - a.score);

    const primary = scores[0] && scores[0].score >= 3.5 ? scores[0] : null;
    
    // Find a distinct secondary differential (preferably different category or distinct pathology)
    let secondary = null;
    if (primary && scores.length > 1) {
      for (let i = 1; i < scores.length; i++) {
        if (scores[i].score >= 2.5 && scores[i].condition.name !== primary.condition.name) {
          secondary = scores[i];
          break;
        }
      }
    }

    return {
      primary: primary ? primary.condition : null,
      primaryScore: primary ? primary.score : 0,
      primaryFeatures: primary ? primary.matchedFeatures : [],
      secondary: secondary ? secondary.condition : null,
      secondaryScore: secondary ? secondary.score : 0
    };
  }
};

/**
 * Empathetic Dialogue State Tracker & Clinical Response Generator
 */
const DialogueManager = {
  generate(parsedContext, differential, questionCount) {
    // 1. EMERGENCY OVERRIDE
    if (parsedContext.emergencies.length > 0) {
      const redReasons = parsedContext.emergencies.join(', ');
      return {
        text: `[DIAGNOSIS_DOCTOR] 🚨 **URGENT EMERGENCY CARE REQUIRED**\n\nYou reported clinical red flags (${redReasons}). This indicates a potential acute medical crisis. \n\n**Action Steps:**\n• Call emergency responders (911 or 112) immediately.\n• If experiencing chest pressure or severe breathlessness, rest upright and do not exert yourself.\n• Do not wait for symptoms to resolve on their own.`,
        isFinal: true,
        outcome: 'see-doctor'
      };
    }

    // 2. EXCHANGE 1: Attentive Clinical Reflection & Focused Follow-Up
    if (questionCount === 1) {
      return this.buildFirstExchange(parsedContext, differential);
    }

    // 3. EXCHANGE 2+: Comprehensive Clinical Synthesis & Triage Card
    return this.buildDiagnosisSynthesis(parsedContext, differential);
  },

  /**
   * Builds empathetic first response: quotes context, confirms negations, asks ONE focused question
   */
  buildFirstExchange(ctx, diff) {
    // 1. Empathetic Opening & Contextual Mirroring
    let mirrorText = '';
    const posItems = ctx.positiveSymptoms.map(s => s.label);

    if (posItems.length > 0) {
      const symptomList = this.joinGrammatically(posItems);
      
      let durationPart = '';
      if (ctx.duration) {
        if (/^(since|for|over)\b/i.test(ctx.duration)) {
          durationPart = ` ${ctx.duration}`;
        } else if (/^(yesterday|this\s+morning|last\s+night|today)\b/i.test(ctx.duration)) {
          durationPart = ` since ${ctx.duration}`;
        } else {
          durationPart = ` present for about ${ctx.duration}`;
        }
      }

      let severityPart = '';
      if (ctx.severities.length > 0) {
        severityPart = ` (described as ${this.joinGrammatically(ctx.severities)})`;
      }

      mirrorText = `I hear you clearly. You're dealing with **${symptomList}**${durationPart}${severityPart}.`;
    } else {
      mirrorText = `Thank you for sharing how you're feeling.`;
    }

    // Acknowledge negated symptoms
    if (ctx.negatedLabels.length > 0) {
      const negList = this.joinGrammatically(ctx.negatedLabels);
      mirrorText += ` I've also noted that you **do not** have ${negList}, which is an important clinical negative.`;
    }

    // 2. Focused Clinical Inquiry (Tailored to top differential without prematurely naming)
    let clinicalQuestion = '';
    const top = diff.primary;

    if (top) {
      switch (top.category) {
        case 'respiratory':
          clinicalQuestion = `To help evaluate if this is an upper airway viral issue or spreading deeper: have you noticed any difficulty taking a full deep breath, or is there any discolored phlegm?`;
          break;
        case 'neurological':
          clinicalQuestion = `To better assess this head pain: is it sensitive to light, sound, or movement, and did it come on gradually or abruptly like a thunderclap?`;
          break;
        case 'digestive':
          clinicalQuestion = `To evaluate your gastrointestinal balance: are you able to keep sips of water or liquids down, and is there any sharp localized stomach pain?`;
          break;
        case 'dermatological':
          clinicalQuestion = `Regarding the skin: is the irritation hot to the touch, rapidly expanding, or accompanied by any swelling of the lips or face?`;
          break;
        case 'cardiovascular':
          clinicalQuestion = `Because chest and circulatory comfort are critical: is the sensation a sharp pinch or a dull squeezing pressure, and does it spread to your shoulder, jaw, or neck?`;
          break;
        case 'musculoskeletal':
          clinicalQuestion = `To understand this joint or muscular discomfort: did it follow a specific physical strain or awkward twist, and does gentle rest relieve it?`;
          break;
        default:
          clinicalQuestion = `To help calibrate the safest advice: how is this symptom impacting your ability to eat, drink, or rest today, and has it been getting steadily worse?`;
      }
    } else {
      clinicalQuestion = `To help me narrow this down: how long have you felt this way, and are there any other associated sensations you've noticed?`;
    }

    const reply = `${mirrorText}\n\n${clinicalQuestion}`;
    return {
      text: reply,
      isFinal: false,
      outcome: 'ongoing'
    };
  },

  /**
   * Builds Exchange 2: Full Clinical Synthesis, Differential Reasoning, Non-Pharm Home Care & Red Flags
   */
  buildDiagnosisSynthesis(ctx, diff) {
    const primary = diff.primary;
    const secondary = diff.secondary;

    // Safety fallback if no clear match
    if (!primary) {
      return {
        text: `[DIAGNOSIS_DOCTOR] **Clinical Assessment: Undifferentiated Presentation**\n\nBased on the combination of symptoms and duration you've described, this pattern does not match a clear-cut self-limiting routine illness in my clinical database.\n\n**Recommendation:**\nBecause atypical symptom presentations deserve cautious in-person physical evaluation, please have a physician or local clinic examine you to identify the root cause.\n\n**General Support:**\n• Rest, avoid strenuous exertion, and stay hydrated with clear fluids.\n• Monitor your temperature and seek urgent care if new or sharp pain develops.`,
        isFinal: true,
        outcome: 'see-doctor'
      };
    }

    // Determine Urgency & Triage Tag
    const isEmergency = primary.urgency === 'emergency';
    const isDoctor = ['emergency', 'high'].includes(primary.urgency);
    const prefix = isDoctor ? '[DIAGNOSIS_DOCTOR]' : '[DIAGNOSIS_HOME]';

    // Tailored Clinical Rationale
    let rationale = '';
    const posList = ctx.positiveSymptoms.map(s => s.label);
    const posSummary = posList.length > 0 ? this.joinGrammatically(posList) : 'your reported symptoms';
    
    let durationNote = '';
    if (ctx.duration) {
      if (/^(since|for|over)\b/i.test(ctx.duration)) {
        durationNote = ` ${ctx.duration}`;
      } else if (/^(yesterday|this\s+morning|last\s+night|today)\b/i.test(ctx.duration)) {
        durationNote = ` since ${ctx.duration}`;
      } else {
        durationNote = ` over the past ${ctx.duration}`;
      }
    }

    if (isDoctor) {
      rationale = `⚕️ **Clinical Referral Directed:** Based on ${posSummary}${durationNote}, this profile aligns most closely with **${primary.name}**. Due to the potential for complication or need for targeted prescription therapy, an in-person medical evaluation is recommended within the next 24 to 48 hours.`;
    } else {
      rationale = `✅ **Home Care Appropriate:** Your description of ${posSummary}${durationNote} is characteristic of a benign, self-limiting episode consistent with **${primary.name}**. With attentive supportive care, symptoms typically run their course.`;
    }

    // Differential Consideration Block
    let diffBlock = '';
    if (secondary && secondary.name !== primary.name) {
      diffBlock = `\n\n**Also Considered (Differential):**\n• **${secondary.name}**: An alternative possibility if symptoms persist or if secondary triggers are involved.`;
    }

    // Tailored Non-Pharmacological Regimen
    const homeCare = this.generateHomeCareGuidance(primary, ctx);

    // Red Flags
    const redFlagsList = (primary.redFlags && primary.redFlags.length > 0)
      ? primary.redFlags.slice(0, 4).map(rf => `• ${rf}`).join('\n')
      : `• High fever persisting beyond 3 days\n• Severe or sharp escalation in pain\n• Difficulty swallowing or labored breathing`;

    const fullResponse = `${prefix} **Clinical Triage Evaluation**\n\n${rationale}${diffBlock}\n\n**Recommended Evidence-Based Self-Care:**\n${homeCare}\n\n**Critical Red Flags (Escalate to Doctor / Clinic):**\n${redFlagsList}`;

    return {
      text: fullResponse,
      isFinal: true,
      outcome: isDoctor ? 'see-doctor' : 'home-remedy'
    };
  },

  /**
   * Synthesizes clinically practical non-pharmacological care
   */
  generateHomeCareGuidance(primary, ctx) {
    const advice = primary.advice || 'Rest, hydrate, and monitor symptoms.';
    const cat = primary.category || 'general';

    let practicalSteps = [];

    switch (cat) {
      case 'respiratory':
        practicalSteps.push('• **Hydration & Airway Care:** Drink warm broths, herbal teas with honey (if over 1 yr old), and use a cool-mist humidifier or steam inhalation to ease airways.');
        practicalSteps.push('• **Rest & Positioning:** Sleep with your head slightly elevated on an extra pillow to prevent post-nasal drip from triggering nocturnal cough.');
        practicalSteps.push('• **Supportive Comfort:** Saline nasal sprays or rinses help flush irritants. Over-the-counter pain relief (such as paracetamol/acetaminophen) can help ease body aches.');
        break;
      case 'neurological':
        practicalSteps.push('• **Environmental Reduction:** Rest in a dark, quiet, temperature-controlled room with minimal screen or sensory exposure.');
        practicalSteps.push('• **Compresses:** Apply a cool, damp compress across forehead or temples, or a warm heating pad to back of neck if muscle tension is present.');
        practicalSteps.push('• **Hydration:** Sip room-temperature electrolyte fluids; mild dehydration is one of the most common headache amplifiers.');
        break;
      case 'digestive':
        practicalSteps.push('• **Gut Rest & Rehydration:** Sip small, frequent amounts of Oral Rehydration Salts (ORS) or electrolyte solutions. Avoid chugging fluids.');
        practicalSteps.push('• **Gradual Food Reintroduction:** Once nausea settles, stick to bland, low-fiber foods (rice, plain toast, bananas, applesauce). Avoid dairy, caffeine, and fatty foods.');
        break;
      case 'dermatological':
        practicalSteps.push('• **Barrier Protection:** Keep the affected skin clean with gentle, unscented soap and lukewarm water. Apply a fragrance-free barrier moisturizer.');
        practicalSteps.push('• **Itch Management:** Use cool, damp compresses. Avoid hot showers and resist scratching to prevent secondary bacterial infection.');
        break;
      case 'musculoskeletal':
        practicalSteps.push('• **P.R.I.C.E. Principle:** Protect the area, Rest from strenuous impact, Apply Ice (15 mins on/off) for the first 48 hours, and Elevate if swollen.');
        practicalSteps.push('• **Gentle Mobilization:** Avoid strict bed rest; gentle, pain-free range of motion prevents joint stiffness.');
        break;
      default:
        practicalSteps.push(`• **General Regimen:** ${advice}`);
        practicalSteps.push('• **Restorative Rest:** Prioritize 8+ hours of uninterrupted sleep to support immune function.');
    }

    return practicalSteps.join('\n');
  },

  joinGrammatically(arr) {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
  }
};

// Global export for MediSense
window.ClinicalNLP = ClinicalNLP;
window.DifferentialEngine = DifferentialEngine;
window.DialogueManager = DialogueManager;
