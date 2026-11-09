// S-25 - Documents | Module M09 Documents et extraction | Phase S9
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

const FILTERS = [
  { label: 'Tous', count: 18 },
  { label: 'Identité', count: 3 },
  { label: 'Logement & Factures', count: 8 },
  { label: 'Santé', count: 4 },
  { label: 'Impôts', count: 3 },
];

const RECENT_DOCUMENTS = [
  {
    icon: 'account_balance',
    title: 'Avis_Imposition_2023.pdf',
    kind: 'Personnel',
    category: 'Impôts',
    meta: 'Archivé • 12 Avr',
    trailing: 'verified',
    shared: false,
  },
  {
    icon: 'real_estate_agent',
    title: 'Bail_Appartement_Signe.pdf',
    kind: 'Partagé Foyer',
    category: 'Logement',
    meta: 'Signé • 2,4 Mo',
    trailing: 'group',
    shared: true,
  },
  {
    icon: 'medical_services',
    title: 'Carte_Vitale_Attestation.pdf',
    kind: 'Personnel',
    category: 'Santé',
    meta: "Valide jusqu'en 2026",
    trailing: 'verified',
    shared: false,
  },
];

export default function DocumentListScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <TitleBlock />
        <StorageCard />
        <CategoryFilters />
        <AiAnalysisPanel />
        <RecentDocuments />
        <ScanButton />
      </ScrollView>
    </SafeAreaView>
  );
}

function TitleBlock() {
  return (
    <View style={styles.titleBlock}>
      <View style={styles.titleTextBlock}>
        <Text style={styles.eyebrow}>Coffre Sécurisé</Text>
        <Text style={styles.title}>Documents &amp; IA</Text>
      </View>
      <View style={styles.securePill}>
        <Icon name="verified_user" size={15} color={Serene.secondary} />
        <Text style={styles.securePillText}>AES-256</Text>
      </View>
    </View>
  );
}

function StorageCard() {
  return (
    <View style={styles.storageCard}>
      <View style={styles.storageRow}>
        <View style={styles.storageLeft}>
          <View style={styles.storageIcon}>
            <Icon name="cloud_done" size={18} color={Serene.onSurfaceVariant} />
          </View>
          <View style={styles.storageTextBlock}>
            <Text style={styles.storageTitle}>Espace de stockage</Text>
            <Text style={styles.storageSubtitle}>1,42 Go sur 10 Go utilisés (14%)</Text>
          </View>
        </View>
        <Text style={styles.storageState}>Sain</Text>
      </View>
      <View style={styles.storageTrack}>
        <View style={styles.storageFill} />
      </View>
    </View>
  );
}

function CategoryFilters() {
  const [selected, setSelected] = useState('Tous');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersScroll}
      contentContainerStyle={styles.filtersRow}>
      {FILTERS.map((filter) => {
        const active = filter.label === selected;

        return (
          <Pressable
            key={filter.label}
            onPress={() => setSelected(filter.label)}
            style={[styles.filterChip, active && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
              {filter.label}
            </Text>
            {filter.label === 'Tous' ? (
              <View style={[styles.filterCount, active && styles.filterCountActive]}>
                <Text
                  style={[styles.filterCountText, active && styles.filterCountTextActive]}>
                  {filter.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function AiAnalysisPanel() {
  const [validated, setValidated] = useState(false);

  return (
    <View style={styles.aiPanel}>
      <View style={styles.aiBlob} />

      <View style={styles.aiHeader}>
        <View style={styles.aiHeaderLeft}>
          <View style={styles.aiIcon}>
            <Icon name="auto_awesome" size={15} filled color={Serene.onSecondaryContainer} />
          </View>
          <Text style={styles.aiTitle}>Analyse IA Kora terminée</Text>
        </View>
        <View style={styles.reliabilityPill}>
          <Text style={styles.reliabilityText}>98.4% fiable</Text>
        </View>
      </View>

      <View style={styles.docPreview}>
        <View style={styles.thumb}>
          <Icon name="receipt_long" size={20} color={Serene.onPrimary} />
        </View>
        <View style={styles.docPreviewBody}>
          <View style={styles.docPreviewTitleRow}>
            <View style={styles.fileTypePill}>
              <Text style={styles.fileTypeText}>PDF</Text>
            </View>
            <Text style={styles.docPreviewTitle} numberOfLines={1}>
              Facture_Electricite_Engie_Mai2024.pdf
            </Text>
          </View>
          <Text style={styles.docPreviewMeta}>Capturé aujourd&apos;hui à 11:42</Text>
          <View style={styles.docReadyRow}>
            <Icon name="check_circle" size={14} color={Serene.secondary} />
            <Text style={styles.docReadyText}>Prêt pour affectation</Text>
          </View>
        </View>
      </View>

      <View style={styles.dataCard}>
        <DataRow icon="corporate_fare" label="Émetteur" value="ENGIE Énergie France" />
        <View style={styles.divider} />
        <DataRow icon="payments" label="Montant TTC" value="118,50 €" accent />
        <View style={styles.divider} />
        <DataRow icon="event_repeat" label="Échéance" value="27 mai 2024" />
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

      <Pressable
        style={styles.manualButton}
        accessibilityRole="button"
        onPress={() => router.push('/documents/detail')}>
        <Icon name="tune" size={16} color={Serene.onSurfaceVariant} />
        <Text style={styles.manualButtonText}>Modifier manuellement les données</Text>
      </Pressable>
    </View>
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

function RecentDocuments() {
  return (
    <View style={styles.recentBlock}>
      <View style={styles.recentHeader}>
        <View style={styles.recentTitleRow}>
          <Text style={styles.recentTitle}>Autres documents récents</Text>
          <View style={styles.recentCount}>
            <Text style={styles.recentCountText}>17</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/documents/detail')}>
          <Text style={styles.recentAction}>Voir tout</Text>
        </Pressable>
      </View>

      <View style={styles.recentList}>
        {RECENT_DOCUMENTS.map((doc) => (
          <Pressable
            key={doc.title}
            style={styles.recentCard}
            onPress={() => router.push('/documents/detail')}
            accessibilityRole="button">
            <View style={styles.recentIcon}>
              <Icon name={doc.icon} size={20} color={Serene.onSurfaceVariant} />
            </View>
            <View style={styles.recentBody}>
              <View style={styles.recentTitleLine}>
                <Text style={styles.recentDocTitle} numberOfLines={1}>
                  {doc.title}
                </Text>
                <Icon
                  name={doc.trailing}
                  size={16}
                  color={doc.shared ? Serene.onSurfaceVariant : Serene.secondary}
                />
              </View>
              <View style={styles.recentMetaRow}>
                <View style={[styles.tag, doc.shared && styles.tagShared]}>
                  <Text style={[styles.tagText, doc.shared && styles.tagTextShared]}>
                    {doc.kind}
                  </Text>
                </View>
                <View style={[styles.tag, styles.tagCategory]}>
                  <Text style={[styles.tagText, styles.tagCategoryText]}>{doc.category}</Text>
                </View>
                <Text style={styles.recentMeta} numberOfLines={1}>
                  {doc.meta}
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.moreButton}
              accessibilityRole="button"
              accessibilityLabel={`Options pour ${doc.title}`}>
              <Icon name="more_vert" size={18} color={Serene.onSurfaceVariant} />
            </Pressable>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ScanButton() {
  return (
    <Pressable
      style={styles.scanButton}
      accessibilityRole="button"
      onPress={() => router.push('/documents/detail')}>
      <Icon name="photo_camera" size={22} color={Serene.secondaryFixed} />
      <Text style={styles.scanButtonText}>Scanner ou importer un document</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.lg,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },
  titleTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  title: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  securePillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  storageCard: {
    marginTop: Space.md,
    padding: Space.md,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    gap: Space.sm,
    ...Shadow.card,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  storageIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  storageTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  storageSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  storageState: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.secondary,
  },
  storageTrack: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    overflow: 'hidden',
  },
  storageFill: {
    width: '14.2%',
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  filtersScroll: {
    marginTop: 12,
    marginHorizontal: -Space.gutter,
  },
  filtersRow: {
    paddingHorizontal: Space.gutter,
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  filterChipActive: {
    backgroundColor: Serene.primary,
  },
  filterChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: Serene.onPrimary,
  },
  filterCount: {
    paddingHorizontal: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  filterCountTextActive: {
    color: Serene.onPrimary,
  },
  aiPanel: {
    marginTop: 12,
    padding: Space.md,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLow,
    gap: 12,
    overflow: 'hidden',
    ...Shadow.floating,
  },
  aiBlob: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(134, 242, 228, 0.4)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  aiHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flexShrink: 1,
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
  docPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  thumb: {
    width: 56,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docPreviewBody: {
    flex: 1,
    minWidth: 0,
  },
  docPreviewTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  fileTypeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  docPreviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flexShrink: 1,
  },
  docPreviewMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  docReadyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  docReadyText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.secondary,
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
  recentBlock: {
    marginTop: Space.md,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Space.sm,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  recentCount: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCountText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  recentAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  recentList: {
    gap: 10,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recentBody: {
    flex: 1,
    minWidth: 0,
  },
  recentTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  recentDocTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flex: 1,
  },
  recentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  tagShared: {
    backgroundColor: Serene.secondaryContainer,
  },
  tagText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  tagTextShared: {
    color: Serene.onSecondaryContainer,
  },
  tagCategory: {
    backgroundColor: Serene.secondaryContainer,
  },
  tagCategoryText: {
    color: Serene.onSecondaryContainer,
  },
  recentMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    flexShrink: 1,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scanButton: {
    marginTop: Space.md,
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Shadow.floating,
  },
  scanButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
});
