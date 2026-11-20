# anael_homepage — epics et stories

Page d'accueil personnelle d'Anaël Yahi, inspirée de https://portfolio.abdoulayetall.workers.dev/ (portage Astro du modèle MIT [dillionverma/portfolio](https://github.com/dillionverma/portfolio)), à la charte [charte-generique](https://github.com/Aliquanto3/charte-generique).

## Décisions (2026-11-20, validées par Anaël)

| Sujet | Décision |
| --- | --- |
| Pile | Astro (dernière version stable), îlots React, Tailwind pour la mise en page seulement, sortie statique |
| Charte | `charte-generique/skills/charte/dist/charte.css` v2.1.0 copié dans `src/styles/charte.css` (version citée en tête). Sombre par défaut, clair par `data-theme="clair"`. Aucune couleur, police ou rayon hors des variables de la charte. Polices Sora, Atkinson Hyperlegible, JetBrains Mono par `@fontsource` (pas de Google Fonts). Favicon : `dist/favicon.svg` de la charte |
| Hébergement | Dépôt public `Aliquanto3/Aliquanto3.github.io`, GitHub Pages par GitHub Actions, URL `https://aliquanto3.github.io/` |
| Langues | FR (`/`) et EN (`/en/`), bascule dans la barre, `hreflang` réciproques |
| Contenu | Tiré des CV de `CVs/` (non versionné, jamais publié). **LinkedIn fait foi** pour dates, intitulés et chiffres. Titre : **AI Architect** (FR : « Architecte IA »). Clients **anonymisés** (seuls les employeurs sont nommés : Wavestone, Sopra Steria…). E-mail affiché : anael.yahi@gmail.com. Pas de téléphone ni d'adresse. Pas de section photos |
| Projets | Générés au build depuis `Aliquanto3/Aliquanto3/portfolio.json` + API GitHub publique (topics `status-*`, dernière release, description), même tri et mêmes libellés que le README du profil (`scripts/build_portfolio.py` du dépôt `Aliquanto3`). Ce site n'a **pas** le topic `ai-portfolio` |
| Liens croisés | Après mise en ligne : lien vers le site dans l'intro FR et EN du README `Aliquanto3/Aliquanto3` (hors marqueurs `portfolio:*`) et dans le champ Website du profil GitHub ; le site renvoie vers le profil GitHub |
| Crédit | Design inspiré de dillionverma/portfolio (MIT) : mention dans le pied de page et `LICENSE` |

## Epic 1 — Page d'accueil

### Story 1.1 ★ Squelette, charte et déploiement
Fichiers : `package.json`, `astro.config.mjs`, `src/layouts/Base.astro`, `src/styles/charte.css`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/en/index.astro`, `.github/workflows/deploy.yml`, `CLAUDE.md`, `LICENSE`, `README.md`.
- Given un clone frais, When `npm ci && npm run build`, Then `dist/index.html` et `dist/en/index.html` existent et `npm run check` (astro check) passe.
- Given un visiteur sans préférence stockée, When il ouvre la page, Then le thème suit `prefers-color-scheme` (sombre par défaut), sans flash (script inline avant le premier rendu, comme la référence), et le choix stocké dans `localStorage` prime (accès protégé par try/catch).
- Given un push sur `main` ou le cron du lundi 06:00 UTC, When le workflow tourne, Then le site est publié sur Pages.
- `CLAUDE.md` court : commandes `npm run dev|build|check|lint`, règle « couleurs par variables de la charte uniquement ».

### Story 1.2 Barre flottante et i18n
Fichiers : `src/i18n/ui.ts`, `src/components/Navbar.tsx`, `src/components/ThemeToggle.tsx`, `src/layouts/Base.astro`.
- Given la page FR, When on clique la bascule de langue, Then on arrive sur `/en/` (et inversement), `<html lang>` et `hreflang` sont corrects.
- Given la barre flottante en bas d'écran (comme la référence), Then elle porte : accueil, GitHub, LinkedIn, copier l'e-mail (retour visuel « copié », repli `mailto:` si le presse-papiers échoue), langue, thème ; chaque bouton icône a un `aria-label` traduit et une info-bulle.
- Given un clavier seul, Then tous les contrôles sont atteignables, avec l'anneau `--focus` de la charte.

### Story 1.3 Profil : hero, à propos, expérience, formation, compétences
Fichiers : `src/data/profil.ts`, `src/components/sections/*.astro`, `src/pages/index.astro`, `src/pages/en/index.astro`.
- Given `src/data/profil.ts` (FR et EN, saisi d'après les CV, LinkedIn faisant foi), When la page s'affiche, Then on voit hero (nom, « AI Architect », accroche, avatar GitHub `https://avatars.githubusercontent.com/u/46462004`), à propos, expérience (employeur, intitulé, dates, 2 à 4 points, dépliable comme la référence), formation, compétences en badges.
- Given n'importe quelle entrée, Then aucun client n'est nommé, aucun téléphone ni adresse n'apparaît (test qui cherche les noms de clients listés dans les CV et un motif de numéro de téléphone dans `dist/`).
- Les divergences entre CV tranchées autrement que par LinkedIn sont listées en commentaire en tête de `profil.ts` pour relecture par Anaël.

### Story 1.4 Projets générés depuis portfolio.json
Fichiers : `scripts/projets.mjs`, `src/data/projets.json` (instantané versionné), `src/components/sections/Projets.astro`, `package.json` (script `prebuild`).
- Given le build, When `scripts/projets.mjs` tourne (Node sans dépendance, `GITHUB_TOKEN` optionnel), Then il lit `portfolio.json` brut et les dépôts publics d'Aliquanto3 ayant le topic `ai-portfolio`, et écrit `src/data/projets.json` : nom affiché, descriptions FR (description GitHub, sinon `fr`) et EN (`en`, sinon description GitHub), clé d'état, release, préversion, URL.
- Given un échec réseau ou API, Then le script garde l'instantané existant, avertit, et le build réussit.
- Given les données, Then les projets sont triés par rang d'état puis nom (insensible aux accents), avec le libellé d'état et la version comme le README, rendus en cartes avec un badge aux couleurs de statut de la charte et un lien vers le dépôt ; un lien « tous les projets sur GitHub » pointe vers `https://github.com/Aliquanto3`.
- Tests unitaires du tri et des libellés sur un jeu fixe (`node --test`).

### Story 1.5 Grille animée, métadonnées, accessibilité, v0.1.0
Fichiers : `src/components/FlickeringGrid.tsx`, `src/layouts/Base.astro`, `public/og.png`, `package.json`.
- Given l'en-tête, Then une grille de carrés qui scintillent (canvas, couleur `--primaire`, masque dégradé vers le bas, réimplémentée d'après le composant MIT) s'affiche ; Given `prefers-reduced-motion: reduce`, Then elle est figée.
- Given la page, Then `title`, `description`, `canonical`, Open Graph et Twitter sont renseignés dans chaque langue.
- Given les deux thèmes, Then les contrastes respectent WCAG AA (contrôle avec les outils de la charte ou axe/Lighthouse).
- Version `0.1.0` dans `package.json`, tag annoté `v0.1.0`, release GitHub avec notes ; puis liens croisés (README du profil et champ Website).
