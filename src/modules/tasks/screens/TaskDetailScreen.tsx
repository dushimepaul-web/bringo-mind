// S-09 - Détail d'une tâche | Module M04 Tâches | Phase S4
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function TaskDetailScreen() {
  const [completed, setCompleted] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour aux tâches"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Détail de la tâche</Text>
        <Pressable style={styles.headerButton} accessibilityLabel="Plus d'options">
          <Icon name="more_vert" size={22} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.pillsRow}>
          <View style={styles.priorityPill}>
            <View style={styles.priorityDot} />
            <Text style={styles.priorityText}>Haute priorité</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{completed ? 'Terminée' : 'En cours'}</Text>
          </View>
        </View>

        <Text style={[styles.title, completed && styles.titleCompleted]}>
          Renvoyer attestation de domicile signée
        </Text>
        <Text style={styles.subtitle}>Bailleur Foncia • Format PDF certifié</Text>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>
            Renvoyer l&apos;attestation de domicile signée au bailleur avant 17h. Le document est
            déjà scanné, signé électroniquement et prêt à être joint.
          </Text>
        </View>

        <SectionTitle icon="info" title="Informations" />
        <View style={styles.infoCard}>
          <InfoRow icon="event" label="Échéance" value="Aujourd'hui à 17h00" valueAccent />
          <View style={styles.divider} />
          <InfoRow icon="folder" label="Catégorie" value="Logement" />
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="person" size={16} color={Serene.onSurfaceVariant} />
              <Text style={styles.infoLabelText}>Assigné à</Text>
            </View>
            <View style={styles.assignee}>
              <View style={styles.assigneeAvatar}>
                <Text style={styles.assigneeInitial}>C</Text>
              </View>
              <Text style={styles.infoValue}>Claire Martin</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <InfoRow icon="family_restroom" label="Foyer" value="Foyer Martin" />
          <View style={styles.divider} />
          <InfoRow icon="notifications_active" label="Rappel" value="1h avant" />
          <View style={styles.divider} />
          <InfoRow icon="calendar_today" label="Créée le" value="12 mai 2024" />
        </View>

        <SectionTitle icon="checklist" title="Sous-tâches" trailing="2 / 3" />
        <View style={styles.subtasksCard}>
          <SubtaskRow title="Télécharger le formulaire" initialChecked />
          <View style={styles.divider} />
          <SubtaskRow title="Signer électroniquement" initialChecked />
          <View style={styles.divider} />
          <SubtaskRow title="Envoyer au bailleur" />
        </View>

        <SectionTitle icon="attachment" title="Document lié" />
        <Pressable
          style={styles.documentCard}
          accessibilityRole="button"
          onPress={() => router.push('/documents/detail')}>
          <View style={styles.documentIcon}>
            <Icon name="picture_as_pdf" size={22} color={Serene.secondary} />
          </View>
          <View style={styles.documentBody}>
            <Text style={styles.documentTitle} numberOfLines={1}>
              Attestation_domicile_2024.pdf
            </Text>
            <Text style={styles.documentMeta}>PDF • 248 Ko • Signé</Text>
          </View>
          <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
        </Pressable>

        <SectionTitle icon="group" title="Partagé avec" />
        <View style={styles.shareCard}>
          <View style={styles.shareMember}>
            <View style={[styles.shareAvatar, styles.shareAvatarPrimary]}>
              <Text style={styles.shareInitial}>C</Text>
            </View>
            <Text style={styles.shareName}>Claire (vous)</Text>
          </View>
          <View style={styles.shareMember}>
            <View style={[styles.shareAvatar, styles.shareAvatarSecondary]}>
              <Text style={styles.shareInitial}>T</Text>
            </View>
            <Text style={styles.shareName}>Thomas</Text>
          </View>
        </View>

        <Pressable
          style={[styles.completeButton, completed && styles.reopenButton]}
          onPress={() => setCompleted((value) => !value)}
          accessibilityRole="button">
          <Icon
            name={completed ? 'replay' : 'done_all'}
            size={18}
            color={completed ? Serene.onSurface : Serene.onSecondary}
          />
          <Text
            style={[styles.completeButtonText, completed && styles.reopenButtonText]}>
            {completed ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
          </Text>
        </Pressable>

        <View style={styles.secondaryActions}>
          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/tasks/edit')}>
            <Icon name="edit" size={18} color={Serene.onSurface} />
            <Text style={styles.secondaryButtonText}>Modifier</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/calendar/add')}>
            <Icon name="schedule" size={18} color={Serene.onSurface} />
            <Text style={styles.secondaryButtonText}>Reporter</Text>
          </Pressable>
        </View>

        <Pressable style={styles.deleteButton} accessibilityRole="button">
          <Icon name="delete" size={16} color={Serene.error} />
          <Text style={styles.deleteText}>Supprimer la tâche</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({
  icon,
  title,
  trailing,
}: {
  icon: string;
  title: string;
  trailing?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Icon name={icon} size={18} color={Serene.onSurface} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {trailing ? <Text style={styles.sectionTrailing}>{trailing}</Text> : null}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueAccent,
}: {
  icon: string;
  label: string;
  value: string;
  valueAccent?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Icon name={icon} size={16} color={Serene.onSurfaceVariant} />
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueAccent && styles.infoValueAccent]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SubtaskRow({
  title,
  initialChecked,
}: {
  title: string;
  initialChecked?: boolean;
}) {
  const [checked, setChecked] = useState(Boolean(initialChecked));

  return (
    <Pressable
      style={styles.subtaskRow}
      onPress={() => setChecked((value) => !value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}>
      <View style={[styles.subtaskCheckbox, checked && styles.subtaskCheckboxChecked]}>
        {checked ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
      </View>
      <Text style={[styles.subtaskText, checked && styles.subtaskTextChecked]}>{title}</Text>
    </Pressable>
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
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.errorContainer,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.error,
  },
  priorityText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onErrorContainer,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  statusText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  title: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
    marginTop: 10,
  },
  titleCompleted: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    marginTop: 4,
  },
  descriptionCard: {
    marginTop: Space.md,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    gap: 4,
    ...Shadow.card,
  },
  descriptionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  sectionTrailing: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  infoCard: {
    paddingHorizontal: Space.sm,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 4,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  infoLabelText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  infoValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  infoValueAccent: {
    color: Serene.error,
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    color: Serene.onPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  subtasksCard: {
    paddingHorizontal: Space.sm,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 4,
  },
  subtaskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckboxChecked: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  subtaskText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  subtaskTextChecked: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  documentBody: {
    flex: 1,
    minWidth: 0,
  },
  documentTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  documentMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  shareCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  shareMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  shareAvatar: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareAvatarPrimary: {
    backgroundColor: Serene.primary,
  },
  shareAvatarSecondary: {
    backgroundColor: Serene.secondary,
  },
  shareInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    color: Serene.onPrimary,
  },
  shareName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  completeButton: {
    marginTop: Space.lg,
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.card,
  },
  reopenButton: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  completeButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSecondary,
  },
  reopenButtonText: {
    color: Serene.onSurface,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.card,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    marginTop: Space.sm,
  },
  deleteText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
});
