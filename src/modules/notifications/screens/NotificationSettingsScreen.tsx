// S-22 - Paramètres de notifications | Module M10 Notifications | Phase S8
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function NotificationSettingsScreen() {
  const [master, setMaster] = useState(true);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [silence, setSilence] = useState(true);
  const [criticalDuringSilence, setCriticalDuringSilence] = useState(true);

  const [types, setTypes] = useState<Record<string, boolean>>({
    tasks: true,
    events: true,
    documents: true,
    household: true,
    assistant: false,
    product: false,
  });

  const toggleType = (key: string) => {
    setTypes((current) => ({ ...current, [key]: !current[key] }));
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.masterCard}>
          <View style={styles.masterIcon}>
            <Icon name="notifications_active" size={24} color={Serene.onPrimary} />
          </View>
          <View style={styles.masterBody}>
            <Text style={styles.masterTitle}>Activer les notifications</Text>
            <Text style={styles.masterText}>
              Recevez les rappels et mises à jour importantes
            </Text>
          </View>
          <Switch
            value={master}
            onValueChange={setMaster}
            trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
            thumbColor={Serene.surfaceContainerLowest}
          />
        </View>

        <View style={master ? undefined : styles.disabledSection}>
          <SectionTitle icon="send" title="Canaux" />
          <View style={styles.card}>
            <ToggleRow
              icon="phone_iphone"
              label="Notifications push"
              hint="Sur tous vos appareils"
              value={push}
              onChange={setPush}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="mail"
              label="E-mail"
              hint="claire.martin@email.fr"
              value={email}
              onChange={setEmail}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="sms"
              label="SMS"
              hint="+33 6 12 34 56 78 • urgences uniquement"
              value={sms}
              onChange={setSms}
            />
          </View>

          <SectionTitle icon="category" title="Types de notifications" />
          <View style={styles.card}>
            <ToggleRow
              icon="task_alt"
              label="Tâches"
              hint="Échéances, retards et rappels"
              value={types.tasks}
              onChange={() => toggleType('tasks')}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="event"
              label="Rendez-vous"
              hint="Nouveaux événements et modifications"
              value={types.events}
              onChange={() => toggleType('events')}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="folder"
              label="Documents"
              hint="Analyses IA terminées, partages"
              value={types.documents}
              onChange={() => toggleType('documents')}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="family_restroom"
              label="Foyer"
              hint="Invitations et activité partagée"
              value={types.household}
              onChange={() => toggleType('household')}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="auto_awesome"
              label="Suggestions de l’assistant"
              hint="Conseils et résumés de Kora"
              value={types.assistant}
              onChange={() => toggleType('assistant')}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="campaign"
              label="Nouveautés produit"
              hint="Conseils et évolutions de Bringo Mind"
              value={types.product}
              onChange={() => toggleType('product')}
            />
          </View>

          <SectionTitle icon="bedtime" title="Heures de silence" />
          <View style={styles.silenceCard}>
            <ToggleRow
              icon="do_not_disturb_on"
              label="Activer les heures de silence"
              hint="Aucune notification pendant cette plage"
              value={silence}
              onChange={setSilence}
            />

            {silence ? (
              <>
                <View style={styles.divider} />
                <View style={styles.timeRow}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>De</Text>
                    <Text style={styles.timeValue}>22:00</Text>
                  </View>
                  <Icon name="arrow_forward" size={18} color={Serene.outlineVariant} />
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>À</Text>
                    <Text style={styles.timeValue}>07:00</Text>
                  </View>
                  <View style={styles.timezonePill}>
                    <Text style={styles.timezoneText}>Europe/Paris</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <ToggleRow
                  icon="priority_high"
                  label="Rappels critiques autorisés"
                  hint="Laisser passer les urgences pendant le silence"
                  value={criticalDuringSilence}
                  onChange={setCriticalDuringSilence}
                />
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Les notifications critiques concernent les rappels de tâches en retard et les
            échéances du jour. Vous pouvez les désactiver à tout moment.
          </Text>
        </View>

        <Pressable style={styles.testButton} accessibilityRole="button">
          <Icon name="notifications" size={18} color={Serene.onSurface} />
          <Text style={styles.testButtonText}>Envoyer une notification de test</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={17} color={Serene.onSurfaceVariant} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
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
  saveButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
  },
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  masterIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterBody: {
    flex: 1,
    minWidth: 0,
  },
  masterTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  masterText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  disabledSection: {
    opacity: 0.45,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
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
  silenceCard: {
    paddingHorizontal: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  timeBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
  },
  timeLabel: {
    fontFamily: FontFamily.body,
    fontSize: 9,
    lineHeight: 13,
    color: Serene.onSurfaceVariant,
  },
  timeValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 22,
    color: Serene.onSurface,
  },
  timezonePill: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  timezoneText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Space.lg,
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
  testButton: {
    height: 44,
    marginTop: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.card,
  },
  testButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
