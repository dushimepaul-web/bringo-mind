import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BottomTabBar } from '@/components/bottom-tab-bar';
import { Serene } from '@/constants/design';

export default function Layout() {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <BottomTabBar />
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
