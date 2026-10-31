import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MascotMovement } from '../src/mascot/mascot-movement';

describe('MascotMovement', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Deterministic direction: Math.random() = 0 -> angle 0 -> moves right.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('moves along the initial direction each tick', () => {
    const positions: { x: number; y: number }[] = [];
    const movement = new MascotMovement({
      initialPosition: { x: 0, y: 0 },
      config: { speed: 100, tickIntervalMs: 1000 },
      getBounds: () => ({ maxX: 500, maxY: 500 }),
      onTick: (pos) => positions.push({ ...pos }),
    });
    movement.start();
    vi.advanceTimersByTime(1000); // 1 tick = 1 second of motion
    expect(positions).toHaveLength(1);
    expect(positions[0]!.x).toBe(100);
    expect(positions[0]!.y).toBe(0);
    movement.stop();
  });

  it('bounces off the right edge', () => {
    const positions: { x: number; y: number }[] = [];
    const movement = new MascotMovement({
      initialPosition: { x: 450, y: 0 },
      config: { speed: 100, tickIntervalMs: 1000 },
      getBounds: () => ({ maxX: 500, maxY: 500 }),
      onTick: (pos) => positions.push({ ...pos }),
    });
    movement.start();
    vi.advanceTimersByTime(1000); // 450 -> 550 -> clamp 500, reverse
    expect(positions[0]!.x).toBe(500);
    vi.advanceTimersByTime(1000); // 500 -> 400
    expect(positions[1]!.x).toBe(400);
    movement.stop();
  });

  it('rescales velocity when speed changes', () => {
    const positions: { x: number; y: number }[] = [];
    const movement = new MascotMovement({
      initialPosition: { x: 0, y: 0 },
      config: { speed: 100, tickIntervalMs: 1000 },
      getBounds: () => ({ maxX: 5000, maxY: 5000 }),
      onTick: (pos) => positions.push({ ...pos }),
    });
    movement.start();
    vi.advanceTimersByTime(1000); // 100 px at speed 100
    expect(positions[0]!.x).toBe(100);
    movement.setSpeed(200);
    vi.advanceTimersByTime(1000); // +200 px at speed 200
    expect(positions[1]!.x).toBe(300);
    movement.stop();
  });

  it('stops moving when stop() is called', () => {
    const positions: { x: number; y: number }[] = [];
    const movement = new MascotMovement({
      initialPosition: { x: 0, y: 0 },
      config: { speed: 100, tickIntervalMs: 1000 },
      getBounds: () => ({ maxX: 500, maxY: 500 }),
      onTick: (pos) => positions.push({ ...pos }),
    });
    movement.start();
    vi.advanceTimersByTime(1000);
    expect(positions).toHaveLength(1);
    movement.stop();
    expect(movement.isRunning).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(positions).toHaveLength(1); // no further ticks
  });

  it('reports running state', () => {
    const movement = new MascotMovement({
      initialPosition: { x: 0, y: 0 },
      getBounds: () => ({ maxX: 500, maxY: 500 }),
      onTick: () => {},
    });
    expect(movement.isRunning).toBe(false);
    movement.start();
    expect(movement.isRunning).toBe(true);
    movement.stop();
    expect(movement.isRunning).toBe(false);
  });
});
