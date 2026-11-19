// Éléments d'interface du module Notes, en clair et en sombre (palette useAppColors).
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import type { NoteColor, NoteFont } from '../store';

/** Couleurs pastel unies des notes (fond de carte et de page), version claire et sombre. */
export const NOTE_COLORS: Record<NoteColor, { light: string; dark: string; dot: string; label: string }> = {
  mint: { light: '#D7F5EC', dark: '#123B34', dot: '#14B892', label: 'Menthe' },
  lime: { light: '#EAF6CF', dark: '#2A3A18', dot: '#7CB518', label: 'Citron' },
  blue: { light: '#DCE8FB', dark: '#1B3058', dot: '#2F7BE0', label: 'Bleu' },
  lavender: { light: '#E6E3FA', dark: '#2A2856', dot: '#6D5DD3', label: 'Lavande' },
  pink: { light: '#FBDDE8', dark: '#4A2233', dot: '#E0518E', label: 'Rose' },
  amber: { light: '#FCEFC4', dark: '#3D3216', dot: '#E0A100', label: 'Ambre' },
};

export const NOTE_COLOR_KEYS = Object.keys(NOTE_COLORS) as NoteColor[];

export function noteBackground(color: NoteColor, dark: boolean): string {
  return dark ? NOTE_COLORS[color].dark : NOTE_COLORS[color].light;
}

/** Ligne de note : case (cochée ou non), puce, numéro ou texte simple. */
export type NoteLine =
  | { kind: 'check'; done: boolean; text: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'number'; n: string; text: string }
  | { kind: 'text'; text: string };

export function parseLine(line: string): NoteLine {
  if (line.startsWith('☐ ')) return { kind: 'check', done: false, text: line.slice(2) };
  if (line.startsWith('☑ ')) return { kind: 'check', done: true, text: line.slice(2) };
  if (line.startsWith('• ')) return { kind: 'bullet', text: line.slice(2) };
  const numbered = /^(\d+)\. (.*)$/.exec(line);
  if (numbered) return { kind: 'number', n: numbered[1], text: numbered[2] };
  return { kind: 'text', text: line };
}

/** Coche ou décoche la case de la ligne `index`. */
export function toggleCheck(body: string, index: number): string {
  const lines = body.split('\n');
  const line = lines[index];
  if (line?.startsWith('☐ ')) lines[index] = `☑ ${line.slice(2)}`;
  else if (line?.startsWith('☑ ')) lines[index] = `☐ ${line.slice(2)}`;
  return lines.join('\n');
}

/** Texte de la note rendu ligne par ligne ; les cases se cochent d'un toucher. */
export function NoteBody({
  body,
  onToggle,
  maxLines,
  compact,
  fontSize,
  font,
}: {
  body: string;
  onToggle?: (index: number) => void;
  maxLines?: number;
  /** Texte plus petit (aperçu sur les cartes). */
  compact?: boolean;
  /** Taille et police choisies pour la note. */
  fontSize?: number;
  font?: NoteFont;
}) {
  const { c, ui } = useNotesUi();
  const lines = body.split('\n');
  const custom = fontSize || font ? { fontSize: fontSize ?? 15, lineHeight: Math.round((fontSize ?? 15) * 1.5), fontFamily: font === 'rounded' ? FontFamily.heading : FontFamily.body } : null;
  const shown = maxLines ? lines.slice(0, maxLines) : lines;
  return (
    <View style={ui.lines}>
      {shown.map((raw, index) => {
        const line = parseLine(raw);
        if (line.kind === 'check') {
          const box = (
            <View style={[ui.box, line.done && { backgroundColor: c.text, borderColor: c.text }]}>
              {line.done ? <Icon name="check" size={13} color={c.dark ? '#0A1326' : '#FFFFFF'} /> : null}
            </View>
          );
          return (
            <View key={index} style={ui.line}>
              {onToggle ? (
                <Pressable
                  hitSlop={8}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: line.done }}
                  accessibilityLabel={line.text}
                  onPress={() => onToggle(index)}>
                  {box}
                </Pressable>
              ) : (
                box
              )}
              <Text style={[ui.lineText, compact && ui.small, custom, line.done && ui.lineDone]}>{line.text}</Text>
            </View>
          );
        }
        if (line.kind === 'bullet' || line.kind === 'number') {
          return (
            <View key={index} style={ui.line}>
              <Text style={[ui.marker, compact && ui.small, custom]}>{line.kind === 'bullet' ? '•' : `${line.n}.`}</Text>
              <Text style={[ui.lineText, compact && ui.small, custom]}>{line.text}</Text>
            </View>
          );
        }
        return (
          <Text key={index} style={[ui.lineText, compact && ui.small, custom]}>
            {line.text || ' '}
          </Text>
        );
      })}
    </View>
  );
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du module pour le mode actuel. */
export function useNotesUi() {
  const c = useAppColors();
  return { c, ui: c.dark ? STYLES.dark : STYLES.light };
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    lines: { gap: 4 },
    line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    lineText: { flexShrink: 1, fontFamily: FontFamily.body, fontSize: 16, lineHeight: 24, color: c.text },
    lineDone: { textDecorationLine: 'line-through', opacity: 0.6 },
    small: { fontSize: 13, lineHeight: 19 },
    marker: { minWidth: 18, fontFamily: FontFamily.bodySemiBold, fontSize: 16, lineHeight: 24, color: c.text },
    box: {
      width: 20,
      height: 20,
      marginTop: 2,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: 0.8 },
    iconButton: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  });
}
