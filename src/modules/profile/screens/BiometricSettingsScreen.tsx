// S-20 (sécurité) - Biométrie | Module M09 Profil et paramètres | Phase S8
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function BiometricSettingsScreen() {
  const [enabled, setEnabled] = useState(true);
  const [sensitiveActions, setSensitiveActions] = useState(true);
  const [fallbackPin, setFallbackPin] = useState(true);
  const [testState, setTestState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const runTest = () => {
    if (testState === 'scanning') return;
    setTestState('scanning');
    timeoutRef.current = setTimeout(() => setTestState('success'), 1200);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Sécurité biométrique</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={[styles.fingerprintRing, enabled && styles.fingerprintRingActive]}>
            <View style={[styles.fingerprintCircle, enabled && styles.fingerprintCircleActive]}>
              <Icon
                name="fingerprint"
                size={44}
                color={enabled ? Serene.onPrimary : Serene.onSurfaceVariant}
              />
            </View>
          </View>
          <Text style={styles.heroTitle}>
            {enabled ? 'Biométrie activée' : 'Biométrie désactivée'}
          </Text>
          <Text style={styles.heroText}>
            Utilisez Face ID ou votre empreinte digitale pour déverrouiller Bringo Mind et confirmer
            les actions sensibles.
          </Text>

          <Pressable
            style={[
              styles.testButton,
              testState === 'success' && styles.testButtonSuccess,
            ]}
            onPress={runTest}
            accessibilityRole="button">
            <Icon
              name={
                testState === 'success'
                  ? 'check_circle'
                  : testState === 'scanning'
                    ? 'fingerprint'
                    : 'play_arrow'
              }
              size={18}
              color={testState === 'success' ? Serene.success : Serene.onSurface}
            />
            <Text
              style={[
                styles.testButtonText,
                testState === 'success' && styles.testButtonTextSuccess,
              ]}>
              {testState === 'success'
                ? 'Identité vérifiée'
                : testState === 'scanning'
                  ? 'Scan en cours...'
                  : 'Tester la biométrie'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <ToggleRow
            icon="fingerprint"
            label="Déverrouillage de l’application"
            hint="Face ID ou empreinte au lancement"
            value={enabled}
            onChange={setEnabled}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="gpp_good"
            label="Confirmer les actions sensibles"
            hint="Suppression, export, transfert de foyer"
            value={sensitiveActions}
            onChange={setSensitiveActions}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="pin"
            label="Code de secours"
            hint="Utiliser le code de l’appareil en cas d’échec"
            value={fallbackPin}
            onChange={setFallbackPin}
          />
        </View>

        <View style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Icon name="phone_iphone" size={20} color={Serene.secondary} />
          </View>
          <View style={styles.deviceBody}>
            <Text style={styles.deviceTitle}>iPhone 15</Text>
            <Text style={styles.deviceText}>Face ID disponible • iOS 18.2</Text>
          </View>
          <View style={styles.deviceStatus}>
            <Icon name="check_circle" size={14} color={Serene.success} />
            <Text style={styles.deviceStatusText}>Compatible</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon name="shield" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Vos données biométriques restent sur l’appareil. Bringo Mind ne les reçoit ni ne les
            stocke jamais.
          </Text>
        </View>

        <Pressable
          style={styles.saveButton}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Icon name="check" size={18} color={Serene.onPrimary} />
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={18} color={Serene.onSurfaceVariant} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
        thumbColor={Serene.surfaceContainerLowest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
    gap: Space.md,
  },
  heroCard: {
    alignItems: 'center',
    padding: Space.md,
    borderRadius: Radius.xxl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  fingerprintRing: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fingerprintRingActive: {
    backgroundColor: Serene.secondaryContainer,
  },
  fingerprintCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintCircleActive: {
    backgroundColor: Serene.primary,
  },
  heroTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 3,
    maxWidth: 300,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  testButtonSuccess: {
    backgroundColor: Serene.successContainer,
  },
  testButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  testButtonTextSuccess: {
    color: Serene.success,
    fontFamily: FontFamily.bodySemiBold,
  },
  card: {
    paddingHorizontal: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  rowHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  deviceIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceBody: {
    flex: 1,
    minWidth: 0,
  },
  deviceTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  deviceText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  deviceStatusText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  saveButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  saveButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
