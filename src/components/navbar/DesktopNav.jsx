import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavLink from "./NavLink.jsx";

const NAV_ITEMS = [
  { label: "Product", href: "#gallery" },
  { label: "Features", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#signals" },
  { label: "Company", href: "#stats" },
];

export default function DesktopNav({ navGap }) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.ul
      className="desktop-nav"
      aria-label="Primary links"
      style={navGap ? { gap: navGap } : undefined}
    >
      {NAV_ITEMS.map((item) => {
        const id = item.href.replace("#", "");
        return (
          <NavLink
            key={item.label}
            href={item.href}
            label={item.label}
            isCurrent={activeSection === id}
          />
        );
      })}
    </motion.ul>
  );
}
