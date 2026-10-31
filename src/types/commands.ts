/**
 * Natural-language command parsing types.
 *
 * The parser converts English input into a ParsedCommand using a local
 * pattern-matching engine, designed for future AI integration. A
 * ParseResult either carries a command or explains why parsing failed.
 */

import type { TargetKind } from './context';

/** The verb extracted from a natural-language command. */
export type CommandVerb =
  | 'changeBackground'
  | 'changeTextColor'
  | 'changeTypography'
  | 'createButton'
  | 'createSearchBar'
  | 'glitch'
  | 'shake'
  | 'chaos'
  | 'undo'
  | 'exorcise';

/** A command parsed from the user's natural-language input. */
export interface ParsedCommand {
  verb: CommandVerb;
  /** Free-text value such as a color or font name. */
  value?: string;
  /** A hint about what the user wants to target, e.g. "headings". */
  targetHint?: string;
  /** Best-effort target kind inferred from the hint. */
  targetKind?: TargetKind;
  /** The original user input, kept for debugging and logging. */
  raw: string;
}

/** Outcome of parsing: a command on success, or an error message. */
export interface ParseResult {
  ok: boolean;
  command?: ParsedCommand;
  error?: string;
}
