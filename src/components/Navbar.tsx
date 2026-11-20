import { useEffect, useRef, useState } from "react";
import { useTranslations, type Lang } from "../i18n/ui";
import ThemeToggle from "./ThemeToggle";

export interface NavbarProps {
  lang: Lang;
  /** Page d'accueil dans la langue courante : "/" ou "/en/". */
  homeHref: string;
  /** Page courante dans l'autre langue (bascule de langue). */
  otherLangHref: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

/** Icônes en SVG inline, trait simple (inspirées de Feather Icons, MIT), 20x20. */
function Icone({ enfants }: { enfants: React.ReactNode }) {
  return (
    <svg
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
      {enfants}
    </svg>
  );
}

const IconeAccueil = () => (
  <Icone
    enfants={
      <>
        <path d="M3 9.5 12 2l9 7.5" />
        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
      </>
    }
  />
);

const IconeGitHub = () => (
  <Icone
    enfants={
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    }
  />
);

const IconeLinkedIn = () => (
  <Icone
    enfants={
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    }
  />
);

const IconeMail = () => (
  <Icone
    enfants={
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 6 10 7 10-7" />
      </>
    }
  />
);

const IconeCoche = () => <Icone enfants={<path d="m20 6-11 11-5-5" />} />;

/** `droite` : info-bulle alignée sur le bord droit de l'élément, pour ne pas
 * déborder de l'écran en fin de barre sur petit écran. */
function barreItemClasses(droite?: boolean) {
  return droite ? "barre__item barre__item--droite" : "barre__item";
}

function BarreBouton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className={barreItemClasses()}>
      <button
        type="button"
        className="barre__bouton"
        aria-label={label}
        onClick={onClick}
      >
        {children}
      </button>
      {/* Info-bulle visuelle : elle répète le nom accessible, d'où aria-hidden. */}
      <span className="barre__infobulle" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}

function BarreLien({
  href,
  label,
  labelLecteur,
  externe,
  droite,
  children,
}: {
  href: string;
  label: string;
  /** Nom accessible s'il diffère de l'info-bulle (doit la contenir). */
  labelLecteur?: string;
  externe?: boolean;
  droite?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={barreItemClasses(droite)}>
      <a
        href={href}
        className="barre__bouton"
        aria-label={labelLecteur ?? label}
        {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
      {/* Info-bulle visuelle : elle répète le nom accessible, d'où aria-hidden. */}
      <span className="barre__infobulle" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}

export default function Navbar({
  lang,
  homeHref,
  otherLangHref,
  email,
  githubUrl,
  linkedinUrl,
}: NavbarProps) {
  const t = useTranslations(lang);
  const [copie, setCopie] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    },
    [],
  );

  async function copierEmail() {
    try {
      if (!navigator.clipboard) {
        throw new Error("clipboard indisponible");
      }
      await navigator.clipboard.writeText(email);
      setCopie(true);
      if (minuteur.current) clearTimeout(minuteur.current);
      minuteur.current = setTimeout(() => setCopie(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  const libelleAutreLangue =
    lang === "en" ? languageLabel("fr") : languageLabel("en");

  return (
    <nav aria-label={t("nav.barre")} className="barre">
      <BarreLien href={homeHref} label={t("nav.accueil")}>
        <IconeAccueil />
      </BarreLien>
      <BarreLien
        href={githubUrl}
        label={t("nav.github")}
        labelLecteur={`${t("nav.github")} ${t("nav.nouvelOnglet")}`}
        externe
      >
        <IconeGitHub />
      </BarreLien>
      <BarreLien
        href={linkedinUrl}
        label={t("nav.linkedin")}
        labelLecteur={`${t("nav.linkedin")} ${t("nav.nouvelOnglet")}`}
        externe
      >
        <IconeLinkedIn />
      </BarreLien>
      <BarreBouton
        label={copie ? t("nav.email.copie") : t("nav.email")}
        onClick={copierEmail}
      >
        {copie ? <IconeCoche /> : <IconeMail />}
      </BarreBouton>
      <span className="barre__separateur" aria-hidden="true" />
      <BarreLien href={otherLangHref} label={t("nav.langue")} droite>
        <span className="barre__texte-langue" aria-hidden="true">
          {libelleAutreLangue}
        </span>
      </BarreLien>
      <ThemeToggle lang={lang} />
      <span aria-live="polite" className="sr-only">
        {copie ? t("nav.email.copie") : ""}
      </span>
    </nav>
  );
}

function languageLabel(lang: Lang): string {
  return lang.toUpperCase();
}
