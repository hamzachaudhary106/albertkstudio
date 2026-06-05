import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "#home");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id.replace("#", "")))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const update = () => {
      if (window.scrollY < 120) {
        setActive("#home");
        return;
      }

      const midpoint = window.innerHeight * 0.35;
      let closest = sections[0];
      let closestDistance = Infinity;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - midpoint);
        if (rect.top <= midpoint && rect.bottom > midpoint) {
          setActive(`#${section.id}`);
          return;
        }
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = section;
        }
      }

      if (closest?.id) setActive(`#${closest.id}`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  return active;
}
