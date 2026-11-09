// S-24 - Connexions externes | Module M11 Intégrations | Phase S10
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type AccountKey = 'gmail' | 'gcal' | 'outlook';

type Account = {
  key: AccountKey;
  name: string;
  detail: string;
  icon: string;
  connected: boolean;
  permissions: string[];
};

const INITIAL_ACCOUNTS: Account[] = [
  {
    key: 'gmail',
    name: 'Gmail',
    detail: 'claire.martin@gmail.com',
    icon: 'mail',
    connected: true,
    permissions: ['Lire les e-mails entrants', 'Extraire les dates et montants', 'Détecter les pièces jointes'],
  },
  {
    key: 'gcal',
    name: 'Google Agenda',
    detail: 'claire.martin@gmail.com',
    icon: 'event',
    connected: true,
    permissions: ['Lire les événements', 'Créer des événements', 'Synchroniser les rappels'],
  },
  {
    key: 'outlook',
    name: 'Microsoft Outlook',
    detail: 'Non connecté',
    icon: 'alternate_email',
    connected: false,
    permissions: ['Lire les e-mails entrants', 'Détecter les pièces jointes'],
  },
];

export default function ConnectedAccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [syncEnabled, setSyncEnabled] = useState<Record<AccountKey, boolean>>({
    gmail: true,
    gcal: true,
    outlook: false,
  });
  const [expanded, setExpanded] = useState<AccountKey | null>('gmail');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Il y a 12 min');

  const connectedCount = accounts.filter((account) => account.connected).length;

  const toggleConnection = (key: AccountKey) => {
    setAccounts((current) =>
      current.map((account) =>
        account.key === key
          ? {
              ...account,
              connected: !account.connected,
              detail: !account.connected
                ? account.key === 'outlook'
                  ? 'claire.martin@outlook.fr'
                  : account.detail
                : 'Non connecté',
            }
          : account,
      ),
    );
    if (key === 'outlook') {
      setSyncEnabled((current) => ({ ...current, outlook: true }));
    }
  };

  const runSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("À l'instant");
    }, 1400);
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
        <Text style={styles.headerTitle}>Connexions externes</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Icon name="cable" size={24} color={Serene.secondary} />
          </View>
          <View style={styles.heroBody}>
            <Text style={styles.heroTitle}>{connectedCount} comptes connectés</Text>
            <Text style={styles.heroText}>
              Importez automatiquement vos e-mails et événements dans Bringo Mind.
            </Text>
          </View>
        </View>

        <View style={styles.syncCard}>
          <View style={styles.syncLeft}>
            <Icon name="sync" size={18} color={Serene.onSurfaceVariant} />
            <View>
              <Text style={styles.syncTitle}>Dernière synchronisation</Text>
              <Text style={styles.syncText}>{lastSync}</Text>
            </View>
          </View>
          <Pressable
            style={[styles.syncButton, syncing && styles.syncButtonActive]}
            onPress={runSync}
            disabled={syncing}>
            <Icon
              name={syncing ? 'hourglass_top' : 'refresh'}
              size={15}
              color={Serene.onSecondary}
            />
            <Text style={styles.syncButtonText}>
              {syncing ? 'Synchronisation...' : 'Synchroniser'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Comptes et autorisations</Text>

        <View style={styles.list}>
          {accounts.map((account) => {
            const isExpanded = expanded === account.key;

            return (
              <View key={account.key} style={styles.accountCard}>
                <View style={styles.accountRow}>
                  <View
                    style={[
                      styles.accountIcon,
                      account.connected ? styles.accountIconConnected : styles.accountIconOff,
                    ]}>
                    <Icon
                      name={account.icon}
                      size={20}
                      color={account.connected ? Serene.secondary : Serene.onSurfaceVariant}
                    />
                  </View>
                  <View style={styles.accountBody}>
                    <View style={styles.accountNameRow}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      {account.connected ? (
                        <View style={styles.connectedPill}>
                          <View style={styles.connectedDot} />
                          <Text style={styles.connectedText}>Connecté</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.accountDetail} numberOfLines={1}>
                      {account.detail}
                    </Text>
                  </View>

                  {account.connected ? (
                    <Switch
                      value={syncEnabled[account.key]}
                      onValueChange={(value) =>
                        setSyncEnabled((current) => ({ ...current, [account.key]: value }))
                      }
                      trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
                      thumbColor={Serene.surfaceContainerLowest}
                    />
                  ) : (
                    <Pressable
                      style={styles.connectButton}
                      onPress={() => toggleConnection(account.key)}>
                      <Text style={styles.connectButtonText}>Connecter</Text>
                    </Pressable>
                  )}
                </View>

                {account.connected ? (
                  <>
                    <Pressable
                      style={styles.permissionsToggle}
                      onPress={() =>
                        setExpanded((current) =>
                          current === account.key ? null : account.key,
                        )
                      }
                      accessibilityRole="button">
                      <Icon name="key" size={15} color={Serene.onSurfaceVariant} />
                      <Text style={styles.permissionsToggleText}>
                        Gérer les autorisations ({account.permissions.length})
                      </Text>
                      <Icon
                        name={isExpanded ? 'expand_less' : 'expand_more'}
                        size={18}
                        color={Serene.onSurfaceVariant}
                      />
                    </Pressable>

                    {isExpanded ? (
                      <View style={styles.permissionsList}>
                        {account.permissions.map((permission) => (
                          <PermissionRow key={permission} label={permission} />
                        ))}
                        <Pressable
                          style={styles.disconnectButton}
                          onPress={() => toggleConnection(account.key)}>
                          <Icon name="link_off" size={15} color={Serene.error} />
                          <Text style={styles.disconnectText}>Déconnecter ce compte</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </>
                ) : null}
              </View>
            );
          })}
        </View>

        <Pressable
          style={styles.emailPreview}
          accessibilityRole="button"
          onPress={() => router.push('/integrations/email')}>
          <View style={styles.emailPreviewIcon}>
            <Icon name="mark_email_unread" size={20} color={Serene.onSecondaryContainer} />
          </View>
          <View style={styles.emailPreviewBody}>
            <Text style={styles.emailPreviewTitle}>Voir un e-mail importé</Text>
            <Text style={styles.emailPreviewText}>
              Exemple d’extraction IA depuis votre boîte de réception
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color={Serene.onSecondaryContainer} />
        </Pressable>

        <View style={styles.privacyCard}>
          <Icon name="shield" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Bringo Mind n’accède qu’aux données nécessaires. Vous pouvez révoquer l’accès à tout
            moment ; les jetons sont chiffrés et jamais partagés.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PermissionRow({ label }: { label: string }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <Pressable
      style={styles.permissionRow}
      onPress={() => setEnabled((value) => !value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: enabled }}>
      <View style={[styles.permissionCheckbox, enabled && styles.permissionCheckboxActive]}>
        {enabled ? <Icon name="check" size={11} color={Serene.onPrimary} /> : null}
      </View>
      <Text style={styles.permissionText}>{label}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurface,
  },
  syncText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
  },
  syncButtonActive: {
    backgroundColor: Serene.secondary,
  },
  syncButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onPrimary,
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
  list: {
    gap: 10,
  },
  accountCard: {
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountIconConnected: {
    backgroundColor: Serene.secondaryContainer,
  },
  accountIconOff: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  accountBody: {
    flex: 1,
    minWidth: 0,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  connectedDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.success,
  },
  connectedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 9,
    lineHeight: 13,
    color: Serene.success,
  },
  accountDetail: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  connectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
  },
  connectButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onPrimary,
  },
  permissionsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  permissionsToggleText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  permissionsList: {
    gap: 2,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  permissionCheckbox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionCheckboxActive: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  permissionText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingVertical: 6,
  },
  disconnectText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.error,
  },
  emailPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.secondaryContainer,
  },
  emailPreviewIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailPreviewBody: {
    flex: 1,
    minWidth: 0,
  },
  emailPreviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondaryContainer,
  },
  emailPreviewText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSecondaryContainer,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
});
