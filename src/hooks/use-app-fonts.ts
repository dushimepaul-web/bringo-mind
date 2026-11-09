import { useFonts } from 'expo-font';

export function useAppFonts() {
  return useFonts({
    PlusJakartaSans_600SemiBold: require('../../assets/fonts/PlusJakartaSans_600SemiBold.ttf'),
    PlusJakartaSans_700Bold: require('../../assets/fonts/PlusJakartaSans_700Bold.ttf'),
    Inter_400Regular: require('../../assets/fonts/Inter_400Regular.ttf'),
    Inter_500Medium: require('../../assets/fonts/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('../../assets/fonts/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('../../assets/fonts/Inter_700Bold.ttf'),
    MaterialSymbols_400Regular: require('../../assets/fonts/MaterialSymbols_400Regular.ttf'),
    MaterialSymbols_400Regular_Filled: require('../../assets/fonts/MaterialSymbols_400Regular_Filled.ttf'),
  });
}
