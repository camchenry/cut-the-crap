const findElementContainingText = (text, root = document) => {
  return Array.from(root.querySelectorAll("div")).find(
    (element) => element.textContent === text
  );
};

/**
 * @param {HTMLElement} element
 */
const findParentElement = (element, strategy = "border-radius") => {
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
      if (height > 10) {
        return null;
      }
    }
    return parentElement;
  }
};

/**
 *
 * @param {HTMLElement | undefined | null} element
 */
const deleteElement = (element) => {
  element?.remove();
};

// Listen for DOM changes
// TODO: Get smarter about performance and not running this on every DOM change
const mutationObserver = new MutationObserver((mutations) => {
  // Delete the "Subscribe to Premium element"
  const premiumText = findElementContainingText("Subscribe to Premium");
  const premiumContainer = findParentElement(premiumText, "border-radius");
  console.log("premiumText", premiumText);
  console.log("premiumContainer", premiumContainer);
  deleteElement(premiumContainer);
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
