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
- 2026-11-20 16:24 · 1.2 · dev · lancé (dev-story Sonnet, worktree) · —
- 2026-11-20 16:24 · 1.4 · dev · lancé (dev-story Sonnet, worktree) · —
- 2026-11-20 16:32 · 1.2 · dev · fini, contrôle rapide + build verts, PR #2 · 85c264d
- 2026-11-20 16:34 · 1.2 · second-avis · 0 high/medium, 7 low (prototype dans getLangFromUrl, label-in-name, tooltip qui déborde à 320 px…) · —
- 2026-11-20 16:36 · 1.4 · dev · fini, 15 tests verts, 18 projets, PR #3 · 63d55a4
- 2026-11-20 16:38 · 1.4 · second-avis · 3 high (name_en ignoré, instantané écrasé par réponse vide, dépôts privés avec jeton), 2 medium, 3 low · —
- 2026-11-20 16:39 · 1.2 · review · passe 1 : 0 Important, 6 low corrigés, 1 écarté · 2e5388f
- 2026-11-20 16:39 · 1.2 · fusion · #2 fusionnée, MERGED vérifié · c10b365
- 2026-11-20 16:39 · 1.3 · dev · lancé (dev-story Sonnet, worktree) · —
- 2026-11-20 16:45 · 1.4 · review · passe 1 : 3 high + 2 medium corrigés, 2 low corrigés, 1 écarté ; 21 tests · 832ce98
- 2026-11-20 16:49 · 1.4 · review · passe 2 : rebasée sur main, 0 Important, 3 low laissés · 1154092
- 2026-11-20 16:50 · 1.4 · fusion · #3 fusionnée, MERGED vérifié · 9023ee6
- 2026-11-20 16:54 · 1.3 · dev · fini, rebasée sur 1.4, verif confidentialité verte, PR #4 · 65508f7
- 2026-11-20 17:00 · 1.3 · second-avis · 1 high (employeur = personne physique + détail qui identifie un client), 8 medium (liste à masquer incomplète de 7, dates et intitulés hors LinkedIn, verif pas jouée en CI), 2 low · —
- 2026-11-20 17:12 · 1.3 · review · passe 1 : 1 high + 7 medium corrigés, 2 low corrigés ; liste à masquer 5 → 18 noms ; historique réécrit en 1 commit (nom d'intermédiaire) · d6fa1b9
- 2026-11-20 17:12 · 1.3 · attente humaine · relecture du profil par Anaël (questions en tête de src/data/profil.ts) et secret CLIENTS_A_MASQUER_B64 à poser · d6fa1b9
