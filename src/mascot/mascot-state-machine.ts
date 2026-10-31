/**
 * Mascot state machine.
 *
 * Governs the five mascot lifecycle states and the valid transitions
 * between them. The mascot UI reacts to state changes via listeners.
 */

import { MascotState } from '../types';

/** Transitions allowed from each state. */
const VALID_TRANSITIONS: Record<MascotState, readonly MascotState[]> = {
  [MascotState.IDLE]: [MascotState.SUMMONED],
  [MascotState.SUMMONED]: [
    MascotState.POSSESSING,
    MascotState.CHAOS,
    MascotState.EXORCISED,
    MascotState.IDLE,
  ],
  [MascotState.POSSESSING]: [
    MascotState.SUMMONED,
    MascotState.EXORCISED,
    MascotState.IDLE,
  ],
  [MascotState.CHAOS]: [
    MascotState.SUMMONED,
    MascotState.EXORCISED,
    MascotState.IDLE,
  ],
  [MascotState.EXORCISED]: [MascotState.IDLE],
};

export type StateChangeListener = (state: MascotState) => void;

/** A small finite-state machine for the mascot lifecycle. */
export class MascotStateMachine {
  private state: MascotState = MascotState.IDLE;
  private readonly listeners = new Set<StateChangeListener>();

  /** The current mascot state. */
  get current(): MascotState {
    return this.state;
  }

  /** Whether a transition to `target` is permitted from the current state. */
  canTransitionTo(target: MascotState): boolean {
    return VALID_TRANSITIONS[this.state].includes(target);
  }

  /**
   * Attempt a transition to `target`.
   * @returns `true` if the transition happened, `false` if rejected.
   */
  transition(target: MascotState): boolean {
    if (!this.canTransitionTo(target)) return false;
    this.state = target;
    this.listeners.forEach((listener) => listener(this.state));
    return true;
  }

  /**
   * Subscribe to state changes.
   * @returns an unsubscribe function.
   */
  onStateChange(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Reset to IDLE without notifying listeners. */
  reset(): void {
    this.state = MascotState.IDLE;
  }
}
