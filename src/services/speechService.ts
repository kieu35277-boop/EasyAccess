/**
 * Accessible Speech Service
 * Combines browser Web Speech API (STT & TTS) with Server-Side Gemini TTS
 */

let activeRecognition: any = null;
let activeAudioElement: HTMLAudioElement | null = null;

export const speechService = {
  isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  },

  startListening({
    language = 'vi-VN',
    onResult,
    onError,
    onEnd,
  }: {
    language: string;
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (errorMsg: string) => void;
    onEnd: () => void;
  }) {
    if (!this.isRecognitionSupported()) {
      onError('Trình duyệt không hỗ trợ Web Speech API.');
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    try {
      if (activeRecognition) {
        try {
          activeRecognition.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      activeRecognition = recognition;
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          onResult(interimTranscript.trim(), false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Quyền truy cập micro đã bị từ chối.');
        } else if (event.error === 'no-speech') {
          onError('Không phát hiện thấy âm thanh giọng nói.');
        } else {
          onError(`Lỗi nhận dạng: ${event.error}`);
        }
      };

      recognition.onend = () => {
        activeRecognition = null;
        onEnd();
      };

      recognition.start();
    } catch (err: any) {
      onError(err.message || 'Không thể khởi động micro');
    }
  },

  stopListening() {
    if (activeRecognition) {
      try {
        activeRecognition.stop();
      } catch (e) {
        // ignore
      }
      activeRecognition = null;
    }
  },

  async speak({
    text,
    language = 'vi',
    onStart,
    onEnd,
  }: {
    text: string;
    language: 'vi' | 'en' | 'zh';
    onStart?: () => void;
    onEnd?: () => void;
  }) {
    this.stopSpeaking();

    // 1. Try Gemini TTS on backend
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: language === 'vi' ? 'Kore' : language === 'zh' ? 'Puck' : 'Zephyr',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          onStart?.();
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          activeAudioElement = audio;
          audio.onended = () => {
            activeAudioElement = null;
            onEnd?.();
          };
          audio.onerror = () => {
            activeAudioElement = null;
            this.speakWithBrowserFallback(text, language, onStart, onEnd);
          };
          await audio.play();
          return;
        }
      }
    } catch (e) {
      // Backend TTS failed or offline, fall through to browser SpeechSynthesis
    }

    // 2. Fallback to Browser SpeechSynthesis
    this.speakWithBrowserFallback(text, language, onStart, onEnd);
  },

  speakWithBrowserFallback(
    text: string,
    language: 'vi' | 'en' | 'zh',
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'vi' ? 'vi-VN' : language === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = 0.95; // Slightly slower for better motor comprehension

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
      } catch (e) {
        // ignore
      }
      activeAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
};
