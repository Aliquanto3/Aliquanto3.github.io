# anael_homepage

Page d'accueil d'Anaël Yahi (Astro statique, îlots React, Tailwind pour la mise
en page seulement), publiée sur https://aliquanto3.github.io/ par GitHub Pages.
Epics, décisions et stories : `_bmad-output/planning-artifacts/epics.md`.

## Commandes

- `npm run dev` : serveur de développement
- `npm run build` : site statique dans `dist/`
- `npm run check` : `astro check`
- `npm run lint` : `prettier --check .` (corriger avec `npx prettier --write .`)

La CI (`.github/workflows/deploy.yml`) lance lint, check et build sur chaque PR
(porte de fusion) et déploie sur `main`, le lundi 06:00 UTC et à la demande.

## Règles

- Couleurs, polices et rayons : variables de la charte uniquement
  (`src/styles/charte.css`, copie verbatim de charte-generique v2.1.0, à ne pas
  modifier). Les palettes, polices et rayons de Tailwind sont désactivés dans
  `src/styles/global.css`.
- Thème : sombre par défaut, clair par `data-theme="clair"` sur `<html>`
  (`data-theme="sombre"` force le sombre). Le script inline de
  `src/layouts/Base.astro` pose l'attribut avant le rendu : `localStorage`
  clé `theme` (`sombre` | `clair`) prime, sinon `prefers-color-scheme`. Une
  bascule écrit l'attribut et la même clé (dans un try/catch).
- Polices par `@fontsource` (Sora, Atkinson Hyperlegible, JetBrains Mono),
  jamais Google Fonts ni CDN.
- i18n : `fr` à `/`, `en` à `/en/` ; `Base.astro` prend `lang`, `title`,
  `description` et pose `canonical` et `hreflang` fr/en/x-default.
- `CVs/` n'est jamais versionné ni publié. Clients toujours anonymisés : seuls
  les employeurs sont nommés. Pas de téléphone ni d'adresse.
- Fins de ligne LF (`.gitattributes`). Sous Windows, `uv run python`, jamais
  `python` nu.
