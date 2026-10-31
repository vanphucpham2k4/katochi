/**
 * Page context analysis and target resolution types.
 *
 * The Page Context Analyzer inspects the active page and the Target
 * Resolver maps a user's intent onto concrete DOM targets. Users never
 * type CSS selectors; selectors are generated internally.
 */

/** Categories of page elements a command can target. */
export type TargetKind =
  | 'page' // the whole document / body
  | 'heading' // h1-h6
  | 'paragraph' // p
  | 'link' // a
  | 'button' // button
  | 'text' // all text-bearing elements
  | 'image' // img
  | 'navigation'; // nav

/** A resolved DOM target: an internal selector plus a human label. */
export interface Target {
  kind: TargetKind;
  /** Internal CSS selector used by the DOM controller. Never user-typed. */
  selector: string;
  /** Human-readable label surfaced in the chat bubble. */
  description: string;
}

/** Snapshot of the active page produced by the Page Context Analyzer. */
export interface PageContext {
  url: string;
  title: string;
  /** Count of each notable element kind present on the page. */
  elementCounts: Partial<Record<TargetKind, number>>;
  /** Computed background color of the body, if detectable. */
  bodyBackgroundColor: string | null;
}
