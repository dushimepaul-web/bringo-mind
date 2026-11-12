// Animation d'ouverture (environ 1,2 s) : la tuile bleu nuit du logo officiel (identique à l'écran système,
// donc sans saut) — le « B » en bulle pulse avec un halo cyan, « BringoMind » apparaît, puis fondu vers l'app.
// Un toucher passe l'animation ; « réduire les animations » donne un simple fondu.
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

import { BRAND, BRAND_IMAGES, SYMBOL_RATIO, WORDMARK_RATIO } from '@/components/brand-logo';
import { FontFamily } from '@/constants/design';

/** Même taille que l'image de l'écran système (app.json → expo-splash-screen → imageWidth). */
const SIZE = 120;
const WORD_HEIGHT = 34;

export function LaunchIntro({ onDone }: { onDone: () => void }) {
  const dark = useColorScheme() === 'dark';
  const [pulse] = useState(() => new Animated.Value(0));
  const [halo] = useState(() => new Animated.Value(0));
  const [word] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  const [leaving, setLeaving] = useState(false);

  const leave = () => {
    if (leaving) return;
    setLeaving(true);
    Animated.timing(fade, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => onDone());
  };

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          word.setValue(1);
          setTimeout(() => !cancelled && leave(), 350);
          return;
        }
        Animated.sequence([
          Animated.parallel([
            Animated.sequence([
              Animated.timing(pulse, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: false }),
              Animated.spring(pulse, { toValue: 0, friction: 4, tension: 110, useNativeDriver: false }),
            ]),
            Animated.timing(halo, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          ]),
          Animated.timing(word, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.delay(320),
        ]).start(({ finished }) => {
          if (finished && !cancelled) leave();
        });
      });
    return () => {
      cancelled = true;
    };
    // L'animation ne se joue qu'une fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: dark ? '#0b1220' : '#F8F9FF', opacity: fade }]}
      pointerEvents={leaving ? 'none' : 'auto'}>
      <Pressable style={styles.center} accessibilityRole="button" accessibilityLabel="Passer l’animation d’ouverture" onPress={leave}>
        {/* Halo cyan qui s'élargit derrière la tuile */}
        <Animated.View
          style={[
            styles.halo,
            {
              opacity: halo.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.55, 0] }),
              transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.9] }) }],
            },
          ]}
        />
        <Animated.View
          style={[styles.tile, { transform: [{ scale: fade.interpolate({ inputRange: [0, 1], outputRange: [1.08, 1] }) }] }]}
          accessibilityRole="image"
          accessibilityLabel="Bringo Mind">
          <Animated.View style={{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }}>
            <Image source={BRAND_IMAGES.symbol} style={styles.symbol} contentFit="contain" />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.wordmark,
            { opacity: word, transform: [{ translateY: word.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}>
          <Image
            source={dark ? BRAND_IMAGES.wordmarkDark : BRAND_IMAGES.wordmark}
            style={{ width: WORD_HEIGHT * WORDMARK_RATIO, height: WORD_HEIGHT }}
            contentFit="contain"
            accessibilityLabel="BringoMind"
          />
          <Text style={[styles.claim, { color: dark ? '#cbd5e1' : '#45464d' }]}>Votre vie administrative, simplifiée</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 100,
    elevation: 100,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE * 0.5,
    backgroundColor: BRAND.cyan,
  },
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE * 0.225,
    backgroundColor: BRAND.navy,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  symbol: {
    width: SIZE * SYMBOL_RATIO,
    height: SIZE * SYMBOL_RATIO,
  },
  wordmark: {
    position: 'absolute',
    top: '50%',
    marginTop: SIZE / 2 + 24,
    alignItems: 'center',
    gap: 8,
  },
  claim: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
  },
});
