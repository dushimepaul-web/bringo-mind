import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppLockScreen } from '@/components/app-lock-screen';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { OfflineBanner } from '@/components/ui/states';
import { Serene } from '@/constants/design';

export default function Layout() {
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
