/**
 * Modification tracking for Undo and Exorcise.
 *
 * Every KATOCHI-owned change is recorded so it can be reverted. Undo
 * reverts the most recent modification; Exorcise reverts all of them.
 * Both must never overwrite changes the website made independently.
 */

import type { ActionType } from './actions';

/** How a modification was applied. */
export type ModificationKind = 'styleChange' | 'elementCreated' | 'effect';

/** Record of a style property change so it can be reverted. */
export interface StyleChangeRecord {
  kind: 'styleChange';
  /** Selector the change was applied to. */
  selector: string;
  /** CSS property name, e.g. "background-color". */
  property: string;
  /** Previous inline value, or an empty string if none was set. */
  previousValue: string;
  /** Value written by KATOCHI. */
  newValue: string;
}

/** Record of an element KATOCHI created, so it can be removed. */
export interface ElementCreatedRecord {
  kind: 'elementCreated';
  /** A KATOCHI-generated id stamped on the created element. */
  elementId: string;
  /** Selector locating the created element. */
  selector: string;
}

/** Record of an applied effect, with the prior style to restore. */
export interface EffectRecord {
  kind: 'effect';
  selector: string;
  /** Which effect was applied. */
  effectType: 'glitch' | 'shake';
  /** Inline style string to restore when the effect ends or is undone. */
  previousStyle: string;
}

/** A single tracked KATOCHI modification. */
export interface Modification {
  /** Stable unique identifier. */
  id: string;
  /** The action that produced this modification. */
  actionType: ActionType;
  kind: ModificationKind;
  /** When the modification was applied, in epoch milliseconds. */
  timestamp: number;
  /** Payload describing how to revert the modification. */
  data: StyleChangeRecord | ElementCreatedRecord | EffectRecord;
}
