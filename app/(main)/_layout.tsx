import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppLockScreen } from '@/components/app-lock-screen';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { OfflineBanner } from '@/components/ui/states';
import { Serene } from '@/constants/design';
import { IS_DEMO } from '@/lib/config';
import { useOnboarded } from '@/lib/launch';
import { useSession } from '@/lib/session';

export default function Layout() {
  const { status } = useSession();
  const onboarded = useOnboarded(!IS_DEMO);
  // Mode API : écrans connectés réservés à une session valide (démo : Claire est toujours connectée).
  // Pendant la reprise de session, l'animation d'ouverture couvre l'écran.
  if (!IS_DEMO && (status === 'loading' || onboarded === null)) return null;
  if (!IS_DEMO && status === 'unauthenticated') {
    return <Redirect href={onboarded ? '/welcome' : '/onboarding'} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
        {/* Hors ligne : bandeau au-dessus de la barre d'onglets, sur tous les écrans connectés. */}
        <OfflineBanner />
      </View>
      <BottomTabBar />
      {/* Verrouillage Face ID au démarrage et au retour dans l'app (selon le délai choisi). */}
      <AppLockScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  content: {
    flex: 1,
  },
});
