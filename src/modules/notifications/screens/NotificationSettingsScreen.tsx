// S-22 - Réglages des notifications | Module M10 Notifications | Phase S8
// Comme les réglages du téléphone : icônes dans des carrés de couleur, chaque interrupteur s'enregistre
// tout de suite (pas de bouton « Enregistrer »), heures de silence choisies sur des roues à 3 lignes.
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { QueryView } from '@/components/ui/states';
import { WheelList, WheelSeparator } from '@/components/ui/wheel-list';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { deviceTimeZone } from '@/lib/device-info';
import { useSession } from '@/lib/session';

import {
  clearNotificationSettingsError,
  syncNotificationPreferences,
  updateNotificationSettings,
  useNotificationSettings,
  type NotificationChannelKey,
  type NotificationSettings,
} from '../settings-store';

type BooleanKey = 'dailySummary' | 'weeklySummary' | 'sameDay';

const SUMMARIES: { key: BooleanKey; icon: string; tint: string; title: string; subtitle: string }[] = [
  { key: 'sameDay', icon: 'today', tint: '#16A34A', title: 'Rappel le jour même', subtitle: 'Le matin d’une échéance' },
  { key: 'dailySummary', icon: 'wb_sunny', tint: '#E08A00', title: 'Résumé du matin', subtitle: 'Ce qui vous attend aujourd’hui' },
  { key: 'weeklySummary', icon: 'date_range', tint: '#2F7BE0', title: 'Résumé de la semaine', subtitle: 'Les échéances des 7 prochains jours' },
];

const two = (value: number) => String(value).padStart(2, '0');
const HOUR_ITEMS = Array.from({ length: 24 }, (_, value) => ({ key: `h${value}`, label: two(value) }));
const MINUTE_ITEMS = Array.from({ length: 12 }, (_, value) => ({ key: `m${value * 5}`, label: two(value * 5) }));

export default function NotificationSettingsScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const settings = useNotificationSettings();
  const { user } = useSession();
  const query = useQuery('notification-preferences', syncNotificationPreferences);
  const [toast, setToast] = useState<string | null>(null);

  // Enregistrement refusé par le serveur : on l'affiche une fois.
  useEffect(() => {
    if (!settings.error) return;
    const timer = setTimeout(() => {
      setToast(settings.error);
      clearNotificationSettingsError();
    }, 0);
    return () => clearTimeout(timer);
  }, [settings.error]);

  const channels: { key: NotificationChannelKey; icon: string; tint: string; title: string; subtitle: string }[] = [
    { key: 'in_app', icon: 'notifications', tint: '#E5484D', title: 'Dans l’application', subtitle: 'Centre de notifications Bringo Mind' },
    { key: 'web_push', icon: 'phone_iphone', tint: '#2F7BE0', title: 'Notifications push', subtitle: 'Sur vos appareils inscrits' },
    { key: 'email', icon: 'mail', tint: '#0FB5A3', title: 'E-mail', subtitle: user?.email ?? 'À l’adresse de votre compte' },
  ];
  const activeChannels = Object.values(settings.channels).filter(Boolean).length;
  const update = (change: Partial<NotificationSettings>) => updateNotificationSettings((current) => ({ ...current, ...change }));
  const setChannel = (key: NotificationChannelKey, value: boolean) => {
    // Au moins un canal : sans canal, aucun rappel ne serait envoyé.
    if (!value && activeChannels <= 1 && settings.channels[key]) {
      setToast('Gardez au moins un canal pour recevoir vos rappels.');
      return;
    }
    updateNotificationSettings((current) => ({ ...current, channels: { ...current.channels, [key]: value } }));
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Réglages des notifications" fallback="/notifications" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <QueryView query={query}>
          <SettingsSection title="Canaux">
            {channels.map((channel, index) => (
              <SettingsRow
                key={channel.key}
                first={index === 0}
                icon={channel.icon}
                tint={channel.tint}
                title={channel.title}
                subtitle={channel.subtitle}
                right={
                  <ToggleSwitch value={settings.channels[channel.key]} label={channel.title} onValueChange={(value) => setChannel(channel.key, value)} />
                }
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Rappels et résumés">
            {SUMMARIES.map((entry, index) => (
              <SettingsRow
                key={entry.key}
                first={index === 0}
                icon={entry.icon}
                tint={entry.tint}
                title={entry.title}
                subtitle={entry.subtitle}
                right={<ToggleSwitch value={settings[entry.key]} label={entry.title} onValueChange={(value) => update({ [entry.key]: value })} />}
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Heures de silence" footer={`Fuseau : ${deviceTimeZone()}. Pendant le silence, les envois sont décalés à la fin de la plage.`}>
            <SettingsRow
              first
              icon="bedtime"
              tint="#5B5BD6"
              title="Heures de silence"
              subtitle="Aucune notification pendant cette plage"
              right={<ToggleSwitch value={settings.quiet} label="Activer les heures de silence" onValueChange={(value) => update({ quiet: value })} />}
            />
            {settings.quiet ? (
              <View style={styles.range}>
                <TimeWheels label="De" value={settings.quietStart} onChange={(value) => update({ quietStart: value })} />
                <Icon name="arrow_forward" size={20} color={c.muted} style={styles.arrow} />
                <TimeWheels label="À" value={settings.quietEnd} onChange={(value) => update({ quietEnd: value })} />
              </View>
            ) : null}
            <SettingsRow
              icon="priority_high"
              tint="#E08A00"
              title="Tâches urgentes"
              subtitle="Leurs rappels passent même pendant le silence"
              disabled={!settings.quiet}
              right={
                <ToggleSwitch
                  value={settings.critical}
                  disabled={!settings.quiet}
                  label="Laisser passer les rappels des tâches urgentes"
                  onValueChange={(value) => update({ critical: value })}
                />
              }
            />
          </SettingsSection>
        </QueryView>
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
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
