// Génère src/data/projets.json à partir de portfolio.json (Aliquanto3/Aliquanto3)
// et des dépôts publics d'Aliquanto3 portant le topic ai-portfolio, pour la section
// Projets. Node 22, aucune dépendance (fetch natif).
//
// En cas d'échec réseau ou API (y compris 403 et JSON invalide), l'instantané
// existant est conservé, un avertissement est écrit sur stderr et le script
// sort en code 0 (le build ne doit pas échouer). Si aucun instantané n'existe
// encore et que le réseau échoue, src/data/projets.json est écrit à `[]`.
//
// GITHUB_TOKEN (optionnel) : utilisé en en-tête Authorization: Bearer s'il est présent.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORTFOLIO_URL =
  "https://raw.githubusercontent.com/Aliquanto3/Aliquanto3/main/portfolio.json";
const API_BASE = "https://api.github.com";
const OWNER = "Aliquanto3";
const USER_AGENT = "anael-homepage-projets";

const SNAPSHOT_PATH = fileURLToPath(
  new URL("../src/data/projets.json", import.meta.url),
);

function warn(msg) {
  // En CI (GitHub Actions), annotation ::warning:: visible dans le résumé du run.
  const prefix = process.env.GITHUB_ACTIONS === "true" ? "::warning::" : "";
  console.error(`${prefix}avertissement : ${msg}`);
}

// --- Fonctions pures (testées) --------------------------------------------

/** Clé de tri alphabétique insensible à la casse et aux accents. */
export function normalizeForSort(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Nom affiché d'un dépôt dans une langue : name_en (EN), sinon name, sinon nom du dépôt. */
export function displayName(repo, meta, lang = "fr") {
  return (
    (lang === "en" && meta && meta.name_en) || (meta && meta.name) || repo.name
  );
}

/** Clé d'état (topic status-* connu, sinon état par défaut si une release existe). */
export function statusKey(repo, cfg) {
  const key = Object.keys(cfg.statuses).find((k) => repo.topics.includes(k));
  if (key) return key;
  if (repo.release || repo.prerelease) return cfg.release_default;
  return null;
}

/** Libellé d'état dans une langue, avec version et préversion comme le README du profil. */
export function statusLabel(repo, cfg, lang) {
  const key = statusKey(repo, cfg);
  if (!key) return cfg.unknown[lang];
  const st = cfg.statuses[key];
  let label = st[lang];
  if (st.with_version && repo.release) label += ` · ${repo.release}`;
  if (st.with_version && repo.prerelease) {
    label += ` · ${cfg.pending[lang].replace("{tag}", repo.prerelease)}`;
  }
  return label;
}

/** Description dans une langue : FR = description GitHub sinon fr ; EN = en sinon description GitHub. */
export function mergeDescription(repo, meta, lang) {
  if (lang === "fr") {
    return repo.description || (meta && meta.fr) || "";
  }
  return (meta && meta.en) || repo.description || "";
}

/** Dépôts portant le topic suivi. */
export function selectRepos(repos, cfg) {
  return repos.filter((r) => r.topics.includes(cfg.topic));
}

/** Dépôts triés par rang d'état puis nom affiché (insensible à la casse et aux accents). */
export function sortRepos(repos, cfg, lang = "fr") {
  const ranks = Object.values(cfg.statuses).map((s) => s.rank);
  const lastRank = (ranks.length ? Math.max(...ranks) : 0) + 1;
  const meta = cfg.repos || {};
  const rankOf = (r) => {
    const key = statusKey(r, cfg);
    return key ? cfg.statuses[key].rank : lastRank;
  };
  return [...repos].sort((a, b) => {
    const diff = rankOf(a) - rankOf(b);
    if (diff !== 0) return diff;
    const na = normalizeForSort(displayName(a, meta[a.name], lang));
    const nb = normalizeForSort(displayName(b, meta[b.name], lang));
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
  });
}

/** Entrée finale d'un dépôt pour src/data/projets.json. */
export function buildEntry(repo, cfg) {
  const meta = (cfg.repos && cfg.repos[repo.name]) || {};
  return {
    nom: {
      fr: displayName(repo, meta, "fr"),
      en: displayName(repo, meta, "en"),
    },
    description: {
      fr: mergeDescription(repo, meta, "fr"),
      en: mergeDescription(repo, meta, "en"),
    },
    etat: statusKey(repo, cfg),
    etatLabel: {
      fr: statusLabel(repo, cfg, "fr"),
      en: statusLabel(repo, cfg, "en"),
    },
    release: repo.release || null,
    preversion: Boolean(repo.prerelease),
    url: repo.url,
  };
}

/**
 * Jeu de dépôts normalisés -> instantané trié dans l'ordre FR, prêt à sérialiser.
 * `ordre.{fr,en}` donne la position de chaque entrée dans le tri de chaque langue
 * (le nom affiché, donc l'ordre, peut différer entre FR et EN).
 */
export function buildProjets(repos, cfg) {
  const kept = selectRepos(repos, cfg);
  const enIndex = new Map(
    sortRepos(kept, cfg, "en").map((r, i) => [r.name, i]),
  );
  return sortRepos(kept, cfg, "fr").map((r, i) => ({
    ...buildEntry(r, cfg),
    ordre: { fr: i, en: enIndex.get(r.name) },
  }));
}

/** Entrées d'un instantané dans l'ordre d'une langue. */
export function orderFor(entries, lang) {
  return [...entries].sort((a, b) => a.ordre[lang] - b.ordre[lang]);
}

/** Élément de réponse search -> dépôt normalisé, ou null s'il n'est pas public. */
export function normalizeSearchItem(item) {
  if (item.private || item.visibility === "private") return null;
  return {
    name: item.name,
    url: item.html_url,
    description: item.description || "",
    topics: item.topics || [],
  };
}

/** Lève une erreur si le nouvel instantané ne doit pas remplacer l'existant. */
export function checkReplacement(entries, existing) {
  if (entries.length === 0 && Array.isArray(existing) && existing.length > 0) {
    throw new Error(
      "aucun dépôt avec le topic suivi alors que l'instantané en contient",
    );
  }
}

/** Sérialisation déterministe (indentation 2, LF, fin de ligne finale). */
export function formatSnapshot(entries) {
  return `${JSON.stringify(entries, null, 2)}\n`;
}

// --- Accès réseau -----------------------------------------------------------

async function fetchJson(url, token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} pour ${url}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchConfig() {
  const res = await fetch(PORTFOLIO_URL, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} pour portfolio.json`);
    err.status = res.status;
    throw err;
  }
  const text = await res.text();
  return JSON.parse(text);
}

async function fetchRepoList(cfg, token) {
  const repos = [];
  let page = 1;
  for (;;) {
    const url = `${API_BASE}/search/repositories?q=${encodeURIComponent(
      `user:${OWNER} topic:${cfg.topic} is:public fork:true`,
    )}&per_page=100&page=${page}`;
    const data = await fetchJson(url, token);
    if (data.incomplete_results) {
      throw new Error("résultats de recherche GitHub incomplets");
    }
    const items = data.items || [];
    for (const item of items) {
      const repo = normalizeSearchItem(item);
      if (repo) repos.push(repo);
    }
    if (items.length < 100) break;
    page += 1;
  }
  return repos;
}

/** Release stable et préversion la plus récente, même logique que build_portfolio.py. */
async function fetchReleaseInfo(repo, token) {
  let release = null;
  try {
    const data = await fetchJson(
      `${API_BASE}/repos/${OWNER}/${repo.name}/releases/latest`,
      token,
    );
    release = data.tag_name;
  } catch (err) {
    if (err.status !== 404) throw err;
  }
  let prerelease = null;
  try {
    const list = await fetchJson(
      `${API_BASE}/repos/${OWNER}/${repo.name}/releases?per_page=5`,
      token,
    );
    const last = list.find((r) => !r.draft);
    if (last && last.prerelease && last.tag_name !== release) {
      prerelease = last.tag_name;
    }
  } catch (err) {
    if (err.status !== 404) throw err;
  }
  return { ...repo, release, prerelease };
}

async function fetchRepos(cfg, token) {
  const list = await fetchRepoList(cfg, token);
  const withReleases = [];
  for (const repo of list) {
    withReleases.push(await fetchReleaseInfo(repo, token));
  }
  return withReleases;
}

async function readSnapshot(snapshotPath) {
  try {
    return JSON.parse(await readFile(snapshotPath, "utf8"));
  } catch {
    return null;
  }
}

/** Orchestration : construit le nouvel instantané ou conserve l'existant en cas d'échec. */
export async function run({
  snapshotPath = SNAPSHOT_PATH,
  token = process.env.GITHUB_TOKEN,
} = {}) {
  const existing = await readSnapshot(snapshotPath);
  await mkdir(path.dirname(snapshotPath), { recursive: true });
  try {
    const cfg = await fetchConfig();
    const repos = await fetchRepos(cfg, token);
    const entries = buildProjets(repos, cfg);
    checkReplacement(entries, existing);
    await writeFile(snapshotPath, formatSnapshot(entries), "utf8");
    return 0;
  } catch (err) {
    warn(
      `génération de projets.json impossible (${err.message}), instantané conservé`,
    );
    if (existing === null) {
      await writeFile(snapshotPath, formatSnapshot([]), "utf8");
      warn("aucun instantané existant : src/data/projets.json écrit vide ([])");
    }
    return 0;
  }
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  run().then((code) => process.exit(code));
}
