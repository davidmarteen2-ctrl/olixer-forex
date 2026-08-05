export default function MobileMenuTrigger({ isOpen, onClick }) {
  return (
    <button
      type="button"
      className="mobile-menu-trigger"
      aria-expanded={isOpen}
      aria-controls="mobile-menu-panel"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      onClick={onClick}
    >
      <span className="trigger-box" aria-hidden="true">
        <span className="trigger-line trigger-line-top" />
        <span className="trigger-line trigger-line-bottom" />
      </span>
    </button>
  );
}
