# Run autonome — anael_homepage

Stories et décisions : `_bmad-output/planning-artifacts/epics.md`.

## Périmètre

| Périmètre | Epics | Note |
| --- | --- | --- |
| Dans le run | Epics 1 à 1 | Stories 1.1 à 1.5, du squelette à la v0.1.0 et aux liens croisés |

Au plus 2 stories en développement à la fois

## Règles du run

- Chaîne par story : `dev-story` (Sonnet) → `second-avis` (Haiku) → `reviewer` (Opus) → fusion, appels bloquants.
- `CVs/` n'est jamais commité (`.gitignore`) ; contenu public sans client nommé ni téléphone.
- Arrêt seulement pour une décision d'Anaël (contenu du profil à valider après 1.3).

## Sprint 1 — Page d'accueil

| Vague | Stories en parallèle | Après |
| --- | --- | --- |
| V0 | 1.1 ★ | |
| V1 | 1.2 · 1.4 | 1.2 ← 1.1 ; 1.4 ← 1.1 |
| V2 | 1.3 | 1.3 ← 1.2 |
| V3 | 1.5 | 1.5 ← 1.3 ; 1.5 ← 1.4 |

## Journal

- 2026-11-20 15:53 · run · décision · cadrage validé (Astro, charte-generique, Pages sur Aliquanto3.github.io, FR/EN, LinkedIn fait foi, clients anonymisés, titre AI Architect) ·
- 2026-11-20 15:55 · 1.1 · dev · lancé (dev-story Opus, worktree) · —
- 2026-11-20 15:57 · 1.1 · blocked · isolation worktree perdue, rien fait ; relance dans un worktree git manuel · —
- 2026-11-20 16:15 · 1.1 · dev · fini, lint/check/build verts, CI PR verte, PR #1 · 389e3cb
- 2026-11-20 16:17 · 1.1 · second-avis · 1 medium (deploy par workflow_dispatch hors main), 2 low · —
- 2026-11-20 16:20 · 1.1 · review · passe 1 : medium corrigé (deploy limité à main), 1 low corrigé, 1 écarté · 5ad0ccc
- 2026-11-20 16:20 · 1.1 · fusion · #1 fusionnée, MERGED vérifié · 650de3c
- 2026-11-20 16:22 · run · décision · cost-kit-install relancé : global conforme, contrôle rapide npm (lint + check) installé · —
- 2026-11-20 16:23 · 1.1 · CI · verte sur main, site publié (https://aliquanto3.github.io/) · 650de3c
