// MediSense — Gemini AI Triage Engine

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

  // Intelligent local triage fallback for offline / key-free exploration
  localTriageFallback(userMessage, hadApiError = false) {
    const fullConversation = this.history.map(m => m.text).join(' ').toLowerCase();
    let replyText = '';
    let isFinal = false;
    let outcome = 'ongoing';

    // Serious flag triggers (heart, sweating + unwell, severe pain, breathing)
    const seriousTriggers = ['sweat', 'sweating', 'chest', 'heart', 'faint', 'shortness of breath', 'numb', 'collapse', 'vomiting blood'];
    const isSerious = seriousTriggers.some(trigger => fullConversation.includes(trigger));

    // Minor cold/scratch triggers across full session context
    const isCold = fullConversation.includes('cold') || fullConversation.includes('cough') || fullConversation.includes('sneez') || fullConversation.includes('throat') || fullConversation.includes('runny') || fullConversation.includes('fever');
    const isScratch = fullConversation.includes('scratch') || fullConversation.includes('cut') || fullConversation.includes('scrape') || fullConversation.includes('bruise') || fullConversation.includes('wound') || fullConversation.includes('skin');

    if (isSerious) {
      replyText = `[DIAGNOSIS_DOCTOR] What you're experiencing—especially symptoms like profuse sweating, feeling acutely unwell, or chest discomfort—can be signs of a serious underlying condition. Please do not wait. You should be examined by a doctor or emergency clinic immediately.`;
      isFinal = true;
      outcome = 'see-doctor';
    } else if (this.questionCount === 1) {
      if (isCold) {
        replyText = `I hear you. Colds are frustrating to navigate when you're busy. Could you tell me: how many days have you had these symptoms, and do you currently have a high fever or body chills?`;
      } else if (isScratch) {
        replyText = `Let's take a look at that scrape. Is the skin actively bleeding, and is there any dirt or swelling around the scratch?`;
      } else {
        replyText = `Thank you for sharing that with me. To understand what's happening better: how long have you felt this way, and has it gotten steadily worse over today?`;
      }
    } else {
      // 2nd exchange -> Provide resolution
      if (isScratch) {
        replyText = `[DIAGNOSIS_HOME] For a mild scratch or surface graze: gently clean the area with mild soap and clean water, apply an antiseptic cream or petroleum jelly, and cover with a sterile bandage. If it becomes hot, swollen, or produces pus over the next few days, consult a physician.`;
        isFinal = true;
        outcome = 'home-remedy';
      } else if (isCold) {
        replyText = `[DIAGNOSIS_HOME] This aligns with a routine viral cold episode. The most effective course is warm fluids (herbal tea or broth), plenty of restorative sleep, and steam inhalation for congestion. Since you experience these occasionally, rest for 48 hours. If fever spikes over 101°F or persists past 7 days, check with your physician.`;
        isFinal = true;
        outcome = 'home-remedy';
      } else {
        replyText = `[DIAGNOSIS_DOCTOR] Based on what you've described, I am not confident providing a home remedy for this specific combination of symptoms. For your peace of mind and safety, please have a healthcare professional or local clinic evaluate this.`;
        isFinal = true;
        outcome = 'see-doctor';
      }
    }

    if (hadApiError) {
      console.info('Response handled via MediSense local safety fallback.');
    }

    this.history.push({ role: 'model', text: replyText });
    return this.parseResponseMetadata(replyText);
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
  }
};

window.GeminiService = GeminiService;
