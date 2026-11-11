"""Construit la vidéo HyperFrames de démonstration à partir des vrais écrans (assets/ecrans/shots.json)
et de la voix off (assets/voix/voix.json). Une scène par chapitre dans compositions/, la voix dans index.html.
Relancer après une nouvelle capture ou une nouvelle voix : python -I build.py"""
import io
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
voice = json.load(io.open(os.path.join(ROOT, 'assets/voix/voix.json'), encoding='utf-8'))
capture = json.load(io.open(os.path.join(ROOT, 'assets/ecrans/shots.json'), encoding='utf-8'))
SHOTS = {s['id']: s for s in capture['shots']}

# --- Mise en page (1920 × 1080) ---
SCREEN_W, SCREEN_H = 405, 876  # écran du téléphone (capture 390 × 844 mise à l'échelle)
BEZEL = 16
PHONE_X, PHONE_Y = 1150, (1080 - SCREEN_H - 2 * BEZEL) // 2
SCREEN_X, SCREEN_Y = PHONE_X + BEZEL, PHONE_Y + BEZEL

LEAD = 0.9   # avant la première phrase (le titre arrive)
GAP = 0.55   # silence entre deux phrases
TAP_GAP = 1.1  # silence quand un toucher change l'écran
TAIL = 0.7   # après la dernière phrase

CHAPTERS = {
    '01-introduction': ('Bienvenue', 'Bringo Mind', 'Votre assistant pour la vie administrative et le foyer.'),
    '02-ouverture': ('Chapitre 1', 'Ouverture et connexion', 'Présentation, connexion, puis Face ID à chaque ouverture.'),
    '03-accueil': ('Chapitre 2', 'Le tableau de bord', 'Votre journée en un coup d’œil, et les suggestions de Kora.'),
    '04-taches': ('Chapitre 3', 'Les tâches', 'Toutes vos démarches, classées par urgence.'),
    '05-rappels': ('Chapitre 4', 'Les rappels', 'Prévenu au bon moment, sur le bon canal.'),
    '06-calendrier': ('Chapitre 5', 'Le calendrier', 'Jour, semaine, mois, année — et le Planning.'),
    '07-documents': ('Chapitre 6', 'Les documents', 'Un coffre sécurisé que Kora vous aide à lire.'),
    '08-kora': ('Chapitre 7', 'Kora et la voix', 'Posez une question : Kora propose, vous décidez.'),
    '09-foyer': ('Chapitre 8', 'Le foyer', 'Partager avec vos proches, en restant privé.'),
    '10-notifications': ('Chapitre 9', 'Les notifications', 'Tout ce qui demande votre attention.'),
    '11-connexions': ('Chapitre 10', 'Messagerie et calendrier', 'Connectés, et toujours sous votre contrôle.'),
    '12-profil': ('Chapitre 11', 'Profil et réglages', 'Tout se règle à votre façon.'),
    '13-conclusion': ('', 'bringo mind', 'Kora propose, vous décidez.'),
}

# Pour chaque phrase : l'écran affiché, et le geste en fin de phrase (« tap » = le toucher capturé sur cet écran,
# « swipe » = geste de balayage dessiné). None = pas de téléphone (scène titre).
BEATS = {
    '01-introduction': [('03-accueil', None), ('03-accueil', None), ('03-accueil', None)],
    '02-ouverture': [('logo', None), ('02-presentation', 'tap'), ('02-bienvenue', 'tap'), ('02-connexion', 'tap'), ('02-faceid', None)],
    '03-accueil': [('03-accueil', None), ('03-accueil', 'tap'), ('03-accueil', None), ('03-accueil-suite', None)],
    '04-taches': [('04-taches', None), ('04-taches', 'tap'), ('04-taches-retard', 'swipe'), ('04-taches-retard', 'tap'), ('04-nouvelle-tache', 'tap'), ('04-detail-tache', None)],
    '05-rappels': [('05-rappels', None), ('05-rappels', None), ('05-rappels', 'tap'), ('05-nouveau-rappel', None)],
    '06-calendrier': [('06-mois', None), ('06-mois', 'tap'), ('06-annee', 'tap'), ('06-nouvel-evenement', None), ('06-nouvel-evenement', None)],
    '07-documents': [('07-documents', None), ('07-documents', None), ('07-documents', 'tap'), ('07-document-kora', 'tap'), ('07-document-actions', 'tap'), ('07-document-actions', None)],
    '08-kora': [('08-kora', None), ('08-kora', 'tap'), ('08-kora-reponse', None), ('08-kora-reponse', 'tap'), ('08-voix-compris', None)],
    '09-foyer': [('09-foyer', None), ('09-foyer', 'tap'), ('09-foyer-leo', None), ('09-membres', 'tap'), ('09-activite', None)],
    '10-notifications': [('10-notifications', None), ('10-notifications', None), ('10-notifications', 'swipe')],
    '11-connexions': [('11-connexions', None), ('11-connexions', 'tap'), ('11-conflits', None)],
    '12-profil': [('12-profil', None), ('12-profil', 'tap'), ('12-confidentialite', None), ('12-confidentialite', None)],
    '13-conclusion': [(None, None), (None, None)],
}

ORDER = list(CHAPTERS)

FONTS = """
    @font-face { font-family: 'Plus Jakarta Sans'; src: url('assets/fonts/PlusJakartaSans_700Bold.ttf'); font-weight: 700; }
    @font-face { font-family: 'Inter App'; src: url('assets/fonts/Inter_400Regular.ttf'); font-weight: 400; }
    @font-face { font-family: 'Inter App'; src: url('assets/fonts/Inter_600SemiBold.ttf'); font-weight: 600; }
"""


def r(value):
    return round(value, 3)


def plan(chapter):
    """Calcule les instants de chaque phrase, toucher et changement d'écran (temps local à la scène)."""
    paras = voice[chapter]
    beats = BEATS[chapter]
    assert len(paras) == len(beats), (chapter, len(paras), len(beats))
    t = LEAD
    out = []
    for para, (shot, gesture) in zip(paras, beats):
        start, end = t, t + para['duration']
        gesture_at = end + 0.15 if gesture else None
        out.append({'start': r(start), 'end': r(end), 'shot': shot, 'gesture': gesture, 'gesture_at': r(gesture_at) if gesture_at else None, 'file': para['file']})
        t = end + (TAP_GAP if gesture else GAP)
    return out, r(t - (TAP_GAP if out[-1]['gesture'] else GAP) + TAIL + (1.0 if out[-1]['gesture'] else 0) + (2.6 if chapter == '13-conclusion' else 0))


def scene_html(chapter, index, beats, duration):
    cid = f'c{index:02d}'
    eyebrow, title, summary = CHAPTERS[chapter]
    is_end = chapter == '13-conclusion'
    is_intro = chapter == '01-introduction'
    parts, tweens = [], []

    # Progression des chapitres (points)
    dots = ''.join(
        f'<span class="{cid}-dot{" on" if i == index else ""}{" done" if i < index else ""}"></span>' for i in range(2, 13)
    )

    if not is_end:
        parts.append(f'''
    <div id="{cid}-text" class="clip" data-start="0" data-duration="{duration}" data-track-index="1">
      <div id="{cid}-eyebrow" class="{cid}-eyebrow">{eyebrow}</div>
      <h1 id="{cid}-title" class="{cid}-title">{title}</h1>
      <p id="{cid}-summary" class="{cid}-summary">{summary}</p>
      {'' if is_intro else f'<div id="{cid}-dots" class="{cid}-dots">{dots}</div>'}
    </div>''')
        tweens.append(f'tl.fromTo("#{cid}-eyebrow", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }}, 0.1);')
        tweens.append(f'tl.fromTo("#{cid}-title", {{ opacity: 0, y: 26 }}, {{ opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }}, 0.2);')
        tweens.append(f'tl.fromTo("#{cid}-summary", {{ opacity: 0, y: 18 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }}, 0.4);')

        # Téléphone
        parts.append(f'''
    <div id="{cid}-phone" class="clip {cid}-phone" data-start="0" data-duration="{duration}" data-track-index="2">
      <div id="{cid}-phone-body" class="{cid}-phone-body"></div>
    </div>''')
        tweens.append(f'tl.fromTo("#{cid}-phone-body", {{ opacity: 0, y: 40, scale: 0.97 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }}, 0.15);')
        tweens.append(f'tl.fromTo("#{cid}-phone-body", {{ y: 0, rotation: 0 }}, {{ y: -14, rotation: -0.6, duration: {r((duration - 1.6) / 2)}, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }}, 0.8);')

        # Écrans successifs (fondu enchaîné à chaque changement)
        windows = []
        for i, beat in enumerate(beats):
            shot = beat['shot']
            switch = 0 if i == 0 else (beats[i - 1]['gesture_at'] + 0.45 if beats[i - 1]['gesture'] == 'tap' else beat['start'] - 0.2)
            if windows and windows[-1]['shot'] == shot:
                continue
            windows.append({'shot': shot, 'start': r(max(0, switch))})
        for i, win in enumerate(windows):
            end = windows[i + 1]['start'] + 0.4 if i + 1 < len(windows) else duration
            sid = f'{cid}-s{i}'
            if win['shot'] == 'logo':
                parts.append(f'''
    <div id="{sid}" class="clip {cid}-screen {cid}-splash" data-start="{win['start']}" data-duration="{r(end - win['start'])}" data-track-index="3" style="z-index:{10 + i}">
      <div id="{sid}-tile" class="{cid}-tile">
        <div id="{sid}-ring" class="{cid}-ring"></div>
        <div id="{sid}-bar" class="{cid}-bar"></div>
        <div id="{sid}-dot" class="{cid}-ldot"></div>
      </div>
      <div id="{sid}-word" class="{cid}-word">bringo <span>mind</span></div>
    </div>''')
                t0 = win['start'] + 0.4
                tweens.append(f'tl.fromTo("#{sid}-bar", {{ scaleY: 0.2, opacity: 0 }}, {{ scaleY: 1, opacity: 1, duration: 0.35, ease: "power3.out" }}, {r(t0)});')
                tweens.append(f'tl.fromTo("#{sid}-ring", {{ scale: 0.4, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }}, {r(t0 + 0.35)});')
                tweens.append(f'tl.fromTo("#{sid}-dot", {{ scale: 0 }}, {{ scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" }}, {r(t0 + 0.75)});')
                tweens.append(f'tl.fromTo("#{sid}-word", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }}, {r(t0 + 1.1)});')
            else:
                src = SHOTS[win['shot']]['file']
                parts.append(f'''
    <img id="{sid}" class="clip {cid}-screen" src="{src}" alt="" data-start="{win['start']}" data-duration="{r(end - win['start'])}" data-track-index="3" style="z-index:{10 + i}" />''')
            if i > 0:
                tweens.append(f'tl.fromTo("#{sid}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4, ease: "power2.out" }}, {win["start"]});')

        # Gestes : flèche + cercle de toucher, ou balayage
        for i, beat in enumerate(beats):
            if not beat['gesture']:
                continue
            gid = f'{cid}-g{i}'
            at = beat['gesture_at']
            if beat['gesture'] == 'tap':
                tap = SHOTS[beat['shot']].get('tap')
                if not tap:
                    continue
                x = SCREEN_X + tap['x'] * SCREEN_W
                y = SCREEN_Y + tap['y'] * SCREEN_H
                label = tap['label'].replace('’', '’')
                parts.append(f'''
    <div id="{gid}" class="clip {cid}-gesture" data-start="{r(at - 0.7)}" data-duration="1.6" data-track-index="4" style="left:{r(x)}px; top:{r(y)}px">
      <div id="{gid}-ring" class="{cid}-tapring"></div>
      <div id="{gid}-press" class="{cid}-press"></div>
      <div id="{gid}-arrow" class="{cid}-arrow"><svg viewBox="0 0 64 64" width="64" height="64"><path d="M6 6 L52 22 L33 30 L48 52 L40 58 L25 36 L14 52 Z" fill="#131c2d" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/></svg></div>
      <div id="{gid}-label" class="{cid}-label">Toucher « {label} »</div>
    </div>''')
                tweens.append(f'tl.fromTo("#{gid}-arrow", {{ x: 150, y: 120, opacity: 0 }}, {{ x: 0, y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }}, {r(at - 1.05)});')
                tweens.append(f'tl.fromTo("#{gid}-label", {{ opacity: 0, x: 20 }}, {{ opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }}, {r(at - 0.85)});')
                tweens.append(f'tl.fromTo("#{gid}-arrow", {{ scale: 1 }}, {{ scale: 0.86, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }}, {r(at)});')
                tweens.append(f'tl.fromTo("#{gid}-press", {{ scale: 0.4, opacity: 0.55 }}, {{ scale: 1, opacity: 0, duration: 0.5, ease: "power2.out" }}, {r(at)});')
                tweens.append(f'tl.fromTo("#{gid}-ring", {{ scale: 0.3, opacity: 1 }}, {{ scale: 1.8, opacity: 0, duration: 0.75, ease: "power2.out" }}, {r(at)});')
                tweens.append(f'tl.fromTo("#{gid}", {{ opacity: 1 }}, {{ opacity: 0, duration: 0.3 }}, {r(at + 1.2)});')
            else:  # balayage vers la droite sur la première ligne de la liste
                y = SCREEN_Y + 0.50 * SCREEN_H
                x0 = SCREEN_X + 0.18 * SCREEN_W
                parts.append(f'''
    <div id="{gid}" class="clip {cid}-gesture" data-start="{r(at - 1.6)}" data-duration="2.4" data-track-index="4" style="left:{r(x0)}px; top:{r(y)}px">
      <div id="{gid}-trail" class="{cid}-trail"></div>
      <div id="{gid}-arrow" class="{cid}-arrow"><svg viewBox="0 0 64 64" width="64" height="64"><path d="M6 6 L52 22 L33 30 L48 52 L40 58 L25 36 L14 52 Z" fill="#131c2d" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/></svg></div>
      <div id="{gid}-label" class="{cid}-label">Glisser vers la droite</div>
    </div>''')
                tweens.append(f'tl.fromTo("#{gid}-arrow", {{ x: 0, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.3 }}, {r(at - 1.6)});')
                tweens.append(f'tl.fromTo("#{gid}-label", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, {r(at - 1.4)});')
                tweens.append(f'tl.fromTo("#{gid}-arrow", {{ x: 0 }}, {{ x: 230, duration: 0.9, ease: "power2.inOut", immediateRender: false }}, {r(at - 1.1)});')
                tweens.append(f'tl.fromTo("#{gid}-trail", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.9, ease: "power2.inOut" }}, {r(at - 1.1)});')
                tweens.append(f'tl.fromTo("#{gid}", {{ opacity: 1 }}, {{ opacity: 0, duration: 0.3 }}, {r(at + 0.2)});')
    else:
        # Carte de fin : logo, nom, promesse
        parts.append(f'''
    <div id="{cid}-end" class="clip {cid}-end" data-start="0" data-duration="{duration}" data-track-index="1">
      <img id="{cid}-logo" class="{cid}-logo" src="assets/brand/bringo-mind-icon.png" alt="Bringo Mind" />
      <div id="{cid}-endword" class="{cid}-endword">bringo <span>mind</span></div>
      <p id="{cid}-claim" class="{cid}-claim">Votre vie administrative, simplifiée.</p>
      <p id="{cid}-promise" class="{cid}-promise">Kora propose, vous décidez.</p>
    </div>''')
        tweens.append(f'tl.fromTo("#{cid}-logo", {{ opacity: 0, scale: 0.8 }}, {{ opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }}, 0.2);')
        tweens.append(f'tl.fromTo("#{cid}-endword", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }}, 0.6);')
        tweens.append(f'tl.fromTo("#{cid}-claim", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }}, {beats[0]["start"]});')
        tweens.append(f'tl.fromTo("#{cid}-promise", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }}, {beats[1]["start"]});')

    # Fondu de sortie de la scène
    tweens.append(f'tl.fromTo("#{cid}-fade", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.35, ease: "power1.in" }}, {r(duration - 0.35)});')
    parts.append(f'''
    <div id="{cid}-fade" class="clip {cid}-fade" data-start="0" data-duration="{duration}" data-track-index="9"></div>''')

    css = f'''
    {FONTS}
    #root {{ position: absolute; inset: 0; overflow: hidden;
      background: radial-gradient(circle at 78% 20%, rgba(134,242,228,0.38) 0, rgba(134,242,228,0) 42%),
                  radial-gradient(circle at 12% 92%, rgba(229,238,255,0.9) 0, rgba(229,238,255,0) 45%), #f8f9ff; }}
    #{cid}-text {{ position: absolute; left: 150px; top: 0; bottom: 0; width: 860px; display: flex; flex-direction: column; justify-content: center; }}
    .{cid}-eyebrow {{ font-family: 'Inter App'; font-weight: 600; font-size: 30px; letter-spacing: 0.08em; text-transform: uppercase; color: #006a61; margin-bottom: 18px; }}
    .{cid}-title {{ font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: {104 if is_intro else 88}px; line-height: 1.05; letter-spacing: -0.03em; color: #131c2d; }}
    .{cid}-summary {{ font-family: 'Inter App'; font-weight: 400; font-size: 36px; line-height: 1.4; color: #45464d; margin-top: 26px; max-width: 760px; }}
    .{cid}-dots {{ display: flex; gap: 12px; margin-top: 56px; }}
    .{cid}-dots span {{ width: 34px; height: 8px; border-radius: 8px; background: #d3e4fe; }}
    .{cid}-dots span.done {{ background: #86f2e4; }}
    .{cid}-dots span.on {{ background: #006a61; width: 64px; }}
    #{cid}-phone {{ position: absolute; inset: 0; }}
    .{cid}-phone-body {{ position: absolute; left: {PHONE_X}px; top: {PHONE_Y}px; width: {SCREEN_W + 2 * BEZEL}px; height: {SCREEN_H + 2 * BEZEL}px;
      border-radius: 64px; background: #131c2d; box-shadow: 0 40px 90px rgba(19,28,45,0.28), 0 0 0 2px #2a3550 inset; }}
    .{cid}-screen {{ position: absolute; left: {SCREEN_X}px; top: {SCREEN_Y}px; width: {SCREEN_W}px; height: {SCREEN_H}px; border-radius: 50px; object-fit: cover; }}
    .{cid}-splash {{ background: #f8f9ff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; overflow: hidden; }}
    .{cid}-tile {{ position: relative; width: 150px; height: 150px; border-radius: 34px; background: #131c2d; overflow: hidden; }}
    .{cid}-ring {{ position: absolute; left: 43.4px; top: 54.6px; width: 68px; height: 68px; border-radius: 50%; border: 18.9px solid #fff; }}
    .{cid}-bar {{ position: absolute; left: 38.8px; top: 27.4px; width: 18.6px; height: 94.9px; border-radius: 9.3px; background: #fff; transform-origin: top center; }}
    .{cid}-ldot {{ position: absolute; left: 96.8px; top: 26.8px; width: 23.7px; height: 23.7px; border-radius: 50%; background: #2fd5c1; }}
    .{cid}-word {{ font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: 38px; color: #131c2d; letter-spacing: -0.02em; }}
    .{cid}-word span {{ font-family: 'Inter App'; font-weight: 600; color: #006a61; }}
    .{cid}-gesture {{ position: absolute; width: 0; height: 0; z-index: 50; }}
    .{cid}-tapring {{ position: absolute; left: -46px; top: -46px; width: 92px; height: 92px; border-radius: 50%; border: 5px solid #2fd5c1; }}
    .{cid}-press {{ position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: #2fd5c1; }}
    .{cid}-arrow {{ position: absolute; left: -4px; top: -4px; filter: drop-shadow(0 6px 10px rgba(19,28,45,0.35)); }}
    .{cid}-label {{ position: absolute; left: 70px; top: 40px; white-space: nowrap; font-family: 'Inter App'; font-weight: 600; font-size: 30px; color: #fff;
      background: #131c2d; padding: 10px 18px; border-radius: 14px; box-shadow: 0 10px 24px rgba(19,28,45,0.25); }}
    .{cid}-trail {{ position: absolute; left: 0; top: -4px; width: 240px; height: 8px; border-radius: 8px; background: linear-gradient(90deg, rgba(47,213,193,0), #2fd5c1); transform-origin: left center; }}
    .{cid}-end {{ position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }}
    .{cid}-logo {{ width: 220px; height: 220px; border-radius: 50px; }}
    .{cid}-endword {{ margin-top: 40px; font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: 96px; letter-spacing: -0.03em; color: #131c2d; }}
    .{cid}-endword span {{ font-family: 'Inter App'; font-weight: 600; color: #006a61; }}
    .{cid}-claim {{ margin-top: 18px; font-family: 'Inter App'; font-size: 40px; color: #45464d; }}
    .{cid}-promise {{ margin-top: 30px; font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: 44px; color: #006a61; }}
    .{cid}-fade {{ position: absolute; inset: 0; background: #f8f9ff; z-index: 90; }}
'''
    body = ''.join(parts)
    script = '\n    '.join(tweens)
    return f'''<template>
  <style>{css}  </style>
  <div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080" data-layout-allow-overlap>{body}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {script}
    window.__timelines["{cid}"] = tl;
  </script>
</template>
'''


os.makedirs(os.path.join(ROOT, 'compositions'), exist_ok=True)
os.makedirs(os.path.join(ROOT, 'assets/brand'), exist_ok=True)
hosts, audios = [], []
t = 0.0
for index, chapter in enumerate(ORDER, start=1):
    beats, duration = plan(chapter)
    cid = f'c{index:02d}'
    io.open(os.path.join(ROOT, 'compositions', f'{cid}.html'), 'w', encoding='utf-8').write(scene_html(chapter, index, beats, duration))
    hosts.append(
        f'      <div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{r(t)}" '
        f'data-duration="{duration}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
    )
    for j, beat in enumerate(beats):
        para = voice[chapter][j]
        audios.append(
            f'      <audio id="v{index:02d}-{j + 1}" src="{beat["file"]}" data-start="{r(t + beat["start"])}" data-duration="{para["duration"]}" data-track-index="5"></audio>'
        )
    t += duration

total = r(t)
index_html = f'''<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #f8f9ff; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
{chr(10).join(hosts)}
{chr(10).join(audios)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
'''
io.open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(index_html)
print('Durée totale :', total, 's', f'({int(total // 60)} min {int(total % 60)} s)')
