/**
 * KATOCHI background service worker (Manifest V3).
 *
 * The only MVP responsibility here is to forward an extension-action
 * click to the active tab so the content script can summon the mascot.
 */

chrome.action.onClicked.addListener((tab) => {
  if (tab.id == null) return;
  // Content scripts are injected on <all_urls>; restricted schemes
  // (chrome://, etc.) have no content script, so swallow the rejection.
  chrome.tabs.sendMessage(tab.id, { type: 'SUMMON_MASCOT' }).catch(() => {
    /* no content script available on this tab */
  });
});
