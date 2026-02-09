export type GameLoopCallback = (deltaMs: number) => void;

export interface GameLoopControls {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

export const useGameLoop = (callback: GameLoopCallback, fps = 60): GameLoopControls => {
  let animationFrameId: number | null = null;
  let lastFrameTime = 0;
  const frameDuration = 1000 / fps;

  const tick = (time: number) => {
    if (time - lastFrameTime >= frameDuration) {
      const delta = time - lastFrameTime;
      lastFrameTime = time;
      callback(delta);
    }
    animationFrameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (animationFrameId !== null) {
      return;
    }
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (animationFrameId === null) {
      return;
    }
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  const isRunning = () => animationFrameId !== null;

  return {
    start,
    stop,
    isRunning,
  };
};
