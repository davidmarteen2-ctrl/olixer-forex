import { motion } from "framer-motion";

export default function NavLink({ href, label, isCurrent = false, onClick }) {
  return (
    <li className="nav-link-item">
      <a
        href={href}
        className="nav-link"
        aria-current={isCurrent ? "page" : undefined}
        onClick={onClick}
      >
        <span>{label}</span>
      </a>
      {isCurrent && (
        <motion.span
          layoutId="navbar-active-indicator"
          className="navbar-active-indicator"
          aria-hidden="true"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </li>
  );
}
