/**
 * On-page chat bubble.
 *
 * Renders inside the mascot's Shadow DOM. Opens when the mascot is clicked,
 * accepts natural-language commands, and displays a conversation between
 * the user and KATOCHI. The chat stays put while the mascot keeps floating.
 */

import { CHAT_STYLES } from "./chat-styles";

const BUBBLE_WIDTH = 300;
const BUBBLE_HEIGHT = 360;
const EDGE_MARGIN = 12;
const MASCOT_OFFSET = 72;

/** Who authored a chat message. */
export type ChatRole = "user" | "system";

export interface ChatBubbleOptions {
  /** Called when the user submits a command. */
  onCommand: (text: string) => void;
}

export class ChatBubble {
  private bubbleEl: HTMLElement | null = null;
  private inputEl: HTMLInputElement | null = null;
  private messageListEl: HTMLElement | null = null;
  private visible = false;
  private welcomed = false;
  private readonly onCommand: (text: string) => void;

  constructor(opts: ChatBubbleOptions) {
    this.onCommand = opts.onCommand;
  }

  /** Whether the chat is currently visible. */
  get isVisible(): boolean {
    return this.visible;
  }

  /** Build the chat DOM inside the given shadow root. */
  mount(shadow: ShadowRoot): void {
    const style = document.createElement("style");
    style.textContent = CHAT_STYLES;
    shadow.appendChild(style);

    this.bubbleEl = document.createElement("div");
    this.bubbleEl.className = "katochi-chat";
    this.bubbleEl.dataset.open = "false";

    const header = document.createElement("div");
    header.className = "katochi-chat-header";
    const title = document.createElement("span");
    title.className = "katochi-chat-title";
    title.textContent = "KATOCHI";
    const closeBtn = document.createElement("button");
    closeBtn.className = "katochi-chat-close";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", "Close chat");
    closeBtn.addEventListener("click", () => this.close());
    header.append(title, closeBtn);

    this.messageListEl = document.createElement("div");
    this.messageListEl.className = "katochi-chat-messages";

    const inputRow = document.createElement("div");
    inputRow.className = "katochi-chat-input-row";
    this.inputEl = document.createElement("input");
    this.inputEl.className = "katochi-chat-input";
    this.inputEl.type = "text";
    this.inputEl.placeholder = "Tell KATOCHI what to do…";
    this.inputEl.setAttribute("aria-label", "Command input");
    const sendBtn = document.createElement("button");
    sendBtn.className = "katochi-chat-send";
    sendBtn.textContent = "Send";
    sendBtn.addEventListener("click", () => this.submitCommand());
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.submitCommand();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    });
    inputRow.append(this.inputEl, sendBtn);

    this.bubbleEl.append(header, this.messageListEl, inputRow);
    shadow.appendChild(this.bubbleEl);
  }

  /** Remove the chat DOM. */
  unmount(): void {
    this.bubbleEl?.remove();
    this.bubbleEl = null;
    this.inputEl = null;
    this.messageListEl = null;
    this.visible = false;
  }

  /** Show the chat, positioned near (nearX, nearY) if provided. */
  open(nearX?: number, nearY?: number): void {
    if (this.bubbleEl == null) return;
    this.visible = true;
    this.bubbleEl.dataset.open = "true";

    const x = nearX ?? window.innerWidth - BUBBLE_WIDTH - EDGE_MARGIN * 2;
    const y = nearY ?? EDGE_MARGIN;
    const maxLeft = Math.max(
      EDGE_MARGIN,
      window.innerWidth - BUBBLE_WIDTH - EDGE_MARGIN,
    );
    const maxTop = Math.max(
      EDGE_MARGIN,
      window.innerHeight - BUBBLE_HEIGHT - EDGE_MARGIN,
    );
    const left = Math.min(Math.max(x + MASCOT_OFFSET, EDGE_MARGIN), maxLeft);
    const top = Math.min(Math.max(y, EDGE_MARGIN), maxTop);
    this.bubbleEl.style.left = `${Math.round(left)}px`;
    this.bubbleEl.style.top = `${Math.round(top)}px`;

    if (!this.welcomed) {
      this.welcomed = true;
      this.addMessage(
        "system",
        "Hi! I'm KATOCHI. Tell me what to change on this page.",
      );
    }
    this.inputEl?.focus();
  }

  /** Hide the chat. */
  close(): void {
    if (this.bubbleEl == null) return;
    this.visible = false;
    this.bubbleEl.dataset.open = "false";
  }

  /** Toggle the chat visibility, repositioning near the mascot on open. */
  toggle(nearX?: number, nearY?: number): void {
    if (this.visible) {
      this.close();
    } else {
      this.open(nearX, nearY);
    }
  }

  /** Append a message to the conversation. */
  addMessage(role: ChatRole, text: string): void {
    if (this.messageListEl == null) return;
    const msg = document.createElement("div");
    msg.className = "katochi-chat-message";
    msg.dataset.role = role;
    msg.textContent = text;
    this.messageListEl.appendChild(msg);
    this.messageListEl.scrollTop = this.messageListEl.scrollHeight;
  }

  /** Remove all messages. */
  clear(): void {
    this.messageListEl?.replaceChildren();
  }

  /** Tear down the chat. */
  destroy(): void {
    this.unmount();
  }

  private submitCommand(): void {
    if (this.inputEl == null) return;
    const text = this.inputEl.value.trim();
    if (text === "") return;
    this.addMessage("user", text);
    this.inputEl.value = "";
    this.onCommand(text);
  }
}
