// @ts-check

/**
 * @param {string} text
 * @param {{
 *  root?: HTMLElement
 *  tag?: string
 * }} [options]
 * @returns {HTMLElement | undefined}
 */
const findElementContainingText = (text, options) => {
  const root = options?.root ?? document.body;
  const tag = options?.tag ?? "div";
  /** @type {any} */
  const el = Array.from(root.querySelectorAll(tag)).find((element) =>
    element.textContent.includes(text)
  );
  return el;
};

/**
 * @param {HTMLElement | null | undefined} element
 * @param {"border-radius" | "position-bottom"} [strategy]
 */
const MAX_PARENT_HEIGHT = 25;
const findParentTag = (element, tagName) => {
  if (!element) return null;
  let height = 0;
  /** @type {HTMLElement | null} */
  let parentElement = element;
  while (parentElement) {
    if (parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
      return parentElement;
    }
    parentElement = parentElement.parentElement;
    height++;
    if (height > MAX_PARENT_HEIGHT) {
      return null;
    }
  }
  return parentElement;
};

/**
 *
 * @param {Element | undefined | null} element
 */
const deleteElement = (element) => {
  element?.remove();
};

// Listen for DOM changes
// TODO: Get smarter about performance and not running this on every DOM change
const mutationObserver = new MutationObserver((mutations) => {
  const isFeedPage = document.location.pathname === "/feed/";

  // Delete premium upsell and marketing
  const premiumUpsell = document.querySelector(".premium-upsell-link");
  deleteElement(premiumUpsell);

  const premiumProfileLink =
    findElementContainingText("Try for $0", {
      tag: "span",
    }) ??
    findElementContainingText("Try Premium for $0", {
      tag: "span",
    });
  const premiumProfileLinkParent = findParentTag(premiumProfileLink, "a");
  deleteElement(premiumProfileLinkParent);

  if (isFeedPage) {
    // Remove the "Messaging" overlay
    const messagingOverlay = document.getElementById("msg-overlay");
    deleteElement(messagingOverlay);

    // Remove the "LinkedIn News" and footer
    const linkedInNews = document.querySelector(
      'aside[aria-label="LinkedIn News"]'
    );
    deleteElement(linkedInNews);
  }
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
