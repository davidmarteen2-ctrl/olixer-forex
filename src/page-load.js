export function preparePageLoad({
  eventTarget = window,
  historyState = window.history,
  locationState = window.location,
  scrollTo = window.scrollTo.bind(window),
} = {}) {
  if ("scrollRestoration" in historyState) {
    historyState.scrollRestoration = "manual";
  }

  const resetNonAnchorScroll = () => {
    if (!locationState.hash) {
      scrollTo(0, 0);
    }
  };

  resetNonAnchorScroll();

  eventTarget.addEventListener(
    "pageshow",
    (event) => {
      if (event && event.persisted) {
        resetNonAnchorScroll();
      }
    },
    { once: true },
  );
}
