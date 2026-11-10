// S-31 - Abonnement | Module M15 Facturation | Phase S12 (prestataire de paiement : décision D-05 ouverte)
// Offre actuelle, utilisation, comparaison claire, factures, et résiliation transparente et réversible.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, PrimaryButton, SecondaryButton, Tag, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection } from '@/components/ui/settings';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

type PlanKey = 'free' | 'premium' | 'family';
type Cycle = 'monthly' | 'yearly';

const PLANS: Record<PlanKey, { name: string; monthly: string; yearly: string; perks: string[] }> = {
  free: {
    name: 'Gratuit',
    monthly: '0 €',
    yearly: '0 €',
    perks: ['Tâches, rappels et calendrier', '20 documents', 'Kora : 10 questions par mois'],
  },
  premium: {
    name: 'Premium',
    monthly: '9,99 €',
    yearly: '99,90 €',
    perks: ['Documents illimités', 'Kora illimitée et commande vocale', 'Messagerie et calendrier connectés', 'Foyer jusqu’à 4 membres'],
  },
  family: {
    name: 'Famille',
    monthly: '14,99 €',
    yearly: '149,90 €',
    perks: ['Tout Premium', 'Foyer jusqu’à 8 membres', 'Comptes enfants encadrés', 'Coffre partagé de 50 Go'],
  },
};

const INVOICES = [
  { id: 'f-mai', date: '9 mai 2024', amount: '9,99 €' },
  { id: 'f-avr', date: '9 avril 2024', amount: '9,99 €' },
  { id: 'f-mar', date: '9 mars 2024', amount: '9,99 €' },
];

const USAGE = [
  { label: 'Documents', value: '12', limit: 'illimités', ratio: 0.3 },
  { label: 'Questions à Kora ce mois', value: '34', limit: 'illimitées', ratio: 0.45 },
  { label: 'Membres du foyer', value: '3', limit: 'sur 4', ratio: 0.75 },
];

export default function SubscriptionScreen() {
  const [current, setCurrent] = useState<PlanKey>('premium');
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const [cancelled, setCancelled] = useState(false);
  const [sheet, setSheet] = useState<{ change: PlanKey } | 'cancel' | 'card' | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  const plan = PLANS[current];
  const price = (key: PlanKey) => (cycle === 'monthly' ? `${PLANS[key].monthly} / mois` : `${PLANS[key].yearly} / an`);
  const close = () => setSheet(null);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Abonnement" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {cancelled ? (
          <View style={styles.banner}>
            <Icon name="event_busy" size={22} color="#92400e" />
            <View style={styles.flex}>
              <Text style={styles.bannerTitle}>Résiliation prévue le 9 juin</Text>
              <Text style={styles.bannerText}>Vous gardez {plan.name} jusque-là, puis vous passerez à l’offre Gratuite.</Text>
            </View>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => {
                setCancelled(false);
                setToast({ text: `Abonnement ${plan.name} conservé` });
              }}>
              <Text style={styles.bannerAction}>Reprendre</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Offre actuelle */}
        <View style={styles.current}>
          <View style={styles.currentTop}>
            <View style={styles.flex}>
              <Text style={styles.currentLabel}>Votre offre</Text>
              <Text style={styles.currentName}>Bringo Mind {plan.name}</Text>
            </View>
            <Tag label={cancelled ? 'Se termine le 9 juin' : 'Active'} tone={cancelled ? 'neutral' : 'success'} icon={cancelled ? 'schedule' : 'check'} />
          </View>
          <Text style={styles.currentPrice}>{PLANS[current].monthly}<Text style={styles.currentPer}> / mois</Text></Text>
          <Text style={styles.currentMeta}>
            {current === 'free' ? 'Sans engagement' : cancelled ? 'Aucun prochain prélèvement' : 'Prochain prélèvement le 9 juin • sans engagement'}
          </Text>
        </View>

        <SettingsSection title="Utilisation ce mois-ci" icon="insights">
          {USAGE.map((entry, index) => (
            <View key={entry.label} style={[styles.usage, index > 0 && styles.usageBorder]}>
              <View style={styles.usageTop}>
                <Text style={styles.usageLabel}>{entry.label}</Text>
                <Text style={styles.usageValue}>
                  {entry.value} <Text style={styles.usageLimit}>{entry.limit}</Text>
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.round(entry.ratio * 100)}%` }]} />
              </View>
            </View>
          ))}
        </SettingsSection>

        {/* Comparer les offres */}
        <View style={styles.compareHead}>
          <Text style={styles.sectionTitle}>Comparer les offres</Text>
        </View>
        <View style={styles.cycle}>
          <Chip label="Mensuel" selected={cycle === 'monthly'} onPress={() => setCycle('monthly')} />
          <Chip label="Annuel • 2 mois offerts" selected={cycle === 'yearly'} onPress={() => setCycle('yearly')} />
        </View>
        <View style={styles.plans}>
          {(Object.keys(PLANS) as PlanKey[]).map((key) => {
            const isCurrent = key === current;
            return (
              <View key={key} style={[styles.plan, isCurrent && styles.planCurrent]}>
                <View style={styles.planTop}>
                  <Text style={styles.planName}>{PLANS[key].name}</Text>
                  {isCurrent ? <Tag label="Votre offre" tone="teal" /> : key === 'family' ? <Tag label="Pour tout le foyer" /> : null}
                </View>
                <Text style={styles.planPrice}>{price(key)}</Text>
                {PLANS[key].perks.map((perk) => (
                  <View key={perk} style={styles.perk}>
                    <Icon name="check" size={18} color={Tint.primary} />
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
                {!isCurrent ? (
                  <SecondaryButton
                    label={key === 'free' ? 'Passer à Gratuit' : `Passer à ${PLANS[key].name}`}
                    style={styles.planButton}
                    onPress={() => setSheet({ change: key })}
                  />
                ) : null}
              </View>
            );
          })}
        </View>

        <SettingsSection title="Paiement" icon="credit_card">
          <SettingsRow first icon="credit_card" title="Carte Visa •••• 4242" subtitle="Expire en août 2027" onPress={() => setSheet('card')} />
        </SettingsSection>

        <SettingsSection title="Factures" icon="receipt_long" footer="Chaque facture est aussi envoyée à claire.martin@email.fr.">
          {INVOICES.map((invoice, index) => (
            <SettingsRow
              key={invoice.id}
              first={index === 0}
              icon="description"
              title={`Premium mensuel • ${invoice.amount}`}
              subtitle={`Payée le ${invoice.date}`}
              onPress={() => setToast({ text: `Démo : facture du ${invoice.date} téléchargée` })}
              right={<Icon name="download" size={20} color={Serene.onSurfaceVariant} />}
            />
          ))}
        </SettingsSection>

        {current !== 'free' && !cancelled ? (
          <SecondaryButton label="Résilier l’abonnement" danger style={styles.cancel} onPress={() => setSheet('cancel')} />
        ) : null}
        <Text style={styles.legal}>Paiement sécurisé. Résiliable à tout moment, sans frais.</Text>
      </ScrollView>

      {/* Changer d'offre */}
      <BottomSheet
        visible={typeof sheet === 'object' && sheet !== null}
        title={typeof sheet === 'object' && sheet ? `Passer à ${PLANS[sheet.change].name} ?` : ''}
        subtitle={
          typeof sheet === 'object' && sheet
            ? sheet.change === 'free'
              ? 'Vous gardez vos données. Au-delà de 20 documents, les nouveaux ne pourront plus être ajoutés.'
              : `Nouveau tarif : ${price(sheet.change)}, appliqué au prochain prélèvement le 9 juin.`
            : undefined
        }
        onClose={close}>
        <PrimaryButton
          label="Confirmer le changement"
          icon="check"
          onPress={() => {
            if (typeof sheet !== 'object' || !sheet) return;
            const previous = current;
            setCurrent(sheet.change);
            setCancelled(false);
            close();
            setToast({ text: `Offre ${PLANS[sheet.change].name} choisie`, undo: () => setCurrent(previous) });
          }}
        />
        <SecondaryButton label="Garder mon offre" onPress={close} />
      </BottomSheet>

      {/* Résilier : ce qui se passe, clairement */}
      <BottomSheet visible={sheet === 'cancel'} title="Résilier votre abonnement ?" subtitle={`Vous gardez ${plan.name} jusqu’au 9 juin.`} onClose={close}>
        {[
          { icon: 'check', text: 'Vos tâches, rappels, événements et documents sont conservés' },
          { icon: 'remove', text: 'Kora et les connexions externes seront limitées' },
          { icon: 'replay', text: 'Vous pouvez reprendre votre abonnement à tout moment' },
        ].map((line) => (
          <View key={line.text} style={styles.cancelLine}>
            <Icon name={line.icon} size={20} color={line.icon === 'remove' ? Serene.error : Tint.primary} />
            <Text style={styles.cancelText}>{line.text}</Text>
          </View>
        ))}
        <SecondaryButton
          label="Résilier"
          danger
          onPress={() => {
            setCancelled(true);
            close();
            setToast({ text: 'Résiliation enregistrée', undo: () => setCancelled(false) });
          }}
        />
        <SecondaryButton label={`Garder ${plan.name}`} onPress={close} />
      </BottomSheet>

      {/* Carte : la saisie se fait chez le prestataire de paiement */}
      <BottomSheet
        visible={sheet === 'card'}
        title="Moyen de paiement"
        subtitle="Pour votre sécurité, la carte se modifie sur la page sécurisée de notre prestataire de paiement."
        onClose={close}>
        <PrimaryButton
          label="Ouvrir la page sécurisée"
          icon="open_in_new"
          onPress={() => {
            close();
            setToast({ text: 'Démo : ouverture de la page de paiement sécurisée' });
          }}
        />
        <SecondaryButton label="Plus tard" onPress={close} />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  bannerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: '#92400e',
  },
  bannerText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
  },
  bannerAction: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  current: {
    padding: 20,
    gap: 6,
    borderRadius: 24,
    backgroundColor: Tint.black,
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  currentLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Tint.glow,
  },
  currentName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Serene.onPrimary,
  },
  currentPrice: {
    marginTop: 6,
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    lineHeight: 40,
    color: Serene.onPrimary,
  },
  currentPer: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: '#cbd5e1',
  },
  currentMeta: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: '#cbd5e1',
  },
  usage: {
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  usageBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  usageTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  usageLabel: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  usageValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  usageLimit: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: Serene.onSurfaceVariant,
  },
  track: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },
  compareHead: {
    marginTop: 26,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  cycle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  plans: {
    gap: 12,
    marginTop: 12,
  },
  plan: {
    gap: 8,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  planCurrent: {
    borderWidth: 2,
    borderColor: Tint.black,
    padding: 15,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  planName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 19,
    lineHeight: 25,
    color: Tint.navy,
  },
  planPrice: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.primary,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  planButton: {
    marginTop: 6,
  },
  cancel: {
    marginTop: 24,
  },
  legal: {
    marginTop: 12,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  cancelLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
});
