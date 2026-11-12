// Capture des vrais écrans de Bringo Mind, en taille téléphone, pour la vidéo de démonstration.
// Parcourt l'app comme un utilisateur ; avant chaque toucher, enregistre la position exacte du bouton
// (pour placer la flèche dans la vidéo). Résultat : assets/ecrans/*.png + assets/ecrans/shots.json
// Usage : node capture.mjs <chemin de puppeteer-core> <chrome.exe>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const [, , puppeteerPath, chromePath] = process.argv;
const require = createRequire(import.meta.url);
const puppeteer = require(puppeteerPath);

const BASE = 'http://localhost:8090';
const OUT = path.resolve('assets/ecrans');
fs.mkdirSync(OUT, { recursive: true });
const W = 390;
const H = 844;
const shots = [];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--hide-scrollbars', '--lang=fr-FR'],
});
const page = await browser.newPage();
await page.emulate({
  viewport: { width: W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
});

// « Réduire les animations » : le carrousel de suggestions reste sur la première carte.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

/** Chargement complet d'une adresse : laisse passer l'animation d'ouverture et Face ID. */
async function open(route, settle = 4200) {
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 120000 });
  await wait(settle);
}

/** Trouve l'élément visible le plus petit dont le libellé ou le texte correspond. */
async function locate(label) {
  return page.evaluate((wanted) => {
    const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();
    let best = null;
    for (const el of document.querySelectorAll('body *')) {
      const aria = norm(el.getAttribute('aria-label'));
      const text = norm(el.innerText);
      if (aria !== wanted && text !== wanted && !aria.startsWith(wanted + ',')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) continue;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
      const area = r.width * r.height;
      if (!best || area < best.area) best = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, area };
    }
    return best;
  }, label);
}

/**
 * Si l'écran défile, capture deux calques pour animer le défilement dans la vidéo :
 * - <id>-contenu.png : tout le contenu de la zone qui défile, de haut en bas ;
 * - <id>-dessus.png : les éléments posés au-dessus (bouton flottant, barre de saisie…), fond transparent.
 */
async function scrollLayers(id, keep) {
  const info = await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 300 && r.height > 120 && r.top < window.innerHeight && r.bottom > 0;
    };
    const scrollers = [...document.querySelectorAll('div')].filter(
      (el) => el.scrollHeight > el.clientHeight + 80 && ['auto', 'scroll'].includes(getComputedStyle(el).overflowY) && visible(el),
    );
    const main = scrollers.sort((a, b) => b.clientHeight - a.clientHeight)[0];
    if (!main) return null;
    document.querySelectorAll('[data-cap-scroller],[data-cap-float]').forEach((el) => {
      el.removeAttribute('data-cap-scroller');
      el.removeAttribute('data-cap-float');
    });
    main.setAttribute('data-cap-scroller', '1');
    const r = main.getBoundingClientRect();
    let floats = 0;
    for (const el of document.querySelectorAll('body *')) {
      if (main.contains(el) || el.contains(main)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const b = el.getBoundingClientRect();
      if (b.width < 4 || b.height < 4 || b.width * b.height > 0.5 * window.innerWidth * window.innerHeight) continue;
      if (b.bottom <= r.top + 1 || b.top >= r.bottom - 1) continue;
      // Seulement ce qui est vraiment au premier plan (pas les écrans cachés derrière).
      const hit = document.elementFromPoint(Math.min(window.innerWidth - 1, b.left + b.width / 2), Math.min(window.innerHeight - 1, b.top + b.height / 2));
      if (!hit || !el.contains(hit)) continue;
      el.setAttribute('data-cap-float', '1');
      floats += 1;
    }
    return { top: r.top, height: main.clientHeight, contentH: main.scrollHeight, scrollTop: main.scrollTop, floats };
  });
  if (!info) return null;

  const style = await page.addStyleTag({ content: '[data-cap-float], [data-cap-float] * { visibility: hidden !important; }' });
  await page.setViewport({ width: W, height: H + (info.contentH - info.height), deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await wait(900);
  if (keep) await waitText(keep).catch(() => console.warn('! carrousel', id));
  const tall = await page.evaluate(() => {
    const main = document.querySelector('[data-cap-scroller]');
    if (!main) return null;
    main.scrollTo(0, 0);
    return { top: main.getBoundingClientRect().top };
  });
  await wait(300);
  let content = null;
  if (tall) {
    content = `${id}-contenu.png`;
    await page.screenshot({ path: path.join(OUT, content), clip: { x: 0, y: tall.top, width: W, height: info.contentH } });
  }
  await style.evaluate((el) => el.remove());
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await wait(900);
  await page.evaluate((y) => document.querySelector('[data-cap-scroller]')?.scrollTo(0, y), info.scrollTop);
  await wait(500);

  let overlay = null;
  if (info.floats) {
    overlay = `${id}-dessus.png`;
    const only = await page.addStyleTag({
      content:
        'html, body { background: transparent !important; } * { visibility: hidden !important; } [data-cap-float], [data-cap-float] * { visibility: visible !important; }',
    });
    await wait(200);
    await page.screenshot({ path: path.join(OUT, overlay), omitBackground: true });
    await only.evaluate((el) => el.remove());
    await wait(200);
  }
  if (!content) return null;
  return {
    top: +info.top.toFixed(1),
    height: info.height,
    contentH: info.contentH,
    scrollTop: Math.round(info.scrollTop),
    content: `assets/ecrans/${content}`,
    overlay: overlay ? `assets/ecrans/${overlay}` : null,
  };
}

/** Capture l'écran ; si `tap` est donné, note où se trouve ce bouton puis le touche. */
/** Attend qu'un texte soit visible (ex. le bon slide d'un carrousel qui tourne seul). */
async function waitText(text, timeout = 20000) {
  await page.waitForFunction(
    (wanted) => [...document.querySelectorAll('body *')].some((el) => {
      if ((el.innerText || '').trim() !== wanted) return false;
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.right <= window.innerWidth && r.width > 0;
    }),
    { timeout, polling: 100 },
    text,
  );
  await wait(400);
}

async function shot(id, { chapter, tap, after = 1300, scrollY, reveal, noScroll, keep } = {}) {
  if (reveal) {
    // Fait défiler jusqu'au bouton pour qu'il soit visible au centre de l'écran.
    await page.evaluate((wanted) => {
      const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();
      const el = [...document.querySelectorAll('body *')].find(
        (node) => norm(node.innerText) === wanted || norm(node.getAttribute('aria-label')).startsWith(wanted),
      );
      el?.scrollIntoView({ block: 'center' });
    }, reveal);
    await wait(700);
  }
  if (scrollY != null) {
    await page.evaluate((y) => {
      const scrollers = [...document.querySelectorAll('div')].filter((el) => el.scrollHeight > el.clientHeight + 40 && getComputedStyle(el).overflowY !== 'visible');
      const main = scrollers.sort((a, b) => b.clientHeight - a.clientHeight)[0];
      if (main) main.scrollTo(0, y);
    }, scrollY);
    await wait(600);
  }
  const file = `${id}.png`;
  await page.screenshot({ path: path.join(OUT, file) });
  const entry = { id, chapter, file: `assets/ecrans/${file}` };
  // Position du bouton telle qu'elle apparaît sur la capture (avant la capture longue).
  const shown = tap ? await locate(tap) : null;
  if (!id.startsWith('tmp-') && !noScroll) {
    const scroll = await scrollLayers(id, keep);
    if (scroll) entry.scroll = scroll;
  }
  if (tap) {
    if (reveal) {
      await page.evaluate((wanted) => {
        const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();
        const el = [...document.querySelectorAll('body *')].find(
          (node) => norm(node.innerText) === wanted || norm(node.getAttribute('aria-label')).startsWith(wanted),
        );
        el?.scrollIntoView({ block: 'center' });
      }, reveal);
      await wait(500);
    }
    const now = (await locate(tap)) || shown;
    if (!shown || !now) {
      console.warn(`! bouton introuvable « ${tap} » sur ${id}`);
    } else {
      entry.tap = { label: tap, x: +(shown.x / W).toFixed(4), y: +(shown.y / H).toFixed(4), w: +(shown.w / W).toFixed(4), h: +(shown.h / H).toFixed(4) };
      await page.mouse.click(now.x, now.y);
      await wait(after);
    }
  }
  shots.push(entry);
  console.log('✓', id, tap ? `→ ${tap}` : '');
}

// 02 — Ouverture et connexion
await open('/onboarding', 2500);
await shot('02-presentation', { chapter: '02-ouverture', tap: 'Suivant' });
await open('/welcome', 2500);
await shot('02-bienvenue', { chapter: '02-ouverture', tap: 'J’ai déjà un compte' });
await shot('02-connexion', { chapter: '02-ouverture', tap: 'Se connecter', after: 2500 });
// Verrouillage Face ID : déclenché depuis Mon profil → Démo → Revoir l'ouverture.
await open('/profile');
await shot('tmp-profil', { reveal: 'Revoir l’ouverture', tap: 'Revoir l’ouverture', after: 900 });
await shot('tmp-menu', { tap: 'Verrouillage Face ID', after: 650 });
await shot('02-faceid', { chapter: '02-ouverture', noScroll: true });
await wait(2500);

// 03 — Accueil
await open('/dashboard');
await waitText('1/3');
await shot('03-accueil', { keep: '1/3', chapter: '03-accueil', tap: 'Vérifier', after: 2000 });
await open('/dashboard');
await shot('03-accueil-suite', { keep: '1/3', chapter: '03-accueil', scrollY: 560 });

// 04 — Tâches
await open('/tasks');
await shot('04-taches', { chapter: '04-taches', tap: 'En retard' });
await shot('04-taches-retard', { chapter: '04-taches', tap: 'Nouvelle tâche', after: 2000 });
await shot('04-nouvelle-tache', { chapter: '04-taches', tap: 'Créer la tâche', after: 2000 });
await open('/tasks/detail?id=attestation');
await shot('04-detail-tache', { chapter: '04-taches' });

// 05 — Rappels
await open('/reminders');
await shot('05-rappels', { chapter: '05-rappels', tap: 'Nouveau rappel', after: 2000 });
await shot('05-nouveau-rappel', { chapter: '05-rappels' });

// 06 — Calendrier
await open('/calendar');
await shot('06-mois', { chapter: '06-calendrier', tap: 'Année' });
await shot('06-annee', { chapter: '06-calendrier', tap: 'Voir le planning', after: 2500 });
await shot('06-planning', { chapter: '06-calendrier' });
await open('/calendar/add');
await shot('06-nouvel-evenement', { chapter: '06-calendrier' });

// 07 — Documents
await open('/documents');
await shot('07-documents', { chapter: '07-documents', tap: 'Vérifier', after: 2000 });
await shot('07-document-kora', { chapter: '07-documents', tap: 'C’est correct' });
await shot('07-document-actions', { chapter: '07-documents', reveal: 'Créer un rappel', tap: 'Créer un rappel', after: 2000 });
await shot('07-rappel-document', { chapter: '07-documents' });

// 08 — Kora et la voix
await open('/assistant');
await shot('08-kora', { chapter: '08-kora', tap: 'Que dois-je payer ?', after: 1800 });
await shot('08-kora-reponse', { chapter: '08-kora', tap: 'Commande vocale', after: 2000 });
await shot('08-voix', { chapter: '08-kora', tap: 'Parler à Kora', after: 4500 });
await shot('08-voix-compris', { chapter: '08-kora' });

// 09 — Foyer
await open('/household');
await shot('09-foyer', { chapter: '09-foyer', scrollY: 420, tap: 'Léo' });
await shot('09-foyer-leo', { chapter: '09-foyer' });
await open('/household/members');
await shot('09-membres', { chapter: '09-foyer', tap: 'Inviter un membre', after: 2000 });
await shot('09-inviter', { chapter: '09-foyer' });
await open('/household/activity');
await shot('09-activite', { chapter: '09-foyer' });

// 10 — Notifications
await open('/notifications');
await shot('10-notifications', { chapter: '10-notifications' });

// 11 — Connexions
await open('/integrations');
await shot('11-connexions', { chapter: '11-connexions', reveal: 'Conflits à résoudre', tap: 'Conflits à résoudre', after: 2500 });
await shot('11-conflits', { chapter: '11-connexions' });

// 12 — Profil et réglages
await open('/profile');
await shot('12-profil', { chapter: '12-profil', reveal: 'Langue et région', tap: 'Langue et région', after: 2500 });
await shot('12-preferences', { chapter: '12-profil' });
await open('/profile/privacy');
await shot('12-confidentialite', { chapter: '12-profil' });

// Les captures techniques (tmp-*) servent seulement à naviguer.
for (const file of fs.readdirSync(OUT)) if (file.startsWith('tmp-')) fs.unlinkSync(path.join(OUT, file));
const kept = shots.filter((entry) => !entry.id.startsWith('tmp-'));
fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ width: W, height: H, shots: kept }, null, 2));
await browser.close();
console.log('TERMINÉ', shots.length, 'écrans');
