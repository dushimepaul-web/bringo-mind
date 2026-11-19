// S-32 - Aide et support | Module M16 Support | Phase S12
// Comme l'app « Aide » du téléphone : recherche, thèmes en tuiles, questions fréquentes avec avis 👍 / 👎,
// puis « Discuter avec Kora » ou « Écrire à l'équipe » (formulaire dans une feuille, envoi confirmé).
import { router } from 'expo-router';
import { Fragment, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { BottomSheet, PrimaryButton, SecondaryButton, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { ToggleSwitch } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

type Topic = 'account' | 'household' | 'documents' | 'kora' | 'reminders' | 'privacy';
type Href = '/household/invite' | '/profile/privacy' | '/integrations' | '/billing' | '/profile/biometric' | '/notifications/settings';

const TOPICS: { key: Topic; label: string; icon: string; tint: string }[] = [
  { key: 'account', label: 'Compte', icon: 'person', tint: '#2F7BE0' },
  { key: 'household', label: 'Foyer', icon: 'family_restroom', tint: '#8B5CF6' },
  { key: 'documents', label: 'Documents', icon: 'folder', tint: '#E08A00' },
  { key: 'kora', label: 'Kora', icon: 'auto_awesome', tint: '#0FB5A3' },
  { key: 'reminders', label: 'Rappels', icon: 'alarm', tint: '#E5484D' },
  { key: 'privacy', label: 'Vie privée', icon: 'shield', tint: '#16A34A' },
];

const TOPIC_OF = Object.fromEntries(TOPICS.map((topic) => [topic.key, topic])) as Record<Topic, (typeof TOPICS)[number]>;

const FAQ: { id: string; topic: Topic; question: string; answer: string; link?: { label: string; href: Href } }[] = [
  {
    id: 'q1',
    topic: 'household',
    question: 'Les membres du foyer voient-ils mes éléments personnels ?',
    answer: 'Non. Ils voient seulement ce que vous partagez avec le foyer. Tout le reste reste privé, même pour le propriétaire.',
  },
  {
    id: 'q2',
    topic: 'household',
    question: 'Comment ajouter un membre au foyer ?',
    answer: 'Depuis le Foyer, touchez « Inviter ». La personne reçoit un lien valable 7 jours, que vous pouvez annuler à tout moment.',
    link: { label: 'Inviter un membre', href: '/household/invite' },
  },
  {
    id: 'q3',
    topic: 'kora',
    question: 'Kora peut-elle créer des éléments sans mon accord ?',
    answer: 'Non. Kora propose ; c’est vous qui validez chaque tâche, rappel ou événement dans son formulaire.',
  },
  {
    id: 'q4',
    topic: 'documents',
    question: 'Comment Kora lit-elle mes documents ?',
    answer: 'Kora repère les dates et les montants pour vous les proposer. Vous pouvez tout corriger, ou désactiver cette analyse.',
    link: { label: 'Gérer mes consentements', href: '/profile/privacy' },
  },
  {
    id: 'q9',
    topic: 'reminders',
    question: 'Pourquoi un rappel n’a-t-il pas sonné ?',
    answer: 'Il tombait peut-être pendant vos heures de silence, ou les notifications de ce type sont coupées. Vérifiez vos réglages.',
    link: { label: 'Réglages des notifications', href: '/notifications/settings' },
  },
  {
    id: 'q5',
    topic: 'account',
    question: 'Puis-je utiliser Bringo Mind sans connecter ma messagerie ?',
    answer: 'Oui. Les connexions externes sont optionnelles : tout fonctionne aussi en saisissant vos éléments vous-même.',
    link: { label: 'Voir les connexions', href: '/integrations' },
  },
  {
    id: 'q6',
    topic: 'privacy',
    question: 'Comment exporter toutes mes données ?',
    answer: 'Dans Confidentialité et données, touchez « Exporter mes données » et choisissez ce que vous voulez récupérer.',
    link: { label: 'Exporter mes données', href: '/profile/privacy' },
  },
  {
    id: 'q7',
    topic: 'account',
    question: 'Comment activer Face ID ?',
    answer: 'Dans Mon profil, ouvrez « Déverrouillage biométrique » et activez Face ID. Vous pouvez aussi choisir quand l’app se verrouille.',
    link: { label: 'Déverrouillage biométrique', href: '/profile/biometric' },
  },
  {
    id: 'q8',
    topic: 'account',
    question: 'Que se passe-t-il si je résilie Premium ?',
    answer: 'Vous gardez Premium jusqu’à la fin de la période payée. Vos données sont conservées, puis vous passez à l’offre Gratuite.',
    link: { label: 'Voir mon abonnement', href: '/billing' },
  },
];

const SUBJECTS = ['Question', 'Problème', 'Suggestion'];
const SHOWN = 5;

export default function HelpSupportScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [sheet, setSheet] = useState<'write' | 'confirm' | null>(null);
  const [subject, setSubject] = useState('Question');
  const [message, setMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const term = query.trim().toLowerCase();
  const results = FAQ.filter(
    (item) => (!topic || item.topic === topic) && (!term || item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)),
  );
  const filtered = !!topic || !!term;
  const visible = all || filtered ? results : results.slice(0, SHOWN);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Aide" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Icon name="search" size={22} color={c.muted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher dans l’aide"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            accessibilityLabel="Rechercher dans l’aide"
          />
          {query ? (
            <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => setQuery('')}>
              <Icon name="cancel" size={20} color={c.muted} filled />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Services OK</Text>
        </View>

        {/* Thèmes */}
        <Text style={styles.section}>Thèmes</Text>
        <View style={styles.grid}>
          {TOPICS.map((entry) => {
            const on = topic === entry.key;
            return (
              <Pressable
                key={entry.key}
                style={({ pressed }) => [styles.tile, on && styles.tileOn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  setTopic(on ? null : entry.key);
                  setOpen(null);
                }}>
                <View style={[styles.tileIcon, { backgroundColor: entry.tint }]}>
                  <Icon name={entry.icon} size={20} color="#FFFFFF" filled />
                </View>
                <Text style={styles.tileText} numberOfLines={1}>
                  {entry.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Questions fréquentes */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionInline}>{topic ? TOPIC_OF[topic].label : 'Questions fréquentes'}</Text>
          {!filtered && results.length > SHOWN ? (
            <Pressable hitSlop={8} accessibilityRole="button" onPress={() => setAll((value) => !value)}>
              <Text style={styles.link}>{all ? 'Réduire' : `Voir toutes (${results.length})`}</Text>
            </Pressable>
          ) : null}
        </View>
        {visible.length === 0 ? (
          <View style={[styles.card, styles.empty]}>
            <Icon name="search_off" size={28} color={c.link} />
            <Text style={styles.emptyTitle}>Aucune réponse trouvée</Text>
            <Text style={styles.muted}>Écrivez-nous : nous répondons sous 24 h.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {visible.map((item, index) => {
              const expanded = open === item.id;
              const meta = TOPIC_OF[item.topic];
              return (
                <Fragment key={item.id}>
                  {index > 0 ? <View style={styles.divider} /> : null}
                  <Pressable
                    style={({ pressed }) => [styles.faqHead, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setOpen(expanded ? null : item.id)}>
                    <View style={[styles.faqIcon, { backgroundColor: meta.tint }]}>
                      <Icon name={meta.icon} size={16} color="#FFFFFF" filled />
                    </View>
                    <Text style={styles.question}>{item.question}</Text>
                    <Icon name={expanded ? 'expand_more' : 'chevron_right'} size={22} color={c.muted} />
                  </Pressable>
                  {expanded ? (
                    <View style={styles.answerBox}>
                      <Text style={styles.answer}>{item.answer}</Text>
                      {item.link ? (
                        <Pressable hitSlop={8} accessibilityRole="link" onPress={() => item.link && router.push(item.link.href)}>
                          <Text style={styles.link}>{item.link.label} →</Text>
                        </Pressable>
                      ) : null}
                      <View style={styles.vote}>
                        <Text style={styles.voteText}>{votes[item.id] ? 'Merci pour votre avis !' : 'Cette réponse vous a aidé ?'}</Text>
                        {(['up', 'down'] as const).map((value) => {
                          const on = votes[item.id] === value;
                          return (
                            <Pressable
                              key={value}
                              hitSlop={6}
                              style={[styles.voteButton, on && styles.voteButtonOn]}
                              accessibilityRole="button"
                              accessibilityLabel={value === 'up' ? 'Oui, utile' : 'Non, pas utile'}
                              accessibilityState={{ selected: on }}
                              onPress={() => setVotes((current) => ({ ...current, [item.id]: value }))}>
                              <Icon name={value === 'up' ? 'thumb_up' : 'thumb_down'} size={18} color={on ? '#0C1A37' : c.muted} filled={on} />
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </Fragment>
              );
            })}
          </View>
        )}

        {/* Nous contacter */}
        <Text style={styles.section}>Nous contacter</Text>
        <View style={styles.card}>
          <Row icon="forum" tint="#0C1A37" title="Discuter avec Kora" subtitle="Réponse immédiate, à toute heure" onPress={() => router.push('/assistant')} />
          <View style={styles.divider} />
          <Row icon="mail" tint="#2F7BE0" title="Écrire à l’équipe" subtitle="Réponse sous 24 h par e-mail" onPress={() => setSheet('write')} />
        </View>

        {/* Autres ressources */}
        <Text style={styles.section}>Autres ressources</Text>
        <View style={styles.card}>
          <Row icon="school" tint="#E08A00" title="Guide de démarrage" subtitle="Les bases en 5 minutes" onPress={() => router.push('/onboarding')} />
          <View style={styles.divider} />
          <Row icon="shield" tint="#16A34A" title="Confidentialité et données" subtitle="Consentements, export, suppression" onPress={() => router.push('/profile/privacy')} />
        </View>

        <Text style={styles.version}>Bringo Mind 1.0.0 • version de démonstration</Text>
      </ScrollView>

      {/* Écrire à l'équipe */}
      <BottomSheet visible={sheet === 'write'} title="Écrire à l’équipe" subtitle="Réponse sous 24 h à claire.martin@email.fr." onClose={() => setSheet(null)}>
        <View style={styles.segments} accessibilityRole="radiogroup">
          {SUBJECTS.map((entry) => {
            const on = subject === entry;
            return (
              <Pressable
                key={entry}
                style={[styles.segment, on && styles.segmentOn]}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setSubject(entry)}>
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{entry}</Text>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          style={styles.message}
          value={message}
          onChangeText={setMessage}
          placeholder="Décrivez votre question…"
          placeholderTextColor={c.muted}
          multiline
          textAlignVertical="top"
          selectionColor={c.link}
          accessibilityLabel="Votre message"
        />
        <View style={styles.deviceRow}>
          <View style={styles.flex}>
            <Text style={styles.deviceTitle}>Joindre les infos de l’appareil</Text>
            <Text style={styles.muted}>iPhone 15 • iOS 18 • Bringo Mind 1.0.0</Text>
          </View>
          <ToggleSwitch value={deviceInfo} label="Joindre les informations de l’appareil" onValueChange={setDeviceInfo} />
        </View>
        {message.trim() ? <PrimaryButton label="Envoyer" icon="send" onPress={() => setSheet('confirm')} /> : null}
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'confirm'}
        title="Envoyer votre message ?"
        subtitle={`Sujet : ${subject}. Réponse sous 24 h à claire.martin@email.fr.`}
        onClose={() => setSheet('write')}>
        <PrimaryButton
          label="Oui, envoyer"
          icon="send"
          onPress={() => {
            setSheet(null);
            setMessage('');
            setToast('Message envoyé • demande n° BM-2405-1182');
          }}
        />
        <SecondaryButton label="Revenir au message" onPress={() => setSheet('write')} />
      </BottomSheet>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={24} /> : null}
    </SafeAreaView>
  );
}

function Row({ icon, tint, title, subtitle, onPress }: { icon: string; tint: string; title: string; subtitle: string; onPress: () => void }) {
  const { c, styles } = useLook();
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} accessibilityRole="button" onPress={onPress}>
      <View style={[styles.rowIcon, { backgroundColor: tint }, tint === '#0C1A37' && c.dark && styles.rowIconDark]}>
        <Icon name={icon} size={20} color="#FFFFFF" filled />
      </View>
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
      </View>
      <Icon name="chevron_right" size={22} color={c.muted} />
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      minWidth: 0,
    },
    pressed: {
      opacity: 0.75,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      height: 54,
      paddingHorizontal: 16,
      borderRadius: Radius.full,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
      marginLeft: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#16A34A',
    },
    statusText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    section: {
      marginTop: 22,
      marginBottom: 8,
      marginLeft: 4,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 22,
      marginBottom: 8,
      marginHorizontal: 4,
    },
    sectionInline: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    tile: {
      width: '48%',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    tileOn: {
      borderWidth: 2,
      borderColor: TURQUOISE,
      padding: 11,
    },
    tileIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tileText: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    card: {
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginLeft: 14,
      backgroundColor: c.divider,
    },
    faqHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    faqIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    question: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    answerBox: {
      gap: 10,
      paddingLeft: 54,
      paddingRight: 14,
      paddingBottom: 14,
    },
    answer: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
    vote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
    },
    voteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    voteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    voteButtonOn: {
      backgroundColor: TURQUOISE,
      borderColor: TURQUOISE,
    },
    empty: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    emptyTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    muted: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIconDark: {
      backgroundColor: '#3B5079',
    },
    rowTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    version: {
      marginTop: 22,
      textAlign: 'center',
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    segments: {
      flexDirection: 'row',
      padding: 4,
      gap: 4,
      borderRadius: 14,
      backgroundColor: c.dark ? '#0F1B33' : '#F0F1F4',
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 9,
      borderRadius: 11,
    },
    segmentOn: {
      backgroundColor: c.solid,
    },
    segmentText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    segmentTextOn: {
      color: c.solidText,
    },
    message: {
      minHeight: 120,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
    },
    deviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    deviceTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
