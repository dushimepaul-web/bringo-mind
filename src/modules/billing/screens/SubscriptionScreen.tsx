// S-31 - Abonnement & facturation | Module M17 Abonnement | Phase S10
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type Plan = 'premium' | 'famille';

const INVOICES = [
  { date: '9 mai 2024', amount: '9,99 €', label: 'Premium mensuel' },
  { date: '9 avril 2024', amount: '9,99 €', label: 'Premium mensuel' },
  { date: '9 mars 2024', amount: '9,99 €', label: 'Premium mensuel' },
];

const PREMIUM_FEATURES = [
  'Documents illimités analysés par Kora',
  '1 000 requêtes IA par mois',
  'Synchronisation multi-comptes',
  'Support prioritaire',
];

const FAMILY_FEATURES = [
  'Tout Premium pour 5 membres',
  'Documents et tâches partagés',
  '3 000 requêtes IA par mois',
  'Espace foyer avancé + historique',
];

export default function SubscriptionScreen() {
  const [plan, setPlan] = useState<Plan>('premium');
  const [upgraded, setUpgraded] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);

  const upgrade = () => {
    setPlan('famille');
    setUpgraded(true);
    setCancelConfirm(false);
    setCancelRequested(false);
  };

  const confirmCancel = () => {
    setCancelRequested(true);
    setCancelConfirm(false);
  };

  const price = plan === 'famille' ? '14,99 €' : '9,99 €';

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
        <Text style={styles.headerTitle}>Abonnement</Text>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={() => router.back()}>
          <Icon name="close" size={22} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.currentCard}>
          <View style={styles.currentTop}>
            <View style={styles.currentBadge}>
              <Icon name="workspace_premium" size={15} color={Serene.onPrimary} />
              <Text style={styles.currentBadgeText}>
                {plan === 'famille' ? 'Famille' : 'Premium'}
              </Text>
            </View>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>
                {cancelRequested ? 'Résiliation programmée' : 'Actif'}
              </Text>
            </View>
          </View>

          <Text style={styles.currentPrice}>{price}</Text>
          <Text style={styles.currentPeriod}>par mois • sans engagement</Text>

          <View style={styles.currentDivider} />

          <View style={styles.currentRow}>
            <Icon name="event_repeat" size={15} color={Serene.onSecondaryContainer} />
            <Text style={styles.currentRowText}>
              {cancelRequested
                ? 'Accès conservé jusqu’au 9 juin 2024'
                : 'Prochain paiement le 9 juin 2024'}
            </Text>
          </View>
          <View style={styles.currentRow}>
            <Icon name="credit_card" size={15} color={Serene.onSecondaryContainer} />
            <Text style={styles.currentRowText}>Visa •••• 4242</Text>
          </View>
        </View>

        {upgraded ? (
          <View style={styles.successBanner}>
            <Icon name="check_circle" size={18} color={Serene.success} />
            <Text style={styles.successText}>
              Passage au plan Famille confirmé. Le nouveau tarif s’appliquera au prochain cycle.
            </Text>
          </View>
        ) : null}

        <View style={styles.usageCard}>
          <Text style={styles.cardTitle}>Utilisation ce mois-ci</Text>
          <UsageBar label="Documents analysés" value={128} max={500} unit="documents" />
          <UsageBar label="Requêtes IA" value={340} max={plan === 'famille' ? 3000 : 1000} unit="requêtes" />
          <UsageBar label="Membres du foyer" value={3} max={5} unit="membres" />
        </View>

        <Text style={styles.sectionLabel}>Comparer les offres</Text>

        <View style={styles.plans}>
          <PlanCard
            title="Premium"
            price="9,99 €"
            features={PREMIUM_FEATURES}
            current={plan === 'premium'}
            onSelect={() => {
              setPlan('premium');
              setUpgraded(false);
            }}
          />
          <PlanCard
            title="Famille"
            price="14,99 €"
            features={FAMILY_FEATURES}
            current={plan === 'famille'}
            highlight
            onSelect={upgrade}
          />
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Moyen de paiement</Text>
          <View style={styles.paymentRow}>
            <View style={styles.paymentIcon}>
              <Icon name="credit_card" size={19} color={Serene.onSurface} />
            </View>
            <View style={styles.paymentBody}>
              <Text style={styles.paymentName}>Visa •••• 4242</Text>
              <Text style={styles.paymentMeta}>Expire le 08/27</Text>
            </View>
            <Pressable style={styles.paymentAction}>
              <Text style={styles.paymentActionText}>Modifier</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.invoicesCard}>
          <View style={styles.invoicesHeader}>
            <Text style={styles.cardTitle}>Historique de facturation</Text>
            <Pressable>
              <Text style={styles.seeAll}>Tout voir</Text>
            </Pressable>
          </View>
          {INVOICES.map((invoice, index) => (
            <View key={invoice.date}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable style={styles.invoiceRow}>
                <View style={styles.invoiceIcon}>
                  <Icon name="receipt_long" size={17} color={Serene.onSurfaceVariant} />
                </View>
                <View style={styles.invoiceBody}>
                  <Text style={styles.invoiceLabel}>{invoice.label}</Text>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                </View>
                <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
                <Icon name="download" size={17} color={Serene.onSurfaceVariant} />
              </Pressable>
            </View>
          ))}
        </View>

        {cancelRequested ? (
          <View style={styles.cancelBanner}>
            <Icon name="info" size={17} color={Serene.warning} />
            <View style={styles.cancelBannerBody}>
              <Text style={styles.cancelBannerTitle}>Résiliation enregistrée</Text>
              <Text style={styles.cancelBannerText}>
                Votre accès Premium reste actif jusqu’au 9 juin 2024. Aucun prélèvement ne sera
                effectué après cette date.
              </Text>
              <Pressable onPress={() => setCancelRequested(false)}>
                <Text style={styles.cancelUndo}>Reprendre mon abonnement</Text>
              </Pressable>
            </View>
          </View>
        ) : cancelConfirm ? (
          <View style={styles.cancelCard}>
            <Text style={styles.cancelTitle}>Confirmer la résiliation ?</Text>
            <Text style={styles.cancelText}>
              Vous conserverez vos données. Certaines fonctions IA passeront en mode limité à la
              fin de la période.
            </Text>
            <View style={styles.cancelActions}>
              <Pressable style={styles.cancelKeep} onPress={() => setCancelConfirm(false)}>
                <Text style={styles.cancelKeepText}>Conserver</Text>
              </Pressable>
              <Pressable style={styles.cancelConfirmButton} onPress={confirmCancel}>
                <Text style={styles.cancelConfirmText}>Résilier</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.cancelLink}
            accessibilityRole="button"
            onPress={() => setCancelConfirm(true)}>
            <Text style={styles.cancelLinkText}>Résilier l’abonnement</Text>
          </Pressable>
        )}

        <Text style={styles.legal}>
          Paiement sécurisé. Les abonnements se renouvellent automatiquement et peuvent être
          résiliés à tout moment depuis cet écran.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function UsageBar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const ratio = Math.min(1, value / max);
  const critical = ratio >= 0.8;

  return (
    <View style={styles.usageBlock}>
      <View style={styles.usageHeader}>
        <Text style={styles.usageLabel}>{label}</Text>
        <Text style={[styles.usageValue, critical && styles.usageValueCritical]}>
          {value}/{max} {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${ratio * 100}%` },
            critical ? styles.fillCritical : styles.fillNormal,
          ]}
        />
      </View>
    </View>
  );
}

function PlanCard({
  title,
  price,
  features,
  current,
  highlight,
  onSelect,
}: {
  title: string;
  price: string;
  features: string[];
  current: boolean;
  highlight?: boolean;
  onSelect: () => void;
}) {
  return (
    <View style={[styles.planCard, highlight && styles.planCardHighlight]}>
      {highlight ? (
        <View style={styles.recommendedPill}>
          <Text style={styles.recommendedText}>Recommandé</Text>
        </View>
      ) : null}
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <Text style={styles.planPeriod}>/ mois</Text>

      <View style={styles.planFeatures}>
        {features.map((feature) => (
          <View key={feature} style={styles.planFeatureRow}>
            <Icon name="check_circle" size={14} color={Serene.secondary} />
            <Text style={styles.planFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.planButton, current ? styles.planButtonCurrent : styles.planButtonActive]}
        onPress={onSelect}
        disabled={current}
        accessibilityRole="button">
        <Text style={current ? styles.planButtonCurrentText : styles.planButtonText}>
          {current ? 'Offre actuelle' : 'Choisir cette offre'}
        </Text>
      </Pressable>
    </View>
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
  currentCard: {
    padding: 16,
    borderRadius: Radius.xl,
    backgroundColor: Serene.secondaryContainer,
    ...Shadow.card,
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
  },
  currentBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onPrimary,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.success,
  },
  activeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSecondaryContainer,
  },
  currentPrice: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    lineHeight: 40,
    color: Serene.onSecondaryContainer,
    marginTop: 12,
  },
  currentPeriod: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSecondaryContainer,
  },
  currentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.onSecondaryContainer,
    opacity: 0.15,
    marginVertical: 12,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  currentRowText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSecondaryContainer,
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
  usageCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  usageBlock: {
    marginTop: 12,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  usageLabel: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  usageValue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurface,
  },
  usageValueCritical: {
    color: Serene.error,
  },
  track: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  fillNormal: {
    backgroundColor: Serene.secondary,
  },
  fillCritical: {
    backgroundColor: Serene.error,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.xs,
  },
  plans: {
    gap: 10,
  },
  planCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Serene.surfaceContainerHigh,
  },
  planCardHighlight: {
    borderColor: Serene.secondary,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  recommendedPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    marginBottom: 6,
  },
  recommendedText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSecondaryContainer,
  },
  planTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  planPrice: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 30,
    color: Serene.onSurface,
    marginTop: 2,
  },
  planPeriod: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    marginBottom: 8,
  },
  planFeatures: {
    gap: 6,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  planFeatureText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurface,
  },
  planButton: {
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  planButtonActive: {
    backgroundColor: Serene.primary,
  },
  planButtonCurrent: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  planButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  planButtonCurrentText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  paymentCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentBody: {
    flex: 1,
  },
  paymentName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  paymentMeta: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  paymentAction: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  paymentActionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurface,
  },
  invoicesCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  invoicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  seeAll: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.secondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
  },
  invoiceIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceBody: {
    flex: 1,
  },
  invoiceLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  invoiceDate: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  invoiceAmount: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  cancelBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.warningContainer,
  },
  cancelBannerBody: {
    flex: 1,
  },
  cancelBannerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.warning,
  },
  cancelBannerText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.warning,
    marginTop: 2,
  },
  cancelUndo: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.warning,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  cancelCard: {
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.errorContainer,
  },
  cancelTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
  cancelText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.error,
    marginTop: 3,
  },
  cancelActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  cancelKeep: {
    flex: 1,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelKeepText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  cancelConfirmButton: {
    flex: 1,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Serene.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onPrimary,
  },
  cancelLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  cancelLinkText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.error,
  },
  legal: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
});
