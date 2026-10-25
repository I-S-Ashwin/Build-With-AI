// MediSense — Gemini AI Triage Engine
// Knowledge Base is loaded from knowledge-base.js (116 conditions from Kaggle dataset)

const GeminiService = {
  history: [], // [{ role: 'user'|'model', text: '...' }]
  questionCount: 0,

  SYSTEM_INSTRUCTION: `You are MediSense, a calm, attentive, and helpful personal healthcare triage assistant.
Your goal is to understand the user's symptoms and guide them appropriately.
GUIDELINES:
1. Tone: Warm, reassuring, conversational, and philosophical "wanderer" style—like an experienced, calm friend.
2. Follow-up: Ask ONLY ONE follow-up question at a time to clarify duration, severity, or related symptoms.
3. Length: Keep questions and suggestions brief, focused, and scannable (2-3 sentences max).
4. Triage Outcome: After 1 to 2 follow-ups (or immediately if symptoms sound critical like chest pain, severe sweating, sudden numbness, or shortness of breath):
   - If MINOR (cold, mild scratch, minor ache): Provide a clear home remedy suggestion (rest, hydration, basic wound care). Prefix the final summary line with [DIAGNOSIS_HOME].
   - If SERIOUS or UNCERTAIN: Provide a firm, calm directive to see a doctor or visit urgent care immediately. Prefix the final summary line with [DIAGNOSIS_DOCTOR].
5. Never provide prescription medication advice. Never claim to give a certified medical diagnosis. Always prioritize user safety.`,

  getApiKey() {
    const configKey = window.MEDISENSE_CONFIG && window.MEDISENSE_CONFIG.GEMINI_API_KEY;
    const localKey = localStorage.getItem('medisense_gemini_key');
    return (localKey && localKey.trim()) || (configKey && configKey.trim()) || '';
  },

  setApiKey(key) {
    localStorage.setItem('medisense_gemini_key', key.trim());
  },

  resetSession() {
    this.history = [];
    this.questionCount = 0;
  },

  async sendMessage(userMessage) {
    this.history.push({ role: 'user', text: userMessage });
    this.questionCount++;

    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        return await this.callGeminiAPI(apiKey);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local triage heuristics:', err);
        return this.localTriageFallback(userMessage, true);
      }
    } else {
      // Local fallback mode when no key is entered yet
      return this.localTriageFallback(userMessage, false);
    }
  },

  async callGeminiAPI(apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Format conversation history for Gemini API
    const contents = [
      {
        role: 'user',
        parts: [{ text: `SYSTEM INSTRUCTIONS: ${this.SYSTEM_INSTRUCTION}` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am MediSense, ready to provide calm, safe healthcare triage.' }]
      }
    ];

    this.history.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 250
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Empty response received from Gemini.');
    }

    const botResponse = candidateText.trim();
    this.history.push({ role: 'model', text: botResponse });

    return this.parseResponseMetadata(botResponse);
  },

  // ─── Knowledge-Base Powered Local Triage (116 diseases from Kaggle dataset) ───
  localTriageFallback(userMessage, hadApiError = false) {
    const fullConversation = this.history.map(m => m.text).join(' ').toLowerCase();
    const kb = (typeof MEDISENSE_KB !== 'undefined') ? MEDISENSE_KB : [];

    // ── Emergency override: always escalate for these triggers ──
    const emergencyTriggers = [
      'chest pain', 'heart attack', 'stroke', 'collapse', 'vomiting blood',
      'coughing blood', 'blood in stool', 'seizure', 'unconscious', 'can\'t breathe',
      'not breathing', 'shortness of breath severe', 'severe bleeding', 'anaphylaxis',
      'blue lips', 'cholera', 'sepsis', 'appendicitis', 'tetanus', 'rabies', 'ebola'
    ];
    const isEmergency = emergencyTriggers.some(t => fullConversation.includes(t));
    if (isEmergency) {
      const reply = `[DIAGNOSIS_DOCTOR] ⚠️ EMERGENCY: What you've described could be a life-threatening emergency. Please call emergency services (911 or 112) immediately or have someone take you to the nearest emergency room right now. Do not wait.`;
      this.history.push({ role: 'model', text: reply });
      return this.parseResponseMetadata(reply);
    }

    // ── Score each condition in the knowledge base ──
    const scores = kb.map(condition => {
      let score = 0;
      const text = fullConversation;

      // Keyword matching (primary signal)
      condition.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) score += 3;
      });

      // Symptom signals from conversation
      if (condition.symptoms.fever && (text.includes('fever') || text.includes('temperature') || text.includes('hot'))) score += 2;
      if (condition.symptoms.cough && (text.includes('cough') || text.includes('coughing'))) score += 2;
      if (condition.symptoms.fatigue && (text.includes('tired') || text.includes('fatigue') || text.includes('exhausted') || text.includes('weak'))) score += 2;
      if (condition.symptoms.breathingDifficulty && (text.includes('breath') || text.includes('wheez') || text.includes('breathing'))) score += 2;

      return { condition, score };
    });

    // Sort by score, best match first
    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];
    const hasMatch = best && best.score >= 3;

    // ── First message: ask one follow-up question ──
    if (this.questionCount === 1) {
      if (hasMatch) {
        const c = best.condition;
        // Pick a smart follow-up based on what we already know
        const followUps = {
          respiratory: `How long have you had these symptoms, and is there any fever or difficulty breathing?`,
          cardiovascular: `Is the discomfort constant or does it come and go? Any sweating, dizziness, or pain spreading to your arm or jaw?`,
          digestive: `Are you experiencing any nausea, vomiting, or changes in your bowel movements?`,
          neurological: `Is this a new symptom or something that's been happening before? Any visual disturbances or weakness?`,
          musculoskeletal: `Is the pain localised to one area, and does it worsen with movement? Any recent injury?`,
          dermatological: `Is the rash spreading, and is there any itching, pain, or associated fever?`,
          mental_health: `How long have you felt this way, and is it affecting your daily life or sleep?`,
          metabolic: `Do you have a history of diabetes or thyroid conditions? When did these symptoms start?`,
          urological: `Is there any pain or burning when you urinate, or any blood in your urine?`,
          infectious: `Have you been in contact with anyone ill, or recently travelled to a different region?`,
          default: `How long have you been experiencing this, and has it been getting worse over time?`
        };
        const question = followUps[c.category] || followUps.default;
        const reply = `Based on what you've shared, this could be related to **${c.name}**. To give you better guidance — ${question}`;
        this.history.push({ role: 'model', text: reply });
        if (hadApiError) console.info('Local KB triage: first exchange.');
        return this.parseResponseMetadata(reply);
      } else {
        const reply = `Thank you for sharing that with me. To understand what's happening better: how long have you felt this way, and has it been getting steadily worse?`;
        this.history.push({ role: 'model', text: reply });
        return this.parseResponseMetadata(reply);
      }
    }

    // ── Second message: deliver the diagnosis ──
    if (hasMatch) {
      const c = best.condition;
      const isHighUrgency = ['high', 'emergency'].includes(c.urgency);
      const isMedUrgency = c.urgency === 'moderate';

      // Format red flags list
      const redFlagsList = c.redFlags.slice(0, 3).map(f => `• ${f}`).join('\n');

      let prefix, urgencyNote;
      if (c.urgency === 'emergency') {
        prefix = '[DIAGNOSIS_DOCTOR]';
        urgencyNote = `🚨 **This requires emergency care.** Please call 911/112 or go to the ER immediately.`;
      } else if (isHighUrgency) {
        prefix = '[DIAGNOSIS_DOCTOR]';
        urgencyNote = `⚕️ **Please see a doctor soon** — ideally within 24 hours.`;
      } else if (isMedUrgency) {
        prefix = '[DIAGNOSIS_DOCTOR]';
        urgencyNote = `👨‍⚕️ **Consider seeing a doctor** if symptoms persist or worsen.`;
      } else {
        prefix = '[DIAGNOSIS_HOME]';
        urgencyNote = `✅ **This can likely be managed at home**, but monitor closely.`;
      }

      const reply = `${prefix} Based on your symptoms, this appears consistent with **${c.name}**.\n\n${urgencyNote}\n\n**What to do:** ${c.advice}\n\n**Watch out for (see a doctor if any appear):**\n${redFlagsList}`;
      this.history.push({ role: 'model', text: reply });
      if (hadApiError) console.info('Local KB triage: diagnosis delivered.');
      return this.parseResponseMetadata(reply);
    }

    // ── Fallback if nothing matched ──
    const reply = `[DIAGNOSIS_DOCTOR] Based on what you've described, I wasn't able to confidently match this to a specific condition in my local knowledge base. For your safety, please consult a healthcare professional or local clinic who can properly evaluate your symptoms.`;
    this.history.push({ role: 'model', text: reply });
    return this.parseResponseMetadata(reply);
  },

  parseResponseMetadata(rawText) {
    let cleanText = rawText;
    let isFinal = false;
    let outcome = 'ongoing'; // 'home-remedy' | 'see-doctor' | 'ongoing'

    if (rawText.includes('[DIAGNOSIS_HOME]')) {
      cleanText = rawText.replace(/\[DIAGNOSIS_HOME\]/g, '').trim();
      isFinal = true;
      outcome = 'home-remedy';
    } else if (rawText.includes('[DIAGNOSIS_DOCTOR]')) {
      cleanText = rawText.replace(/\[DIAGNOSIS_DOCTOR\]/g, '').trim();
      isFinal = true;
      outcome = 'see-doctor';
    } else if (rawText.toLowerCase().includes('see a doctor') || rawText.toLowerCase().includes('emergency') || rawText.toLowerCase().includes('urgent care')) {
      isFinal = true;
      outcome = 'see-doctor';
    } else if (this.questionCount >= 3 && !rawText.includes('?')) {
      isFinal = true;
      outcome = 'home-remedy';
    }

    return {
      text: cleanText,
      isFinal,
      outcome,
      raw: rawText
    };
  },

  // Direct Audio Processing via Gemini 1.5 Flash Multimodal Audio API
  async sendAudioRecording(base64Audio, mimeType = 'audio/webm') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        userSpokenText: 'Spoken Audio Recording',
        reply: {
          text: 'To let Gemini listen to your real voice recording directly, please paste your free Gemini API key into the "🔑 API Key" button in the top right!',
          isFinal: false,
          outcome: 'ongoing'
        }
      };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: `SYSTEM INSTRUCTIONS: ${this.SYSTEM_INSTRUCTION}\nListen to this patient's audio recording. First, transcribe their exact words in the format [TRANSCRIPT: <words spoken>]. Then on the next line, provide your triage assessment or single follow-up question per the system rules.` },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Audio
            }
          }
        ]
      }
    ];

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 350
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini Audio Error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let userSpokenText = 'Audio consultation';
    let replyText = candidateText;

    const transcriptMatch = candidateText.match(/\[TRANSCRIPT:\s*(.*?)\]/i);
    if (transcriptMatch) {
      userSpokenText = transcriptMatch[1].trim();
      replyText = candidateText.replace(/\[TRANSCRIPT:\s*.*?\]/i, '').trim();
    }

    this.history.push({ role: 'user', text: userSpokenText });
    this.history.push({ role: 'model', text: replyText });
    this.questionCount++;

    return {
      userSpokenText,
      reply: this.parseResponseMetadata(replyText)
    };
  }
};

window.GeminiService = GeminiService;
