/**
 * CSS injected into the chat bubble's Shadow DOM (shared with the mascot).
 * Kept as a string so the styles are fully isolated from the host page.
 */

export const CHAT_STYLES = `
.katochi-chat {
  position: fixed;
  width: 300px;
  max-height: 360px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(20, 30, 60, 0.22);
  display: none;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  color: #1a1a2e;
  pointer-events: auto;
  z-index: 2147483647;
}

.katochi-chat[data-open="true"] {
  display: flex;
}

.katochi-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #6c5ce7;
  color: #ffffff;
  font-weight: 600;
}

.katochi-chat-title {
  font-size: 14px;
}

.katochi-chat-close {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
}

.katochi-chat-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.katochi-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 80px;
  max-height: 240px;
}

.katochi-chat-message {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  line-height: 1.4;
}

.katochi-chat-message[data-role="user"] {
  align-self: flex-end;
  background: #6c5ce7;
  color: #ffffff;
}

.katochi-chat-message[data-role="system"] {
  align-self: flex-start;
  background: #f0f0f5;
  color: #1a1a2e;
}

.katochi-chat-input-row {
  display: flex;
  padding: 8px;
  gap: 8px;
  border-top: 1px solid #ececf2;
}

.katochi-chat-input {
  flex: 1;
  border: 1px solid #d0d0dc;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  color: #1a1a2e;
  background: #ffffff;
}

.katochi-chat-input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

.katochi-chat-send {
  background: #6c5ce7;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.katochi-chat-send:hover {
  background: #5b4dd1;
}

.katochi-chat-send:active {
  background: #4a3dc1;
}
`;
