// MediSense — Voice Recognition Service (Web Speech API)

const VoiceService = {
  recognition: null,
  isRecording: false,
  transcript: '',
  onTranscriptChange: null,
  onRecordingStateChange: null,
  onError: null,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser. Fallback to text input.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; // Capture current utterance
      this.recognition.interimResults = true; // Stream real-time words
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.transcript = '';
        if (this.onRecordingStateChange) this.onRecordingStateChange(true);
      };

      this.recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        this.transcript = currentText;
        if (this.onTranscriptChange) {
          this.onTranscriptChange(this.transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition event error:', event.error);
        this.isRecording = false;
        if (this.onRecordingStateChange) this.onRecordingStateChange(false);
        if (this.onError) {
          let msg = 'Could not access microphone.';
          if (event.error === 'not-allowed') {
            msg = 'Microphone access denied. You can continue typing your symptoms below.';
          } else if (event.error === 'no-speech') {
            msg = 'No voice detected. Tap mic again or type below.';
          }
          this.onError(msg);
        }
      };

      this.recognition.onend = () => {
        const wasRecording = this.isRecording;
        this.isRecording = false;
        if (this.onRecordingStateChange) this.onRecordingStateChange(false);

        // If a non-empty transcript was gathered, dispatch it
        if (wasRecording && this.transcript.trim()) {
          const finalWords = this.transcript.trim();
          this.transcript = '';
          if (window.handleUserTriageSubmission) {
            window.handleUserTriageSubmission(finalWords);
          }
        }
      };

      return true;
    } catch (e) {
      console.error('Failed to initialize speech recognition', e);
      return false;
    }
  },

  start() {
    if (!this.recognition && !this.init()) {
      if (this.onError) this.onError('Speech recognition is not supported in this browser. Please use Chrome or type below.');
      return;
    }

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition start called while active or restarting', e);
    }
  },

  stop() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  },

  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  }
};

window.VoiceService = VoiceService;
