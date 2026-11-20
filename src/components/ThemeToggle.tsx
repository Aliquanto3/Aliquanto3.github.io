import { useEffect, useId, useState } from "react";
import { useTranslations, type Lang } from "../i18n/ui";

export interface ThemeToggleProps {
  lang: Lang;
}

type Theme = "sombre" | "clair";

function lireTheme(): Theme {
  if (typeof document === "undefined") return "sombre";
  const attribut = document.documentElement.getAttribute("data-theme");
  if (attribut === "sombre" || attribut === "clair") return attribut;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "clair"
      : "sombre";
  }
  return "sombre";
}

/**
 * Les deux icônes sont toujours rendues ; seule la CSS (sélecteur
 * `[data-theme]` sur `<html>`) décide laquelle s'affiche, pour éviter tout
 * décalage d'icône à l'hydratation. Seul le libellé (aria-label, info-bulle)
 * est recalculé après montage, dans un effet.
 */
export default function ThemeToggle({ lang }: ThemeToggleProps) {
  const t = useTranslations(lang);
  const idInfobulle = useId();
  // Par défaut sombre, comme le script inline de Base.astro : cohérent avec
  // la CSS, qui affiche l'icône soleil tant que data-theme n'est pas "clair".
  const [theme, setTheme] = useState<Theme>("sombre");

  useEffect(() => {
    setTheme(lireTheme());
  }, []);

  function basculer() {
    const suivant: Theme = lireTheme() === "sombre" ? "clair" : "sombre";
    document.documentElement.setAttribute("data-theme", suivant);
    try {
      localStorage.setItem("theme", suivant);
    } catch {
      // Stockage indisponible (navigation privée...) : le thème reste posé
      // pour la session en cours.
    }
    setTheme(suivant);
  }

  const label =
    theme === "sombre" ? t("nav.theme.clair") : t("nav.theme.sombre");

  return (
    <span className="barre__item">
      <button
        type="button"
        className="barre__bouton"
        aria-label={label}
        aria-describedby={idInfobulle}
        onClick={basculer}
      >
        <svg
          className="barre__icone-soleil"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
        </svg>
        <svg
          className="barre__icone-lune"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </svg>
      </button>
      <span id={idInfobulle} role="tooltip" className="barre__infobulle">
        {label}
      </span>
    </span>
  );
}
