type WindowWithWebkitAudio = typeof window & { webkitAudioContext?: typeof AudioContext };

let audioCtx: AudioContext | null = null;

const getAudioContextClass = (): typeof AudioContext | undefined => {
  const w = window as WindowWithWebkitAudio;
  return w.AudioContext ?? w.webkitAudioContext;
};

const ensureContext = (): AudioContext | null => {
  const AudioContextClass = getAudioContextClass();
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

// Call from a user-gesture handler (e.g. a button click) to unlock audio
// playback ahead of time, working around browser autoplay restrictions.
export const primeAudioContext = (): void => {
  try {
    ensureContext();
  } catch {
    // best effort
  }
};

export const playNotificationSound = (): void => {
  try {
    const ctx = ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};
