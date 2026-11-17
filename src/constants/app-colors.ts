// Couleurs des écrans au style de la maquette validée, en clair et en sombre.
// Tirées du logo officiel, sans dégradé. Utiliser via useAppColors().
import { useIsDark } from '@/lib/theme';

const NAVY = '#0C1A37';

export type AppColors = {
  dark: boolean;
  page: string;
  card: string;
  border: string;
  /** Trait sous un en-tête fixe. */
  divider: string;
  text: string;
  muted: string;
  /** Bandeau de Kora. */
  banner: string;
  bannerText: string;
  link: string;
  tabBar: string;
  /** Icônes de la barre du bas. */
  tabIcon: string;
  /** Bouton plein foncé (« Voir plus »). */
  solid: string;
  solidText: string;
  /** Fonds des tuiles et pastilles (bleu, menthe, citron, vert, ambre). */
  tintBlue: string;
  tintMint: string;
  tintLime: string;
  tintGreen: string;
  tintAmber: string;
  amberText: string;
  blueText: string;
  /** Bloc « À faire aujourd'hui », case de date, assistant vocal. */
  soft: string;
  dateTile: string;
  voice: string;
  voiceBorder: string;
  /** Cercles décoratifs du fond (écrans d'accès). */
  glow: string;
  /** Bouton plein appuyé. */
  solidPressed: string;
  /** Réussite (coches, critères validés) et erreur. */
  success: string;
  error: string;
  /** Rail de l'anneau de progression. */
  track: string;
  chartTrack: string;
  input: string;
  shadowOpacity: number;
};

export const LIGHT: AppColors = {
  dark: false,
  page: '#F2F8F4',
  card: '#FFFFFF',
  border: '#E1ECE7',
  divider: '#C9DCD3',
  text: NAVY,
  muted: '#4A5568',
  banner: NAVY,
  bannerText: '#E4ECF7',
  link: '#0CA07C',
  tabBar: '#FFFFFF',
  tabIcon: '#1D5ED0',
  solid: NAVY,
  solidText: '#FFFFFF',
  tintBlue: '#DDE9FB',
  tintMint: '#D3F5EE',
  tintLime: '#E5F6D3',
  tintGreen: '#D9F3E4',
  tintAmber: '#FCEFC4',
  amberText: '#8A6100',
  blueText: '#1D5ED0',
  soft: '#F1F5FA',
  dateTile: '#D6F5EE',
  voice: '#E6F6D6',
  voiceBorder: '#CDEBB5',
  glow: '#D3F5EE',
  solidPressed: '#1E2D4D',
  success: '#15803D',
  error: '#BA1A1A',
  track: '#D9F8F8',
  chartTrack: '#EEF3F7',
  input: '#FFFFFF',
  shadowOpacity: 0.05,
};

export const DARK: AppColors = {
  dark: true,
  page: '#0A1326',
  card: '#13213D',
  border: '#22365C',
  divider: '#2E4778',
  text: '#F2F6FC',
  muted: '#A7B6CC',
  banner: '#16294D',
  bannerText: '#D5DFEE',
  link: '#14E5AA',
  tabBar: '#101D36',
  tabIcon: '#6FA8FF',
  solid: '#F2F6FC',
  solidText: NAVY,
  tintBlue: '#1B3058',
  tintMint: '#0F3B3B',
  tintLime: '#25391D',
  tintGreen: '#113A2E',
  tintAmber: '#3D3216',
  amberText: '#F5C84B',
  blueText: '#8DBBFF',
  soft: '#192A4A',
  dateTile: '#0F3B3B',
  voice: '#1C3324',
  voiceBorder: '#2D4F37',
  glow: '#0F2E3A',
  solidPressed: '#D0D8E6',
  success: '#4ADE80',
  error: '#F87171',
  track: '#1E3A4A',
  chartTrack: '#1E2F4F',
  input: '#13213D',
  shadowOpacity: 0.25,
};

/** Couleurs du mode actuel (clair ou sombre). */
export function useAppColors(): AppColors {
  return useIsDark() ? DARK : LIGHT;
}
