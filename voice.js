// MediSense — Voice Recognition Service (Web Speech API)

const VoiceService = {
  recognition: null,
  isRecording: false,
  transcript: '',
  finalTranscript: '',
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
      // Use continuous=true so Chrome doesn't cut off after 1 second of pause!
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.transcript = '';
        this.finalTranscript = '';
        if (this.onRecordingStateChange) this.onRecordingStateChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        this.transcript = (this.finalTranscript + interimText).trim();
        if (this.onTranscriptChange) {
          this.onTranscriptChange(this.transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'no-speech') {
          // Continuous mode: ignore quiet moments without shutting down
          return;
        }

        this.isRecording = false;
        if (this.onRecordingStateChange) this.onRecordingStateChange(false);

        if (this.onError) {
          let msg = 'Could not access microphone.';
          if (event.error === 'not-allowed') {
            msg = window.location.protocol === 'file:'
              ? 'Chrome restricts mic on local files. Open http://localhost:3000 to keep mic active, or type below.'
              : 'Microphone permission blocked. Please allow mic in Chrome address bar or type below.';
          } else if (event.error === 'audio-capture') {
            msg = 'No microphone device found. Please check your hardware or type below.';
          }
          this.onError(msg);
        }
      };

      this.recognition.onend = () => {
        // If the user was still recording and browser timed out, restart automatically
        if (this.isRecording) {
          try {
            this.recognition.start();
            return;
          } catch (e) {}
        }

        this.isRecording = false;
        if (this.onRecordingStateChange) this.onRecordingStateChange(false);
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
      this.finalTranscript = '';
      this.transcript = '';
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition start called while active or restarting', e);
    }
  },

  stop(submit = true) {
    if (this.recognition && this.isRecording) {
      this.isRecording = false;
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    if (this.onRecordingStateChange) this.onRecordingStateChange(false);

    const spokenWords = this.transcript.trim();
    this.transcript = '';
    this.finalTranscript = '';

    if (submit && spokenWords && window.handleUserTriageSubmission) {
      window.handleUserTriageSubmission(spokenWords);
    }
  },

  toggle() {
    if (this.isRecording) {
      this.stop(true); // Stop and send what was spoken
    } else {
      this.start();
    }
  }
};

window.VoiceService = VoiceService;
