/**
 * Contrat i18n partagé (stories 1.2 à 1.5) : `languages`, `defaultLang`,
 * dictionnaire `ui` par langue (clés à plat), `useTranslations`,
 * `getLangFromUrl` et `localizedPath`. Typage strict : une clé manquante en
 * anglais est une erreur `astro check` (contrôlé par `Record<Lang, Record<Cles, string>>`).
 */

export const languages = {
  fr: "Français",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "fr";

const fr = {
  "nav.barre": "Navigation principale",
  "nav.accueil": "Accueil",
  "nav.github": "Profil GitHub",
  "nav.linkedin": "Profil LinkedIn",
  "nav.email": "Copier l'adresse e-mail",
  "nav.email.copie": "E-mail copié",
  "nav.langue": "Passer en anglais (EN)",
  "nav.nouvelOnglet": "(nouvel onglet)",
  "nav.theme.clair": "Passer au thème clair",
  "nav.theme.sombre": "Passer au thème sombre",
} as const;

type Cles = keyof typeof fr;

export const ui: Record<Lang, Record<Cles, string>> = {
  fr,
  en: {
    "nav.barre": "Main navigation",
    "nav.accueil": "Home",
    "nav.github": "GitHub profile",
    "nav.linkedin": "LinkedIn profile",
    "nav.email": "Copy email address",
    "nav.email.copie": "Email copied",
    "nav.langue": "Switch to French (FR)",
    "nav.nouvelOnglet": "(new tab)",
    "nav.theme.clair": "Switch to light theme",
    "nav.theme.sombre": "Switch to dark theme",
  },
};

export function useTranslations(lang: Lang) {
  return function t(key: Cles): string {
    return ui[lang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  // Object.hasOwn : `in` suivrait le prototype ("/constructor/").
  if (maybeLang && Object.hasOwn(languages, maybeLang)) {
    return maybeLang as Lang;
  }
  return defaultLang;
}

/** `/` pour fr, `/en/` (ou `/en/<chemin>`) pour en. `path` commence par `/`. */
export function localizedPath(lang: Lang, path = "/"): string {
  return lang === defaultLang ? path : `/en${path}`;
}
