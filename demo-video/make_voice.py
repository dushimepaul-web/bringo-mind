"""Génère la voix off (Kokoro, voix française ff_siwis) : un fichier par paragraphe du script.
Écrit assets/voix/voix.json avec la durée de chaque paragraphe, pour caler les touchers."""
import io
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
TEXT_DIR = os.path.join(ROOT, 'assets', 'voix', 'texte')
OUT_DIR = os.path.join(ROOT, 'assets', 'voix')
env = dict(os.environ, HYPERFRAMES_PYTHON=os.path.join(ROOT, '.venv', 'Scripts', 'python.exe'))

result = {}
for name in sorted(os.listdir(TEXT_DIR)):
    if not name.endswith('.txt'):
        continue
    chapter = name[:-4]
    paragraphs = [p.strip() for p in io.open(os.path.join(TEXT_DIR, name), encoding='utf-8').read().split('\n\n') if p.strip()]
    items = []
    for index, text in enumerate(paragraphs, start=1):
        out = os.path.join(OUT_DIR, f'{chapter}-{index}.wav')
        cmd = ['npx', '--yes', 'hyperframes', 'tts', text, '--voice', 'ff_siwis', '--speed', '0.95', '--output', out, '--json']
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', env=env, shell=True)
        line = [l for l in proc.stdout.splitlines() if l.strip().startswith('{')]
        data = json.loads(line[-1]) if line else {'ok': False, 'error': proc.stderr[-300:]}
        if not data.get('ok'):
            print('ERREUR', chapter, index, data, file=sys.stderr)
            sys.exit(1)
        items.append({'file': f'assets/voix/{chapter}-{index}.wav', 'text': text, 'duration': round(data['durationSeconds'], 3)})
        print(chapter, index, data['durationSeconds'], flush=True)
    result[chapter] = items

io.open(os.path.join(OUT_DIR, 'voix.json'), 'w', encoding='utf-8').write(json.dumps(result, ensure_ascii=False, indent=2))
total = sum(i['duration'] for c in result.values() for i in c)
print('TOTAL', round(total, 1), 's')
