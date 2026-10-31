/**
 * Messages exchanged between the background service worker and the
 * content script. A discriminated union keeps senders and receivers
 * type-safe without any shared runtime schema.
 */

import type { MascotState } from './mascot';
import type { ParseResult } from './commands';

/** Message sent from the service worker to summon the mascot. */
export interface SummonMascotMessage {
  type: 'SUMMON_MASCOT';
}

/** Message reporting the mascot's current state. */
export interface MascotStateChangedMessage {
  type: 'MASCOT_STATE_CHANGED';
  state: MascotState;
}

/** Message asking the content script to execute a parsed command. */
export interface ExecuteCommandMessage {
  type: 'EXECUTE_COMMAND';
  command: ParseResult;
}

/** Message asking the content script to exorcise the mascot. */
export interface ExorciseMessage {
  type: 'EXORCISE';
}

/** Message asking the content script to undo the latest change. */
export interface UndoMessage {
  type: 'UNDO';
}

/** Every KATOCHI runtime message. */
export type KatochiMessage =
  | SummonMascotMessage
  | MascotStateChangedMessage
  | ExecuteCommandMessage
  | ExorciseMessage
  | UndoMessage;
