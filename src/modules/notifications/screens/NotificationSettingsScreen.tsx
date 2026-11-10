// S-22 - Réglages des notifications | Module M10 Notifications | Phase S8
// Canaux, types (mêmes éléments que dans l'app), heures de silence réglables à la roue.
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton, SecondaryButton, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { TimeWheelSheet } from '@/components/ui/wheel-picker';
import { FontFamily, Serene, Tint } from '@/constants/design';

type Settings = {
  enabled: boolean;
  channels: Record<'push' | 'email' | 'sms', boolean>;
  types: Record<'tasks' | 'reminders' | 'events' | 'documents' | 'household' | 'kora' | 'product', boolean>;
  quiet: boolean;
  quietStart: [number, number];
  quietEnd: [number, number];
  critical: boolean;
};

const CHANNELS: { key: keyof Settings['channels']; icon: string; title: string; subtitle: string }[] = [
  { key: 'push', icon: 'phone_iphone', title: 'Notifications sur le téléphone', subtitle: 'iPhone 15 et MacBook Air' },
  { key: 'email', icon: 'mail', title: 'E-mail', subtitle: 'claire.martin@email.fr' },
  { key: 'sms', icon: 'sms', title: 'SMS', subtitle: '+33 6 12 34 56 78 • urgences uniquement' },
];

const TYPES: { key: keyof Settings['types']; icon: string; title: string; subtitle: string }[] = [
  { key: 'tasks', icon: 'task_alt', title: 'Tâches', subtitle: 'Échéances du jour et retards' },
  { key: 'reminders', icon: 'notifications', title: 'Rappels', subtitle: 'À l’heure que vous avez choisie' },
  { key: 'events', icon: 'event', title: 'Événements', subtitle: 'Avant chaque événement et en cas de changement' },
  { key: 'documents', icon: 'folder', title: 'Documents', subtitle: 'Analyse terminée, document partagé' },
  { key: 'household', icon: 'family_restroom', title: 'Foyer', subtitle: 'Invitations et éléments partagés' },
  { key: 'kora', icon: 'auto_awesome', title: 'Suggestions de Kora', subtitle: 'Conseils et résumé du matin' },
  { key: 'product', icon: 'campaign', title: 'Nouveautés', subtitle: 'Évolutions de Bringo Mind' },
];

const INITIAL: Settings = {
  enabled: true,
  channels: { push: true, email: true, sms: false },
  types: { tasks: true, reminders: true, events: true, documents: true, household: true, kora: false, product: false },
  quiet: true,
  quietStart: [22, 0],
  quietEnd: [7, 0],
  critical: true,
};

// Démo : les réglages enregistrés restent en mémoire tant que l'app est ouverte.
let savedSettings: Settings = INITIAL;

const hhmm = ([hours, minutes]: [number, number]) => `${String(hours).padStart(2, '0')}h${String(minutes).padStart(2, '0')}`;

export default function NotificationSettingsScreen() {
  const [saved, setSaved] = useState<Settings>(savedSettings);
  const [draft, setDraft] = useState<Settings>(savedSettings);
  const [picker, setPicker] = useState<'start' | 'end' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const off = !draft.enabled;
  const activeChannels = Object.values(draft.channels).filter(Boolean).length;

  const setChannel = (key: keyof Settings['channels'], value: boolean) =>
    setDraft((current) => ({ ...current, channels: { ...current.channels, [key]: value } }));
  const setType = (key: keyof Settings['types'], value: boolean) =>
    setDraft((current) => ({ ...current, types: { ...current.types, [key]: value } }));

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Notifications" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.master]}>
          <View style={[styles.masterIcon, off && styles.masterIconOff]}>
            <Icon name={off ? 'notifications_off' : 'notifications_active'} size={24} color={off ? Tint.navy : Serene.onPrimary} />
          </View>
          <View style={styles.flex}>
            <Text style={kitStyles.title}>Activer les notifications</Text>
            <Text style={styles.meta}>{off ? 'Vous ne recevrez plus rien de Bringo Mind' : 'Rappels et mises à jour importantes'}</Text>
          </View>
          <ToggleSwitch
            value={draft.enabled}
            label="Activer les notifications"
            onValueChange={(value) => setDraft((current) => ({ ...current, enabled: value }))}
          />
        </View>

        <SettingsSection title="Canaux" icon="send" footer={!off && activeChannels === 0 ? 'Choisissez au moins un canal pour recevoir vos rappels.' : undefined}>
          {CHANNELS.map((channel, index) => (
            <SettingsRow
              key={channel.key}
              first={index === 0}
              icon={channel.icon}
              title={channel.title}
              subtitle={channel.subtitle}
              disabled={off}
              right={
                <ToggleSwitch
                  value={draft.channels[channel.key]}
                  disabled={off}
                  label={channel.title}
                  onValueChange={(value) => setChannel(channel.key, value)}
                />
              }
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Types de notifications" icon="category">
          {TYPES.map((type, index) => (
            <SettingsRow
              key={type.key}
              first={index === 0}
              icon={type.icon}
              title={type.title}
              subtitle={type.subtitle}
              disabled={off}
              right={
                <ToggleSwitch
                  value={draft.types[type.key]}
                  disabled={off}
                  label={type.title}
                  onValueChange={(value) => setType(type.key, value)}
                />
              }
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Heures de silence" icon="bedtime" footer="Heure de Paris (UTC+2). Les rappels critiques concernent les tâches en retard et les échéances du jour.">
          <SettingsRow
            first
            icon="do_not_disturb_on"
            title="Activer les heures de silence"
            subtitle="Aucune notification pendant cette plage"
            disabled={off}
            right={
              <ToggleSwitch
                value={draft.quiet}
                disabled={off}
                label="Activer les heures de silence"
                onValueChange={(value) => setDraft((current) => ({ ...current, quiet: value }))}
              />
            }
          />
          {draft.quiet && !off ? (
            <View style={styles.range}>
              <TimePill label="De" value={hhmm(draft.quietStart)} onPress={() => setPicker('start')} />
              <Icon name="arrow_forward" size={20} color={Serene.onSurfaceVariant} />
              <TimePill label="À" value={hhmm(draft.quietEnd)} onPress={() => setPicker('end')} />
            </View>
          ) : null}
          <SettingsRow
            icon="priority_high"
            title="Laisser passer les rappels critiques"
            subtitle="Même pendant les heures de silence"
            disabled={off || !draft.quiet}
            right={
              <ToggleSwitch
                value={draft.critical}
                disabled={off || !draft.quiet}
                label="Laisser passer les rappels critiques"
                onValueChange={(value) => setDraft((current) => ({ ...current, critical: value }))}
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

      <View style={styles.footer}>
        <PrimaryButton
          label={dirty ? 'Enregistrer' : 'Réglages enregistrés'}
          icon="check"
          disabled={!dirty}
          onPress={() => {
            savedSettings = draft;
            setSaved(draft);
            setToast('Réglages des notifications enregistrés');
          }}
        />
      </View>

      <TimeWheelSheet
        visible={picker === 'start'}
        title="Début du silence"
        hours={draft.quietStart[0]}
        minutes={draft.quietStart[1]}
        onConfirm={(hours, minutes) => setDraft((current) => ({ ...current, quietStart: [hours, minutes] }))}
        onClose={() => setPicker(null)}
      />
      <TimeWheelSheet
        visible={picker === 'end'}
        title="Fin du silence"
        hours={draft.quietEnd[0]}
        minutes={draft.quietEnd[1]}
        onConfirm={(hours, minutes) => setDraft((current) => ({ ...current, quietEnd: [hours, minutes] }))}
        onClose={() => setPicker(null)}
      />

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={100} /> : null}
    </SafeAreaView>
  );
}

function TimePill({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <View style={styles.pillWrap}>
      <Text style={styles.pillLabel}>{label}</Text>
      <SecondaryButton label={value} onPress={onPress} style={styles.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  master: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  masterIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterIconOff: {
    backgroundColor: Tint.soft,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  range: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  pillWrap: {
    flex: 1,
    gap: 4,
  },
  pillLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  pill: {
    backgroundColor: Tint.soft,
  },
  test: {
    marginTop: 22,
  },
  footer: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    backgroundColor: Tint.softer,
  },
});
