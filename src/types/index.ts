/**
 * Central type definitions for KATOCHI.
 *
 * Re-exports all type modules so the rest of the codebase can import
 * everything from a single entry point:
 *
 *   import { MascotState } from '../types';
 *   import type { Action, Target } from '../types';
 */

export * from './mascot';
export * from './context';
export * from './actions';
export * from './commands';
export * from './modifications';
export * from './messaging';
