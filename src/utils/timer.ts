/**
 * Countdown timer utilities.
 * Migrated from timer.js.
 */

let timerInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start a countdown timer.
 * @param durationSeconds - Starting value in seconds.
 * @param onTick - Called every second with the remaining time.
 * @param onFinish - Called when the timer reaches zero.
 */
export function startTimer(
  durationSeconds: number,
  onTick: (remaining: number) => void,
  onFinish: () => void
): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  let timeRemaining = durationSeconds;
  onTick(timeRemaining);

  timerInterval = setInterval(() => {
    timeRemaining--;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval!);
      timerInterval = null;
      onTick(0);
      onFinish();
    } else {
      onTick(timeRemaining);
    }
  }, 1000);
}

/** Stop the currently running timer, if any. */
export function stopTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Format seconds into HH:MM:SS display string.
 * @param totalSeconds - Number of seconds to format.
 */
export function formatTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
