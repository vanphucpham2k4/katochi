/**
 * Mascot lifecycle states and movement configuration.
 *
 * The mascot is KATOCHI's primary interface. It floats over the active
 * webpage and exposes a chat bubble for natural-language commands.
 */

/** Lifecycle states the mascot can occupy. */
export enum MascotState {
  /** Mascot is not present on the page. */
  IDLE = 'IDLE',
  /** Mascot has been summoned and is floating on the viewport. */
  SUMMONED = 'SUMMONED',
  /** Mascot is actively applying a transformation to the page. */
  POSSESSING = 'POSSESSING',
  /** Chaos mode is running a fixed set of effects. */
  CHAOS = 'CHAOS',
  /** Mascot has been exorcised and all KATOCHI changes reverted. */
  EXORCISED = 'EXORCISED',
}

/** Mascot position within the viewport, in CSS pixels. */
export interface MascotPosition {
  x: number;
  y: number;
}

/** Configuration for the mascot's simple CSS-based floating movement. */
export interface MascotMovementConfig {
  /** Drift speed in pixels per second. */
  speed: number;
  /** Interval between position recalculations, in milliseconds. */
  tickIntervalMs: number;
}
