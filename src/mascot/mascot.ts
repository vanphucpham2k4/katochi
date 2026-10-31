/**
 * Mascot controller.
 *
 * Renders the mascot inside a Shadow DOM host attached to the page, drives
 * its floating movement, and reflects the five lifecycle states visually.
 * Clicking the mascot toggles the on-page chat bubble (Task 3).
 */

import { MascotState } from "../types";
import type { MascotPosition } from "../types";
import { MascotStateMachine } from "./mascot-state-machine";
import { MascotMovement } from "./mascot-movement";
import { MASCOT_STYLES } from "./mascot-styles";
import { ChatBubble } from "../chat";

const HOST_ID = "katochi-mascot-host";
const MASCOT_SIZE = 64;
const NORMAL_SPEED = 40; // px/s
const CHAOS_SPEED = 120; // px/s
const EXORCISE_FADE_MS = 600;
const noop = (): void => {};

export interface MascotOptions {
  /** Called when the user submits a chat command. */
  onCommand?: (text: string) => void;
}

export class Mascot {
  private host: HTMLElement | null = null;
  private mascotEl: HTMLElement | null = null;
  private movement: MascotMovement | null = null;
  private exorciseTimer: number | null = null;
  private readonly stateMachine = new MascotStateMachine();
  private readonly unsubscribe: () => void;
  private readonly chat: ChatBubble;

  constructor(opts?: MascotOptions) {
    this.chat = new ChatBubble({ onCommand: opts?.onCommand ?? noop });
    this.unsubscribe = this.stateMachine.onStateChange((state) =>
      this.applyState(state),
    );
  }

  /** Current mascot lifecycle state. */
  get state(): MascotState {
    return this.stateMachine.current;
  }

  /** Whether the mascot host is currently in the document. */
  isMounted(): boolean {
    return this.host != null && document.body.contains(this.host);
  }

  /** Summon the mascot onto the page (-> SUMMONED). */
  summon(): void {
    if (!this.isMounted()) {
      this.mount();
    }
    this.stateMachine.transition(MascotState.SUMMONED);
  }

  /** Begin applying a transformation (-> POSSESSING). */
  possess(): void {
    this.stateMachine.transition(MascotState.POSSESSING);
  }

  /** Enter chaos mode (-> CHAOS). */
  startChaos(): void {
    this.stateMachine.transition(MascotState.CHAOS);
  }

  /** Exorcise the mascot: fade out then leave (-> EXORCISED -> IDLE). */
  exorcise(): void {
    if (!this.stateMachine.transition(MascotState.EXORCISED)) return;
    this.exorciseTimer = setTimeout(() => {
      this.exorciseTimer = null;
      this.stateMachine.transition(MascotState.IDLE);
    }, EXORCISE_FADE_MS);
  }

  /** Dismiss the mascot immediately (-> IDLE). */
  dismiss(): void {
    this.stateMachine.transition(MascotState.IDLE);
  }

  /** Add a KATOCHI (system) message to the chat. */
  respond(text: string): void {
    this.chat.addMessage("system", text);
  }

  /** Tear everything down: stop timers, remove DOM, reset state. */
  destroy(): void {
    this.chat.destroy();
    this.movement?.stop();
    this.movement = null;
    const timer = this.exorciseTimer;
    if (timer != null) {
      clearTimeout(timer);
      this.exorciseTimer = null;
    }
    this.unsubscribe();
    this.unmount();
    this.stateMachine.reset();
  }

  private mount(): void {
    this.host = document.createElement("div");
    this.host.id = HOST_ID;

    const shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = MASCOT_STYLES;
    shadow.appendChild(style);

    this.mascotEl = document.createElement("div");
    this.mascotEl.className = "katochi-mascot";
    this.mascotEl.dataset.state = MascotState.SUMMONED.toLowerCase();

    const ghost = document.createElement("div");
    ghost.className = "katochi-ghost";
    const eyes = document.createElement("div");
    eyes.className = "katochi-eyes";
    const eyeLeft = document.createElement("div");
    eyeLeft.className = "katochi-eye";
    const eyeRight = document.createElement("div");
    eyeRight.className = "katochi-eye";
    eyes.append(eyeLeft, eyeRight);
    ghost.appendChild(eyes);
    this.mascotEl.appendChild(ghost);

    this.mascotEl.addEventListener("click", () => {
      this.toggleChat();
    });

    shadow.appendChild(this.mascotEl);
    this.chat.mount(shadow);
    document.body.appendChild(this.host);
  }

  private unmount(): void {
    this.chat.unmount();
    this.host?.remove();
    this.host = null;
    this.mascotEl = null;
  }

  private toggleChat(): void {
    const pos = this.movement?.currentPosition;
    this.chat.toggle(pos?.x, pos?.y);
  }

  private ensureMovement(): void {
    if (this.movement != null) return;
    const initial: MascotPosition = {
      x: Math.max(0, (window.innerWidth - MASCOT_SIZE) / 2),
      y: Math.max(0, (window.innerHeight - MASCOT_SIZE) / 2),
    };
    this.movement = new MascotMovement({
      initialPosition: initial,
      getBounds: () => ({
        maxX: Math.max(0, window.innerWidth - MASCOT_SIZE),
        maxY: Math.max(0, window.innerHeight - MASCOT_SIZE),
      }),
      onTick: (pos) => {
        if (this.mascotEl != null) {
          this.mascotEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }
      },
    });
  }

  private syncTransform(): void {
    if (this.mascotEl == null || this.movement == null) return;
    const { x, y } = this.movement.currentPosition;
    this.mascotEl.style.transform = `translate(${x}px, ${y}px)`;
  }

  private applyState(state: MascotState): void {
    if (this.mascotEl != null) {
      this.mascotEl.dataset.state = state.toLowerCase();
    }
    switch (state) {
      case MascotState.IDLE:
        this.movement?.stop();
        this.unmount();
        break;
      case MascotState.SUMMONED:
      case MascotState.POSSESSING:
        this.ensureMovement();
        this.movement?.setSpeed(NORMAL_SPEED);
        this.movement?.start();
        this.syncTransform();
        break;
      case MascotState.CHAOS:
        this.ensureMovement();
        this.movement?.setSpeed(CHAOS_SPEED);
        this.movement?.start();
        this.syncTransform();
        break;
      case MascotState.EXORCISED:
        this.movement?.stop();
        this.chat.close();
        break;
    }
  }
}
