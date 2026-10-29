/**
 * Sweet Female Voice Greeter for Priyam Grocery Manager
 * Plays "Hi Priyam!" in a sweet female voice on app open using Gemini TTS
 * (model: gemini-3.8-flash-lite-tts, voice: Kore) with Web Speech Synthesis fallback.
 */

let cachedAudioDataUri: string | null = null;
let isAudioFetching = false;
let hasGreetedInThisSession = false;
let audioInstance: HTMLAudioElement | null = null;

// Listeners for playback state
type StateListener = (isPlaying: boolean) => void;
const listeners = new Set<StateListener>();

function notifyState(isPlaying: boolean) {
  listeners.forEach((listener) => {
    try {
      listener(isPlaying);
    } catch {}
  });
}

export function subscribeToVoiceGreeter(listener: StateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Preload greeting audio from server
 */
export async function preloadPriyamGreeting(): Promise<string | null> {
  if (cachedAudioDataUri) return cachedAudioDataUri;
  if (isAudioFetching) return null;

  try {
    isAudioFetching = true;
    const res = await fetch('/api/greet-voice');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && data.audioBase64) {
      cachedAudioDataUri = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      return cachedAudioDataUri;
    }
  } catch (err) {
    console.warn('Could not fetch Gemini TTS greeting from server, will use Web Speech fallback:', err);
  } finally {
    isAudioFetching = false;
  }
  return null;
}

/**
 * Fallback Web Speech Synthesis with sweet female voice settings
 */
export function playWebSpeechFemaleGreeting(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hi Priyam!');
    
    // Attempt to pick a gentle female voice
    const voices = window.speechSynthesis.getVoices();
    const sweetFemaleVoice =
      voices.find(
        (v) =>
          !v.name.toLowerCase().includes('male') &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('karen') ||
            v.name.toLowerCase().includes('tessa') ||
            v.name.toLowerCase().includes('natural') ||
            v.name.includes('Google US English') ||
            v.name.includes('Google UK English Female'))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (sweetFemaleVoice) {
      utterance.voice = sweetFemaleVoice;
    }
    
    // Sweet, pleasant female tone: slightly higher pitch and gentle pace
    utterance.pitch = 1.15;
    utterance.rate = 0.95;

    utterance.onstart = () => notifyState(true);
    utterance.onend = () => notifyState(false);
    utterance.onerror = () => notifyState(false);

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
    notifyState(false);
    return false;
  }
}

/**
 * Main greeting trigger: speaks "Hi Priyam!"
 * @param forcePlay if true, bypasses session check (e.g. when user clicks replay)
 */
export async function playPriyamGreeting(forcePlay = false): Promise<boolean> {
  if (!forcePlay && hasGreetedInThisSession) {
    return true;
  }

  notifyState(true);

  try {
    let audioUri = cachedAudioDataUri;
    if (!audioUri) {
      audioUri = await preloadPriyamGreeting();
    }

    if (audioUri) {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }

      audioInstance = new Audio(audioUri);
      audioInstance.volume = 1.0;

      audioInstance.onended = () => {
        notifyState(false);
      };
      audioInstance.onerror = () => {
        notifyState(false);
        // Fallback to web speech
        playWebSpeechFemaleGreeting();
      };

      try {
        await audioInstance.play();
        hasGreetedInThisSession = true;
        return true;
      } catch (autoplayError: any) {
        // Browser prevented unmuted autoplay before user interaction
        if (autoplayError?.name === 'NotAllowedError') {
          console.info('Autoplay blocked by browser. Queuing sweet greeting on first user click/tap.');
          notifyState(false);

          // Arm a one-time gesture listener to greet as soon as user touches or clicks anywhere
          const armGesture = () => {
            document.removeEventListener('click', armGesture);
            document.removeEventListener('touchstart', armGesture);
            document.removeEventListener('keydown', armGesture);
            playPriyamGreeting(true);
          };

          document.addEventListener('click', armGesture, { once: true });
          document.addEventListener('touchstart', armGesture, { once: true });
          document.addEventListener('keydown', armGesture, { once: true });
          return false;
        }
      }
    }

    // Fallback if audio URL is unavailable or failed
    const speechSuccess = playWebSpeechFemaleGreeting();
    if (speechSuccess) {
      hasGreetedInThisSession = true;
      return true;
    }
  } catch (err) {
    console.warn('Error in playPriyamGreeting:', err);
    playWebSpeechFemaleGreeting();
  } finally {
    // Safety timeout in case events never fire
    setTimeout(() => {
      notifyState(false);
    }, 2500);
  }

  return false;
}
