// S-32 - Aide et support | Module M16 Support | Phase S12
// Recherche et catégories pour trouver seul ; formulaire prérempli et confirmé pour écrire à l'équipe.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, PrimaryButton, SecondaryButton, TopBar, kitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

type Category = 'all' | 'account' | 'household' | 'documents' | 'kora' | 'billing';

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'all', label: 'Tout', icon: 'apps' },
  { key: 'account', label: 'Compte', icon: 'person' },
  { key: 'household', label: 'Foyer', icon: 'family_restroom' },
  { key: 'documents', label: 'Documents', icon: 'folder' },
  { key: 'kora', label: 'Kora', icon: 'auto_awesome' },
  { key: 'billing', label: 'Abonnement', icon: 'workspace_premium' },
];

const FAQ: { id: string; category: Exclude<Category, 'all'>; question: string; answer: string; link?: { label: string; href: '/household/invite' | '/profile/privacy' | '/integrations' | '/billing' | '/profile/biometric' } }[] = [
  {
    id: 'q1',
    category: 'household',
    question: 'Les membres du foyer voient-ils mes éléments personnels ?',
    answer: 'Non. Ils voient seulement ce que vous partagez avec le foyer. Tout le reste reste privé, même pour le propriétaire.',
  },
  {
    id: 'q2',
    category: 'household',
    question: 'Comment ajouter un membre au foyer ?',
    answer: 'Depuis le Foyer, touchez « Inviter ». La personne reçoit un lien valable 7 jours, que vous pouvez annuler à tout moment.',
    link: { label: 'Inviter un membre', href: '/household/invite' },
  },
  {
    id: 'q3',
    category: 'kora',
    question: 'Kora peut-elle créer des éléments sans mon accord ?',
    answer: 'Non. Kora propose ; c’est vous qui validez chaque tâche, rappel ou événement dans son formulaire.',
  },
  {
    id: 'q4',
    category: 'documents',
    question: 'Comment Kora lit-elle mes documents ?',
    answer: 'Kora repère les dates et les montants pour vous les proposer. Vous pouvez tout corriger, ou désactiver cette analyse.',
    link: { label: 'Gérer mes consentements', href: '/profile/privacy' },
  },
  {
    id: 'q5',
    category: 'account',
    question: 'Puis-je utiliser Bringo Mind sans connecter ma messagerie ?',
    answer: 'Oui. Les connexions externes sont optionnelles : tout fonctionne aussi en saisissant vos éléments vous-même.',
    link: { label: 'Voir les connexions', href: '/integrations' },
  },
  {
    id: 'q6',
    category: 'account',
    question: 'Comment exporter toutes mes données ?',
    answer: 'Dans Confidentialité et données, touchez « Exporter mes données » et choisissez ce que vous voulez récupérer.',
    link: { label: 'Exporter mes données', href: '/profile/privacy' },
  },
  {
    id: 'q7',
    category: 'account',
    question: 'Comment activer Face ID ?',
    answer: 'Dans Mon profil, ouvrez « Déverrouillage biométrique » et activez Face ID. Vous pouvez aussi choisir quand l’app se verrouille.',
    link: { label: 'Déverrouillage biométrique', href: '/profile/biometric' },
  },
  {
    id: 'q8',
    category: 'billing',
    question: 'Que se passe-t-il si je résilie Premium ?',
    answer: 'Vous gardez Premium jusqu’à la fin de la période payée. Vos données sont conservées, puis vous passez à l’offre Gratuite.',
    link: { label: 'Voir mon abonnement', href: '/billing' },
  },
];

const TOPICS = ['Question', 'Problème', 'Suggestion'];

export default function HelpSupportScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [open, setOpen] = useState<string | null>('q1');
  const [focus, setFocus] = useState<'search' | 'message' | null>(null);
  const [topic, setTopic] = useState('Question');
  const [message, setMessage] = useState('Bonjour, comment partager seulement certains documents avec Thomas, sans partager tout le dossier Logement ?');
  const [deviceInfo, setDeviceInfo] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [sent, setSent] = useState(false);

  const term = query.trim().toLowerCase();
  const results = FAQ.filter(
    (item) =>
      (category === 'all' || item.category === category) &&
      (!term || item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)),
  );

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Aide et support" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Comment pouvons-nous vous aider ?</Text>
        <View style={[styles.search, focus === 'search' && kitStyles.inputFocused]}>
          <Icon name="search" size={20} color={focus === 'search' ? Tint.primary : Serene.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocus('search')}
            onBlur={() => setFocus(null)}
            placeholder="Rechercher : foyer, export, Face ID…"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            accessibilityLabel="Rechercher dans l’aide"
          />
          {query ? (
            <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => setQuery('')}>
              <Icon name="cancel" size={20} color={Serene.onSurfaceVariant} filled />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
          {CATEGORIES.map((entry) => (
            <Chip key={entry.key} label={entry.label} icon={entry.icon} selected={category === entry.key} onPress={() => setCategory(entry.key)} />
          ))}
        </ScrollView>

        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Tous les services fonctionnent normalement</Text>
        </View>

        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        {results.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="search_off" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Aucune réponse trouvée</Text>
            <Text style={[kitStyles.muted, styles.center]}>Écrivez-nous ci-dessous : nous répondons sous 24 h.</Text>
          </View>
        ) : (
          <View style={[kitStyles.card, styles.faq]}>
            {results.map((item, index) => {
              const expanded = open === item.id;
              return (
                <View key={item.id} style={[styles.faqItem, index > 0 && styles.faqBorder]}>
                  <Pressable
                    style={({ pressed }) => [styles.faqHead, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setOpen(expanded ? null : item.id)}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Icon name={expanded ? 'expand_less' : 'expand_more'} size={22} color={Serene.onSurfaceVariant} />
                  </Pressable>
                  {expanded ? (
                    <View style={styles.answerBox}>
                      <Text style={styles.answer}>{item.answer}</Text>
                      {item.link ? (
                        <Pressable hitSlop={8} accessibilityRole="link" onPress={() => item.link && router.push(item.link.href)}>
                          <Text style={styles.link}>{item.link.label} →</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* Écrire à l'équipe */}
        <Text style={styles.sectionTitle}>Écrire à l’équipe</Text>
        {sent ? (
          <View style={[kitStyles.card, styles.sent]}>
            <View style={styles.sentIcon}>
              <Icon name="mark_email_read" size={28} color={Serene.onPrimary} />
            </View>
            <Text style={kitStyles.title}>Message envoyé</Text>
            <Text style={[kitStyles.muted, styles.center]}>
              Demande n° BM-2405-1182. Nous répondons sous 24 h à claire.martin@email.fr.
            </Text>
            <SecondaryButton label="Écrire un autre message" onPress={() => setSent(false)} />
          </View>
        ) : (
          <View style={[kitStyles.card, styles.form]}>
            <Text style={styles.fieldLabel}>Sujet</Text>
            <View style={styles.topics}>
              {TOPICS.map((entry) => (
                <Chip key={entry} label={entry} selected={topic === entry} onPress={() => setTopic(entry)} />
              ))}
            </View>
            <Text style={styles.fieldLabel}>Message</Text>
            <TextInput
              style={[kitStyles.input, styles.message, focus === 'message' && kitStyles.inputFocused]}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setFocus('message')}
              onBlur={() => setFocus(null)}
              multiline
              textAlignVertical="top"
              selectionColor={Tint.primary}
              accessibilityLabel="Votre message"
            />
            <View style={styles.deviceRow}>
              <View style={styles.flex}>
                <Text style={styles.deviceTitle}>Joindre les infos de l’appareil</Text>
                <Text style={styles.deviceHint}>iPhone 15 • iOS 18 • Bringo Mind 1.0.0 (aucune donnée personnelle)</Text>
              </View>
              <ToggleSwitch value={deviceInfo} label="Joindre les informations de l’appareil" onValueChange={setDeviceInfo} />
            </View>
            <PrimaryButton
              label="Envoyer le message"
              icon="send"
              disabled={message.trim().length < 10}
              onPress={() => setConfirm(true)}
            />
          </View>
        )}

        <SettingsSection title="Autres ressources" icon="menu_book">
          <SettingsRow first icon="school" title="Guide de démarrage" subtitle="Les bases en 5 minutes" onPress={() => router.push('/onboarding')} />
          <SettingsRow icon="shield" title="Confidentialité et données" subtitle="Consentements, export, suppression" onPress={() => router.push('/profile/privacy')} />
        </SettingsSection>

        <Text style={styles.version}>Bringo Mind 1.0.0 • version de démonstration</Text>
      </ScrollView>

      <BottomSheet
        visible={confirm}
        title="Envoyer votre message ?"
        subtitle={`Sujet : ${topic}. Réponse sous 24 h à claire.martin@email.fr.`}
        onClose={() => setConfirm(false)}>
        <PrimaryButton
          label="Oui, envoyer"
          icon="send"
          onPress={() => {
            setConfirm(false);
            setSent(true);
          }}
        />
        <SecondaryButton label="Revenir au message" onPress={() => setConfirm(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  search: {
    marginTop: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    paddingVertical: 0,
  },
  chipsScroll: {
    marginTop: 10,
  },
  chips: {
    gap: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: '#16a34a',
  },
  statusText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: '#166534',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  faq: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  faqItem: {
    paddingHorizontal: 14,
  },
  faqBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  faqHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  question: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
  answerBox: {
    gap: 8,
    paddingBottom: 14,
  },
  answer: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    color: Tint.navy,
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  form: {
    gap: 10,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  message: {
    minHeight: 110,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deviceTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  deviceHint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  sent: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 22,
  },
  sentIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
});
