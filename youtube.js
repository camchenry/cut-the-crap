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
  const isHomepage = document.location.pathname === "/";
  const isWatchPage = document.location.pathname.startsWith("/watch");

  // Delete the "Shorts" navigation link
  const shortsLink = document.querySelector(`a[title="Shorts"]`);
  deleteElement(shortsLink);

  if (isHomepage) {
    // Delete the chips header
    const chipsHeader = document.querySelector(`#header`);
    deleteElement(chipsHeader);

    // Delete "Shorts" section
    const shortsSections = Array.from(
      document.querySelectorAll("ytd-rich-section-renderer")
    ).filter((section) => {
      return section.textContent?.trim().startsWith("Shorts");
    });
    for (const section of shortsSections) {
      deleteElement(section);
    }
  } else if (isWatchPage) {
    const relatedChips = document.querySelector(
      `yt-related-chip-cloud-renderer`
    );
    deleteElement(relatedChips);
  }
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
