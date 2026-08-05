export function initCtaChoice(root = document, onChoice = () => { }) {
  const cta = root.querySelector(".cta");
  const yesButton = root.querySelector(".btn-yes");
  const noButton = root.querySelector(".btn-no");

  if (!cta || !yesButton || !noButton) return () => { };

  const choose = (choice) => {
    if (cta.dataset.choice === choice) return;
    cta.dataset.choice = choice;
    yesButton.setAttribute("aria-pressed", String(choice === "yes"));
    noButton.setAttribute("aria-pressed", String(choice === "no"));
    onChoice(choice);
  };

  const chooseYes = () => choose("yes");
  const chooseNo = () => choose("no");
  const hoverYes = () => {
    cta.dataset.hoverChoice = "yes";
    chooseYes();
  };
  const hoverNo = () => {
    cta.dataset.hoverChoice = "no";
    chooseNo();
  };
  const clearHoverChoice = () => {
    delete cta.dataset.hoverChoice;
  };

  yesButton.addEventListener("click", chooseYes);
  noButton.addEventListener("click", chooseNo);
  yesButton.addEventListener("mouseenter", hoverYes);
  noButton.addEventListener("mouseenter", hoverNo);
  yesButton.addEventListener("mouseleave", clearHoverChoice);
  noButton.addEventListener("mouseleave", clearHoverChoice);

  return () => {
    yesButton.removeEventListener("click", chooseYes);
    noButton.removeEventListener("click", chooseNo);
    yesButton.removeEventListener("mouseenter", hoverYes);
    noButton.removeEventListener("mouseenter", hoverNo);
    yesButton.removeEventListener("mouseleave", clearHoverChoice);
    noButton.removeEventListener("mouseleave", clearHoverChoice);
  };
}
