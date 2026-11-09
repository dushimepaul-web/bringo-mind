// S-24 (e-mail) - E-mail importé et extraction IA | Module M11 Intégrations | Phase S10
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

const EXTRACTED_FIELDS = [
  { icon: 'description', label: 'Type', value: 'Attestation de domicile' },
  { icon: 'apartment', label: 'Émetteur', value: 'Foncia' },
  { icon: 'event', label: 'Date du document', value: '9 mai 2024' },
  { icon: 'task_alt', label: 'Action attendue', value: 'Signer et renvoyer avant le 15 mai' },
];

export default function EmailViewerScreen() {
  const [saved, setSaved] = useState(false);

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
        <Text style={styles.headerTitle}>E-mail importé</Text>
        <Pressable style={styles.headerButton} accessibilityLabel="Plus d’options">
          <Icon name="more_vert" size={22} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mailCard}>
          <View style={styles.mailTopRow}>
            <View style={styles.senderAvatar}>
              <Text style={styles.senderInitial}>F</Text>
            </View>
            <View style={styles.senderBody}>
              <Text style={styles.senderName}>Foncia</Text>
              <Text style={styles.senderEmail}>contact@foncia.fr</Text>
            </View>
            <Text style={styles.mailTime}>08:42</Text>
          </View>

          <Text style={styles.subject}>Votre attestation de domicile 2024</Text>

          <View style={styles.mailLabels}>
            <View style={styles.labelPill}>
              <Icon name="inbox" size={11} color={Serene.onSurfaceVariant} />
              <Text style={styles.labelText}>Boîte de réception</Text>
            </View>
            <View style={styles.labelPill}>
              <Icon name="auto_awesome" size={11} color={Serene.secondary} />
              <Text style={[styles.labelText, styles.labelTextAccent]}>Importé par Bringo Mind</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.mailBody}>Bonjour Madame Martin,</Text>
          <Text style={styles.mailBody}>
            Veuillez trouver ci-joint votre attestation de domicile pour l’année 2024. Nous vous
            remercions de bien vouloir la signer et nous la retourner avant le 15 mai 2024.
          </Text>
          <Text style={styles.mailBody}>
            Pour toute question, notre service reste à votre disposition.
          </Text>
          <Text style={styles.mailSign}>Cordialement,</Text>
          <Text style={styles.mailSign}>Service locataires — Foncia</Text>
        </View>

        <Pressable
          style={styles.attachment}
          accessibilityRole="button"
          onPress={() => router.push('/documents/detail')}>
          <View style={styles.attachmentIcon}>
            <Icon name="picture_as_pdf" size={22} color={Serene.error} />
          </View>
          <View style={styles.attachmentBody}>
            <Text style={styles.attachmentName} numberOfLines={1}>
              Attestation_domicile_2024.pdf
            </Text>
            <Text style={styles.attachmentMeta}>PDF • 248 Ko • 2 pages</Text>
          </View>
          <Icon name="download" size={20} color={Serene.onSurfaceVariant} />
        </Pressable>

        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIcon}>
              <Icon name="auto_awesome" size={18} color={Serene.onPrimary} />
            </View>
            <View style={styles.aiHeaderBody}>
              <Text style={styles.aiTitle}>Analyse de Kora</Text>
              <Text style={styles.aiSub}>4 informations extraites • fiabilité 98,4 %</Text>
            </View>
            <View style={styles.confidencePill}>
              <Text style={styles.confidenceText}>98%</Text>
            </View>
          </View>

          <View style={styles.aiFields}>
            {EXTRACTED_FIELDS.map((field, index) => (
              <View key={field.label}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.aiRow}>
                  <View style={styles.aiRowIcon}>
                    <Icon name={field.icon} size={15} color={Serene.secondary} />
                  </View>
                  <Text style={styles.aiLabel}>{field.label}</Text>
                  <Text style={styles.aiValue} numberOfLines={2}>
                    {field.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.suggestion}>
            <Icon name="lightbulb" size={15} color={Serene.warning} />
            <Text style={styles.suggestionText}>
              Kora suggère de créer une tâche avec rappel pour ne pas oublier l’envoi.
            </Text>
          </View>

          <View style={styles.aiActions}>
            <Pressable
              style={styles.aiPrimary}
              accessibilityRole="button"
              onPress={() => router.push('/tasks/add')}>
              <Icon name="add_task" size={16} color={Serene.onPrimary} />
              <Text style={styles.aiPrimaryText}>Créer une tâche</Text>
            </Pressable>
            <Pressable
              style={styles.aiSecondary}
              accessibilityRole="button"
              onPress={() => setSaved(true)}>
              <Icon
                name={saved ? 'check' : 'bookmark_add'}
                size={16}
                color={Serene.onSurface}
              />
              <Text style={styles.aiSecondaryText}>
                {saved ? 'Enregistré' : 'Classer le document'}
              </Text>
            </Pressable>
          </View>
        </View>

        {saved ? (
          <View style={styles.successBanner}>
            <Icon name="check_circle" size={18} color={Serene.success} />
            <Text style={styles.successText}>
              Document classé dans « Logement » et lié à la tâche créée.
            </Text>
          </View>
        ) : null}

        <View style={styles.mailActions}>
          <Pressable style={styles.mailAction}>
            <Icon name="reply" size={18} color={Serene.onSurfaceVariant} />
            <Text style={styles.mailActionText}>Répondre</Text>
          </Pressable>
          <Pressable style={styles.mailAction}>
            <Icon name="forward" size={18} color={Serene.onSurfaceVariant} />
            <Text style={styles.mailActionText}>Transférer</Text>
          </Pressable>
          <Pressable style={styles.mailAction}>
            <Icon name="archive" size={18} color={Serene.onSurfaceVariant} />
            <Text style={styles.mailActionText}>Archiver</Text>
          </Pressable>
        </View>

        <View style={styles.privacyCard}>
          <Icon name="lock" size={15} color={Serene.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Cet e-mail est traité localement pour l’extraction. Aucun contenu n’est partagé avec
            des tiers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  mailCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  mailTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  senderBody: {
    flex: 1,
    minWidth: 0,
  },
  senderName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  senderEmail: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  mailTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  subject: {
    ...Typography.titleMd,
    color: Serene.onSurface,
    marginTop: 12,
  },
  mailLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  labelText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  labelTextAccent: {
    color: Serene.secondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
    marginVertical: 10,
  },
  mailBody: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
    color: Serene.onSurface,
    marginBottom: 8,
  },
  mailSign: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Serene.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentBody: {
    flex: 1,
    minWidth: 0,
  },
  attachmentName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  attachmentMeta: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  aiCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Serene.secondaryContainer,
    ...Shadow.card,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderBody: {
    flex: 1,
    minWidth: 0,
  },
  aiTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  aiSub: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  confidencePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  confidenceText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  aiFields: {
    marginTop: 10,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
  },
  aiRowIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    width: 108,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  aiValue: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
    textAlign: 'right',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    padding: 9,
    borderRadius: Radius.md,
    backgroundColor: Serene.warningContainer,
  },
  suggestionText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.warning,
  },
  aiActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  aiPrimary: {
    flex: 1,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  aiPrimaryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onPrimary,
  },
  aiSecondary: {
    flex: 1,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  aiSecondaryText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.successContainer,
  },
  successText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.success,
  },
  mailActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mailAction: {
    flex: 1,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    ...Shadow.card,
  },
  mailActionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
});
