// MediSense — Enhanced Voice Recognition & Microphone Level Visualizer

const VoiceService = {
  recognition: null,
  isRecording: false,
  transcript: '',
  audioStream: null,
  audioContext: null,
  analyser: null,
  animFrameId: null,
  onTranscriptChange: null,
  onRecordingStateChange: null,
  onError: null,

  async initAudioMeter() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const meterEl = document.getElementById('mic-volume-bar');

      const checkVolume = () => {
        if (!this.isRecording) {
          if (meterEl) meterEl.style.width = '0%';
          return;
        }
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        const percent = Math.min(100, Math.round((avg / 128) * 100));

        if (meterEl) {
          meterEl.style.width = `${Math.max(5, percent)}%`;
        }
        this.animFrameId = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (e) {
      console.warn('Microphone hardware level check not available:', e);
    }
  },

  stopAudioMeter() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(t => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    const meterEl = document.getElementById('mic-volume-bar');
    if (meterEl) meterEl.style.width = '0%';
  },

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.transcript = '';
        if (this.onRecordingStateChange) this.onRecordingStateChange(true);
        this.initAudioMeter();
      };

      this.recognition.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + ' ';
        }
        this.transcript = text.trim();
        if (this.onTranscriptChange) {
          this.onTranscriptChange(this.transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.isRecording = false;
          this.stopAudioMeter();
          if (this.onRecordingStateChange) this.onRecordingStateChange(false);
          if (this.onError) {
            this.onError('Microphone access blocked. Please type your symptoms below.');
          }
        }
      };

      this.recognition.onend = () => {
        if (!this.isRecording) {
          this.stopAudioMeter();
          if (this.onRecordingStateChange) this.onRecordingStateChange(false);
        }
      };

      return true;
    } catch (e) {
      console.error('Speech initialization error', e);
      return false;
    }
  },

  async start() {
    if (!this.recognition && !this.init()) {
      if (this.onError) this.onError('Speech recognition not available. Please type your symptoms below.');
      return;
    }

    try {
      this.transcript = '';
      this.recognition.start();
    } catch (e) {
      try {
        this.recognition.stop();
        setTimeout(() => this.recognition.start(), 200);
      } catch (err) {}
    }
  },

  stop(submit = true) {
    this.isRecording = false;
    this.stopAudioMeter();

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    if (this.onRecordingStateChange) this.onRecordingStateChange(false);

    const spoken = this.transcript.trim();
    this.transcript = '';

    if (submit && spoken && window.handleUserTriageSubmission) {
      window.handleUserTriageSubmission(spoken);
    }
  },

  toggle() {
    if (this.isRecording) {
      this.stop(true);
    } else {
      this.start();
    }
  }
};

window.VoiceService = VoiceService;
