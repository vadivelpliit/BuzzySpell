// Web Speech API wrapper for TTS and Speech Recognition

class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: any; // SpeechRecognition
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Load voices
    this.loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }

    // Initialize speech recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  // Text-to-Speech
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      utterance.rate = options?.rate || 0.9; // Slightly slower for children
      utterance.pitch = options?.pitch || 1.1; // Slightly higher pitch
      utterance.volume = options?.volume || 1;

      // Select a child-friendly voice (prefer female voices)
      if (options?.voice) {
        const selectedVoice = this.voices.find(v => v.name === options.voice);
        if (selectedVoice) utterance.voice = selectedVoice;
      } else {
        const preferredVoice = this.voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha'))
        );
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stop() {
    this.synthesis.cancel();
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Speech Recognition
  startListening(onResult: (transcript: string) => void, onError?: (error: any) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      onError?.(new Error('Speech recognition not supported'));
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event);
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError?.(error);
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Check if speech recognition is supported
  isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  // Check if speech synthesis is supported
  isSynthesisSupported(): boolean {
    return !!this.synthesis;
  }
}

export default new SpeechService();
