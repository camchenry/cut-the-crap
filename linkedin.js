// @ts-check

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
  // Remove the "Messaging" overlay
  const messagingOverlay = document.getElementById("msg-overlay");
  deleteElement(messagingOverlay);

  // Remove the "LinkedIn News" and footer
  const linkedInNews = document.querySelector(
    'aside[aria-label="LinkedIn News"]'
  );
  deleteElement(linkedInNews);
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
