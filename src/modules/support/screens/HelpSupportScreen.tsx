// S-32 - Aide & support | Module M18 Support | Phase S10
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

const FAQ = [
  {
    question: 'Comment fonctionne l’analyse de documents par Kora ?',
    answer:
      'Kora lit vos documents importés (PDF, photos, e-mails) et en extrait les informations clés : dates, montants, échéances et actions. Vous validez toujours avant enregistrement.',
  },
  {
    question: 'Mes données sont-elles partagées avec mon foyer ?',
    answer:
      'Chaque élément possède un niveau de visibilité. Un document marqué « privé » reste visible uniquement par vous, même au sein du foyer.',
  },
  {
    question: 'Puis-je utiliser Bringo Mind sans connexion externe ?',
    answer:
      'Oui. Les connexions Gmail ou Agenda sont optionnelles : elles permettent l’import automatique mais toutes les fonctions restent accessibles manuellement.',
  },
  {
    question: 'Comment exporter toutes mes données ?',
    answer:
      'Depuis Profil → Confidentialité, lancez un export. Un lien sécurisé vous est envoyé par e-mail sous 24 heures au format ZIP (PDF + JSON).',
  },
  {
    question: 'Que se passe-t-il si je résilie mon abonnement Premium ?',
    answer:
      'Vos données restent conservées 90 jours. L’accès repasse en mode limité à la fin de la période payée, sans suppression automatique.',
  },
  {
    question: 'Comment ajouter un membre au foyer ?',
    answer:
      'Dans Foyer → Membres, appuyez sur « Inviter un membre », saisissez son e-mail et choisissez son rôle. Il reçoit une invitation valable 7 jours.',
  },
];

const CONTACT_TOPICS = ['Question générale', 'Problème technique', 'Facturation', 'Signaler un bug'];

export default function HelpSupportScreen() {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [topic, setTopic] = useState(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const filtered = FAQ.filter(
    (item) =>
      query.trim().length === 0 ||
      item.question.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.answer.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const send = () => {
    if (message.trim().length < 5) return;
    setSent(true);
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
        <Text style={styles.headerTitle}>Aide & support</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Icon name="support_agent" size={26} color={Serene.onPrimary} />
          </View>
          <Text style={styles.heroTitle}>Comment pouvons-nous vous aider ?</Text>
          <Text style={styles.heroText}>
            Réponse moyenne en moins de 2 heures pour les abonnés Premium.
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={19} color={Serene.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une question…"
            placeholderTextColor={Serene.onSurfaceVariant}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Rechercher dans l’aide"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Effacer">
              <Icon name="close" size={17} color={Serene.onSurfaceVariant} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.quickGrid}>
          <QuickAction icon="chat" label="Discuter" hint="Assistant en direct" />
          <QuickAction icon="bug_report" label="Signaler" hint="Bug ou erreur" />
          <QuickAction icon="menu_book" label="Guides" hint="Tutoriels" />
          <QuickAction icon="forum" label="Communauté" hint="Entraide" />
        </View>

        <Text style={styles.sectionLabel}>Questions fréquentes</Text>

        <View style={styles.faqList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Icon name="search_off" size={26} color={Serene.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Aucun résultat</Text>
              <Text style={styles.emptyText}>
                Essayez un autre mot-clé ou contactez notre équipe ci-dessous.
              </Text>
            </View>
          ) : (
            filtered.map((item, index) => {
              const open = openIndex === index;
              return (
                <View key={item.question} style={styles.faqCard}>
                  <Pressable
                    style={styles.faqQuestionRow}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                    onPress={() => setOpenIndex(open ? null : index)}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Icon
                      name={open ? 'expand_less' : 'expand_more'}
                      size={20}
                      color={Serene.onSurfaceVariant}
                    />
                  </Pressable>
                  {open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
                </View>
              );
            })
          )}
        </View>

        <Text style={styles.sectionLabel}>Contacter l’équipe</Text>

        {sent ? (
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <Icon name="mark_email_read" size={24} color={Serene.success} />
            </View>
            <Text style={styles.sentTitle}>Message envoyé</Text>
            <Text style={styles.sentText}>
              Notre équipe vous répondra à claire.martin@email.fr sous 2 heures ouvrées.
            </Text>
            <Pressable
              style={styles.sentButton}
              onPress={() => {
                setSent(false);
                setMessage('');
              }}>
              <Text style={styles.sentButtonText}>Envoyer un autre message</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.contactCard}>
            <Text style={styles.fieldLabel}>Sujet</Text>
            <View style={styles.topicChips}>
              {CONTACT_TOPICS.map((item) => {
                const active = topic === item;
                return (
                  <Pressable
                    key={item}
                    style={[styles.topicChip, active && styles.topicChipActive]}
                    onPress={() => setTopic(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.topicChipText, active && styles.topicChipTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Décrivez votre demande…"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Message au support"
            />

            <View style={styles.contactMeta}>
              <Icon name="schedule" size={14} color={Serene.onSurfaceVariant} />
              <Text style={styles.contactMetaText}>
                Réponse sous 2 h • Lun–Ven 9h–18h
              </Text>
            </View>

            <Pressable
              style={[styles.sendButton, message.trim().length < 5 && styles.sendButtonDisabled]}
              onPress={send}
              disabled={message.trim().length < 5}
              accessibilityRole="button">
              <Icon name="send" size={17} color={Serene.onPrimary} />
              <Text style={styles.sendButtonText}>Envoyer le message</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.footerCard}>
          <FooterRow icon="mail" label="support@bringomind.app" hint="Réponse par e-mail" />
          <View style={styles.divider} />
          <FooterRow icon="public" label="status.bringomind.app" hint="État des services" />
          <View style={styles.divider} />
          <FooterRow icon="description" label="Conditions & confidentialité" hint="Documents légaux" />
        </View>

        <Text style={styles.version}>Bringo Mind 1.0.0 • Build 2026.11</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, hint }: { icon: string; label: string; hint: string }) {
  return (
    <Pressable style={styles.quickCard} accessibilityRole="button">
      <View style={styles.quickIcon}>
        <Icon name={icon} size={20} color={Serene.secondary} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickHint}>{hint}</Text>
    </Pressable>
  );
}

function FooterRow({ icon, label, hint }: { icon: string; label: string; hint: string }) {
  return (
    <Pressable style={styles.footerRow} accessibilityRole="button">
      <View style={styles.footerIcon}>
        <Icon name={icon} size={17} color={Serene.onSurfaceVariant} />
      </View>
      <View style={styles.footerBody}>
        <Text style={styles.footerLabel}>{label}</Text>
        <Text style={styles.footerHint}>{hint}</Text>
      </View>
      <Icon name="chevron_right" size={19} color={Serene.onSurfaceVariant} />
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
  heroCard: {
    alignItems: 'center',
    padding: 18,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
    marginTop: 10,
    textAlign: 'center',
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Space.md,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: Serene.onSurface,
    paddingVertical: 0,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Space.md,
  },
  quickCard: {
    width: '48.7%',
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
    marginTop: 7,
  },
  quickHint: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 13,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  faqAnswer: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    paddingHorizontal: 13,
    paddingBottom: 13,
    paddingTop: 0,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 22,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  emptyTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    marginTop: 6,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  contactCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginBottom: 6,
  },
  fieldLabelSpaced: {
    marginTop: 12,
  },
  topicChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  topicChipActive: {
    backgroundColor: Serene.primary,
  },
  topicChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  topicChipTextActive: {
    color: Serene.onPrimary,
  },
  messageInput: {
    minHeight: 96,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  contactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  contactMetaText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sendButton: {
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  sendButtonDisabled: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  sendButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  sentCard: {
    alignItems: 'center',
    padding: 18,
    borderRadius: Radius.xl,
    backgroundColor: Serene.successContainer,
  },
  sentIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.success,
    marginTop: 8,
  },
  sentText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.success,
    textAlign: 'center',
    marginTop: 3,
  },
  sentButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  sentButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.success,
  },
  footerCard: {
    marginTop: Space.md,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
  },
  footerIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBody: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  footerHint: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
    marginLeft: 53,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Space.md,
  },
});
