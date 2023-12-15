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
  const el = Array.from(root.querySelectorAll(tag)).find(
    (element) => element.textContent === text
  );
  return el;
};

/**
 * @param {HTMLElement | null | undefined} element
 * @param {"border-radius" | "position-bottom"} [strategy]
 */
const MAX_PARENT_HEIGHT = 25;
const findParentElement = (element, strategy = "border-radius") => {
  if (!element) return null;
  if (strategy === "border-radius") {
    let height = 0;
    /** @type {HTMLElement | null} */
    let parentElement = element;
    // Keep going up parent elements until we find one with a border-radius set on it
    while (parentElement) {
      const style = globalThis.getComputedStyle(parentElement);
      const borderRadius = style["border-radius"];
      if (borderRadius && borderRadius !== "0" && borderRadius !== "0px") {
        return parentElement;
      }
      parentElement = parentElement.parentElement;
      height++;
      if (height > MAX_PARENT_HEIGHT) {
        return null;
      }
    }
    return parentElement;
  } else if (strategy === "position-bottom") {
    let height = 0;
    /** @type {HTMLElement | null} */
    let parentElement = element;
    // Keep going up parent elements until we find one with a border-radius set on it
    while (parentElement) {
      const style = globalThis.getComputedStyle(parentElement);
      const position = style["position"];
      const bottom = style["bottom"];
      console.log(parentElement, position, bottom);
      if (position === "absolute" && bottom === "0px") {
        return parentElement;
      }
      parentElement = parentElement.parentElement;
      height++;
      if (height > MAX_PARENT_HEIGHT) {
        return null;
      }
    }
    return parentElement;
  }
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
  // Delete the "Subscribe to Premium" element
  const premiumText = findElementContainingText("Subscribe to Premium");
  const premiumContainer = findParentElement(premiumText, "border-radius");
  deleteElement(premiumContainer);

  // Delete the "What's Happening" element
  const whatsHappeningText = findElementContainingText("What’s happening", {
    tag: "h2",
  });
  const whatsHappeningContainer = findParentElement(whatsHappeningText);
  deleteElement(whatsHappeningContainer);

  // Delete the "Who to follow" element
  /** @type {HTMLElement | null} */
  const whoToFollowAside = document.querySelector(
    `aside[aria-label="Who to follow"]`
  );
  const whoToFollowContainer = findParentElement(whoToFollowAside);
  deleteElement(whoToFollowContainer);

  // Delete the floating "messages" container
  const messagesText = findElementContainingText("Messages", { tag: "h2" });
  const messagesContainer = findParentElement(messagesText, "position-bottom");
  deleteElement(messagesContainer);

  // Delete Grok in the navigation
  const nav = document.querySelector(`nav[aria-label="Primary"]`);
  const grokLink = nav?.querySelector(`a[aria-label="Grok"]`);
  deleteElement(grokLink);

  // Delete Premium in the navigation
  const premiumLink = nav?.querySelector(`a[aria-label="Premium"]`);
  deleteElement(premiumLink);

  // Delete Premium in the navigation
  const exploreLink = nav?.querySelector(`a[aria-label="Search and explore"]`);
  deleteElement(exploreLink);

  // Clean up footer content
  deleteElement(document.querySelector(`nav[aria-label="Footer"]`));
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
