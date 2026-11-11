// Écran de verrouillage : par-dessus l'app connectée tant que Face ID n'a pas reconnu la personne.
// La reconnaissance se lance toute seule ; le code du téléphone sert de secours.
// L'écran demandé (par exemple ouvert depuis une notification) est déjà prêt dessous : il apparaît au déverrouillage.
import { useEffect, useState } from 'react';
import { Animated, AppState, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BRAND, BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/kit';
import { FontFamily, Serene, Tint } from '@/constants/design';
import { appLock, useAppLock } from '@/lib/app-lock';

type Scan = 'idle' | 'scanning' | 'success';

export function AppLockScreen() {
  const { locked } = useAppLock();
  const insets = useSafeAreaInsets();
  const [scan, setScan] = useState<Scan>('idle');
  const [pulse] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  const [visible, setVisible] = useState(locked);
  const [wasLocked, setWasLocked] = useState(locked);

  // Réaffiche l'écran à chaque nouveau verrouillage.
  if (locked !== wasLocked) {
    setWasLocked(locked);
    if (locked) {
      setVisible(true);
      setScan('idle');
    }
  }

  // Arrière-plan / premier plan : le verrou décide selon le délai choisi.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'background') appLock.wentBackground();
      if (next === 'active') appLock.cameBack();
    });
    return () => subscription.remove();
  }, []);

  // Démo : Face ID se lance tout seul, reconnaît en ~1 s, puis l'écran s'efface.
  useEffect(() => {
    if (!locked) return undefined;
    fade.setValue(1);
    const start = setTimeout(() => setScan('scanning'), 450);
    return () => clearTimeout(start);
  }, [locked, fade]);

  useEffect(() => {
    if (scan !== 'scanning') return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 450, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 450, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    const done = setTimeout(() => setScan('success'), 1000);
    return () => {
      loop.stop();
      clearTimeout(done);
    };
  }, [scan, pulse]);

  useEffect(() => {
    if (scan !== 'success') return undefined;
    const timer = setTimeout(() => {
      appLock.unlock();
      Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: false }).start(() => setVisible(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [scan, fade]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { opacity: fade, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
      accessibilityViewIsModal>
      <View style={styles.top}>
        <BrandLogo size={72} />
        <Text style={styles.title}>Bringo Mind est verrouillé</Text>
        <Text style={styles.subtitle}>Vos démarches et documents restent protégés.</Text>
      </View>

      <View style={styles.middle} accessibilityLiveRegion="polite">
        <Animated.View
          style={[
            styles.face,
            scan === 'success' && styles.faceOk,
            { transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] },
          ]}>
          <Icon name={scan === 'success' ? 'check' : 'face'} size={44} color={scan === 'success' ? Serene.onPrimary : BRAND.navy} />
        </Animated.View>
        <Text style={styles.status}>
          {scan === 'success' ? 'Bonjour Claire' : scan === 'scanning' ? 'Reconnaissance Face ID…' : 'Regardez votre téléphone'}
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Déverrouiller avec Face ID" icon="face" onPress={() => setScan('scanning')} />
        <SecondaryButton label="Utiliser le code du téléphone" icon="pin" onPress={() => setScan('success')} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 50,
    elevation: 50,
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    marginTop: 10,
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  middle: {
    alignItems: 'center',
    gap: 14,
  },
  face: {
    width: 104,
    height: 104,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOk: {
    backgroundColor: Tint.primary,
    borderColor: Tint.primary,
  },
  status: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
  },
  actions: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: 10,
  },
});
