import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatBubble } from "../src/chat/chat-bubble";

function createShadow(): ShadowRoot {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

describe("ChatBubble", () => {
  let shadow: ShadowRoot;

  beforeEach(() => {
    shadow = createShadow();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts the chat elements into the shadow root", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    expect(shadow.querySelector(".katochi-chat")).not.toBeNull();
    expect(shadow.querySelector(".katochi-chat-input")).not.toBeNull();
    expect(shadow.querySelector(".katochi-chat-send")).not.toBeNull();
    expect(shadow.querySelector(".katochi-chat-close")).not.toBeNull();
  });

  it("starts hidden and opens/closes", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    expect(chat.isVisible).toBe(false);
    const bubble = shadow.querySelector(".katochi-chat") as HTMLElement;
    expect(bubble.getAttribute("data-open")).toBe("false");
    chat.open();
    expect(chat.isVisible).toBe(true);
    expect(bubble.getAttribute("data-open")).toBe("true");
    chat.close();
    expect(chat.isVisible).toBe(false);
    expect(bubble.getAttribute("data-open")).toBe("false");
  });

  it("toggles visibility", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.toggle();
    expect(chat.isVisible).toBe(true);
    chat.toggle();
    expect(chat.isVisible).toBe(false);
  });

  it("adds messages with the correct role", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.addMessage("user", "change background to red");
    chat.addMessage("system", "Done!");
    const messages = shadow.querySelectorAll(".katochi-chat-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]!.getAttribute("data-role")).toBe("user");
    expect(messages[0]!.textContent).toBe("change background to red");
    expect(messages[1]!.getAttribute("data-role")).toBe("system");
    expect(messages[1]!.textContent).toBe("Done!");
  });

  it("shows a welcome message on first open", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.open();
    const messages = shadow.querySelectorAll(".katochi-chat-message");
    expect(messages).toHaveLength(1);
    expect(messages[0]!.getAttribute("data-role")).toBe("system");
  });

  it("does not repeat the welcome message on re-open", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.open();
    chat.close();
    chat.open();
    expect(
      shadow.querySelectorAll(".katochi-chat-message"),
    ).toHaveLength(1);
  });

  it("submits on Enter and calls onCommand", () => {
    const onCommand = vi.fn();
    const chat = new ChatBubble({ onCommand });
    chat.mount(shadow);
    chat.open();
    const input = shadow.querySelector(".katochi-chat-input") as HTMLInputElement;
    input.value = "make the background blue";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onCommand).toHaveBeenCalledWith("make the background blue");
    const userMessages = shadow.querySelectorAll(
      '.katochi-chat-message[data-role="user"]',
    );
    expect(userMessages).toHaveLength(1);
    expect(input.value).toBe("");
  });

  it("ignores empty input on submit", () => {
    const onCommand = vi.fn();
    const chat = new ChatBubble({ onCommand });
    chat.mount(shadow);
    chat.open();
    const input = shadow.querySelector(".katochi-chat-input") as HTMLInputElement;
    input.value = "   ";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onCommand).not.toHaveBeenCalled();
  });

  it("submits via the send button", () => {
    const onCommand = vi.fn();
    const chat = new ChatBubble({ onCommand });
    chat.mount(shadow);
    chat.open();
    const input = shadow.querySelector(".katochi-chat-input") as HTMLInputElement;
    input.value = "shake everything";
    const sendBtn = shadow.querySelector(".katochi-chat-send") as HTMLButtonElement;
    sendBtn.click();
    expect(onCommand).toHaveBeenCalledWith("shake everything");
  });

  it("closes on Escape", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.open();
    expect(chat.isVisible).toBe(true);
    const input = shadow.querySelector(".katochi-chat-input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(chat.isVisible).toBe(false);
  });

  it("close button closes the chat", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.open();
    expect(chat.isVisible).toBe(true);
    const closeBtn = shadow.querySelector(
      ".katochi-chat-close",
    ) as HTMLButtonElement;
    closeBtn.click();
    expect(chat.isVisible).toBe(false);
  });

  it("clear removes all messages", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    chat.open();
    chat.addMessage("user", "hello");
    chat.addMessage("system", "hi");
    chat.clear();
    expect(shadow.querySelectorAll(".katochi-chat-message")).toHaveLength(0);
  });

  it("unmount removes the chat elements", () => {
    const chat = new ChatBubble({ onCommand: () => {} });
    chat.mount(shadow);
    expect(shadow.querySelector(".katochi-chat")).not.toBeNull();
    chat.unmount();
    expect(shadow.querySelector(".katochi-chat")).toBeNull();
    expect(chat.isVisible).toBe(false);
  });
});
