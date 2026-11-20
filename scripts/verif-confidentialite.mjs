#!/usr/bin/env node
/**
 * Vérifie l'absence de téléphone et de noms de clients anonymisés dans
 * `dist/` (.html, .json, .js, .mjs, .xml, .txt, .webmanifest). Node sans
 * dépendance.
 *
 * - Partie (a), téléphones : toujours jouée.
 * - Partie (b), clients : un nom par ligne (`#` en tête : commentaire), lu
 *   dans l'ordre
 *   1. le fichier pointé par `CLIENTS_A_MASQUER` ;
 *   2. la variable `CLIENTS_A_MASQUER_B64` (contenu du fichier en base64 :
 *      secret GitHub Actions en CI, le dépôt est public et la liste n'y est
 *      jamais versionnée) ;
 *   3. `<racine du dépôt>/CVs/clients-a-masquer.txt` (poste d'Anaël).
 *   Aucune source : partie sautée, avec un avertissement `::warning::`.
 *
 * Le texte est normalisé avant recherche : balises retirées, entités HTML
 * décodées, espaces (dont insécables) réduits, apostrophes typographiques
 * ramenées à `'`, accents et casse ignorés.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const racine = resolve(__dirname, "..");
const distDir = resolve(racine, "dist");

const EXTENSIONS = new Set([
  ".html",
  ".json",
  ".js",
  ".mjs",
  ".xml",
  ".txt",
  ".webmanifest",
]);

export function listeFichiers(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entree of readdirSync(dir, { withFileTypes: true })) {
    const chemin = join(dir, entree.name);
    if (entree.isDirectory()) out.push(...listeFichiers(chemin));
    else if (EXTENSIONS.has(extname(entree.name))) out.push(chemin);
  }
  return out;
}

const ENTITES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "'",
  lsquo: "'",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  agrave: "à",
  ccedil: "ç",
  ocirc: "ô",
  icirc: "î",
  ucirc: "û",
};

export function decodeEntites(texte) {
  return texte.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tout, corps) => {
    if (corps[0] === "#") {
      const hexa = corps[1] === "x" || corps[1] === "X";
      const code = hexa
        ? parseInt(corps.slice(2), 16)
        : parseInt(corps.slice(1), 10);
      return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : tout;
    }
    return ENTITES[corps.toLowerCase()] ?? tout;
  });
}

// Balises en ligne : retirées sans espace (un nom coupé par `<b>` se
// recolle) ; les autres balises séparent les mots.
const BALISE_EN_LIGNE =
  /<\/?(?:a|abbr|b|bdi|bdo|cite|code|data|dfn|em|i|kbd|mark|q|s|samp|small|span|strong|sub|sup|time|u|var|wbr)\b[^>]*>/gi;

/**
 * Texte comparable : balises en ligne retirées, autres balises remplacées par
 * `separateur`, entités décodées, apostrophes et espaces unifiées, accents et
 * casse ignorés.
 */
export function normalise(texte, separateur = " ") {
  const sansBalises = texte
    .replace(BALISE_EN_LIGNE, "")
    .replace(/<[^>]*>/g, separateur);
  return decodeEntites(sansBalises)
    .replace(/[\u2018\u2019\u02bc\u00b4`]/g, "'")
    .replace(/[\s\u00a0\u202f\u2007\u2009]+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// (a) Téléphones, cherchés sur le texte normalisé (insécables et entités
// déjà ramenées à une espace) : numéro FR à 10 chiffres, +33 avec ou sans
// « (0) », et un motif international générique (indicatif puis 3 à 5
// groupes de chiffres). Les dates (AAAA-MM-JJ) et les versions (x.y.z) ne
// correspondent pas à ces formes.
const MOTIFS_TELEPHONE = [
  /(?<!\d)0[1-9](?:[ .-]?\d{2}){4}(?!\d)/g,
  /\+33[ .-]?(?:\(0\)[ .-]?)?[1-9](?:[ .-]?\d{2}){4}(?!\d)/g,
  /\+\d{1,3}[ .-]?(?:\(0\)[ .-]?)?\d{1,4}(?:[ .-]?\d{2,4}){2,4}(?!\d)/g,
];

export function chercheTelephones(texteNormalise) {
  const trouvailles = new Set();
  for (const motif of MOTIFS_TELEPHONE) {
    for (const m of texteNormalise.matchAll(motif)) trouvailles.add(m[0]);
  }
  return [...trouvailles];
}

function echappeRegex(texte) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseListe(contenu) {
  return contenu
    .split(/\r?\n/)
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne && !ligne.startsWith("#"));
}

export function chargeClients(env = process.env) {
  if (env.CLIENTS_A_MASQUER) {
    if (!existsSync(env.CLIENTS_A_MASQUER)) {
      throw new Error("CLIENTS_A_MASQUER pointe vers un fichier absent.");
    }
    return parseListe(readFileSync(env.CLIENTS_A_MASQUER, "utf-8"));
  }
  if (env.CLIENTS_A_MASQUER_B64) {
    return parseListe(
      Buffer.from(env.CLIENTS_A_MASQUER_B64, "base64").toString("utf-8"),
    );
  }
  const local = join(racine, "CVs", "clients-a-masquer.txt");
  if (existsSync(local)) return parseListe(readFileSync(local, "utf-8"));
  return null;
}

function construitMotifClient(nom) {
  const cible = normalise(nom).trim();
  // Pas de lettre ni de chiffre immédiatement avant ou après.
  return new RegExp(`(?<![a-z0-9])${echappeRegex(cible)}(?![a-z0-9])`);
}

export function chercheClients(texteNormalise, clients) {
  return clients.filter((nom) =>
    construitMotifClient(nom).test(texteNormalise),
  );
}

/**
 * Deux lectures du même fichier : balises de bloc remplacées par une espace,
 * puis toutes les balises retirées (nom coupé par une balise de bloc). Un
 * motif trouvé dans l'une suffit.
 */
export function variantes(texte) {
  return [normalise(texte, " "), normalise(texte, "")];
}

function main() {
  const fichiers = listeFichiers(distDir);
  if (!fichiers.some((f) => f.endsWith(".html"))) {
    console.error(
      `verif-confidentialite : aucun fichier HTML sous ${distDir} (lancer "npm run build" avant).`,
    );
    process.exitCode = 1;
    return;
  }

  const clients = chargeClients();
  if (!clients) {
    console.warn(
      "::warning::verif-confidentialite : aucune liste de clients (CLIENTS_A_MASQUER, CLIENTS_A_MASQUER_B64 ou CVs/clients-a-masquer.txt), partie clients sautée.",
    );
  } else if (clients.length === 0) {
    console.error("verif-confidentialite : liste de clients vide.");
    process.exitCode = 1;
    return;
  }

  let enErreur = false;
  for (const fichier of fichiers) {
    const lectures = variantes(readFileSync(fichier, "utf-8"));

    const telephones = [
      ...new Set(lectures.flatMap((texte) => chercheTelephones(texte))),
    ];
    if (telephones.length > 0) {
      enErreur = true;
      console.error(
        `verif-confidentialite : motif de téléphone dans ${fichier} : ${telephones.join(", ")}`,
      );
    }

    if (clients) {
      const trouves = [
        ...new Set(lectures.flatMap((texte) => chercheClients(texte, clients))),
      ];
      if (trouves.length > 0) {
        enErreur = true;
        // Jamais les noms eux-mêmes : les journaux de CI sont publics.
        console.error(
          `verif-confidentialite : nom de client trouvé dans ${fichier} (${trouves.length} entrée(s) de la liste).`,
        );
      }
    }
  }

  if (enErreur) {
    process.exitCode = 1;
    return;
  }

  const detail = clients ? `, ${clients.length} nom(s) de clients` : "";
  console.log(
    `verif-confidentialite : ${fichiers.length} fichier(s) vérifié(s)${detail}, rien trouvé.`,
  );
}

const estLanceDirectement =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (estLanceDirectement) main();
