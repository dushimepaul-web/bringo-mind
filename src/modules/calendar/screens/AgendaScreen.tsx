// S-13 (vue liste) - Agenda | Module M07 Rendez-vous et calendrier | Phase S6
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type AgendaEvent = {
  id: string;
  title: string;
  time: string;
  end: string;
  location: string;
  icon: string;
  accent: 'primary' | 'secondary' | 'warning';
  shared?: boolean;
};

type AgendaSection = {
  key: string;
  title: string;
  events: AgendaEvent[];
};

const SECTIONS: AgendaSection[] = [
  {
    key: 'today',
    title: 'Aujourd’hui • Jeudi 9 mai',
    events: [
      {
        id: 'dentiste',
        title: 'Rendez-vous dentiste',
        time: '09:30',
        end: '10:15',
        location: 'Dr. Moreau • Cabinet Voltaire',
        icon: 'medical_services',
        accent: 'secondary',
      },
      {
        id: 'reunion',
        title: 'Réunion projet PLAA',
        time: '14:00',
        end: '15:00',
        location: 'Visioconférence',
        icon: 'videocam',
        accent: 'primary',
      },
      {
        id: 'leo',
        title: 'Récupérer Léo à l’école',
        time: '16:45',
        end: '17:15',
        location: 'École Jean Moulin',
        icon: 'school',
        accent: 'warning',
        shared: true,
      },
    ],
  },
  {
    key: 'tomorrow',
    title: 'Vendredi 10 mai',
    events: [
      {
        id: 'parents',
        title: 'Réunion parents d’élèves',
        time: '18:00',
        end: '19:30',
        location: 'École Jean Moulin',
        icon: 'groups',
        accent: 'secondary',
        shared: true,
      },
    ],
  },
  {
    key: 'week',
    title: 'Samedi 11 mai',
    events: [
      {
        id: 'football',
        title: 'Match de football de Léo',
        time: '10:00',
        end: '11:30',
        location: 'Stade municipal',
        icon: 'sports_soccer',
        accent: 'warning',
        shared: true,
      },
    ],
  },
  {
    key: 'next-week',
    title: 'Semaine prochaine',
    events: [
      {
        id: 'assurance',
        title: 'Renouvellement assurance habitation',
        time: 'Mer. 10:00',
        end: '',
        location: 'En ligne',
        icon: 'shield',
        accent: 'primary',
      },
      {
        id: 'ophtalmo',
        title: 'Contrôle ophtalmologique',
        time: 'Jeu. 14:30',
        end: '15:00',
        location: 'Centre Voltaire',
        icon: 'visibility',
        accent: 'secondary',
      },
    ],
  },
];

export default function AgendaScreen() {
  const totalEvents = SECTIONS.reduce((total, section) => total + section.events.length, 0);

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
        <Text style={styles.headerTitle}>Agenda</Text>
        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Nouvel événement"
          onPress={() => router.push('/calendar/add')}>
          <Icon name="add" size={24} color={Serene.secondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="event_note" size={22} color={Serene.secondary} />
          </View>
          <View style={styles.summaryBody}>
            <Text style={styles.summaryTitle}>Votre agenda à venir</Text>
            <Text style={styles.summaryText}>
              {totalEvents} événements sur les 7 prochains jours
            </Text>
          </View>
          <View style={styles.summaryPill}>
            <Icon name="group" size={12} color={Serene.onSurfaceVariant} />
            <Text style={styles.summaryPillText}>Foyer</Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{section.events.length}</Text>
              </View>
            </View>

            <View style={styles.sectionList}>
              {section.events.map((event) => (
                <Pressable
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push('/calendar/detail')}
                  accessibilityRole="button">
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeText}>{event.time}</Text>
                    {event.end ? <Text style={styles.endText}>{event.end}</Text> : null}
                  </View>
                  <View style={[styles.eventIcon, accentBubble(event.accent)]}>
                    <Icon name={event.icon} size={17} color={accentColor(event.accent)} />
                  </View>
                  <View style={styles.eventBody}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <View style={styles.locationRow}>
                      <Icon name="location_on" size={13} color={Serene.onSurfaceVariant} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {event.location}
                      </Text>
                    </View>
                    {event.shared ? (
                      <View style={styles.sharedPill}>
                        <Icon name="group" size={11} color={Serene.onSurfaceVariant} />
                        <Text style={styles.sharedText}>Partagé avec le foyer</Text>
                      </View>
                    ) : null}
                  </View>
                  <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          onPress={() => router.push('/calendar/add')}>
          <Icon name="add" size={22} color={Serene.onPrimary} />
          <Text style={styles.addButtonText}>Nouvel événement</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function accentColor(accent: AgendaEvent['accent']) {
  if (accent === 'warning') return Serene.warning;
  if (accent === 'secondary') return Serene.secondary;
  return Serene.primary;
}

function accentBubble(accent: AgendaEvent['accent']) {
  if (accent === 'warning') return styles.iconWarning;
  if (accent === 'secondary') return styles.iconSecondary;
  return styles.iconPrimary;
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
    paddingBottom: Space.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBody: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  summaryText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  summaryPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  section: {
    marginTop: Space.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Space.sm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  countPill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sectionList: {
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  timeBlock: {
    width: 44,
    paddingTop: 2,
  },
  timeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  endText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  eventIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPrimary: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  iconSecondary: {
    backgroundColor: Serene.secondaryContainer,
  },
  iconWarning: {
    backgroundColor: Serene.warningContainer,
  },
  eventBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eventTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    flexShrink: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  sharedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  sharedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  footer: {
    paddingHorizontal: Space.gutter,
    paddingVertical: 10,
    backgroundColor: Serene.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  addButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  addButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
