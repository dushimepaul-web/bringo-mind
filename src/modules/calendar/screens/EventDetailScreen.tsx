// S-14 - Détail d'un événement | Module M07 Rendez-vous et calendrier | Phase S6
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function EventDetailScreen() {
  const [cancelled, setCancelled] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour au calendrier"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Détail de l’événement</Text>
        <Pressable style={styles.headerButton} accessibilityLabel="Plus d’options">
          <Icon name="more_vert" size={22} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, cancelled && styles.heroCancelled]}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <Icon name="medical_services" size={22} color={Serene.secondary} />
            </View>
            <View style={styles.heroBadges}>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>Rendez-vous</Text>
              </View>
              {cancelled ? (
                <View style={styles.cancelledPill}>
                  <Text style={styles.cancelledPillText}>Annulé</Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={[styles.heroTitle, cancelled && styles.heroTitleCancelled]}>
            Rendez-vous dentiste
          </Text>

          <View style={styles.heroMeta}>
            <Icon name="calendar_today" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.heroMetaText}>Jeudi 9 mai 2024</Text>
          </View>
          <View style={styles.heroMeta}>
            <Icon name="schedule" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.heroMetaText}>09:30 – 10:15 • 45 min</Text>
          </View>
          <View style={styles.heroMeta}>
            <Icon name="location_on" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.heroMetaText}>Dr. Moreau • Cabinet Voltaire, Paris 11e</Text>
          </View>
        </View>

        {cancelled ? (
          <View style={styles.warningBanner}>
            <Icon name="event_busy" size={18} color={Serene.error} />
            <Text style={styles.warningText}>
              Cet événement a été annulé. Les participants ont été notifiés.
            </Text>
          </View>
        ) : (
          <View style={styles.successBanner}>
            <Icon name="verified" size={18} color={Serene.success} />
            <Text style={styles.successText}>Aucun conflit détecté dans votre agenda.</Text>
          </View>
        )}

        <SectionTitle icon="info" title="Informations" />
        <View style={styles.infoCard}>
          <InfoRow icon="event" label="Date" value="Jeudi 9 mai 2024" />
          <View style={styles.divider} />
          <InfoRow icon="schedule" label="Horaire" value="09:30 – 10:15" />
          <View style={styles.divider} />
          <InfoRow icon="timer" label="Durée" value="45 minutes" />
          <View style={styles.divider} />
          <InfoRow icon="public" label="Fuseau horaire" value="Europe/Paris" />
          <View style={styles.divider} />
          <InfoRow icon="notifications_active" label="Rappel" value="30 min avant" />
          <View style={styles.divider} />
          <InfoRow icon="view_agenda" label="Agenda" value="Personnel" />
        </View>

        <SectionTitle icon="group" title="Participants" />
        <View style={styles.participantsCard}>
          <ParticipantRow initial="C" name="Claire Martin" role="Organisateur" primary />
          <View style={styles.divider} />
          <ParticipantRow initial="T" name="Thomas Martin" role="Invité • Confirmé" />
          <View style={styles.divider} />
          <ParticipantRow initial="M" name="Dr. Moreau" role="Cabinet Voltaire" external />
        </View>

        <SectionTitle icon="notes" title="Notes" />
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Apporter la carte vitale et le dossier dentaire. Prévoir d’arriver 10 minutes en
            avance pour le formulaire d’accueil.
          </Text>
        </View>

        {!cancelled ? (
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/calendar/edit')}>
            <Icon name="edit" size={18} color={Serene.onPrimary} />
            <Text style={styles.primaryButtonText}>Modifier l’événement</Text>
          </Pressable>
        ) : null}

        {!cancelled ? (
          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/reminders/add')}>
            <Icon name="add_alert" size={18} color={Serene.onSurface} />
            <Text style={styles.secondaryButtonText}>Ajouter un rappel</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.cancelRow}
          accessibilityRole="button"
          onPress={() => setCancelled((value) => !value)}>
          <Icon name={cancelled ? 'undo' : 'event_busy'} size={16} color={Serene.error} />
          <Text style={styles.cancelRowText}>
            {cancelled ? 'Rétablir l’événement' : 'Annuler l’événement'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={18} color={Serene.onSurface} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Icon name={icon} size={16} color={Serene.onSurfaceVariant} />
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ParticipantRow({
  initial,
  name,
  role,
  primary,
  external,
}: {
  initial: string;
  name: string;
  role: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <View style={styles.participantRow}>
      <View
        style={[
          styles.participantAvatar,
          primary
            ? styles.participantAvatarPrimary
            : external
              ? styles.participantAvatarExternal
              : styles.participantAvatarSecondary,
        ]}>
        <Text style={styles.participantInitial}>{initial}</Text>
      </View>
      <View style={styles.participantBody}>
        <Text style={styles.participantName}>{name}</Text>
        <Text style={styles.participantRole}>{role}</Text>
      </View>
      {!external ? (
        <View style={styles.participantStatus}>
          <Icon name="check_circle" size={16} color={Serene.success} />
        </View>
      ) : (
        <View style={styles.externalPill}>
          <Text style={styles.externalPillText}>Externe</Text>
        </View>
      )}
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
  },
  hero: {
    padding: 16,
    borderRadius: Radius.xxl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  heroCancelled: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  typePillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  cancelledPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.errorContainer,
  },
  cancelledPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onErrorContainer,
  },
  heroTitle: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
    marginTop: 12,
  },
  heroTitleCancelled: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  heroMetaText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.successContainer,
  },
  successText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.success,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.errorContainer,
  },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onErrorContainer,
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
  },
  infoLabelText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  participantsCard: {
    paddingHorizontal: Space.sm,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantAvatarPrimary: {
    backgroundColor: Serene.primary,
  },
  participantAvatarSecondary: {
    backgroundColor: Serene.secondary,
  },
  participantAvatarExternal: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  participantInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onPrimary,
  },
  participantBody: {
    flex: 1,
    minWidth: 0,
  },
  participantName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  participantRole: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  participantStatus: {
    width: 24,
    alignItems: 'center',
  },
  externalPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  externalPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  noteCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  noteText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  primaryButton: {
    height: 48,
    marginTop: Space.lg,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  secondaryButton: {
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
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  cancelRow: {
    height: 40,
    marginTop: Space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cancelRowText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
});
