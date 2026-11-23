// S-22 - Réglages des notifications | Module M10 Notifications | Phase S8
// Comme les réglages du téléphone : icônes dans des carrés de couleur, chaque interrupteur s'enregistre
// tout de suite (pas de bouton « Enregistrer »), heures de silence choisies sur des roues à 3 lignes.
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { SecondaryButton, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { WheelList, WheelSeparator } from '@/components/ui/wheel-list';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

import { syncNotificationPreferences, updateNotificationSettings, useNotificationSettings, type NotificationSettings } from '../settings-store';

const CHANNELS: { key: keyof NotificationSettings['channels']; icon: string; tint: string; title: string; subtitle: string }[] = [
  { key: 'push', icon: 'phone_iphone', tint: '#2F7BE0', title: 'Sur le téléphone', subtitle: 'iPhone 15 et MacBook Air' },
  { key: 'email', icon: 'mail', tint: '#0FB5A3', title: 'E-mail', subtitle: 'claire.martin@email.fr' },
  { key: 'sms', icon: 'sms', tint: '#16A34A', title: 'SMS', subtitle: 'Urgences uniquement' },
];

const TYPES: { key: keyof NotificationSettings['types']; icon: string; tint: string; title: string; subtitle: string }[] = [
  { key: 'tasks', icon: 'task_alt', tint: '#16A34A', title: 'Tâches', subtitle: 'Échéances du jour et retards' },
  { key: 'reminders', icon: 'alarm', tint: '#E5484D', title: 'Rappels', subtitle: 'À l’heure que vous avez choisie' },
  { key: 'events', icon: 'event', tint: '#2F7BE0', title: 'Événements', subtitle: 'Avant chaque événement' },
  { key: 'documents', icon: 'folder', tint: '#E08A00', title: 'Documents', subtitle: 'Analyse terminée, document partagé' },
  { key: 'household', icon: 'family_restroom', tint: '#8B5CF6', title: 'Foyer', subtitle: 'Invitations et éléments partagés' },
  { key: 'kora', icon: 'auto_awesome', tint: '#0C1A37', title: 'Suggestions de Kora', subtitle: 'Conseils et résumé du matin' },
  { key: 'product', icon: 'campaign', tint: '#6B7280', title: 'Nouveautés', subtitle: 'Évolutions de Bringo Mind' },
];

const two = (value: number) => String(value).padStart(2, '0');
const HOUR_ITEMS = Array.from({ length: 24 }, (_, value) => ({ key: `h${value}`, label: two(value) }));
const MINUTE_ITEMS = Array.from({ length: 12 }, (_, value) => ({ key: `m${value * 5}`, label: two(value * 5) }));

export default function NotificationSettingsScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const settings = useNotificationSettings();

  // Mode API : charge les préférences du serveur à l'arrivée sur l'écran.
  useEffect(() => {
    void syncNotificationPreferences();
  }, []);
  const [toast, setToast] = useState<string | null>(null);

  const off = !settings.enabled;
  const activeChannels = Object.values(settings.channels).filter(Boolean).length;
  const update = (change: Partial<NotificationSettings>) => updateNotificationSettings((current) => ({ ...current, ...change }));
  const setChannel = (key: keyof NotificationSettings['channels'], value: boolean) =>
    updateNotificationSettings((current) => ({ ...current, channels: { ...current.channels, [key]: value } }));
  const setType = (key: keyof NotificationSettings['types'], value: boolean) =>
    updateNotificationSettings((current) => ({ ...current, types: { ...current.types, [key]: value } }));

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Réglages des notifications" fallback="/notifications" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <SettingsRow
            first
            icon={off ? 'notifications_off' : 'notifications_active'}
            tint={off ? '#6B7280' : '#E5484D'}
            title="Autoriser les notifications"
            subtitle={off ? 'Vous ne recevrez plus rien de Bringo Mind' : 'Rappels et mises à jour importantes'}
            right={<ToggleSwitch value={settings.enabled} label="Autoriser les notifications" onValueChange={(value) => update({ enabled: value })} />}
          />
        </View>

        <SettingsSection title="Canaux" footer={!off && activeChannels === 0 ? 'Choisissez au moins un canal pour recevoir vos rappels.' : undefined}>
          {CHANNELS.map((channel, index) => (
            <SettingsRow
              key={channel.key}
              first={index === 0}
              icon={channel.icon}
              tint={channel.tint}
              title={channel.title}
              subtitle={channel.subtitle}
              disabled={off}
              right={
                <ToggleSwitch value={settings.channels[channel.key]} disabled={off} label={channel.title} onValueChange={(value) => setChannel(channel.key, value)} />
              }
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Types de notifications">
          {TYPES.map((type, index) => (
            <SettingsRow
              key={type.key}
              first={index === 0}
              icon={type.icon}
              tint={type.key === 'kora' && c.dark ? '#3B5079' : type.tint}
              title={type.title}
              subtitle={type.subtitle}
              disabled={off}
              right={<ToggleSwitch value={settings.types[type.key]} disabled={off} label={type.title} onValueChange={(value) => setType(type.key, value)} />}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Heures de silence" footer="Heure de Paris (UTC+2). Les rappels critiques : tâches en retard et échéances du jour.">
          <SettingsRow
            first
            icon="bedtime"
            tint="#5B5BD6"
            title="Heures de silence"
            subtitle="Aucune notification pendant cette plage"
            disabled={off}
            right={<ToggleSwitch value={settings.quiet} disabled={off} label="Activer les heures de silence" onValueChange={(value) => update({ quiet: value })} />}
          />
          {settings.quiet && !off ? (
            <View style={styles.range}>
              <TimeWheels label="De" value={settings.quietStart} onChange={(value) => update({ quietStart: value })} />
              <Icon name="arrow_forward" size={20} color={c.muted} style={styles.arrow} />
              <TimeWheels label="À" value={settings.quietEnd} onChange={(value) => update({ quietEnd: value })} />
            </View>
          ) : null}
          <SettingsRow
            icon="priority_high"
            tint="#E08A00"
            title="Rappels critiques"
            subtitle="Passent même pendant le silence"
            disabled={off || !settings.quiet}
            right={
              <ToggleSwitch
                value={settings.critical}
                disabled={off || !settings.quiet}
                label="Laisser passer les rappels critiques"
                onValueChange={(value) => update({ critical: value })}
              />
            }
          />
        </SettingsSection>

        <SecondaryButton
          label="Envoyer une notification de test"
          icon="notifications"
          style={styles.test}
          onPress={() => setToast(off ? 'Les notifications sont désactivées' : 'Notification de test envoyée sur cet iPhone')}
        />
      </ScrollView>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={24} /> : null}
    </SafeAreaView>
  );
}

function TimeWheels({ label, value, onChange }: { label: string; value: [number, number]; onChange: (value: [number, number]) => void }) {
  const { styles } = useLook();
  const minuteIndex = Math.round(value[1] / 5) % 12;
  return (
    <View style={styles.wheelColumn}>
      <Text style={styles.wheelLabel}>{label}</Text>
      <View style={styles.wheelBox}>
        <WheelList label={`${label}, heures`} items={HOUR_ITEMS} index={value[0]} onChange={(hours) => onChange([hours, value[1]])} style={styles.wheel} />
        <WheelSeparator />
        <WheelList label={`${label}, minutes`} items={MINUTE_ITEMS} index={minuteIndex} onChange={(index) => onChange([value[0], index * 5])} style={styles.wheel} />
      </View>
    </View>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    content: {
      paddingTop: 4,
      paddingBottom: 32,
    },
    card: {
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    range: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingBottom: 14,
    },
    arrow: {
      marginTop: 26,
    },
    wheelColumn: {
      flex: 1,
      gap: 6,
    },
    wheelLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    wheelBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: c.dark ? '#0F1B33' : '#F0F1F4',
      overflow: 'hidden',
    },
    wheel: {
      flex: 1,
    },
    test: {
      marginTop: 22,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
