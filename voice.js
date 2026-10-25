// MediSense — Voice Recognition Service (Web Speech API)

const VoiceService = {
  recognition: null,
  isRecording: false,
  transcript: '',
  finalTranscript: '',
  onTranscriptChange: null,
  onRecordingStateChange: null,
  onError: null,
  restartTimeout: null,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = navigator.language || 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        if (this.onRecordingStateChange) this.onRecordingStateChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            this.finalTranscript += res[0].transcript + ' ';
          } else {
            interimText += res[0].transcript;
          }
        }
        this.transcript = (this.finalTranscript + interimText).trim();
        if (this.onTranscriptChange) {
          this.onTranscriptChange(this.transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition status event:', event.error);
        if (event.error === 'no-speech') {
          // Normal pause in speech, keep listening
          return;
        }

        if (event.error === 'not-allowed') {
          this.isRecording = false;
          if (this.onRecordingStateChange) this.onRecordingStateChange(false);
          if (this.onError) {
            this.onError('Microphone permission blocked. Click the lock/tune icon in the browser address bar to allow.');
          }
        }
      };

      this.recognition.onend = () => {
        // If recording was active and browser briefly paused the audio stream, restart cleanly
        if (this.isRecording) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.isRecording && this.recognition) {
              try {
                this.recognition.start();
              } catch (e) {
                // Ignore already-running state
              }
            }
          }, 150);
        } else {
          if (this.onRecordingStateChange) this.onRecordingStateChange(false);
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
      if (this.onError) this.onError('Speech recognition not supported in this browser. Please use Chrome or type below.');
      return;
    }

    try {
      this.isRecording = true;
      this.finalTranscript = '';
      this.transcript = '';
      this.recognition.start();
    } catch (e) {
      // In case it was already running
      try {
        this.recognition.stop();
        setTimeout(() => {
          if (this.isRecording) this.recognition.start();
        }, 150);
      } catch (err) {}
    }
  },

  stop(submit = true) {
    this.isRecording = false;
    clearTimeout(this.restartTimeout);

    if (this.recognition) {
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
      this.stop(true);
    } else {
      this.start();
    }
  }
};

window.VoiceService = VoiceService;
