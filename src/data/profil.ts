/**
 * Données de profil (FR/EN), tirées des CV d'Anaël Yahi (`CVs/`, non
 * versionné). LinkedIn fait foi pour les dates, intitulés et chiffres.
 * Clients anonymisés : seuls les employeurs sont nommés (cf. CLAUDE.md).
 * Expériences en ordre antichronologique (date de début).
 *
 * À relire par Anaël (divergences entre CV, choix éditoriaux) :
 * - Titre « AI Architect » / « Architecte IA » : décision d'Anaël, gardé alors que LinkedIn porte « Consultant senior » (poste) et « Consultant Senior IA | Architecte IA Agentique & RAG » (titre de profil).
 * - Intitulés : ceux de LinkedIn (Consultant senior, Consultant, Auteur, Étudiant stagiaire…), plus sobres que ceux des autres CV (Senior Consultant IA, Auteur technique, Data scientist…) : à confirmer.
 * - Sopra Steria : deux postes comme LinkedIn (stage 03/2019-11/2019, Ingénieur logiciels 11/2019-09/2020) ; un autre CV donne un poste unique 04/2019-08/2020, non retenu.
 * - Statisticien 2021 : LinkedIn nomme comme employeur une personne physique (consultant indépendant), remplacée par « Cabinet indépendant d'évaluation éducative » ; deux postes comme LinkedIn (01-04/2021, 06-07/2021) au lieu d'un CDD continu ; nombre d'élèves et langues retirés car ils identifient le projet.
 * - Cardmarket : employeur sur LinkedIn (« Auteur », 02/2021-01/2022), freelance de data science encore en cours avec d'autres éditeurs dans un autre CV : repris comme LinkedIn.
 * - aldecis : stage selon deux autres CV, LinkedIn ne le dit pas : pas de mention de stage.
 * - Agents Copilot Studio : un autre CV range 13 agents en 2023-2025 ; LinkedIn place 10 agents au poste actuel : 10 au poste actuel, sans chiffre en 2023-2025.
 * - Étude comparative Claude / Copilot : au poste actuel, restituée à la direction IT comme sur LinkedIn (un autre CV la range en 2023-2025 et dit CODIR).
 * - « Cinq ans » d'IA dans les autres CV : LinkedIn date le premier RAG de 2023 et les agents de 2024 ; à propos réécrit en « depuis 2023 ».
 * - Portefeuille de 8 projets IA : chiffre absent de LinkedIn, tiré d'un autre CV.
 * - Mission de stratégie IA pour une collectivité (poste actuel, sur LinkedIn) non reprise : 4 points au plus par poste, à arbitrer.
 * - Deux stages antérieurs à 2019 (industriel en 2017, conseil en organisation en 2018), dans un seul CV et absents de LinkedIn : non repris.
 * - Présidence d'une association (jeu de cartes à collectionner, 2022-2024), présente sur LinkedIn : non reprise en expérience professionnelle, à confirmer.
 */

import type { Lang } from "../i18n/ui";

export interface TexteBilingue {
  fr: string;
  en: string;
}

export const identite = {
  nom: "Anaël Yahi",
  titre: { fr: "Architecte IA", en: "AI Architect" } as TexteBilingue,
  accroche: {
    fr: "Agents IA, RAG, stratégie et gouvernance : je fais passer les cas d'usage IA de l'idée à la production.",
    en: "AI agents, RAG, strategy and governance: I take AI use cases from idea to production.",
  } as TexteBilingue,
  avatar: "https://avatars.githubusercontent.com/u/46462004",
} as const;

export const aPropos: TexteBilingue = {
  fr: "Depuis 2023, je conçois et déploie des architectures RAG puis des agents IA pour des banques, des assureurs, le secteur public et des institutions internationales, après quatre ans de développement logiciel, de data science et de conseil. Je challenge le besoin avant la technologie - IA générative, automatisation classique ou refonte de processus - pour une valeur métier mesurable, avec une gouvernance native dès la conception : métriques de valeur, conformité, sécurité, éthique, impact environnemental.",
  en: "Since 2023, I have been designing and deploying RAG architectures, then AI agents, for banks, insurers, the public sector and international institutions, after four years in software development, data science and consulting. I challenge the need before the technology - generative AI, classic automation or process redesign - for measurable business value, with governance built in from the start: value metrics, compliance, security, ethics, environmental impact.",
};

export interface Experience {
  /** Nom de l'employeur, ou libellé bilingue s'il est anonymisé. */
  employeur: string | TexteBilingue;
  intitule: TexteBilingue;
  /** Début, ISO `AAAA-MM`. */
  debut: string;
  /** Fin, ISO `AAAA-MM`, ou `null` pour un poste en cours. */
  fin: string | null;
  /** Ville, pays au plus (pas d'adresse). */
  lieu?: string;
  /** 2 à 4 points, clients anonymisés par secteur. */
  points: TexteBilingue[];
}

export const experiences: Experience[] = [
  {
    employeur: "Wavestone",
    intitule: { fr: "Consultant senior", en: "Senior Consultant" },
    debut: "2025-09",
    fin: null,
    lieu: "Nantes, France",
    points: [
      {
        fr: "Référent technico-commercial de l'offre IA de l'agence de Nantes (avant-vente, chiffrage, appels d'offres), responsable de ses formations IA et de la veille technologique IA du cabinet en France.",
        en: "Technical and commercial lead for the Nantes office's AI offering (pre-sales, pricing, tenders), in charge of its AI training and of the firm's AI technology watch in France.",
      },
      {
        fr: "Expert technique en impact environnemental de l'IA pour un acteur bancaire : choix d'une méthodologie d'estimation et application à 3 systèmes d'IA.",
        en: "Technical expert on AI environmental impact for a banking group: choice of an estimation methodology and application to 3 AI systems.",
      },
      {
        fr: "Chef de projet Copilot Studio dans le secteur automobile : gouvernance technique et fonctionnelle, développement de 10 agents.",
        en: "Copilot Studio project manager in the automotive sector: technical and functional governance, development of 10 agents.",
      },
      {
        fr: "Chef de projet d'une étude comparative Claude / Copilot pour un assureur : cas d'usage, méthodologie de test, restitution à la direction IT.",
        en: "Project manager for a Claude vs Copilot comparative study for an insurer: use cases, test methodology, findings presented to IT management.",
      },
    ],
  },
  {
    employeur: "Wavestone",
    intitule: { fr: "Consultant", en: "Consultant" },
    debut: "2023-09",
    fin: "2025-09",
    lieu: "Nantes, France",
    points: [
      {
        fr: "Agents et systèmes multi-agents sous Copilot Studio pour deux programmes Microsoft, dans l'agro-alimentaire et l'IT.",
        en: "Agents and multi-agent systems on Copilot Studio for two Microsoft programs, in the food and IT sectors.",
      },
      {
        fr: "PMO IA générative pour un assureur : gouvernance et suivi budgétaire, portefeuille de 8 projets IA priorisés sur le ROI et la faisabilité, acculturation de plus de 100 collaborateurs.",
        en: "Generative AI PMO for an insurer: governance and budget tracking, an 8-project AI portfolio prioritized on ROI and feasibility, AI awareness for over 100 employees.",
      },
      {
        fr: "Urbanisation du SI d'un assureur : cartographie applicative (~150 applications) et pilotage d'études d'IA générative, dont un POC de RAG sur AWS Bedrock.",
        en: "Enterprise architecture for an insurer: application map (~150 applications) and generative AI studies, including a RAG proof of concept on AWS Bedrock.",
      },
      {
        fr: "Registres DORA pour des assureurs : dry run, collecte multi-filiales, analyse semi-automatisée de contrats par LLM.",
        en: "DORA registers for insurers: dry run, multi-subsidiary data collection, LLM-assisted contract analysis.",
      },
    ],
  },
  {
    employeur: "Wavestone",
    intitule: { fr: "Analyste", en: "Analyst" },
    debut: "2022-09",
    fin: "2023-09",
    lieu: "Nantes, France",
    points: [
      {
        fr: "Analyse de réponses à des appels d'offres d'intégrateurs (ITSM, migration de data centers) pour de grands groupes internationaux.",
        en: "Analysis of integrator tender responses (ITSM, data center migration) for large international groups.",
      },
      {
        fr: "Construction d'une grille de notation, évaluation et simulations financières des offres des soumissionnaires.",
        en: "Design of a scoring grid, evaluation and financial simulations of bidders' offers.",
      },
    ],
  },
  {
    employeur: "aldecis",
    intitule: {
      fr: "Ingénieur data visualisation",
      en: "Data Visualization Engineer",
    },
    debut: "2022-02",
    fin: "2022-06",
    points: [
      {
        fr: "Développement d'un tableau de bord innovant d'analyse financière (Power BI, JavaScript).",
        en: "Development of an innovative financial analysis dashboard (Power BI, JavaScript).",
      },
      {
        fr: "Classification non supervisée de données en 5 catégories de comportement client (R, Shiny).",
        en: "Unsupervised classification of data into 5 customer behavior categories (R, Shiny).",
      },
    ],
  },
  {
    employeur: {
      fr: "Cabinet indépendant d'évaluation éducative",
      en: "Independent education assessment practice",
    },
    intitule: { fr: "Statisticien consultant", en: "Statistician Consultant" },
    debut: "2021-06",
    fin: "2021-07",
    points: [
      {
        fr: "Conception de deux modules de formation (maîtrise de R, psychométrie) et appui à la formation d'une équipe d'évaluation des acquis.",
        en: "Design of two training modules (R proficiency, psychometrics) and support in training a learning assessment team.",
      },
      {
        fr: "Formation du personnel à R et montée en compétences en machine learning, data visualisation et Python.",
        en: "Staff training in R and upskilling in machine learning, data visualization and Python.",
      },
    ],
  },
  {
    employeur: "Cardmarket",
    intitule: { fr: "Auteur", en: "Author" },
    debut: "2021-02",
    fin: "2022-01",
    points: [
      {
        fr: "Rédaction d'analyses statistiques régulières de résultats de tournois, pour un lectorat international.",
        en: "Regular statistical analyses of tournament results, for an international readership.",
      },
      {
        fr: "Méthodologie d'analyse développée en R et diffusée en code ouvert, avec une application Shiny.",
        en: "Analysis methodology built in R and released as open source, with a Shiny application.",
      },
    ],
  },
  {
    employeur: {
      fr: "Cabinet indépendant d'évaluation éducative",
      en: "Independent education assessment practice",
    },
    intitule: { fr: "Statisticien", en: "Statistician" },
    debut: "2021-01",
    fin: "2021-04",
    points: [
      {
        fr: "Rédaction et contrôle qualité de questionnaires d'évaluation des acquis scolaires, implémentation sous Tangerine.",
        en: "Writing and quality control of school learning assessment questionnaires, implemented in Tangerine.",
      },
      {
        fr: "Nettoyage et analyse des données (théorie classique des tests, théorie de réponse à l'item) sous R et Stata, présentation des résultats et rapport.",
        en: "Data cleaning and analysis (classical test theory, item response theory) using R and Stata, presentation of results and report.",
      },
    ],
  },
  {
    employeur: "Sopra Steria",
    intitule: { fr: "Ingénieur logiciels", en: "Software Engineer" },
    debut: "2019-11",
    fin: "2020-09",
    lieu: "Nantes, France",
    points: [
      {
        fr: "Développement et maintenance (Java, SQL) d'une base de données pour une institution publique européenne.",
        en: "Development and maintenance (Java, SQL) of a database for a European public institution.",
      },
      {
        fr: "Déploiement, maintien du code existant et préparation d'une nouvelle version, sur un système à fortes contraintes de disponibilité et de sécurité.",
        en: "Deployment, legacy code maintenance and preparation of a new version, on a system with strong availability and security requirements.",
      },
    ],
  },
  {
    employeur: "Sopra Steria",
    intitule: { fr: "Étudiant stagiaire", en: "Student Intern" },
    debut: "2019-03",
    fin: "2019-11",
    lieu: "Nantes, France",
    points: [
      {
        fr: "Projet de fin d'études sur la même base de données : business analysis et spécification des évolutions.",
        en: "Final-year project on the same database: business analysis and specification of changes.",
      },
      {
        fr: "Programmation (Java, SQL) et qualification des développements.",
        en: "Programming (Java, SQL) and testing of the developments.",
      },
    ],
  },
];

/** Libellé de l'employeur dans la langue demandée. */
export function nomEmployeur(
  lang: Lang,
  employeur: Experience["employeur"],
): string {
  return typeof employeur === "string" ? employeur : employeur[lang];
}

export interface Formation {
  etablissement: string;
  diplome: TexteBilingue;
  /** Années de début et de fin (les CV ne donnent pas les mois). */
  debut: string;
  fin: string;
}

export const formations: Formation[] = [
  {
    etablissement: "Université Bretagne Sud",
    diplome: {
      fr: "Master Statistiques et science des données",
      en: "Master's in Statistics and Data Science",
    },
    debut: "2020",
    fin: "2022",
  },
  {
    etablissement: "IMT Mines Alès",
    diplome: {
      fr: "Diplôme d'ingénieur, informatique",
      en: "Engineering degree, Information Technology",
    },
    debut: "2016",
    fin: "2019",
  },
];

export interface GroupeCompetences {
  titre: TexteBilingue;
  badges: string[];
}

export const competences: GroupeCompetences[] = [
  {
    titre: {
      fr: "Data science et développement",
      en: "Data science & engineering",
    },
    badges: [
      "Python",
      "R",
      "SQL",
      "TypeScript",
      "Java",
      "Git",
      "Power BI",
      "Databricks",
      "Dataiku",
    ],
  },
  {
    titre: { fr: "IA générative et agentique", en: "Generative & agentic AI" },
    badges: [
      "Copilot Studio",
      "RAG",
      "AWS Bedrock",
      "Azure AI Foundry",
      "Claude",
      "MCP",
      "Prompt engineering",
    ],
  },
  {
    titre: { fr: "Produit et pilotage", en: "Product & delivery" },
    badges: ["Agile (Scrum, Kanban)", "Jira", "Priorisation ROI", "Roadmap"],
  },
  {
    titre: { fr: "Gouvernance IA", en: "AI governance" },
    badges: [
      "AI Act",
      "DORA",
      "Analyse de risque",
      "Conformité",
      "Impact environnemental",
    ],
  },
];

const MOIS_COURT: Record<Lang, string[]> = {
  fr: [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

/** `iso` au format `AAAA-MM`. Pas de dépendance à `Intl` : rendu déterministe. */
export function formatMois(lang: Lang, iso: string): string {
  const [annee, mois] = iso.split("-");
  const index = Number(mois) - 1;
  return `${MOIS_COURT[lang][index]} ${annee}`;
}

/** `fin` à `null` pour un poste en cours. */
export function formatPeriode(
  lang: Lang,
  debut: string,
  fin: string | null,
): string {
  const debutTxt = formatMois(lang, debut);
  const finTxt = fin
    ? formatMois(lang, fin)
    : lang === "fr"
      ? "aujourd'hui"
      : "present";
  return `${debutTxt} – ${finTxt}`;
}
