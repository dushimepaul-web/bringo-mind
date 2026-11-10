// Carrousel des suggestions de Kora sur le tableau de bord (démo).
// - défilement automatique toutes les 5 s, avec barre de progression dans le point actif ;
// - pause tant que l'on touche la carte, compteur « 1/3 » ;
// - couleur selon le type (document, rendez-vous, échéance) ;
// - « Ignorer » ou « Plus tard » selon la suggestion, avec « Annuler » ;
// - confirmation explicite avant toute action préparée par Kora (règle du dossier directeur).
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

type Tone = 'document' | 'event' | 'deadline';

type Suggestion = {
  id: string;
  tone: Tone;
  icon: string;
  title: string;
  amount?: string;
  detail: string;
  action: string;
  href: Href;
  /** « later » : la suggestion revient demain au lieu de disparaître. */
  secondary: 'ignore' | 'later';
  /** Action préparée par Kora : demande une confirmation avant d'être appliquée. */
  confirm?: {
    steps: { icon: string; text: string }[];
    source: string;
    success: string;
  };
};

/** Démo : suggestions préparées par Kora. */
const SUGGESTIONS: Suggestion[] = [
  {
    id: 'edf',
    tone: 'document',
    icon: 'bolt',
    title: 'Facture Engie à vérifier',
    amount: '118,50 €',
    detail: 'prélevé le 27 mai • lue par Kora',
    action: 'Vérifier',
    href: { pathname: '/documents/detail', params: { id: 'engie' } },
    secondary: 'ignore',
  },
  {
    id: 'dentiste',
    tone: 'event',
    icon: 'event_available',
    title: 'Rendez-vous dentiste à confirmer',
    detail: 'Vendredi 17 mai à 10h • Cabinet Dr Lemoine',
    action: 'Ajouter',
    href: '/calendar/add',
    secondary: 'ignore',
    confirm: {
      steps: [
        { icon: 'event', text: 'Créer l’événement « Dentiste — Dr Lemoine »' },
        { icon: 'schedule', text: 'Vendredi 17 mai, de 10h00 à 10h30' },
        { icon: 'notifications_active', text: 'Rappel 1 heure avant' },
      ],
      source: 'E-mail du Cabinet Dr Lemoine reçu le 13 mai',
      success: 'Événement ajouté au calendrier.',
    },
  },
  {
    id: 'assurance',
    tone: 'deadline',
    icon: 'home_health',
    title: 'Assurance habitation à renouveler',
    amount: '312,00 €',
    detail: 'échéance le 30 juin • MAIF',
    action: 'Créer un rappel',
    href: '/reminders/add',
    secondary: 'later',
    confirm: {
      steps: [
        { icon: 'alarm', text: 'Rappel « Renouveler l’assurance habitation »' },
        { icon: 'calendar_today', text: 'Le 23 juin à 9h00, 7 jours avant l’échéance' },
        { icon: 'smartphone', text: 'Notification sur ce téléphone' },
      ],
      source: 'Avis d’échéance MAIF classé dans Documents',
      success: 'Rappel créé pour le 23 juin.',
    },
  },
];

const AUTO_ADVANCE_MS = 5000;
const NOTICE_MS = 4000;
const DOT_WIDTH = 24;

const TONES: Record<
  Tone,
  { card: string; border: string; iconBg: string; iconFg: string; label: string }
> = {
  document: {
    card: Serene.surfaceContainerLow,
    border: Tint.border,
    iconBg: Serene.secondaryContainer,
    iconFg: Serene.onSecondaryContainer,
    label: 'Document',
  },
  event: {
    card: '#f1f0ff',
    border: '#d9d6fe',
    iconBg: '#e2dfff',
    iconFg: '#3323cc',
    label: 'Événement',
  },
  deadline: {
    card: '#fff6f5',
    border: '#fcd4cf',
    iconBg: Serene.errorContainer,
    iconFg: Serene.onErrorContainer,
    label: 'Échéance',
  },
};

type Notice = { text: string; restore?: { item: Suggestion; position: number } };

export function KoraSuggestions() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(SUGGESTIONS);
  const [index, setIndex] = useState(0);
  const [touching, setTouching] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [confirming, setConfirming] = useState<Suggestion | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Valeurs d'animation créées une seule fois (compatible React Compiler).
  const [fade] = useState(() => new Animated.Value(1));
  const [slideX] = useState(() => fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }));
  const [progress] = useState(() => new Animated.Value(0));
  const [progressWidth] = useState(() =>
    progress.interpolate({ inputRange: [0, 1], outputRange: [0, DOT_WIDTH] }),
  );
  const touchStartX = useRef<number | null>(null);

  const count = items.length;
  const current = Math.min(index, Math.max(count - 1, 0));
  const item = items[current];
  const paused = touching || confirming !== null;
  const autoPlay = count > 1 && !reduceMotion;

  // Respecte le réglage « réduire les animations » du téléphone.
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduceMotion(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  // Le message (ignorée, reportée, ajoutée…) disparaît seul après 4 s.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  /** Affiche une suggestion avec un court fondu (sans animation si réduite). */
  const show = useCallback(
    (next: number) => {
      progress.stopAnimation();
      progress.setValue(0);
      if (reduceMotion) {
        setIndex(next);
        return;
      }
      fade.stopAnimation();
      Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: Platform.OS !== 'web' }).start(
        ({ finished }) => {
          // Une transition interrompue par une plus récente ne s'applique pas.
          if (!finished) return;
          setIndex(next);
          Animated.timing(fade, {
            toValue: 1,
            duration: 220,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        },
      );
    },
    [fade, progress, reduceMotion],
  );

  // Défilement automatique piloté par la barre de progression : en pause, elle s'arrête
  // et repart d'où elle en était.
  useEffect(() => {
    if (!autoPlay || paused) {
      progress.stopAnimation();
      return;
    }
    let cancelled = false;
    progress.stopAnimation((value) => {
      if (cancelled) return;
      Animated.timing(progress, {
        toValue: 1,
        duration: Math.max(0, (1 - value) * AUTO_ADVANCE_MS),
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !cancelled) show((current + 1) % count);
      });
    });
    return () => {
      cancelled = true;
      progress.stopAnimation();
    };
  }, [autoPlay, paused, current, count, progress, show]);

  // Glissement du doigt : gauche = suivante, droite = précédente.
  const onTouchStart = (x: number) => {
    touchStartX.current = x;
    setTouching(true);
  };
  const onTouchEnd = (x: number) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    setTouching(false);
    if (startX == null || count < 2) return;
    const delta = x - startX;
    if (Math.abs(delta) < 40) return;
    show(delta < 0 ? (current + 1) % count : (current - 1 + count) % count);
  };

  const remove = (target: Suggestion, text: string) => {
    const position = items.findIndex((entry) => entry.id === target.id);
    const next = items.filter((entry) => entry.id !== target.id);
    setItems(next);
    progress.setValue(0);
    setIndex(Math.min(position, Math.max(next.length - 1, 0)));
    setNotice({ text, restore: { item: target, position } });
  };

  const undo = () => {
    const restore = notice?.restore;
    if (!restore) return;
    setItems((list) => {
      if (list.some((entry) => entry.id === restore.item.id)) return list;
      const copy = [...list];
      copy.splice(restore.position, 0, restore.item);
      return copy;
    });
    progress.setValue(0);
    setIndex(restore.position);
    setNotice(null);
  };

  const onPrimary = (target: Suggestion) => {
    if (target.confirm) {
      setConfirming(target);
      return;
    }
    router.push(target.href);
  };

  const onConfirm = () => {
    if (!confirming?.confirm) return;
    const target = confirming;
    setConfirming(null);
    remove(target, target.confirm!.success);
  };

  if (!item) {
    return (
      <View style={styles.doneNote}>
        <Icon name="check_circle" size={20} color={Serene.success} filled />
        <Text style={styles.doneText} numberOfLines={2}>
          {notice?.text ?? 'Toutes les suggestions ont été traitées.'}
        </Text>
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          onPress={() => {
            if (notice?.restore) {
              undo();
            } else {
              setItems(SUGGESTIONS);
              setIndex(0);
            }
          }}>
          <Text style={styles.linkText}>Annuler</Text>
        </Pressable>
      </View>
    );
  }

  const tone = TONES[item.tone];

  return (
    <>
      <View
        style={[styles.card, { backgroundColor: tone.card, borderColor: tone.border }]}
        accessibilityLabel={`Suggestions de Kora, ${current + 1} sur ${count}`}
        onTouchStart={(event) => onTouchStart(event.nativeEvent.pageX)}
        onTouchEnd={(event) => onTouchEnd(event.nativeEvent.pageX)}
        onTouchCancel={() => setTouching(false)}>
        <View style={styles.blob} pointerEvents="none" />
        <Animated.View
          style={[styles.slide, { opacity: fade, transform: [{ translateX: slideX }] }]}>
          <View style={styles.headerRow}>
            <View style={styles.labelRow}>
              <Icon name="auto_awesome" size={16} color={Tint.primary} />
              <Text style={styles.label} numberOfLines={1}>
                Suggestion Kora IA
              </Text>
            </View>
            <View style={styles.counter}>
              {paused && autoPlay ? <Icon name="pause" size={14} color={Tint.navy} /> : null}
              <Text style={styles.counterText}>
                {current + 1}/{count}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: tone.iconBg }]}>
              <Icon name={item.icon} size={22} filled color={tone.iconFg} />
            </View>
            <View style={styles.textBlock}>
              <Text style={[styles.toneTag, { color: tone.iconFg }]}>{tone.label}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.body} numberOfLines={2}>
                {item.amount ? <Text style={styles.amount}>{item.amount} </Text> : null}
                {item.detail}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
              accessibilityRole="button"
              onPress={() => onPrimary(item)}>
              <Text style={styles.primaryText} numberOfLines={1}>
                {item.action}
              </Text>
              <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}
              accessibilityRole="button"
              onPress={() =>
                remove(
                  item,
                  item.secondary === 'later'
                    ? 'Suggestion reportée à demain.'
                    : 'Suggestion ignorée.',
                )
              }>
              {item.secondary === 'later' ? (
                <Icon name="snooze" size={18} color={Tint.navy} />
              ) : null}
              <Text style={styles.secondaryText}>
                {item.secondary === 'later' ? 'Plus tard' : 'Ignorer'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {notice ? (
          <View style={styles.notice} accessibilityLiveRegion="polite">
            <Icon name="check_circle" size={18} color={Serene.success} filled />
            <Text style={styles.noticeText} numberOfLines={1}>
              {notice.text}
            </Text>
            {notice.restore ? (
              <Pressable hitSlop={8} accessibilityRole="button" onPress={undo}>
                <Text style={styles.linkText}>Annuler</Text>
              </Pressable>
            ) : null}
          </View>
        ) : count > 1 ? (
          <View style={styles.dots}>
            {items.map((entry, dotIndex) => {
              const active = dotIndex === current;
              return (
                <Pressable
                  key={entry.id}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Suggestion ${dotIndex + 1} sur ${count}`}
                  accessibilityState={{ selected: active }}
                  onPress={() => !active && show(dotIndex)}
                  style={[styles.dot, active && styles.dotActive]}>
                  {active && autoPlay ? (
                    <Animated.View style={[styles.dotFill, { width: progressWidth }]} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <Modal
        visible={confirming !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirming(null)}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={() => setConfirming(null)}
        />
        {confirming?.confirm ? (
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Space.md) + 8 }]}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Icon name="auto_awesome" size={18} color={Tint.primary} />
              <Text style={styles.sheetEyebrow}>Action suggérée par l’Assistant</Text>
            </View>
            <Text style={styles.sheetTitle}>{confirming.title}</Text>
            <Text style={styles.sheetIntro}>Kora va effectuer ceci après votre confirmation :</Text>

            <View style={styles.summary}>
              {confirming.confirm.steps.map((step) => (
                <View key={step.text} style={styles.summaryRow}>
                  <Icon name={step.icon} size={20} color={Tint.primary} />
                  <Text style={styles.summaryText}>{step.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sourceRow}>
              <Icon name="description" size={16} color={Serene.onSurfaceVariant} />
              <Text style={styles.sourceText}>Source : {confirming.confirm.source}</Text>
            </View>

            <View style={styles.sheetActions}>
              <Pressable
                style={({ pressed }) => [styles.sheetSecondary, pressed && styles.secondaryPressed]}
                accessibilityRole="button"
                onPress={() => {
                  const target = confirming;
                  setConfirming(null);
                  router.push(target.href);
                }}>
                <Icon name="edit" size={18} color={Tint.navy} />
                <Text style={styles.secondaryText}>Modifier</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.sheetConfirm, pressed && styles.confirmPressed]}
                accessibilityRole="button"
                onPress={onConfirm}>
                <Icon name="check" size={20} color={Serene.onPrimary} />
                <Text style={styles.primaryText}>Confirmer</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    userSelect: 'none',
    marginTop: Space.md,
    paddingBottom: 14,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    right: -40,
    bottom: -50,
    width: 160,
    height: 160,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
    opacity: 0.3,
  },
  slide: {
    padding: 16,
    paddingBottom: 6,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Tint.primary,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: Tint.border,
  },
  counterText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    // Hauteur stable (type + 2 lignes de titre + 2 lignes de détail) : la carte ne « saute » pas.
    minHeight: 104,
  },
  toneTag: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.navy,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  amount: {
    fontFamily: FontFamily.bodyBold,
    color: Tint.navy,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primary: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Tint.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryPressed: {
    backgroundColor: Tint.blackPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Serene.onPrimary,
  },
  secondary: {
    flexShrink: 0,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryPressed: {
    backgroundColor: Tint.soft,
  },
  secondaryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    height: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.border,
    overflow: 'hidden',
  },
  dotActive: {
    width: DOT_WIDTH,
    backgroundColor: '#9ad8cf',
  },
  dotFill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginHorizontal: 16,
    height: 18,
  },
  noticeText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.success,
  },
  linkText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Tint.primary,
  },
  doneNote: {
    marginTop: Space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: Serene.successContainer,
  },
  doneText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.success,
  },

  // Feuille de confirmation
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Tint.border,
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetEyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Tint.primary,
  },
  sheetTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: Tint.navy,
    marginTop: 8,
  },
  sheetIntro: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
    marginTop: 6,
  },
  summary: {
    marginTop: 14,
    padding: 14,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#99f6e4',
    backgroundColor: '#f0fdfa',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  sourceText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  sheetSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sheetConfirm: {
    flex: 1.4,
    height: 52,
    borderRadius: 16,
    backgroundColor: Tint.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
