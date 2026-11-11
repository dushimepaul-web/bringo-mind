// Animation d'ouverture (environ 1 s) : la tuile bleu nuit (identique à l'écran système, donc sans saut)
// voit le « b » se dessiner — la barre puis l'anneau —, le point turquoise s'allume avec un petit rebond,
// « bringo mind » apparaît, puis tout s'efface en fondu vers l'app.
// Un toucher passe l'animation ; « réduire les animations » donne un simple fondu.
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

import { BRAND } from '@/components/brand-logo';
import { FontFamily } from '@/constants/design';

/** Même taille que l'image de l'écran système (app.json → expo-splash-screen → imageWidth). */
const SIZE = 120;
const s = SIZE / 1024;
const BAR_HEIGHT = 648 * s;

export function LaunchIntro({ onDone }: { onDone: () => void }) {
  const dark = useColorScheme() === 'dark';
  const [bar] = useState(() => new Animated.Value(0));
  const [ring] = useState(() => new Animated.Value(0));
  const [dot] = useState(() => new Animated.Value(0));
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
          bar.setValue(1);
          ring.setValue(1);
          dot.setValue(1);
          word.setValue(1);
          setTimeout(() => !cancelled && leave(), 350);
          return;
        }
        Animated.sequence([
          Animated.timing(bar, { toValue: 1, duration: 230, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ring, { toValue: 1, duration: 260, easing: Easing.out(Easing.back(1.4)), useNativeDriver: false }),
          Animated.spring(dot, { toValue: 1, friction: 4, tension: 120, useNativeDriver: false }),
          Animated.timing(word, { toValue: 1, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.delay(260),
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
        <Animated.View
          style={[
            styles.tile,
            { transform: [{ scale: fade.interpolate({ inputRange: [0, 1], outputRange: [1.08, 1] }) }] },
          ]}>
          {/* Anneau du « b » */}
          <Animated.View
            style={[
              styles.ring,
              { opacity: ring, transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] },
            ]}
          />
          {/* Barre du « b » : se dessine de haut en bas */}
          <Animated.View style={[styles.bar, { height: bar.interpolate({ inputRange: [0, 1], outputRange: [127 * s, BAR_HEIGHT] }), opacity: bar }]} />
          {/* Point turquoise : s'allume avec un rebond */}
          <Animated.View style={[styles.dot, { transform: [{ scale: dot }] }]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.wordmark,
            { opacity: word, transform: [{ translateY: word.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}>
          <Text style={[styles.word, { color: dark ? BRAND.white : BRAND.navy }]}>
            bringo <Text style={[styles.mind, { color: dark ? BRAND.mint : BRAND.tealDark }]}>mind</Text>
          </Text>
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
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE * 0.225,
    backgroundColor: BRAND.navy,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    left: 296 * s,
    top: 373 * s,
    width: 464 * s,
    height: 464 * s,
    borderRadius: 232 * s,
    borderWidth: 129 * s,
    borderColor: BRAND.white,
  },
  bar: {
    position: 'absolute',
    left: 265 * s,
    top: 187 * s,
    width: 127 * s,
    borderRadius: 63.5 * s,
    backgroundColor: BRAND.white,
  },
  dot: {
    position: 'absolute',
    left: 661 * s,
    top: 183 * s,
    width: 162 * s,
    height: 162 * s,
    borderRadius: 81 * s,
    backgroundColor: BRAND.teal,
  },
  wordmark: {
    position: 'absolute',
    top: '50%',
    marginTop: SIZE / 2 + 22,
    alignItems: 'center',
    gap: 6,
  },
  word: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  mind: {
    fontFamily: FontFamily.bodySemiBold,
  },
  claim: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
  },
});
