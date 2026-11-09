// S-23 - Confidentialité et données | Module M09 Profil et paramètres | Phase S8
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function PrivacyDataScreen() {
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [anonymized, setAnonymized] = useState(false);

  const [exportState, setExportState] = useState<'idle' | 'pending'>('idle');
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'requested'>('idle');
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);

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
        <Text style={styles.headerTitle}>Confidentialité</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Icon name="shield" size={26} color={Serene.onPrimary} />
          </View>
          <Text style={styles.heroTitle}>Vos données sont protégées</Text>
          <Text style={styles.heroText}>
            Chiffrement AES-256 au repos et en transit. Conforme au RGPD.
          </Text>
          <View style={styles.heroBadges}>
            <View style={styles.heroBadge}>
              <Icon name="lock" size={12} color={Serene.success} />
              <Text style={styles.heroBadgeText}>Chiffré</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="verified_user" size={12} color={Serene.success} />
              <Text style={styles.heroBadgeText}>RGPD</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="visibility_off" size={12} color={Serene.success} />
              <Text style={styles.heroBadgeText}>Privé par défaut</Text>
            </View>
          </View>
        </View>

        <SectionTitle icon="toggle_on" title="Vos consentements" />
        <View style={styles.card}>
          <ConsentRow
            icon="auto_awesome"
            label="Analyse IA des documents"
            hint="Extraction des dates et montants"
            value={aiAnalysis}
            onChange={setAiAnalysis}
          />
          <View style={styles.divider} />
          <ConsentRow
            icon="tips_and_updates"
            label="Suggestions personnalisées"
            hint="Priorisation et rappels intelligents"
            value={personalization}
            onChange={setPersonalization}
          />
          <View style={styles.divider} />
          <ConsentRow
            icon="campaign"
            label="Communications produit"
            hint="Nouveautés et conseils d’utilisation"
            value={marketing}
            onChange={setMarketing}
          />
          <View style={styles.divider} />
          <ConsentRow
            icon="insights"
            label="Données anonymisées"
            hint="Amélioration statistique du service"
            value={anonymized}
            onChange={setAnonymized}
          />
        </View>

        <SectionTitle icon="database" title="Vos données" />
        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => setExportState('pending')}
            accessibilityRole="button">
            <View style={styles.rowIcon}>
              <Icon name="download" size={18} color={Serene.onSurfaceVariant} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Exporter mes données</Text>
              <Text style={styles.rowHint}>
                {exportState === 'pending'
                  ? 'Export en préparation • lien par e-mail sous 24h'
                  : 'Archive JSON de vos tâches, documents et préférences'}
              </Text>
            </View>
            {exportState === 'pending' ? (
              <View style={styles.pendingPill}>
                <Text style={styles.pendingPillText}>En cours</Text>
              </View>
            ) : (
              <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
            )}
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} accessibilityRole="button">
            <View style={styles.rowIcon}>
              <Icon name="history" size={18} color={Serene.onSurfaceVariant} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Historique des connexions</Text>
              <Text style={styles.rowHint}>iPhone 15 • Paris • il y a 2 min</Text>
            </View>
            <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} accessibilityRole="button">
            <View style={styles.rowIcon}>
              <Icon name="description" size={18} color={Serene.onSurfaceVariant} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Politique de confidentialité</Text>
              <Text style={styles.rowHint}>Version 2.1 • mise à jour le 1er mai 2024</Text>
            </View>
            <Icon name="open_in_new" size={18} color={Serene.outlineVariant} />
          </Pressable>
        </View>

        {exportState === 'pending' ? (
          <View style={styles.infoBanner}>
            <Icon name="mark_email_read" size={18} color={Serene.secondary} />
            <Text style={styles.infoBannerText}>
              Votre export est en préparation. Vous recevrez un lien sécurisé par e-mail sous
              24 heures.
            </Text>
          </View>
        ) : null}

        <SectionTitle icon="delete_forever" title="Supprimer mon compte" />
        {deleteStep === 'idle' ? (
          <View style={styles.dangerCard}>
            <View style={styles.dangerHeader}>
              <Icon name="warning" size={20} color={Serene.error} />
              <Text style={styles.dangerTitle}>Action définitive</Text>
            </View>
            <Text style={styles.dangerText}>
              La suppression efface votre profil, vos tâches, vos documents et votre
              appartenance aux foyers. Cette action est irréversible après 30 jours.
            </Text>
            <Pressable
              style={styles.dangerButton}
              accessibilityRole="button"
              onPress={() => setDeleteStep('confirm')}>
              <Icon name="delete" size={16} color={Serene.error} />
              <Text style={styles.dangerButtonText}>Demander la suppression</Text>
            </Pressable>
          </View>
        ) : deleteStep === 'confirm' ? (
          <View style={styles.dangerCard}>
            <View style={styles.dangerHeader}>
              <Icon name="warning" size={20} color={Serene.error} />
              <Text style={styles.dangerTitle}>Confirmer la suppression</Text>
            </View>
            <Text style={styles.dangerText}>
              Votre compte sera désactivé immédiatement, puis supprimé définitivement après 30
              jours. Vous pouvez annuler la demande pendant ce délai.
            </Text>

            <Pressable
              style={styles.checkRow}
              onPress={() => setDeleteAcknowledged((value) => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: deleteAcknowledged }}>
              <View
                style={[styles.checkbox, deleteAcknowledged && styles.checkboxChecked]}>
                {deleteAcknowledged ? (
                  <Icon name="check" size={13} color={Serene.onPrimary} />
                ) : null}
              </View>
              <Text style={styles.checkText}>
                Je comprends que cette action est irréversible après 30 jours.
              </Text>
            </Pressable>

            <View style={styles.dangerActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteStep('idle');
                  setDeleteAcknowledged(false);
                }}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmDeleteButton,
                  !deleteAcknowledged && styles.confirmDeleteDisabled,
                ]}
                disabled={!deleteAcknowledged}
                onPress={() => setDeleteStep('requested')}>
                <Text style={styles.confirmDeleteText}>Confirmer</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.requestedCard}>
            <View style={styles.requestedIcon}>
              <Icon name="schedule" size={28} color={Serene.warning} />
            </View>
            <Text style={styles.requestedTitle}>Demande enregistrée</Text>
            <Text style={styles.requestedText}>
              Votre compte sera supprimé le 9 juin 2024. Vous pouvez annuler la demande à tout
              moment avant cette date.
            </Text>
            <Pressable
              style={styles.cancelRequestButton}
              onPress={() => {
                setDeleteStep('idle');
                setDeleteAcknowledged(false);
              }}>
              <Icon name="undo" size={16} color={Serene.onSurface} />
              <Text style={styles.cancelRequestText}>Annuler la demande</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.footerNote}>
          <Icon name="lock" size={14} color={Serene.outlineVariant} />
          <Text style={styles.footerNoteText}>
            Responsable de traitement : PLAA SAS • DPO : dpo@plaa.app
          </Text>
        </View>
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

function ConsentRow({
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
  },
  heroCard: {
    alignItems: 'center',
    padding: Space.md,
    borderRadius: Radius.xxl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginTop: 2,
    maxWidth: 300,
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  heroBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
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
  pendingPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.warningContainer,
  },
  pendingPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.warning,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSecondaryContainer,
  },
  dangerCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.errorContainer,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onErrorContainer,
  },
  dangerText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onErrorContainer,
    marginTop: 6,
  },
  dangerButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  dangerButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.error,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Serene.onErrorContainer,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    borderWidth: 0,
    backgroundColor: Serene.error,
  },
  checkText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onErrorContainer,
  },
  dangerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onErrorContainer,
  },
  confirmDeleteButton: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    backgroundColor: Serene.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeleteDisabled: {
    backgroundColor: Serene.surfaceDim,
  },
  confirmDeleteText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  requestedCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: Radius.xl,
    backgroundColor: Serene.warningContainer,
  },
  requestedIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  requestedTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.warning,
  },
  requestedText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.warning,
    textAlign: 'center',
    marginTop: 3,
  },
  cancelRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  cancelRequestText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: Space.lg,
  },
  footerNoteText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.outlineVariant,
  },
});
