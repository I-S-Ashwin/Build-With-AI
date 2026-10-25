// MediSense — Dual Voice Engine: Real-Time Speech + Direct Hardware Audio Recording

const VoiceService = {
  recognition: null,
  mediaRecorder: null,
  audioChunks: [],
  audioStream: null,
  audioContext: null,
  analyser: null,
  animFrameId: null,
  isRecording: false,
  transcript: '',
  onTranscriptChange: null,
  onRecordingStateChange: null,
  onError: null,

  async start() {
    try {
      this.isRecording = true;
      this.transcript = '';
      this.audioChunks = [];

      // 1. Get raw hardware microphone stream
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Hardware Audio Volume Visualizer Meter
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
        if (meterEl) meterEl.style.width = `${Math.max(5, percent)}%`;
        this.animFrameId = requestAnimationFrame(checkVolume);
      };
      checkVolume();

      // 3. Hardware MediaRecorder: Records actual voice bytes
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      this.mediaRecorder = new MediaRecorder(this.audioStream, { mimeType });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };
      this.mediaRecorder.start(250); // Record in 250ms chunks

      if (this.onRecordingStateChange) this.onRecordingStateChange(true);

      // 4. Try browser speech recognition in parallel if supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = navigator.language || 'en-IN';
          this.recognition.onresult = (event) => {
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
              text += event.results[i][0].transcript + ' ';
            }
            this.transcript = text.trim();
            if (this.onTranscriptChange) this.onTranscriptChange(this.transcript);
          };
          this.recognition.start();
        } catch (e) {}
      }

    } catch (err) {
      console.error('Failed to start microphone recording:', err);
      this.isRecording = false;
      if (this.onRecordingStateChange) this.onRecordingStateChange(false);
      if (this.onError) this.onError('Microphone access denied. Please click the address bar lock icon to allow mic.');
    }
  },

  async stop(submit = true) {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    const meterEl = document.getElementById('mic-volume-bar');
    if (meterEl) meterEl.style.width = '0%';

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    if (this.onRecordingStateChange) this.onRecordingStateChange(false);

    // Stop MediaRecorder and grab audio file
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      const recordType = this.mediaRecorder.mimeType || 'audio/webm';
      
      this.mediaRecorder.onstop = () => {
        // Stop audio tracks
        if (this.audioStream) {
          this.audioStream.getTracks().forEach(t => t.stop());
          this.audioStream = null;
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close().catch(() => {});
          this.audioContext = null;
        }

        const audioBlob = new Blob(this.audioChunks, { type: recordType });
        this.audioChunks = [];

        if (submit) {
          // If browser speech recognition produced text, use it directly
          if (this.transcript && this.transcript.trim() && window.handleUserTriageSubmission) {
            const words = this.transcript.trim();
            this.transcript = '';
            window.handleUserTriageSubmission(words);
          } else {
            // Otherwise, send raw voice audio recording directly to Gemini AI!
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64Data = reader.result.split(',')[1];
              if (window.handleAudioTriageSubmission) {
                window.handleAudioTriageSubmission(base64Data, recordType);
              }
            };
          }
        }
      };

      this.mediaRecorder.stop();
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
