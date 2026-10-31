/**
 * Smoke tests for the KATOCHI type system.
 *
 * These verify that the core types are constructible and that the
 * discriminated unions narrow correctly. They also confirm the test
 * environment (jsdom + chrome mock) is wired up properly.
 */

import { MascotState } from '../src/types';
import type {
  Action,
  ChangeBackgroundAction,
  KatochiMessage,
  Modification,
  PageContext,
  ParseResult,
  ParsedCommand,
  Target,
} from '../src/types';
import { describe, expect, it } from 'vitest';

describe('MascotState', () => {
  it('exposes the five required mascot states', () => {
    expect(Object.values(MascotState)).toHaveLength(5);
    expect(MascotState.IDLE).toBe('IDLE');
    expect(MascotState.SUMMONED).toBe('SUMMONED');
    expect(MascotState.POSSESSING).toBe('POSSESSING');
    expect(MascotState.CHAOS).toBe('CHAOS');
    expect(MascotState.EXORCISED).toBe('EXORCISED');
  });
});

describe('Action discriminated union', () => {
  const pageTarget: Target = {
    kind: 'page',
    selector: 'body',
    description: 'the whole page',
  };

  it('constructs a changeBackground action', () => {
    const action: ChangeBackgroundAction = {
      type: 'changeBackground',
      target: pageTarget,
      color: '#ff0000',
    };
    expect(action.type).toBe('changeBackground');
    expect(action.color).toBe('#ff0000');
  });

  it('narrows actions with payloads via the type discriminator', () => {
    const action: Action = {
      type: 'changeBackground',
      target: pageTarget,
      color: '#00ff00',
    };
    if (action.type === 'changeBackground') {
      expect(action.color).toBe('#00ff00');
    }
  });

  it('narrows a payload-less action', () => {
    const action: Action = { type: 'exorcise' };
    expect(action.type).toBe('exorcise');
  });
});

describe('Parsed command and parse result', () => {
  it('builds a parse result from a parsed command', () => {
    const command: ParsedCommand = {
      verb: 'changeBackground',
      value: 'red',
      targetHint: 'the page',
      targetKind: 'page',
      raw: 'change the background to red',
    };
    const result: ParseResult = { ok: true, command };
    expect(result.ok).toBe(true);
    expect(result.command?.verb).toBe('changeBackground');
  });
});

describe('PageContext', () => {
  it('captures page metadata', () => {
    const ctx: PageContext = {
      url: 'https://example.com',
      title: 'Example',
      elementCounts: { heading: 2, paragraph: 5 },
      bodyBackgroundColor: '#ffffff',
    };
    expect(ctx.elementCounts.heading).toBe(2);
    expect(ctx.bodyBackgroundColor).toBe('#ffffff');
  });
});

describe('Modification tracking', () => {
  it('records a style change for undo', () => {
    const mod: Modification = {
      id: 'mod-1',
      actionType: 'changeBackground',
      kind: 'styleChange',
      timestamp: 0,
      data: {
        kind: 'styleChange',
        selector: 'body',
        property: 'background-color',
        previousValue: '',
        newValue: 'red',
      },
    };
    expect(mod.data.kind).toBe('styleChange');
  });
});

describe('KatochiMessage', () => {
  it('creates a SUMMON_MASCOT message', () => {
    const message: KatochiMessage = { type: 'SUMMON_MASCOT' };
    expect(message.type).toBe('SUMMON_MASCOT');
  });
});

describe('test environment', () => {
  it('provides a DOM document under jsdom', () => {
    const div = document.createElement('div');
    expect(div).toBeInstanceOf(HTMLElement);
  });

  it('provides a working chrome.storage.local mock', async () => {
    await chrome.storage.local.set({ greeting: 'katochi' });
    const result = await chrome.storage.local.get('greeting');
    expect(result.greeting).toBe('katochi');
  });
});
