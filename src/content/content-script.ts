/**
 * KATOCHI content script entry point.
 *
 * Owns the mascot instance and routes runtime messages to it. The mascot
 * renders inside a Shadow DOM so it never clashes with the host page.
 * Clicking the mascot toggles the on-page chat bubble.
 */

import type { KatochiMessage } from "../types";
import { Mascot } from "../mascot";

const LOG_PREFIX = "[KATOCHI]";

const mascot = new Mascot({
  onCommand: (text) => {
    // Full command parsing arrives in Task 5.
    console.log(`${LOG_PREFIX} command received: ${text}`);
    mascot.respond(`I heard: "${text}" — full parsing arrives in Task 5`);
  },
});

chrome.runtime.onMessage.addListener((message: KatochiMessage) => {
  switch (message.type) {
    case "SUMMON_MASCOT":
      mascot.summon();
      console.log(`${LOG_PREFIX} mascot summoned — state: ${mascot.state}`);
      break;
    default:
      // Other message types are handled in later tasks.
      break;
  }
  return false; // no asynchronous sendResponse
});

console.log(`${LOG_PREFIX} content script loaded`);
