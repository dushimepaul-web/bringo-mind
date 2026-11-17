// S-07 - Accueil | Module M03 Tableau de bord | Phase S3
// D'après la maquette validée : le B du logo, conseil de Kora, raccourcis, « Aujourd'hui »,
// prochains rendez-vous et assistant vocal — aux couleurs du logo officiel.
import { router, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityInfo, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineRing, ProgressRing, TURQUOISE } from '@/components/rings';
import { BRAND, BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { KoraRobot } from '../components/kora-robot';

/** Couleurs identiques en clair et en sombre (les autres viennent de useAppColors). */
const C = {
  navy: BRAND.navy,
  teal: TURQUOISE,
  red: '#E53935',
} as const;

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Styles et couleurs du mode actuel. */
function useHome() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}

/** Démo : rien à charger (les données sont en mémoire). */
const loadDashboard = async () => undefined;

export default function DashboardScreen() {
  const { c, styles } = useHome();
  // En mode « api », la synthèse viendra de DASH-001 (/dashboard/today).
  const sync = useQuery('dashboard', loadDashboard);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <HomeHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />
        }>
        <QueryView query={sync} loadingRows={5}>
          <KoraBanner />
          <Shortcuts />
          <TodayCard />
          <UpcomingCard />
          <VoiceBanner />
        </QueryView>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Ouvre un écran ; sur le web, pas de rôle « button » pour une zone qui en contient d'autres. */
const pressRole = Platform.OS === 'web' ? undefined : ('button' as const);
const go = (href: Href) => () => router.push(href);

// ——— En-tête : logo complet, notifications, avatar ———

function HomeHeader() {
  const { c, styles } = useHome();
  return (
    <View style={styles.header}>
      <View style={styles.headerBrand}>
        <BrandLogo size={50} />
      </View>
      <View style={styles.headerRight}>
        <ThemeToggle />
        <Pressable style={styles.bell} accessibilityRole="button" accessibilityLabel="Notifications, 3 non lues" onPress={go('/notifications')}>
          <Icon name="notifications" size={30} color={c.text} />
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>3</Text>
          </View>
        </Pressable>
        <Pressable style={styles.account} accessibilityRole="button" accessibilityLabel="Mon compte" onPress={go('/profile')}>
          <OutlineRing size={46} stroke={4}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>CM</Text>
            </View>
          </OutlineRing>
          <Icon name="expand_more" size={22} color={c.link} />
        </Pressable>
      </View>
    </View>
  );
}

// ——— Conseil de Kora ———

function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour >= 18 || hour < 5) return 'Bonsoir';
  if (hour >= 12) return 'Bon après-midi';
  return 'Bonjour';
}

type Tip = { title: string; line: string; small: string; cta: string; href: Href };

/** Conseils de Kora (démo), un par diapositive. */
function tipsFor(hello: string): Tip[] {
  return [
    {
      title: `${hello} Claire ! 👋`,
      line: 'Voici votre planning du jour :',
      small: '📅 2 événements, 1 tâche importante.',
      cta: 'Voir mon planning →',
      href: '/calendar/agenda',
    },
    {
      title: 'Facture Engie à vérifier',
      line: 'Kora a lu une nouvelle facture :',
      small: '⚡ 118,50 € prélevés le 27 mai.',
      cta: 'Vérifier →',
      href: '/documents',
    },
    {
      title: 'Dentiste de Léo',
      line: 'Vendredi 17 mai à 10h00 :',
      small: '🦷 Cabinet Dr Lemoine, Paris 11e.',
      cta: 'Ajouter un rappel →',
      href: '/reminders/add',
    },
    {
      title: 'Déclaration de revenus',
      line: 'Plus que 12 jours :',
      small: '📄 75 % du dossier est prêt.',
      cta: 'Continuer →',
      href: '/tasks',
    },
  ];
}

/** Durée d'affichage d'un conseil avant de glisser au suivant. */
const TIP_MS = 5000;

function KoraBanner() {
  const { styles } = useHome();
  const tips = tipsFor(greetingFor(IS_DEMO ? DEMO_TODAY : new Date()));
  // La première diapositive est répétée à la fin : la boucle continue sans revenir en arrière à l'écran.
  const slides = [...tips, tips[0]];
  const scroller = useRef<ScrollViewInstance>(null);
  const index = useRef(0);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => active && setReduceMotion(value));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  // Défilement automatique : glisse au conseil suivant ; arrivé sur la copie du premier, revient au vrai premier sans animation.
  useEffect(() => {
    if (!width || paused || reduceMotion) return;
    const timer = setInterval(() => {
      const next = index.current + 1;
      scroller.current?.scrollTo({ x: next * width, animated: true });
      index.current = next;
      if (next === tips.length) {
        setTimeout(() => {
          scroller.current?.scrollTo({ x: 0, animated: false });
          index.current = 0;
        }, 650);
      }
    }, TIP_MS);
    return () => clearInterval(timer);
  }, [width, paused, reduceMotion, tips.length]);

  /** Après un glissement au doigt : retient la position (et recale la copie du premier). */
  const settle = (x: number) => {
    if (!width) return;
    const at = Math.round(x / width);
    if (at >= tips.length) {
      scroller.current?.scrollTo({ x: 0, animated: false });
      index.current = 0;
    } else {
      index.current = at;
    }
  };

  return (
    <View style={styles.banner} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setPaused(true)}
        onScrollEndDrag={() => setPaused(false)}
        onMomentumScrollEnd={(event) => settle(event.nativeEvent.contentOffset.x)}
        accessibilityLabel="Conseils de Kora">
        {slides.map((tip, slide) => (
          <View
            key={slide}
            style={[styles.slide, { width: width || undefined }]}
            accessibilityElementsHidden={slide === tips.length}
            importantForAccessibility={slide === tips.length ? 'no-hide-descendants' : 'auto'}>
            <View style={styles.robot}>
              <KoraRobot width={66} />
            </View>
            <View style={styles.bannerBody}>
              <View style={styles.tipPill}>
                <Text style={styles.tipPillText}>💡 Conseil de Kora</Text>
              </View>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {tip.title}
              </Text>
              <Text style={styles.bannerText} numberOfLines={1}>
                {tip.line}
              </Text>
              <View style={styles.bannerRow}>
                <Text style={styles.bannerSmall} numberOfLines={2}>
                  {tip.small}
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.planningButton, pressed && styles.pressed]}
                  accessibilityRole="button"
                  onPress={go(tip.href)}>
                  <Text style={styles.planningButtonText}>{tip.cta}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ——— Raccourcis ———

type Shortcut = { label: string; icon: string; color: string; bg: 'tintBlue' | 'tintMint' | 'tintLime' | 'tintGreen'; href: Href };

const SHORTCUTS: Shortcut[][] = [
  [
    { label: 'Agenda', icon: 'calendar_month', color: BRAND.blue, bg: 'tintBlue', href: '/calendar' },
    { label: 'Tâches', icon: 'check_box', color: '#0FB5A3', bg: 'tintMint', href: '/tasks' },
    { label: 'Rappels', icon: 'notifications', color: '#5BB81E', bg: 'tintLime', href: '/reminders' },
  ],
  [
    { label: 'Notes', icon: 'description', color: '#2F7BE0', bg: 'tintBlue', href: '/notes' },
    { label: 'Documents', icon: 'folder', color: BRAND.emerald, bg: 'tintGreen', href: '/documents' },
    { label: 'Foyer', icon: 'home', color: '#2F7BE0', bg: 'tintBlue', href: '/household' },
  ],
];

function Shortcuts() {
  const { c, styles } = useHome();
  return (
    <View style={styles.shortcuts}>
      {SHORTCUTS.map((group, index) => (
        <View key={index} style={styles.shortcutGroup}>
          {group.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={go(item.href)}>
              <View style={[styles.shortcutTile, { backgroundColor: c[item.bg] }]}>
                <Icon name={item.icon} size={30} color={item.color} filled />
              </View>
              <Text style={styles.shortcutLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

// ——— Aujourd'hui ———

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  const { styles } = useHome();
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

function TodayCard() {
  const { c, styles } = useHome();
  const done = 2;
  const total = 3;
  const percent = Math.round((done / total) * 100);
  return (
    <View style={styles.cardWrap}>
      <View style={styles.cardAccent} />
      <View style={styles.card}>
        <Pressable style={styles.todayHead} accessibilityRole={pressRole} onPress={go('/calendar/agenda')}>
          <View style={styles.todayHeadLeft}>
            <Icon name="calendar_month" size={24} color={c.text} filled />
            <Text style={styles.cardTitle}>Aujourd’hui</Text>
          </View>
          <View style={styles.todayHeadRight}>
            <Text style={styles.todayDate}>Mardi 14 mai 2024</Text>
            <Icon name="chevron_right" size={22} color={c.text} />
          </View>
        </Pressable>

        <View style={styles.todayBody}>
          <View style={styles.todayList}>
            <Pressable style={styles.todayItem} accessibilityRole={pressRole} onPress={go('/calendar/detail?id=reunion')}>
              <View style={[styles.todayBar, { backgroundColor: '#2E9950' }]} />
              <View style={styles.todayItemBody}>
                <View style={styles.todayLine}>
                  <Icon name="schedule" size={17} color="#2E9950" />
                  <Text style={styles.todayTime}>14:00 – 15:00</Text>
                </View>
                <View style={styles.todayLine}>
                  <Text style={styles.todayTitle} numberOfLines={1}>
                    Réunion projet Bringo Mind
                  </Text>
                  <Pill label="Agenda" color={c.blueText} bg={c.tintBlue} />
                </View>
              </View>
            </Pressable>

            <Pressable
              style={[styles.todayItem, styles.todayItemTinted]}
              accessibilityRole={pressRole}
              onPress={go('/tasks/detail?id=attestation')}>
              <View style={[styles.todayBar, { backgroundColor: '#E8B62B' }]} />
              <View style={styles.todayItemBody}>
                <View style={styles.todayLine}>
                  <Icon name="check_box" size={17} color="#E8B62B" />
                  <Text style={styles.todaySub}>À faire aujourd’hui</Text>
                </View>
                <View style={styles.todayLine}>
                  <Text style={styles.todayTitle} numberOfLines={1}>
                    Renvoyer l’attestation
                  </Text>
                  <Pill label="Priorité haute" color={c.amberText} bg={c.tintAmber} />
                </View>
              </View>
            </Pressable>
          </View>

          <View style={styles.todayDivider} />

          <View style={styles.progress}>
            <ProgressRing size={72} stroke={10} progress={done / total} track={c.track}>
              <Text style={styles.progressValue}>{percent}%</Text>
            </ProgressRing>
            <Text style={styles.progressText}>
              {done} / {total} tâches
            </Text>
            <Pressable
              style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={go('/tasks')}>
              <Text style={styles.moreButtonText}>Voir plus →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// ——— Prochains rendez-vous ———

function UpcomingCard() {
  const { c, styles } = useHome();
  return (
    <View style={[styles.card, styles.upcomingCard]}>
      <View style={styles.upcomingHead}>
        <View style={styles.todayHeadLeft}>
          <Icon name="event_upcoming" size={22} color={c.link} />
          <Text style={styles.cardTitleSmall}>Prochains rendez-vous</Text>
        </View>
        <Pressable style={styles.linkRow} hitSlop={8} accessibilityRole="button" onPress={go('/calendar/agenda')}>
          <Text style={styles.link}>Voir tout</Text>
          <Icon name="chevron_right" size={20} color={c.link} />
        </Pressable>
      </View>
      <Pressable style={styles.upcomingRow} accessibilityRole={pressRole} onPress={go('/calendar/detail?id=dentiste-leo')}>
        <View style={styles.dateTile}>
          <Text style={styles.dateDay}>Ven.</Text>
          <Text style={styles.dateNum}>17</Text>
        </View>
        <Text style={styles.upcomingTime}>10:00</Text>
        <Icon name="stethoscope" size={20} color={c.text} />
        <Text style={styles.upcomingTitle} numberOfLines={1}>
          Dentiste de Léo
        </Text>
        <Pill label="Santé" color={c.blueText} bg={c.tintBlue} />
      </Pressable>
    </View>
  );
}

// ——— Assistant vocal ———

const WAVE = [10, 20, 14, 24, 0, 24, 14, 20, 10];

function VoiceBanner() {
  const { c, styles } = useHome();
  return (
    <Pressable
      style={({ pressed }) => [styles.voice, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Nouveau : assistant vocal. Ouvrir la commande vocale"
      onPress={go('/voice')}>
      <Icon name="star" size={26} color="#F1B300" filled />
      <View style={styles.voiceBody}>
        <Text style={styles.voiceTitle}>Nouveau ! Assistant vocal</Text>
        <Text style={styles.voiceText}>Dites simplement : « Créer une tâche pour demain »</Text>
      </View>
      <View style={styles.wave}>
        {WAVE.map((height, index) =>
          height === 0 ? (
            <View key={index} style={styles.mic}>
              <Icon name="mic" size={18} color={c.solidText} filled />
            </View>
          ) : (
            <View
              key={index}
              style={[
                styles.waveBar,
                {
                  height,
                  backgroundColor: index < 4 ? '#1ECFB2' : '#65B233',
                },
              ]}
            />
          ),
        )}
      </View>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.page,
    },
    scroll: {
      flex: 1,
    },
    content: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingHorizontal: 8,
      paddingTop: 10,
      paddingBottom: 40,
    },
    pressed: {
      opacity: 0.85,
    },

    header: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.page,
      // Trait sous l'en-tête : il reste fixe pendant que la page défile.
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    headerBrand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexShrink: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    bell: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellBadge: {
      position: 'absolute',
      top: 4,
      right: 3,
      minWidth: 19,
      height: 19,
      paddingHorizontal: 4,
      borderRadius: Radius.full,
      backgroundColor: C.red,
      borderWidth: 2,
      borderColor: c.page,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellBadgeText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 11,
      lineHeight: 13,
      color: '#FFFFFF',
    },
    account: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      backgroundColor: C.navy,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 15,
      lineHeight: 19,
      color: '#FFFFFF',
    },

    banner: {
      height: 120,
      borderRadius: 18,
      backgroundColor: c.banner,
      overflow: 'hidden',
    },
    slide: {
      height: 120,
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingTop: 9,
      paddingRight: 10,
      paddingLeft: 8,
    },
    robot: {
      marginRight: 6,
    },
    bannerBody: {
      flex: 1,
      paddingBottom: 9,
      gap: 2,
    },
    tipPill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 9,
      paddingVertical: 2,
      borderRadius: Radius.full,
      backgroundColor: '#8EE33C',
      marginBottom: 2,
    },
    tipPillText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: C.navy,
    },
    bannerTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 19,
      lineHeight: 24,
      color: '#FFFFFF',
    },
    bannerText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: '#FFFFFF',
    },
    bannerSmall: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 16,
      color: c.bannerText,
    },
    bannerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    planningButton: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: C.teal,
    },
    planningButtonText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: C.navy,
    },

    shortcuts: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 15,
    },
    shortcutGroup: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
      paddingVertical: 5,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    shortcut: {
      width: 48,
      alignItems: 'center',
      gap: 4,
    },
    shortcutTile: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shortcutLabel: {
      width: 72,
      marginHorizontal: -12,
      textAlign: 'center',
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },

    cardWrap: {
      position: 'relative',
      marginTop: 14,
    },
    cardAccent: {
      position: 'absolute',
      top: -3,
      left: 18,
      width: 56,
      height: 6,
      borderRadius: 3,
      backgroundColor: C.teal,
      zIndex: 2,
    },
    card: {
      padding: 12,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: C.navy,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: 2,
    },
    cardTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 23,
      color: c.text,
    },
    cardTitleSmall: {
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    todayHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    todayHeadLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    todayHeadRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    todayDate: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    todayBody: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    todayList: {
      flex: 1,
      gap: 6,
    },
    todayItem: {
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 5,
      paddingRight: 6,
      borderRadius: 10,
    },
    todayItemTinted: {
      backgroundColor: c.soft,
    },
    todayBar: {
      width: 4,
      borderRadius: 2,
    },
    todayItemBody: {
      flex: 1,
      gap: 3,
    },
    todayLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    todayTime: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 18,
      color: c.text,
    },
    todaySub: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    todayTitle: {
      flexShrink: 1,
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    pill: {
      paddingHorizontal: 7,
      paddingVertical: 1,
      borderRadius: Radius.full,
    },
    pillText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
    },
    todayDivider: {
      width: 1,
      alignSelf: 'stretch',
      marginHorizontal: 10,
      backgroundColor: c.border,
    },
    progress: {
      alignItems: 'center',
      gap: 4,
    },
    progressValue: {
      fontFamily: FontFamily.headingBold,
      fontSize: 19,
      lineHeight: 24,
      color: c.text,
    },
    progressText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    moreButton: {
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
    },
    moreButtonText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.solidText,
    },

    upcomingCard: {
      marginTop: 13,
    },
    upcomingHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.link,
    },
    upcomingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dateTile: {
      width: 45,
      height: 45,
      borderRadius: 10,
      backgroundColor: c.dateTile,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateDay: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 15,
      color: c.text,
    },
    dateNum: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 22,
      color: c.text,
    },
    upcomingTime: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 18,
      color: c.text,
    },
    upcomingTitle: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },

    voice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 19,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.voiceBorder,
      backgroundColor: c.voice,
    },
    voiceBody: {
      flex: 1,
      gap: 2,
    },
    voiceTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 14,
      lineHeight: 18,
      color: c.text,
    },
    voiceText: {
      fontFamily: FontFamily.body,
      fontStyle: 'italic',
      fontSize: 13,
      lineHeight: 16,
      color: c.text,
    },
    wave: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    waveBar: {
      width: 3,
      borderRadius: 2,
    },
    mic: {
      width: 32,
      height: 32,
      marginHorizontal: 3,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
