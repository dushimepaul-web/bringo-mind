import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LaunchIntro } from '@/components/launch-intro';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { finishIntro, useIntroVisible } from '@/lib/launch';
import { SessionProvider } from '@/lib/session';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useAppFonts();
  const introVisible = useIntroVisible();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
          </Stack>
          {/* Ouverture animée : prend le relais de l'écran système sans saut, une fois par démarrage. */}
          {introVisible ? <LaunchIntro onDone={finishIntro} /> : null}
        </ThemeProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
