import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  normalise,
  chercheTelephones,
  chercheClients,
  chargeClients,
  parseListe,
  variantes,
} from "./verif-confidentialite.mjs";

// Liste factice : aucun vrai nom de client dans le dépôt public.
const CLIENTS = ["Acme Industries", "L'Exemple", "Société Zêta", "ZQX"];

const uniques = (f) => (html) => [...new Set(variantes(html).flatMap(f))];
const trouveClients = uniques((t) => chercheClients(t, CLIENTS));
const trouveTel = uniques(chercheTelephones);

test("téléphones : formes FR et internationales détectées", () => {
  for (const html of [
    "<p>06 12 34 56 78</p>",
    "<p>0612345678</p>",
    "<p>06.12.34.56.78</p>",
    "<p>06&nbsp;12&nbsp;34&nbsp;56&nbsp;78</p>",
    "<p>06 12 34 56 78</p>",
    "<p>+33 6 12 34 56 78</p>",
    "<p>+33 (0)6 12 34 56 78</p>",
    "<p>+336&#160;12 34 56 78</p>",
    "<p>+44 20 7946 0958</p>",
  ]) {
    assert.ok(trouveTel(html).length > 0, html);
  }
});

test("téléphones : dates, versions et identifiants ignorés", () => {
  for (const html of [
    "<p>2026-09-01</p>",
    "<p>v1.2.3</p>",
    "<p>sept. 2025 – aujourd'hui</p>",
    '<img src="https://avatars.githubusercontent.com/u/46462004">',
    "<p>~150 applications, 2 400 élèves</p>",
  ]) {
    assert.deepEqual(trouveTel(html), [], html);
  }
});

test("clients : casse, accents, entités, insécables, apostrophes, balises", () => {
  for (const html of [
    "<p>acme industries</p>",
    "<p>Acme&nbsp;Industries</p>",
    "<p>Acme Industries</p>",
    "<p>Acme <b>Industries</b></p>",
    "<p>Ac<span>me</span> Industries</p>",
    "<p>L’Exemple</p>",
    "<p>L&#39;Exemple</p>",
    "<p>L&rsquo;Exemple</p>",
    "<p>L&#x2019;Exemple</p>",
    "<p>SOCIETE ZETA</p>",
    "<p>Soci&eacute;t&eacute; Z&ecirc;ta</p>",
    '{"nom":"zqx"}',
  ]) {
    assert.equal(trouveClients(html).length, 1, html);
  }
});

test("clients : nom collé à un élément voisin par une balise", () => {
  assert.equal(trouveClients("<li>clair</li><p>Acme Industries</p>").length, 1);
  assert.equal(
    trouveClients("<li>clair</li><p>Ac<i>me</i> Industries</p>").length,
    1,
  );
  assert.equal(trouveClients("<p>x</p>ZQX<div>y</div>").length, 1);
});

test("normalise : balises en ligne recollées, balises de bloc au choix", () => {
  assert.equal(normalise("<p>A</p>c<b>d</b>"), " a cd");
  assert.equal(normalise("<p>A</p>c", ""), "ac");
});

test("clients : pas de faux positif sur un mot qui contient un nom court", () => {
  assert.deepEqual(trouveClients("<p>ZQXY et AZQX</p>"), []);
  assert.deepEqual(trouveClients("<p>Rien à signaler</p>"), []);
});

test("liste : lignes vides et commentaires ignorés, CRLF accepté", () => {
  assert.deepEqual(parseListe("# commentaire\r\nAcme\r\n\r\n  Zêta  \n"), [
    "Acme",
    "Zêta",
  ]);
});

test("chargement : le fichier prime sur le base64, fichier absent en erreur", () => {
  const dir = mkdtempSync(join(tmpdir(), "verif-"));
  const fichier = join(dir, "liste.txt");
  writeFileSync(fichier, "Acme\n");
  const b64 = Buffer.from("Zêta\nZQX\n", "utf-8").toString("base64");

  assert.deepEqual(
    chargeClients({ CLIENTS_A_MASQUER: fichier, CLIENTS_A_MASQUER_B64: b64 }),
    ["Acme"],
  );
  assert.deepEqual(chargeClients({ CLIENTS_A_MASQUER_B64: b64 }), [
    "Zêta",
    "ZQX",
  ]);
  assert.throws(() =>
    chargeClients({ CLIENTS_A_MASQUER: join(dir, "absent.txt") }),
  );
});
