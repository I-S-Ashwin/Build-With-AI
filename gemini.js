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

  getProfileContext() {
    try {
      const p = window.Storage ? window.Storage.getProfile() : JSON.parse(localStorage.getItem('medisense_profile') || 'null');
      if (!p) return '';
      const parts = [];
      if (p.name) parts.push(`Name: ${p.name}`);
      if (p.age) parts.push(`Age: ${p.age}`);
      if (p.gender) parts.push(`Gender: ${p.gender}`);
      if (p.bloodType && p.bloodType !== 'Unknown') parts.push(`Blood Type: ${p.bloodType}`);
      if (p.conditions && p.conditions.length > 0) parts.push(`Known Conditions: ${p.conditions.join(', ')}`);
      if (p.allergies) parts.push(`Allergies: ${p.allergies}`);
      if (p.medications) parts.push(`Current Medications: ${p.medications}`);
      return parts.length > 0 ? `\nPATIENT PROFILE CONTEXT: ${parts.join(' | ')}` : '';
    } catch (e) {
      return '';
    }
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
    const profileContext = this.getProfileContext();

    // Format conversation history for Gemini API
    const contents = [
      {
        role: 'user',
        parts: [{ text: `SYSTEM INSTRUCTIONS: ${this.SYSTEM_INSTRUCTION}${profileContext}` }]
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

  // ─── Advanced Clinical NLP & Context Dialogue State Machine ───
  localTriageFallback(userMessage, hadApiError = false) {
    const kb = (typeof MEDISENSE_KB !== 'undefined') ? MEDISENSE_KB : [];
    const profile = window.Storage ? window.Storage.getProfile() : null;

    if (window.ClinicalNLP && window.DifferentialEngine && window.DialogueManager) {
      // 1. Clinical Context & Negation Parsing (detects "no fever", durations, severities)
      const parsedContext = window.ClinicalNLP.parseContext(this.history, profile);

      // 2. Multi-Factor Differential Computation
      const differential = window.DifferentialEngine.compute(parsedContext, kb);

      // 3. Empathetic Dialogue State Tracking & Clinical Response Generation
      const generated = window.DialogueManager.generate(parsedContext, differential, this.questionCount);

      this.history.push({ role: 'model', text: generated.text });
      if (hadApiError) console.info('Clinical NLP Engine handled fallback response.');

      return this.parseResponseMetadata(generated.text);
    }

    // Direct fallback if NLP modules are still loading
    const fallbackText = `Thank you for sharing your symptoms. To help evaluate this safely, how long have you felt this way, and has it been getting worse?`;
    this.history.push({ role: 'model', text: fallbackText });
    return this.parseResponseMetadata(fallbackText);
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
