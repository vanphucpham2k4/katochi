/**
 * Mascot floating movement.
 *
 * Simple, CSS-transform-based drift around the viewport. The mascot
 * bounces off the viewport edges. No advanced physics or obstacle
 * avoidance — just a velocity vector updated on a fixed interval.
 */

import type { MascotMovementConfig, MascotPosition } from '../types';

const DEFAULT_SPEED = 40; // px/s
const DEFAULT_TICK_MS = 16; // ~60fps

export interface MascotMovementOptions {
  initialPosition: MascotPosition;
  config?: Partial<MascotMovementConfig>;
  /** Returns the maximum x/y the mascot's top-left corner can reach. */
  getBounds: () => { maxX: number; maxY: number };
  /** Called with the new position on every movement tick. */
  onTick: (position: MascotPosition) => void;
}

/** Drives the mascot's floating motion via a fixed-interval timer. */
export class MascotMovement {
  private readonly tickIntervalMs: number;
  private speed: number;
  private readonly position: MascotPosition;
  private velocity: { x: number; y: number };
  private timer: number | null = null;
  private readonly getBounds: () => { maxX: number; maxY: number };
  private readonly onTick: (position: MascotPosition) => void;

  constructor(opts: MascotMovementOptions) {
    this.tickIntervalMs = opts.config?.tickIntervalMs ?? DEFAULT_TICK_MS;
    this.speed = opts.config?.speed ?? DEFAULT_SPEED;
    this.position = { ...opts.initialPosition };
    const angle = Math.random() * Math.PI * 2;
    this.velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed,
    };
    this.getBounds = opts.getBounds;
    this.onTick = opts.onTick;
  }

  /** Begin drifting. No-op if already running. */
  start(): void {
    if (this.timer != null) return;
    this.timer = setInterval(() => this.step(), this.tickIntervalMs);
  }

  /** Stop drifting. */
  stop(): void {
    const timer = this.timer;
    if (timer == null) return;
    clearInterval(timer);
    this.timer = null;
  }

  /** Whether the movement loop is currently running. */
  get isRunning(): boolean {
    return this.timer != null;
  }

  /** A copy of the current position. */
  get currentPosition(): MascotPosition {
    return { ...this.position };
  }

  /** Change the drift speed while preserving the current direction. */
  setSpeed(speed: number): void {
    this.speed = speed;
    const magnitude = Math.hypot(this.velocity.x, this.velocity.y);
    if (magnitude === 0) {
      const angle = Math.random() * Math.PI * 2;
      this.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    } else {
      this.velocity = {
        x: (this.velocity.x / magnitude) * speed,
        y: (this.velocity.y / magnitude) * speed,
      };
    }
  }

  private step(): void {
    const dt = this.tickIntervalMs / 1000;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    const { maxX, maxY } = this.getBounds();
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = Math.abs(this.velocity.x);
    } else if (this.position.x > maxX) {
      this.position.x = maxX;
      this.velocity.x = -Math.abs(this.velocity.x);
    }
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = Math.abs(this.velocity.y);
    } else if (this.position.y > maxY) {
      this.position.y = maxY;
      this.velocity.y = -Math.abs(this.velocity.y);
    }

    this.onTick(this.position);
  }
}
