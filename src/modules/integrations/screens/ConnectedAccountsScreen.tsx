// S-24 - Connexions externes | Module M12 Intégrations | Phase S10
// Ce qui est connecté, ce qui a été importé, et un contrôle fin de ce que Bringo Mind peut lire.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, Tag, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { RadioRow, SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { CALENDARS, GMAIL_ADDRESS, PERMISSIONS, SENDERS } from '../data';
import { integrationActions, useIntegrationsState } from '../store';

type Account = 'gmail' | 'calendar' | 'outlook';
type Sheet = { disconnect: Account } | 'outlook' | null;

const ACCOUNT_NAMES: Record<Account, string> = { gmail: 'Gmail', calendar: 'Google Agenda', outlook: 'Microsoft Outlook' };

/** Ce que la déconnexion garde et retire (guide d'API : EMAIL-004, CI-005). */
const DISCONNECT_EFFECT: Record<Account, string> = {
  gmail: 'Les e-mails et documents déjà importés restent dans Bringo Mind. Les nouveaux ne seront plus récupérés.',
  calendar:
    'Les événements importés de Google Agenda seront retirés de votre calendrier Bringo Mind. Les événements créés dans Bringo Mind sont conservés.',
  outlook:
    'Les e-mails déjà importés restent ; les événements importés d’Outlook seront retirés. Les événements créés dans Bringo Mind sont conservés.',
};

const DISCONNECTED_TOAST: Record<Account, string> = {
  gmail: 'Gmail déconnecté • les éléments importés sont conservés',
  calendar: 'Google Agenda déconnecté • ses événements importés ont été retirés',
  outlook: 'Microsoft Outlook déconnecté',
};

function syncLabel(date: Date): string {
  const minutes = Math.round((DEMO_TODAY.getTime() - date.getTime()) / 60000);
  return minutes <= 0 ? 'à l’instant' : `il y a ${minutes} min`;
}

export default function ConnectedAccountsScreen() {
  const state = useIntegrationsState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (state.flash) {
        setToast(state.flash);
        integrationActions.setFlash(null);
      }
    }, [state.flash]),
  );

  const connected = [state.gmail, state.calendar, state.outlook].filter(Boolean).length;
  const toReview = state.emails.filter((email) => email.status === 'review').length;
  const close = () => setSheet(null);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Connexions externes" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {/* Résumé */}
        <View style={[kitStyles.card, styles.summary]}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <Icon name="cable" size={24} color={Serene.onPrimary} />
            </View>
            <View style={styles.flex}>
              <Text style={kitStyles.title}>
                {connected} compte{connected > 1 ? 's' : ''} connecté{connected > 1 ? 's' : ''}
              </Text>
              <Text style={styles.meta}>Dernière synchronisation {syncLabel(state.lastSync)}</Text>
            </View>
          </View>
          <View style={styles.stats}>
            <Stat value={state.emails.length} label="e-mails importés" />
            <Stat value={toReview} label="à vérifier" highlight={toReview > 0} />
            <Stat value={state.calendar ? state.conflicts.length : 0} label={state.conflicts.length > 1 ? 'conflits' : 'conflit'} highlight={state.calendar && state.conflicts.length > 0} />
          </View>
          <SecondaryButton
            label="Synchroniser maintenant"
            icon="sync"
            onPress={() => {
              integrationActions.sync();
              setToast({ text: 'Synchronisation terminée : rien de nouveau' });
            }}
          />
        </View>

        <SettingsSection title="E-mails importés" icon="mark_email_unread">
          <SettingsRow
            first
            icon="inbox"
            title="Voir les e-mails importés"
            subtitle={toReview ? `${toReview} à vérifier • ${state.emails.length} au total` : `${state.emails.length} e-mails, tous traités`}
            onPress={() => router.push('/integrations/email')}
            right={
              toReview ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{toReview}</Text>
                </View>
              ) : undefined
            }
          />
        </SettingsSection>

        {/* Gmail */}
        <SettingsSection
          title="Messagerie"
          icon="mail"
          footer={state.gmail ? 'Seuls les e-mails de ces expéditeurs sont lus. Le reste de votre boîte n’est jamais ouvert.' : undefined}>
          <AccountRow account="gmail" detail={GMAIL_ADDRESS} connected={state.gmail} onDisconnect={() => setSheet({ disconnect: 'gmail' })} onConnect={() => {
            integrationActions.setConnected('gmail', true);
            setToast({ text: 'Gmail reconnecté' });
          }} />
          {state.gmail
            ? PERMISSIONS.map((permission) => (
                <SettingsRow
                  key={permission.key}
                  icon={permission.icon}
                  title={permission.title}
                  subtitle={permission.subtitle}
                  right={
                    <ToggleSwitch
                      value={state.permissions[permission.key]}
                      label={permission.title}
                      onValueChange={(value) => integrationActions.setPermission(permission.key, value)}
                    />
                  }
                />
              ))
            : null}
          {state.gmail ? (
            <View style={styles.senders}>
              <Text style={styles.sendersLabel}>Expéditeurs autorisés</Text>
              <View style={styles.senderWrap}>
                {SENDERS.map((sender) => {
                  const on = state.senders.includes(sender);
                  return <Tag key={sender} label={sender} icon={on ? 'check' : 'block'} tone={on ? 'teal' : 'neutral'} />;
                })}
              </View>
            </View>
          ) : null}
        </SettingsSection>

        {/* Google Agenda */}
        <SettingsSection
          title="Calendrier"
          icon="event"
          footer={
            state.calendar
              ? state.twoWay
                ? 'Les événements créés dans Bringo Mind sont aussi ajoutés à Google Agenda.'
                : 'Les événements Google arrivent dans Bringo Mind ; rien n’est envoyé vers Google.'
              : undefined
          }>
          <AccountRow account="calendar" detail={GMAIL_ADDRESS} connected={state.calendar} onDisconnect={() => setSheet({ disconnect: 'calendar' })} onConnect={() => {
            integrationActions.setConnected('calendar', true);
            setToast({ text: 'Google Agenda reconnecté' });
          }} />
          {state.calendar ? (
            <SettingsRow
              icon={state.conflicts.length ? 'sync_problem' : 'event_available'}
              title={state.conflicts.length ? 'Conflits à résoudre' : 'Aucun conflit'}
              subtitle={
                state.conflicts.length
                  ? 'Modifiés des deux côtés : vous choisissez la version à garder'
                  : 'Bringo Mind et Google Agenda sont identiques'
              }
              onPress={state.conflicts.length ? () => router.push('/integrations/conflicts') : undefined}
              right={
                state.conflicts.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{state.conflicts.length}</Text>
                  </View>
                ) : undefined
              }
            />
          ) : null}
          {state.calendar
            ? CALENDARS.map((calendar) => (
                <SettingsRow
                  key={calendar.key}
                  icon="calendar_month"
                  title={calendar.title}
                  subtitle={calendar.subtitle}
                  right={
                    <ToggleSwitch
                      value={state.calendars[calendar.key]}
                      label={`Importer le calendrier ${calendar.title}`}
                      onValueChange={(value) => integrationActions.setCalendar(calendar.key, value)}
                    />
                  }
                />
              ))
            : null}
          {state.calendar ? (
            <>
              <RadioRow
                title="Importer seulement"
                subtitle="Google → Bringo Mind"
                selected={!state.twoWay}
                onPress={() => integrationActions.setTwoWay(false)}
              />
              <RadioRow
                title="Synchroniser dans les deux sens"
                subtitle="Google ⇄ Bringo Mind"
                selected={state.twoWay}
                onPress={() => integrationActions.setTwoWay(true)}
              />
            </>
          ) : null}
        </SettingsSection>

        {/* Outlook */}
        <SettingsSection title="Autres comptes" icon="add_link">
          <AccountRow
            first
            account="outlook"
            detail={state.outlook ? 'claire.martin@outlook.fr' : 'E-mails et calendrier Microsoft'}
            connected={state.outlook}
            onDisconnect={() => setSheet({ disconnect: 'outlook' })}
            onConnect={() => setSheet('outlook')}
          />
        </SettingsSection>

        <View style={styles.note}>
          <Icon name="shield" size={20} color={Tint.primary} />
          <Text style={styles.noteText}>
            Bringo Mind n’accède qu’aux données nécessaires. Vous pouvez retirer l’accès à tout moment ; les clés d’accès
            sont chiffrées et jamais partagées.
          </Text>
        </View>
      </ScrollView>

      {/* Connecter Outlook : ce qui sera lu, avant l'autorisation */}
      <BottomSheet visible={sheet === 'outlook'} title="Connecter Microsoft Outlook" subtitle="Vous allez être redirigé vers Microsoft pour autoriser l’accès." onClose={close}>
        {[
          { icon: 'mark_email_read', text: 'Lire les e-mails de vos organismes (factures, courriers)' },
          { icon: 'event', text: 'Importer les événements de votre calendrier' },
          { icon: 'block', text: 'Jamais : envoyer des e-mails ou supprimer quoi que ce soit' },
        ].map((line) => (
          <View key={line.text} style={styles.permLine}>
            <Icon name={line.icon} size={20} color={line.icon === 'block' ? Serene.error : Tint.primary} />
            <Text style={styles.permText}>{line.text}</Text>
          </View>
        ))}
        <PrimaryButton
          label="Continuer vers Microsoft"
          icon="open_in_new"
          onPress={() => {
            integrationActions.setConnected('outlook', true);
            close();
            setToast({ text: 'Microsoft Outlook connecté' });
          }}
        />
        <SecondaryButton label="Plus tard" onPress={close} />
      </BottomSheet>

      {/* Déconnecter un compte */}
      <BottomSheet
        visible={typeof sheet === 'object' && sheet !== null}
        title={typeof sheet === 'object' && sheet ? `Déconnecter ${ACCOUNT_NAMES[sheet.disconnect]} ?` : ''}
        subtitle={typeof sheet === 'object' && sheet ? DISCONNECT_EFFECT[sheet.disconnect] : undefined}
        onClose={close}>
        <SecondaryButton
          label="Déconnecter"
          icon="link_off"
          danger
          onPress={() => {
            if (typeof sheet !== 'object' || !sheet) return;
            // Pas d'« Annuler » : se reconnecter demande une nouvelle autorisation chez le fournisseur.
            integrationActions.setConnected(sheet.disconnect, false);
            setToast({ text: DISCONNECTED_TOAST[sheet.disconnect] });
            close();
          }}
        />
        <SecondaryButton label="Garder la connexion" onPress={close} />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, highlight && styles.statHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** Ligne d'un compte : état clair et une seule action (connecter ou déconnecter). */
function AccountRow({
  account,
  detail,
  connected,
  onConnect,
  onDisconnect,
  first = true,
}: {
  account: Account;
  detail: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  first?: boolean;
}) {
  const icon = account === 'gmail' ? 'mail' : account === 'calendar' ? 'event' : 'alternate_email';
  return (
    <SettingsRow
      first={first}
      icon={icon}
      title={ACCOUNT_NAMES[account]}
      subtitle={connected ? `Connecté
${detail}` : detail}
      right={
        connected ? (
          <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={`Déconnecter ${ACCOUNT_NAMES[account]}`} onPress={onDisconnect}>
            <Text style={styles.disconnect}>Déconnecter</Text>
          </Pressable>
        ) : (
          <PrimaryButton label="Connecter" style={styles.accountButtonDark} onPress={onConnect} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  summary: {
    gap: 14,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Tint.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
  },
  statHighlight: {
    color: '#b45309',
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  badge: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: '#92400e',
  },
  senders: {
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  sendersLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  senderWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  disconnect: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.error,
  },
  accountButtonDark: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 22,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  permLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  permText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
});
