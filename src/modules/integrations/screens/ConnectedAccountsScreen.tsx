// S-24 - Connexions externes | Module M12 Intégrations | Phase S10
// Comme « Comptes et synchronisation » du téléphone : une carte par compte (logo de couleur, adresse, ›),
// un seul bloc « À faire » s'il y a quelque chose à traiter, puis les réglages de chaque compte.
import { router, useFocusEffect } from 'expo-router';
import { Fragment, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, IconButton, PrimaryButton, SecondaryButton, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { CALENDARS, GMAIL_ADDRESS, PERMISSIONS } from '../data';
import { integrationActions, useIntegrationsState } from '../store';

type Account = 'gmail' | 'calendar' | 'outlook';
type Sheet = { account: Account } | { disconnect: Account } | 'outlook' | 'sender' | null;

const ACCOUNTS: Record<Account, { name: string; icon: string; tint: string }> = {
  gmail: { name: 'Gmail', icon: 'mail', tint: '#E5484D' },
  calendar: { name: 'Google Agenda', icon: 'event', tint: '#2F7BE0' },
  outlook: { name: 'Microsoft Outlook', icon: 'alternate_email', tint: '#1E3A8A' },
};

const PERMISSION_TINTS: Record<string, string> = { read: '#0FB5A3', extract: '#8B5CF6', attachments: '#E08A00' };

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
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const state = useIntegrationsState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [sender, setSender] = useState('');
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (state.flash) {
        setToast(state.flash);
        integrationActions.setFlash(null);
      }
    }, [state.flash]),
  );

  const toReview = state.emails.filter((email) => email.status === 'review').length;
  const conflicts = state.calendar ? state.conflicts.length : 0;
  const close = () => setSheet(null);
  const detailOf = (account: Account) => (account === 'outlook' ? 'claire.martin@outlook.fr' : GMAIL_ADDRESS);
  const accounts = (['gmail', 'calendar', 'outlook'] as Account[]).filter((account) => state[account]);
  const sheetAccount = typeof sheet === 'object' && sheet && 'account' in sheet ? sheet.account : null;
  const sheetDisconnect = typeof sheet === 'object' && sheet && 'disconnect' in sheet ? sheet.disconnect : null;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Comptes connectés"
        fallback="/profile"
        right={
          <IconButton
            icon="sync"
            label="Synchroniser maintenant"
            onPress={() => {
              integrationActions.sync();
              setToast({ text: 'Synchronisation terminée : rien de nouveau' });
            }}
          />
        }
      />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <Text style={styles.syncLine}>Dernière synchro {syncLabel(state.lastSync)}</Text>

        {/* À faire : seulement s'il y a quelque chose à traiter */}
        {toReview || conflicts ? (
          <View style={[styles.card, styles.firstCard]}>
            {toReview ? (
              <TodoRow
                icon="mark_email_unread"
                tint="#E08A00"
                title={`${toReview} e-mail${toReview > 1 ? 's' : ''} à vérifier`}
                count={toReview}
                onPress={() => router.push('/integrations/email')}
              />
            ) : null}
            {toReview && conflicts ? <View style={styles.divider} /> : null}
            {conflicts ? (
              <TodoRow
                icon="sync_problem"
                tint="#E5484D"
                title={`${conflicts} conflit${conflicts > 1 ? 's' : ''} à résoudre`}
                count={conflicts}
                onPress={() => router.push('/integrations/conflicts')}
              />
            ) : null}
          </View>
        ) : null}

        {/* Comptes */}
        <Text style={styles.section}>Comptes</Text>
        <View style={styles.card}>
          {accounts.map((account, index) => (
            <Fragment key={account}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                style={({ pressed }) => [styles.accountRow, pressed && styles.rowPressed]}
                accessibilityRole="button"
                accessibilityLabel={`${ACCOUNTS[account].name}, ${detailOf(account)}`}
                onPress={() => setSheet({ account })}>
                <View style={[styles.logo, { backgroundColor: ACCOUNTS[account].tint }]}>
                  <Icon name={ACCOUNTS[account].icon} size={22} color="#FFFFFF" filled />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.accountName}>{ACCOUNTS[account].name}</Text>
                  <Text style={styles.accountDetail} numberOfLines={1}>
                    {detailOf(account)}
                  </Text>
                </View>
                <Icon name="chevron_right" size={22} color={c.muted} />
              </Pressable>
            </Fragment>
          ))}
          {accounts.length === 0 ? <Text style={styles.empty}>Aucun compte connecté.</Text> : null}
        </View>

        {/* Réglages Gmail */}
        {state.gmail ? (
          <SettingsSection title="Gmail" footer="Seuls les e-mails des expéditeurs cochés sont lus. Le reste de votre boîte n’est jamais ouvert.">
            {PERMISSIONS.map((permission, index) => (
              <SettingsRow
                key={permission.key}
                first={index === 0}
                icon={permission.icon}
                tint={PERMISSION_TINTS[permission.key]}
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
            ))}
            <View style={styles.senders}>
              <Text style={styles.sendersLabel}>Expéditeurs autorisés</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.senderRow}>
                {state.known.map((name) => (
                  <Chip key={name} label={name} icon={state.senders.includes(name) ? 'check' : undefined} selected={state.senders.includes(name)} onPress={() => integrationActions.toggleSender(name)} />
                ))}
                <Chip label="Ajouter" icon="add" onPress={() => setSheet('sender')} />
              </ScrollView>
            </View>
          </SettingsSection>
        ) : null}

        {/* Réglages Google Agenda */}
        {state.calendar ? (
          <SettingsSection
            title="Google Agenda"
            footer={
              state.twoWay
                ? 'Les événements créés dans Bringo Mind sont aussi ajoutés à Google Agenda.'
                : 'Les événements Google arrivent dans Bringo Mind ; rien n’est envoyé vers Google.'
            }>
            {CALENDARS.map((calendar, index) => (
              <SettingsRow
                key={calendar.key}
                first={index === 0}
                icon="calendar_month"
                tint={calendar.color}
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
            ))}
            <View style={styles.segmentWrap}>
              <View style={styles.segments} accessibilityRole="radiogroup">
                {[
                  { key: false, label: 'Importer seulement', hint: 'Google → Bringo' },
                  { key: true, label: 'Deux sens', hint: 'Google ⇄ Bringo' },
                ].map((entry) => {
                  const on = state.twoWay === entry.key;
                  return (
                    <Pressable
                      key={entry.label}
                      style={[styles.segment, on && styles.segmentOn]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: on }}
                      onPress={() => integrationActions.setTwoWay(entry.key)}>
                      <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{entry.label}</Text>
                      <Text style={[styles.segmentHint, on && styles.segmentHintOn]}>{entry.hint}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </SettingsSection>
        ) : null}

        {/* Comptes à ajouter */}
        {(['gmail', 'calendar', 'outlook'] as Account[]).some((account) => !state[account]) ? (
          <>
            <Text style={styles.section}>Ajouter un compte</Text>
            <View style={styles.card}>
              {(['gmail', 'calendar', 'outlook'] as Account[])
                .filter((account) => !state[account])
                .map((account, index) => (
                  <Fragment key={account}>
                    {index > 0 ? <View style={styles.divider} /> : null}
                    <View style={styles.accountRow}>
                      <View style={[styles.logo, { backgroundColor: ACCOUNTS[account].tint }]}>
                        <Icon name={ACCOUNTS[account].icon} size={22} color="#FFFFFF" filled />
                      </View>
                      <View style={styles.flex}>
                        <Text style={styles.accountName}>{ACCOUNTS[account].name}</Text>
                        <Text style={styles.accountDetail} numberOfLines={1}>
                          {account === 'outlook' ? 'E-mails et calendrier' : 'Non connecté'}
                        </Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [styles.connect, pressed && styles.rowPressed]}
                        accessibilityRole="button"
                        accessibilityLabel={`Connecter ${ACCOUNTS[account].name}`}
                        onPress={() => {
                          if (account === 'outlook') {
                            setSheet('outlook');
                            return;
                          }
                          integrationActions.setConnected(account, true);
                          setToast({ text: `${ACCOUNTS[account].name} reconnecté` });
                        }}>
                        <Text style={styles.connectText}>Connecter</Text>
                      </Pressable>
                    </View>
                  </Fragment>
                ))}
            </View>
          </>
        ) : null}

        <View style={styles.privacy}>
          <Icon name="shield" size={14} color={c.muted} />
          <Text style={styles.privacyText}>Accès limité au nécessaire, clés chiffrées, retirables à tout moment.</Text>
        </View>
      </ScrollView>

      {/* Page d'un compte : détails et « Déconnecter » tout en bas */}
      <BottomSheet
        visible={!!sheetAccount}
        title={sheetAccount ? ACCOUNTS[sheetAccount].name : ''}
        subtitle={sheetAccount ? `${detailOf(sheetAccount)} • synchronisé ${syncLabel(state.lastSync)}` : undefined}
        onClose={close}>
        <SecondaryButton
          label="Synchroniser maintenant"
          icon="sync"
          onPress={() => {
            integrationActions.sync();
            close();
            setToast({ text: 'Synchronisation terminée : rien de nouveau' });
          }}
        />
        <SecondaryButton label="Déconnecter" icon="link_off" danger onPress={() => sheetAccount && setSheet({ disconnect: sheetAccount })} />
      </BottomSheet>

      {/* Connecter Outlook : ce qui sera lu, avant l'autorisation */}
      <BottomSheet visible={sheet === 'outlook'} title="Connecter Microsoft Outlook" subtitle="Vous allez être redirigé vers Microsoft pour autoriser l’accès." onClose={close}>
        {[
          { icon: 'mark_email_read', text: 'Lire les e-mails de vos organismes (factures, courriers)' },
          { icon: 'event', text: 'Importer les événements de votre calendrier' },
          { icon: 'block', text: 'Jamais : envoyer des e-mails ou supprimer quoi que ce soit' },
        ].map((line) => (
          <View key={line.text} style={styles.permLine}>
            <Icon name={line.icon} size={20} color={line.icon === 'block' ? c.error : c.link} />
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

      {/* Ajouter un expéditeur autorisé */}
      <BottomSheet visible={sheet === 'sender'} title="Ajouter un expéditeur" subtitle="Ses e-mails seront lus et classés par Kora." onClose={close}>
        <TextInput
          value={sender}
          onChangeText={setSender}
          placeholder="Ex. : Impôts, EDF, école…"
          placeholderTextColor={c.muted}
          style={styles.input}
          autoFocus
          onSubmitEditing={() => {
            integrationActions.addSender(sender);
            setSender('');
            close();
          }}
        />
        <PrimaryButton
          label="Ajouter"
          icon="add"
          disabled={!sender.trim()}
          onPress={() => {
            integrationActions.addSender(sender);
            setToast({ text: `${sender.trim()} ajouté aux expéditeurs autorisés` });
            setSender('');
            close();
          }}
        />
      </BottomSheet>

      {/* Déconnecter un compte */}
      <BottomSheet
        visible={!!sheetDisconnect}
        title={sheetDisconnect ? `Déconnecter ${ACCOUNTS[sheetDisconnect].name} ?` : ''}
        subtitle={sheetDisconnect ? DISCONNECT_EFFECT[sheetDisconnect] : undefined}
        onClose={close}>
        <SecondaryButton
          label="Déconnecter"
          icon="link_off"
          danger
          onPress={() => {
            if (!sheetDisconnect) return;
            // Pas d'« Annuler » : se reconnecter demande une nouvelle autorisation chez le fournisseur.
            integrationActions.setConnected(sheetDisconnect, false);
            setToast({ text: DISCONNECTED_TOAST[sheetDisconnect] });
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

function TodoRow({ icon, tint, title, count, onPress }: { icon: string; tint: string; title: string; count: number; onPress: () => void }) {
  const { c, styles } = useLook();
  return (
    <Pressable style={({ pressed }) => [styles.todoRow, pressed && styles.rowPressed]} accessibilityRole="button" onPress={onPress}>
      <View style={[styles.todoIcon, { backgroundColor: tint }]}>
        <Icon name={icon} size={20} color="#FFFFFF" filled />
      </View>
      <Text style={styles.todoTitle}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
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
    content: {
      paddingTop: 0,
      paddingBottom: 40,
    },
    syncLine: {
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
    card: {
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    firstCard: {
      marginTop: 12,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginLeft: 66,
      backgroundColor: c.divider,
    },
    rowPressed: {
      opacity: 0.7,
    },
    todoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    todoIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todoTitle: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    badge: {
      minWidth: 26,
      height: 26,
      paddingHorizontal: 8,
      borderRadius: Radius.full,
      backgroundColor: c.tintAmber,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.amberText,
    },
    accountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountName: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    accountDetail: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    empty: {
      padding: 16,
      fontFamily: FontFamily.body,
      fontSize: 14,
      color: c.muted,
    },
    connect: {
      height: 36,
      paddingHorizontal: 14,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderColor: c.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
    connectText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    senders: {
      gap: 8,
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.divider,
    },
    sendersLabel: {
      paddingHorizontal: 14,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    senderRow: {
      gap: 8,
      paddingHorizontal: 14,
    },
    segmentWrap: {
      padding: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.divider,
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
      paddingVertical: 8,
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
    segmentHint: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    segmentHintOn: {
      color: c.solidText,
      opacity: 0.8,
    },
    privacy: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 24,
      paddingHorizontal: Space.gutter,
    },
    privacyText: {
      flexShrink: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
      textAlign: 'center',
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
      color: c.text,
    },
    input: {
      height: 52,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
