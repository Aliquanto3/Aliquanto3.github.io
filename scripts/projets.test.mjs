import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  normalizeForSort,
  displayName,
  statusKey,
  statusLabel,
  mergeDescription,
  selectRepos,
  sortRepos,
  buildEntry,
  buildProjets,
  orderFor,
  normalizeSearchItem,
  checkReplacement,
  formatSnapshot,
  run,
} from "./projets.mjs";

const CFG = {
  topic: "ai-portfolio",
  statuses: {
    "status-deployed": {
      fr: "Déployé",
      en: "Deployed",
      with_version: true,
      rank: 1,
    },
    "status-dev": { fr: "En dev", en: "In dev", rank: 2 },
  },
  release_default: "status-deployed",
  pending: { fr: "{tag} à tester", en: "{tag} pending" },
  unknown: { fr: "Inconnu", en: "Unknown" },
  repos: {
    zeta: { name: "Zeta", en: "Zeta en" },
    beta: { name: "Beta", en: "a|b\nc" },
  },
};

function repo(
  name,
  { topics = [], release = null, prerelease = null, desc = "d" } = {},
) {
  return {
    name,
    url: `https://x/${name}`,
    description: desc,
    topics: ["ai-portfolio", ...topics],
    release,
    prerelease,
  };
}

test("normalizeForSort ignore la casse et les accents", () => {
  assert.equal(normalizeForSort("Écho"), "echo");
  assert.equal(normalizeForSort("delta"), "delta");
  assert.equal(normalizeForSort(undefined), "");
});

test("displayName : nom du portfolio sinon nom du dépôt", () => {
  assert.equal(displayName(repo("zeta"), CFG.repos.zeta), "Zeta");
  assert.equal(displayName(repo("inconnu"), undefined), "inconnu");
});

test("statusKey : topic connu, sinon état par défaut si release, sinon null", () => {
  assert.equal(
    statusKey(repo("a", { topics: ["status-deployed"] }), CFG),
    "status-deployed",
  );
  assert.equal(statusKey(repo("a", { release: "v1" }), CFG), "status-deployed");
  assert.equal(statusKey(repo("a"), CFG), null);
});

test("statusKey : priorité à l'ordre de configuration", () => {
  assert.equal(
    statusKey(repo("a", { topics: ["status-dev", "status-deployed"] }), CFG),
    "status-deployed",
  );
});

test("statusLabel : version et préversion comme le README", () => {
  assert.equal(
    statusLabel(
      repo("a", { topics: ["status-deployed"], release: "v1" }),
      CFG,
      "fr",
    ),
    "Déployé · v1",
  );
  assert.equal(
    statusLabel(
      repo("a", {
        topics: ["status-deployed"],
        release: "v1",
        prerelease: "v2",
      }),
      CFG,
      "fr",
    ),
    "Déployé · v1 · v2 à tester",
  );
  assert.equal(
    statusLabel(
      repo("a", { topics: ["status-dev"], release: "v1" }),
      CFG,
      "fr",
    ),
    "En dev",
  );
  assert.equal(statusLabel(repo("a"), CFG, "fr"), "Inconnu");
  assert.equal(statusLabel(repo("a"), CFG, "en"), "Unknown");
});

test("mergeDescription : repli FR puis EN", () => {
  const meta = { fr: "desc portfolio", en: "portfolio desc" };
  assert.equal(
    mergeDescription(repo("a", { desc: "github desc" }), meta, "fr"),
    "github desc",
  );
  assert.equal(
    mergeDescription(repo("a", { desc: "" }), meta, "fr"),
    "desc portfolio",
  );
  assert.equal(
    mergeDescription(repo("a", { desc: "github desc" }), meta, "en"),
    "portfolio desc",
  );
  assert.equal(
    mergeDescription(repo("a", { desc: "github desc" }), {}, "en"),
    "github desc",
  );
});

test("selectRepos : uniquement le topic suivi", () => {
  const repos = [repo("a"), { ...repo("b"), topics: ["autre"] }];
  assert.deepEqual(
    selectRepos(repos, CFG).map((r) => r.name),
    ["a"],
  );
});

test("sortRepos : rang d'état puis nom, accents et casse ignorés", () => {
  const repos = [
    repo("zeta", { topics: ["status-dev"] }),
    repo("beta", { topics: ["status-dev"] }),
    repo("alpha", { topics: ["status-dev"] }),
    repo("omega", { topics: ["status-deployed"] }),
    repo("nul"),
  ];
  assert.deepEqual(
    sortRepos(repos, CFG).map((r) => r.name),
    ["omega", "alpha", "beta", "zeta", "nul"],
  );

  const cfgAccents = {
    ...CFG,
    repos: {
      e: { name: "Écho" },
      d: { name: "delta" },
      f: { name: "Foxtrot" },
    },
  };
  const accentRepos = [
    repo("f", { topics: ["status-dev"] }),
    repo("e", { topics: ["status-dev"] }),
    repo("d", { topics: ["status-dev"] }),
  ];
  assert.deepEqual(
    sortRepos(accentRepos, cfgAccents).map((r) => r.name),
    ["d", "e", "f"],
  );
});

test("buildEntry : forme complète d'une entrée", () => {
  const entry = buildEntry(
    repo("zeta", {
      topics: ["status-deployed"],
      release: "v1",
      prerelease: "v2",
      desc: "d",
    }),
    CFG,
  );
  assert.deepEqual(entry, {
    nom: { fr: "Zeta", en: "Zeta" },
    description: { fr: "d", en: "Zeta en" },
    etat: "status-deployed",
    etatLabel: {
      fr: "Déployé · v1 · v2 à tester",
      en: "Deployed · v1 · v2 pending",
    },
    release: "v1",
    preversion: true,
    url: "https://x/zeta",
  });
});

test("buildProjets : filtre, trie et construit en un seul passage", () => {
  const repos = [
    repo("zeta", { topics: ["status-dev"] }),
    repo("omega", { topics: ["status-deployed"] }),
    { ...repo("hors-sujet"), topics: ["autre"] },
  ];
  const projets = buildProjets(repos, CFG);
  assert.deepEqual(
    projets.map((p) => p.nom.fr),
    ["omega", "Zeta"],
  );
});

test("formatSnapshot : indentation 2, LF, fin de ligne finale", () => {
  const out = formatSnapshot([{ a: 1 }]);
  assert.equal(out, '[\n  {\n    "a": 1\n  }\n]\n');
  assert.ok(!out.includes("\r"));
});

// --- run() : garde l'instantané en cas d'échec réseau ou API ---------------

test("run : conserve l'instantané existant si le réseau échoue (ex. 403)", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "projets-test-"));
  const snapshotPath = path.join(dir, "projets.json");
  const existing = formatSnapshot([
    { nom: "Déjà là", description: { fr: "", en: "" } },
  ]);
  await writeFile(snapshotPath, existing, "utf8");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 403,
    text: async () => "",
  });
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const originalErr = console.error;
  const warnings = [];
  console.error = (msg) => warnings.push(msg);
  t.after(() => {
    console.error = originalErr;
  });

  const code = await run({ snapshotPath });

  assert.equal(code, 0);
  assert.equal(await readFile(snapshotPath, "utf8"), existing);
  assert.ok(warnings.some((w) => w.includes("avertissement")));

  await rm(dir, { recursive: true, force: true });
});

test("run : JSON invalide dans portfolio.json garde aussi l'instantané", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "projets-test-"));
  const snapshotPath = path.join(dir, "projets.json");
  const existing = formatSnapshot([]);
  await writeFile(snapshotPath, existing, "utf8");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    text: async () => "pas du json",
  });
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const originalErr = console.error;
  console.error = () => {};
  t.after(() => {
    console.error = originalErr;
  });

  const code = await run({ snapshotPath });

  assert.equal(code, 0);
  assert.equal(await readFile(snapshotPath, "utf8"), existing);

  await rm(dir, { recursive: true, force: true });
});

test("run : sans instantané existant et réseau en échec, écrit []", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "projets-test-"));
  const snapshotPath = path.join(dir, "projets.json");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    text: async () => "",
  });
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const originalErr = console.error;
  console.error = () => {};
  t.after(() => {
    console.error = originalErr;
  });

  const code = await run({ snapshotPath });

  assert.equal(code, 0);
  assert.equal(await readFile(snapshotPath, "utf8"), "[]\n");

  await rm(dir, { recursive: true, force: true });
});

test("run : construit l'instantané à partir de l'API simulée", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "projets-test-"));
  const snapshotPath = path.join(dir, "projets.json");

  const cfg = CFG;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.includes("raw.githubusercontent.com")) {
      return { ok: true, status: 200, text: async () => JSON.stringify(cfg) };
    }
    if (u.includes("/search/repositories")) {
      const q = new URL(u).searchParams.get("q");
      assert.match(q, / is:public( |$)/);
      assert.match(q, / fork:true( |$)/);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              name: "zeta",
              html_url: "https://x/zeta",
              description: "desc github",
              topics: ["ai-portfolio", "status-deployed"],
            },
            {
              name: "secret",
              html_url: "https://x/secret",
              description: "privé",
              private: true,
              topics: ["ai-portfolio", "status-deployed"],
            },
          ],
        }),
      };
    }
    if (u.includes("/releases/latest")) {
      return { ok: true, status: 200, json: async () => ({ tag_name: "v1" }) };
    }
    if (u.includes("/releases?")) {
      return {
        ok: true,
        status: 200,
        json: async () => [{ tag_name: "v1", prerelease: false, draft: false }],
      };
    }
    throw new Error(`url inattendue : ${u}`);
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const code = await run({ snapshotPath });
  assert.equal(code, 0);
  const written = JSON.parse(await readFile(snapshotPath, "utf8"));
  assert.deepEqual(written, [
    {
      nom: { fr: "Zeta", en: "Zeta" },
      description: { fr: "desc github", en: "Zeta en" },
      etat: "status-deployed",
      etatLabel: { fr: "Déployé · v1", en: "Deployed · v1" },
      release: "v1",
      preversion: false,
      url: "https://x/zeta",
      ordre: { fr: 0, en: 0 },
    },
  ]);

  await rm(dir, { recursive: true, force: true });
});

// --- name_en, dépôts privés, réponses vides ou incomplètes -----------------

const CFG_EN = {
  ...CFG,
  repos: {
    copilote: { name: "Copilote Jira", name_en: "Jira Copilot" },
    banc: { name: "Banc" },
  },
};

test("displayName : name_en en anglais, name sinon", () => {
  const meta = CFG_EN.repos.copilote;
  assert.equal(displayName(repo("copilote"), meta, "fr"), "Copilote Jira");
  assert.equal(displayName(repo("copilote"), meta, "en"), "Jira Copilot");
  assert.equal(displayName(repo("banc"), CFG_EN.repos.banc, "en"), "Banc");
});

test("buildProjets : nom et ordre par langue (name_en change le tri)", () => {
  const repos = [
    repo("copilote", { topics: ["status-dev"] }),
    repo("banc", { topics: ["status-dev"] }),
  ];
  const projets = buildProjets(repos, CFG_EN);
  // FR : Banc < Copilote Jira ; EN : Banc < Jira Copilot aussi, donc on
  // ajoute un dépôt qui s'intercale entre les deux noms anglais.
  const plus = buildProjets(
    [...repos, repo("dauphin", { topics: ["status-dev"] })],
    CFG_EN,
  );
  assert.deepEqual(
    projets.map((p) => p.nom.en),
    ["Banc", "Jira Copilot"],
  );
  assert.deepEqual(
    orderFor(plus, "fr").map((p) => p.nom.fr),
    ["Banc", "Copilote Jira", "dauphin"],
  );
  assert.deepEqual(
    orderFor(plus, "en").map((p) => p.nom.en),
    ["Banc", "dauphin", "Jira Copilot"],
  );
});

test("normalizeSearchItem : écarte les dépôts privés", () => {
  assert.equal(normalizeSearchItem({ name: "a", private: true }), null);
  assert.equal(normalizeSearchItem({ name: "a", visibility: "private" }), null);
  assert.deepEqual(
    normalizeSearchItem({ name: "a", html_url: "u", private: false }),
    { name: "a", url: "u", description: "", topics: [] },
  );
});

test("checkReplacement : zéro projet ne remplace pas un instantané non vide", () => {
  assert.throws(() => checkReplacement([], [{ nom: "x" }]));
  assert.doesNotThrow(() => checkReplacement([], []));
  assert.doesNotThrow(() => checkReplacement([], null));
  assert.doesNotThrow(() => checkReplacement([{}], [{ nom: "x" }]));
});

async function runWithSearch(t, searchBody) {
  const dir = await mkdtemp(path.join(tmpdir(), "projets-test-"));
  const snapshotPath = path.join(dir, "projets.json");
  const existing = formatSnapshot([{ nom: { fr: "Déjà là", en: "Already" } }]);
  await writeFile(snapshotPath, existing, "utf8");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.includes("raw.githubusercontent.com")) {
      return { ok: true, status: 200, text: async () => JSON.stringify(CFG) };
    }
    if (u.includes("/search/repositories")) {
      return { ok: true, status: 200, json: async () => searchBody };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
  const originalErr = console.error;
  const warnings = [];
  console.error = (msg) => warnings.push(msg);
  t.after(async () => {
    globalThis.fetch = originalFetch;
    console.error = originalErr;
    await rm(dir, { recursive: true, force: true });
  });
  const code = await run({ snapshotPath });
  return {
    code,
    existing,
    written: await readFile(snapshotPath, "utf8"),
    warnings,
  };
}

test("run : réponse search vide garde l'instantané non vide", async (t) => {
  const r = await runWithSearch(t, { incomplete_results: false, items: [] });
  assert.equal(r.code, 0);
  assert.equal(r.written, r.existing);
  assert.ok(r.warnings.some((w) => w.includes("avertissement")));
});

test("run : réponse search incomplète garde l'instantané", async (t) => {
  const item = {
    name: "zeta",
    html_url: "https://x/zeta",
    topics: ["ai-portfolio", "status-dev"],
  };
  const r = await runWithSearch(t, { incomplete_results: true, items: [item] });
  assert.equal(r.code, 0);
  assert.equal(r.written, r.existing);
  assert.ok(r.warnings.some((w) => w.includes("incomplets")));
});
