import { describe, expect, it } from 'vitest';
import { MascotStateMachine } from '../src/mascot/mascot-state-machine';
import { MascotState } from '../src/types';

describe('MascotStateMachine', () => {
  it('starts in IDLE', () => {
    const sm = new MascotStateMachine();
    expect(sm.current).toBe(MascotState.IDLE);
  });

  it('reports valid transitions via canTransitionTo', () => {
    const sm = new MascotStateMachine();
    expect(sm.canTransitionTo(MascotState.SUMMONED)).toBe(true);
    expect(sm.canTransitionTo(MascotState.POSSESSING)).toBe(false);
  });

  it('allows IDLE -> SUMMONED', () => {
    const sm = new MascotStateMachine();
    expect(sm.transition(MascotState.SUMMONED)).toBe(true);
    expect(sm.current).toBe(MascotState.SUMMONED);
  });

  it('rejects IDLE -> POSSESSING (must be summoned first)', () => {
    const sm = new MascotStateMachine();
    expect(sm.transition(MascotState.POSSESSING)).toBe(false);
    expect(sm.current).toBe(MascotState.IDLE);
  });

  it('allows SUMMONED -> POSSESSING -> SUMMONED', () => {
    const sm = new MascotStateMachine();
    sm.transition(MascotState.SUMMONED);
    expect(sm.transition(MascotState.POSSESSING)).toBe(true);
    expect(sm.transition(MascotState.SUMMONED)).toBe(true);
  });

  it('allows SUMMONED -> CHAOS -> SUMMONED', () => {
    const sm = new MascotStateMachine();
    sm.transition(MascotState.SUMMONED);
    expect(sm.transition(MascotState.CHAOS)).toBe(true);
    expect(sm.transition(MascotState.SUMMONED)).toBe(true);
  });

  it('allows SUMMONED -> EXORCISED -> IDLE', () => {
    const sm = new MascotStateMachine();
    sm.transition(MascotState.SUMMONED);
    expect(sm.transition(MascotState.EXORCISED)).toBe(true);
    expect(sm.transition(MascotState.IDLE)).toBe(true);
  });

  it('notifies listeners on each transition', () => {
    const sm = new MascotStateMachine();
    const states: MascotState[] = [];
    sm.onStateChange((s) => states.push(s));
    sm.transition(MascotState.SUMMONED);
    sm.transition(MascotState.CHAOS);
    expect(states).toEqual([MascotState.SUMMONED, MascotState.CHAOS]);
  });

  it('unsubscribe stops further notifications', () => {
    const sm = new MascotStateMachine();
    const states: MascotState[] = [];
    const unsubscribe = sm.onStateChange((s) => states.push(s));
    sm.transition(MascotState.SUMMONED);
    unsubscribe();
    sm.transition(MascotState.CHAOS);
    expect(states).toEqual([MascotState.SUMMONED]);
  });

  it('reset returns to IDLE without notifying', () => {
    const sm = new MascotStateMachine();
    sm.transition(MascotState.SUMMONED);
    const states: MascotState[] = [];
    sm.onStateChange((s) => states.push(s));
    sm.reset();
    expect(sm.current).toBe(MascotState.IDLE);
    expect(states).toEqual([]);
  });
});
