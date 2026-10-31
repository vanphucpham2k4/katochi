/**
 * CSS injected into the mascot's Shadow DOM.
 * Kept as a string so the styles are fully isolated from the host page.
 */

export const MASCOT_STYLES = `
:host {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647;
  pointer-events: none;
}

.katochi-mascot {
  position: fixed;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  pointer-events: auto;
  cursor: pointer;
  transition: opacity 0.45s ease, filter 0.3s ease;
  will-change: transform;
}

.katochi-ghost {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 38% 32%, #ffffff 0%, #eef2f7 55%, #d6deea 100%);
  border-radius: 50% 50% 22% 22% / 58% 58% 28% 28%;
  box-shadow: 0 6px 18px rgba(20, 30, 60, 0.22), inset 0 -5px 10px rgba(20, 30, 60, 0.08);
  animation: katochi-bob 2.6s ease-in-out infinite;
}

.katochi-eyes {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 13px;
}

.katochi-eye {
  width: 9px;
  height: 13px;
  background: #1b1b33;
  border-radius: 50%;
}

@keyframes katochi-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

/* POSSESSING — gentle glow while transforming the page */
.katochi-mascot[data-state="possessing"] .katochi-ghost {
  filter: drop-shadow(0 0 10px #8a7bff);
}

/* CHAOS — fiery and frantic */
.katochi-mascot[data-state="chaos"] .katochi-ghost {
  background: radial-gradient(circle at 38% 32%, #ffe0b0 0%, #ff9a52 55%, #e8401a 100%);
  animation: katochi-bob 0.7s ease-in-out infinite;
  box-shadow: 0 6px 22px rgba(232, 64, 26, 0.4), inset 0 -5px 10px rgba(120, 20, 0, 0.12);
}

/* EXORCISED — fade out and desaturate */
.katochi-mascot[data-state="exorcised"] {
  opacity: 0;
}

.katochi-mascot[data-state="exorcised"] .katochi-ghost {
  filter: grayscale(0.9);
  animation: none;
}
`;
