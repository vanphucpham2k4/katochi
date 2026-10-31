import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Mascot } from '../src/mascot/mascot';
import { MascotState } from '../src/types';

describe('Mascot', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Remove any mascot hosts leaked between tests.
    document.body.innerHTML = '';
  });

  it('starts in IDLE and is not mounted', () => {
    const mascot = new Mascot();
    expect(mascot.state).toBe(MascotState.IDLE);
    expect(mascot.isMounted()).toBe(false);
  });

  it('summons and mounts the mascot in SUMMONED state', () => {
    const mascot = new Mascot();
    mascot.summon();
    expect(mascot.state).toBe(MascotState.SUMMONED);
    expect(mascot.isMounted()).toBe(true);

    const host = document.getElementById('katochi-mascot-host');
    expect(host).not.toBeNull();
    const mascotEl = host!.shadowRoot!.querySelector('.katochi-mascot');
    expect(mascotEl).not.toBeNull();
    expect(mascotEl!.getAttribute('data-state')).toBe('summoned');
    expect(mascotEl!.getAttribute('style')).toContain('translate(');
  });

  it('toggles the chat when the mascot is clicked', () => {
    const mascot = new Mascot();
    mascot.summon();
    const host = document.getElementById('katochi-mascot-host')!;
    const mascotEl = host.shadowRoot!.querySelector('.katochi-mascot') as HTMLElement;
    const chat = host.shadowRoot!.querySelector('.katochi-chat') as HTMLElement;

    mascotEl.click();
    expect(chat.getAttribute('data-open')).toBe('true');

    mascotEl.click();
    expect(chat.getAttribute('data-open')).toBe('false');
  });

  it('transitions through chaos and back to summoned', () => {
    const mascot = new Mascot();
    mascot.summon();
    mascot.startChaos();
    expect(mascot.state).toBe(MascotState.CHAOS);
    mascot.summon();
    expect(mascot.state).toBe(MascotState.SUMMONED);
  });

  it('transitions to possessing and back', () => {
    const mascot = new Mascot();
    mascot.summon();
    mascot.possess();
    expect(mascot.state).toBe(MascotState.POSSESSING);
    mascot.summon();
    expect(mascot.state).toBe(MascotState.SUMMONED);
  });

  it('exorcises: enters EXORCISED then IDLE after the fade', () => {
    const mascot = new Mascot();
    mascot.summon();
    mascot.exorcise();
    expect(mascot.state).toBe(MascotState.EXORCISED);
    expect(mascot.isMounted()).toBe(true); // still mounted during fade
    vi.advanceTimersByTime(600);
    expect(mascot.state).toBe(MascotState.IDLE);
    expect(mascot.isMounted()).toBe(false); // unmounted after fade
  });

  it('destroy removes the host, stops timers, and resets state', () => {
    const mascot = new Mascot();
    mascot.summon();
    expect(mascot.isMounted()).toBe(true);
    mascot.destroy();
    expect(mascot.isMounted()).toBe(false);
    expect(mascot.state).toBe(MascotState.IDLE);
    expect(document.getElementById('katochi-mascot-host')).toBeNull();
  });
});
