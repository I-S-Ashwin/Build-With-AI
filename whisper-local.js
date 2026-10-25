// MediSense — Local On-Device OpenAI Whisper Speech Recognition via Transformers.js (WebAssembly)

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Disable local file fetch; use cached CDN ONNX weights
env.allowLocalModels = false;
env.useBrowserCache = true;

const LocalWhisperService = {
  transcriber: null,
  isLoading: false,

  async initModel(onProgress) {
    if (this.transcriber) return this.transcriber;
    this.isLoading = true;

    try {
      this.transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
        progress_callback: (data) => {
          if (onProgress && data.status === 'progress') {
            onProgress(Math.round(data.progress || 0));
          }
        }
      });
      this.isLoading = false;
      return this.transcriber;
    } catch (err) {
      this.isLoading = false;
      console.error('Failed to load in-browser Whisper model:', err);
      throw err;
    }
  },

  async transcribeAudioBlob(audioBlob, onStatusUpdate) {
    if (onStatusUpdate) onStatusUpdate('Initializing local Whisper model...');

    const transcriber = await this.initModel((pct) => {
      if (onStatusUpdate) onStatusUpdate(`Downloading Whisper on-device weights (${pct}%)...`);
    });

    if (onStatusUpdate) onStatusUpdate('Transcribing audio locally on device...');

    // Convert audio blob to 16kHz Float32Array required by Whisper
    const arrayBuffer = await audioBlob.arrayBuffer();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext({ sampleRate: 16000 });

    try {
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      let float32Data = audioBuffer.getChannelData(0);

      // Resample to 16000Hz if sample rates differed
      if (audioBuffer.sampleRate !== 16000) {
        float32Data = this.resampleAudio(float32Data, audioBuffer.sampleRate, 16000);
      }

      const result = await transcriber(float32Data);
      await audioCtx.close();
      return result.text ? result.text.trim() : '';
    } catch (e) {
      if (audioCtx.state !== 'closed') await audioCtx.close();
      throw e;
    }
  },

  resampleAudio(audioData, origRate, targetRate) {
    const ratio = origRate / targetRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const origIdx = Math.floor(i * ratio);
      result[i] = audioData[origIdx] || 0;
    }
    return result;
  }
};

window.LocalWhisperService = LocalWhisperService;
