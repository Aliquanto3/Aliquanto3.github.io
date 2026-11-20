# anael_homepage

Page d'accueil personnelle d'Anaël Yahi, architecte IA : https://aliquanto3.github.io/
(français à `/`, anglais à `/en/`).

Site statique Astro, îlots React, Tailwind pour la mise en page, à la charte
[charte-generique](https://github.com/Aliquanto3/charte-generique).

## Commandes

Node 22 ou plus récent.

```sh
npm ci           # installe les dépendances
npm run dev      # serveur de développement
npm run build    # site statique dans dist/
npm run preview  # sert dist/
npm run check    # astro check (types)
npm run lint     # prettier --check
```

## Déploiement

GitHub Actions (`.github/workflows/deploy.yml`) construit le site et le publie
sur GitHub Pages à chaque push sur `main`, chaque lundi à 06:00 UTC et à la
demande. Sur une pull request, la CI lance lint, check et build sans déployer.

## Crédits

Design inspiré de [dillionverma/portfolio](https://github.com/dillionverma/portfolio)
(MIT, © Dillion Verma) et de son [portage Astro](https://portfolio.abdoulayetall.workers.dev/).
Code sous licence MIT (voir `LICENSE`).
