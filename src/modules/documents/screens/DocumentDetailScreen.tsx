// S-26 - Détail d'un document | Module M09 Documents et extraction | Phase S9
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function DocumentDetailScreen() {
  const [validated, setValidated] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour aux documents"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Détail du document</Text>
        <View style={styles.securePill}>
          <Icon name="verified_user" size={14} color={Serene.secondary} />
          <Text style={styles.securePillText}>AES-256</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.thumb}>
            <Icon name="receipt_long" size={26} color={Serene.secondary} />
          </View>
          <View style={styles.heroBody}>
            <View style={styles.fileTypeRow}>
              <View style={styles.fileTypePill}>
                <Text style={styles.fileTypeText}>PDF</Text>
              </View>
              <Text style={styles.heroTitle} numberOfLines={2}>
                Facture_Electricite_Engie_Mai2024.pdf
              </Text>
            </View>
            <Text style={styles.heroMeta}>Ajouté le 14 mai 2024 • 1,2 Mo</Text>
            <View style={styles.verifiedRow}>
              <Icon name="verified" size={14} color={Serene.secondary} />
              <Text style={styles.verifiedText}>Document vérifié par Kora</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Données extraites par Kora</Text>
          <View style={styles.reliabilityPill}>
            <Text style={styles.reliabilityText}>98.4% fiable</Text>
          </View>
        </View>

        <View style={styles.dataCard}>
          <DataRow icon="corporate_fare" label="Émetteur" value="ENGIE Énergie France" />
          <View style={styles.divider} />
          <DataRow icon="payments" label="Montant TTC" value="118,50 €" accent />
          <View style={styles.divider} />
          <DataRow icon="event_repeat" label="Échéance" value="27 mai 2024" />
          <View style={styles.divider} />
          <DataRow icon="calendar_today" label="Date du document" value="12 mai 2024" />
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <View style={styles.dataLabel}>
              <Icon name="category" size={16} color={Serene.onSurfaceVariant} />
              <Text style={styles.dataLabelText}>Périmètre</Text>
            </View>
            <View style={styles.scopePill}>
              <Text style={styles.scopePillText}>Charges Foyer • Logement</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsLabel}>Actions suggérées par l&apos;IA</Text>
          <ActionRow
            title="Planifier un rappel de prélèvement"
            subtitle="Notification sur mobile prévue le 25 mai (J-2)"
            initialChecked
          />
          <View style={styles.divider} />
          <ActionRow
            title={'Catégoriser sous "Charges Foyer - Électricité"'}
            subtitle="Synchronisé avec le bilan budgétaire mensuel"
            initialChecked
          />
          <View style={styles.divider} />
          <ActionRow
            title="Partager dans le dossier partagé de Thomas"
            subtitle="Visible dans son récapitulatif des quittances"
          />
        </View>

        <Pressable
          style={[styles.validateButton, validated && styles.validateButtonDone]}
          onPress={() => setValidated(true)}
          accessibilityRole="button">
          <Icon
            name={validated ? 'check_circle' : 'done_all'}
            size={18}
            color={validated ? Serene.onPrimary : Serene.onSecondary}
          />
          <Text style={styles.validateButtonText}>
            {validated ? 'Document classé & Rappel actif' : 'Valider et appliquer les actions'}
          </Text>
        </Pressable>

        <View style={styles.quickActions}>
          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/documents')}>
            <Icon name="download" size={18} color={Serene.onSurface} />
            <Text style={styles.secondaryButtonText}>Télécharger</Text>
          </Pressable>
          <Pressable
            style={styles.shareButton}
            accessibilityRole="button"
            onPress={() => router.push('/household/members')}>
            <Icon name="share" size={18} color={Serene.onSecondary} />
            <Text style={styles.shareButtonText}>Partager</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.manualButton}
          accessibilityRole="button"
          onPress={() => router.push('/documents')}>
          <Icon name="tune" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.manualButtonText}>Modifier manuellement les données</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function DataRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.dataRow}>
      <View style={styles.dataLabel}>
        <Icon name={icon} size={16} color={Serene.onSurfaceVariant} />
        <Text style={styles.dataLabelText}>{label}</Text>
      </View>
      <Text style={[styles.dataValue, accent && styles.dataValueAccent]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActionRow({
  title,
  subtitle,
  initialChecked,
}: {
  title: string;
  subtitle: string;
  initialChecked?: boolean;
}) {
  const [checked, setChecked] = useState(Boolean(initialChecked));

  return (
    <Pressable
      style={styles.actionRow}
      onPress={() => setChecked((value) => !value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
      </View>
      <View style={styles.actionRowBody}>
        <Text style={styles.actionRowTitle}>{title}</Text>
        <Text style={styles.actionRowSubtitle}>{subtitle}</Text>
      </View>
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
    gap: 8,
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  securePillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
    gap: 12,
  },
  heroCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  thumb: {
    width: 64,
    height: 78,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },
  fileTypeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  fileTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Serene.surfaceContainerHigh,
    marginTop: 1,
  },
  fileTypeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  heroTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
    flex: 1,
  },
  heroMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  reliabilityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  reliabilityText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  dataCard: {
    paddingHorizontal: Space.sm,
    paddingVertical: 4,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  dataLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  dataLabelText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  dataValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  dataValueAccent: {
    ...Typography.headlineSm,
    color: Serene.secondary,
  },
  scopePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  scopePillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  actionsCard: {
    padding: Space.sm,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  actionsLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  actionRowBody: {
    flex: 1,
    minWidth: 0,
  },
  actionRowTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  actionRowSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  validateButton: {
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.card,
  },
  validateButtonDone: {
    backgroundColor: Serene.primary,
  },
  validateButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  shareButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.card,
  },
  shareButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondary,
  },
  manualButton: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  manualButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
});
