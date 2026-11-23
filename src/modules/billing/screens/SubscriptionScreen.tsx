// S-31 - Abonnement | Module M15 Facturation | Phase S12 (prestataire de paiement : décision D-05 ouverte)
// Comme la page « Abonnements » du store du téléphone : carte de l'offre avec « Gérer », utilisation en tuiles,
// offres sur une ligne qui défile, paiement et factures groupés. Résiliation transparente et réversible.
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewInstance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/icon";
import { TURQUOISE } from "@/components/rings";
import {
  BottomSheet,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  TopBar,
  UndoToast,
  useKitStyles,
} from "@/components/ui/kit";
import {
  DARK,
  LIGHT,
  useScopedColors,
  type AppColors,
} from "@/constants/app-colors";
import { FontFamily, Radius, Space } from "@/constants/design";
import { IS_DEMO } from "@/lib/config";

import { billingActions, syncBilling, useBilling } from "../store";

type Sheet = "manage" | { change: string } | "cancel" | "card" | null;

export default function SubscriptionScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const scroll = useRef<ScrollViewInstance>(null);
  const plansY = useRef(0);
  const billing = useBilling();
  const plans = billing.plans;
  const current = billing.current;
  const plan = plans.find((entry) => entry.code === current);
  const cancelled = billing.cancelAtPeriodEnd;
  const [picked, setPicked] = useState<string | null>(null);
  const [allInvoices, setAllInvoices] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{
    text: string;
    undo?: () => void;
  } | null>(null);

  useEffect(() => {
    if (!IS_DEMO) void syncBilling();
  }, []);

  const price = (key: string) => plans.find((entry) => entry.code === key)?.price ?? "";
  const close = () => setSheet(null);
  const change = typeof sheet === "object" && sheet ? sheet.change : null;
  const invoices = allInvoices ? billing.invoices : billing.invoices.slice(0, 3);

  return (
    <SafeAreaView style={kitStyles.safe} edges={["top"]}>
      <TopBar title="Abonnement" fallback="/profile" />
      <ScrollView
        ref={scroll}
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* Offre actuelle */}
        <View style={styles.card}>
          <View style={styles.offerTop}>
            <BrandLogo
              size={52}
              shadow={false}
              variant={c.dark ? "light" : "dark"}
            />
            <View style={styles.flex}>
              <Text style={styles.offerName}>Bringo Mind {plan?.name ?? "…"}</Text>
              <View style={[styles.pill, cancelled && styles.pillEnding]}>
                <View
                  style={[styles.pillDot, cancelled && styles.pillDotEnding]}
                />
                <Text
                  style={[styles.pillText, cancelled && styles.pillTextEnding]}
                >
                  {cancelled ? "Se termine bientôt" : "Active"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.offerBottom}>
            <View style={styles.flex}>
              <Text style={styles.offerPrice}>
                {plan?.price ?? "—"}
                <Text style={styles.offerPer}> {plan?.per ?? "/ mois"}</Text>
              </Text>
              <Text style={styles.offerMeta}>
                {current === "free"
                  ? "Sans engagement"
                  : cancelled
                    ? "Aucun prochain prélèvement"
                    : "Renouvellement automatique"}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.manage,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              onPress={() => setSheet("manage")}
            >
              <Text style={styles.manageText}>Gérer</Text>
            </Pressable>
          </View>
        </View>

        {/* Utilisation */}
        <Text style={styles.section}>Ce mois-ci</Text>
        <View style={styles.usageRow}>
          {billing.usage.map((entry) => (
            <View key={entry.key} style={styles.usageTile}>
              <View style={[styles.usageIcon, { backgroundColor: entry.tint }]}>
                <Icon name={entry.icon} size={18} color="#FFFFFF" filled />
              </View>
              <Text style={styles.usageValue}>{entry.value}</Text>
              <Text style={styles.usageLabel} numberOfLines={2}>
                {entry.label}
              </Text>
              {entry.ratio ? (
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${Math.round(entry.ratio * 100)}%` },
                    ]}
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>

        {/* Offres */}
        <View
          style={styles.compareHead}
          onLayout={(event) => {
            plansY.current = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionInline}>Offres</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.plansScroll}
          contentContainerStyle={styles.plansRow}
        >
          {plans
            .slice()
            .sort((x, y) => Number(y.code === current) - Number(x.code === current))
            .map((entry) => {
              const isCurrent = entry.code === current;
              const isPicked = picked === entry.code && !isCurrent;
              return (
                <Pressable
                  key={entry.code}
                  style={[
                    styles.plan,
                    (isCurrent || isPicked) && styles.planOn,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Offre ${entry.name}, ${entry.price} ${entry.per}${isCurrent ? ", votre offre" : ""}`}
                  onPress={() => setPicked(entry.code)}
                >
                  <View style={styles.planTop}>
                    <Text style={styles.planName}>{entry.name}</Text>
                    {isCurrent ? (
                      <View style={styles.yours}>
                        <Text style={styles.yoursText}>Votre offre</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.planPrice}>
                    {entry.price}
                    <Text style={styles.planPer}> {entry.per}</Text>
                  </Text>
                  <View style={styles.perks}>
                    {entry.perks.map((perk) => (
                      <View key={perk} style={styles.perk}>
                        <Icon name="check" size={16} color={c.link} />
                        <Text style={styles.perkText}>{perk}</Text>
                      </View>
                    ))}
                  </View>
                  {isPicked ? (
                    <PrimaryButton
                      label={`Passer à ${entry.name}`}
                      onPress={() => setSheet({ change: entry.code })}
                    />
                  ) : null}
                </Pressable>
              );
            })}
        </ScrollView>

        {/* Paiement */}
        <Text style={styles.section}>Paiement</Text>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.row,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          onPress={() => setSheet("card")}
        >
          <View style={styles.cardLogo}>
            <Text style={styles.cardLogoText}>VISA</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.rowTitle}>Visa •••• 4242</Text>
            <Text style={styles.rowMeta}>Expire en août 2027</Text>
          </View>
          <Icon name="chevron_right" size={22} color={c.muted} />
        </Pressable>

        {/* Factures */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionInline}>Factures</Text>
          {billing.invoices.length > 3 ? (
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => setAllInvoices((value) => !value)}
            >
              <Text style={styles.link}>
                {allInvoices ? "Réduire" : "Voir toutes"}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.card}>
          {invoices.length ? (
            invoices.map((invoice, index) => (
              <Fragment key={invoice.id}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <Pressable
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Télécharger la facture de ${invoice.month}`}
                  onPress={() =>
                    setToast({
                      text: `Facture du ${invoice.date} téléchargée`,
                    })
                  }
                >
                  <View style={styles.flex}>
                    <Text style={styles.rowTitle}>{invoice.month}</Text>
                    <Text style={styles.rowMeta}>
                      {invoice.date ? `Payée le ${invoice.date}` : ""}
                    </Text>
                  </View>
                  <Text style={styles.amount}>{invoice.amount}</Text>
                  <Icon name="download" size={20} color={c.muted} />
                </Pressable>
              </Fragment>
            ))
          ) : (
            <Text style={styles.rowMeta}>Aucune facture pour le moment.</Text>
          )}
        </View>
        <Text style={styles.note}>Factures aussi envoyées par e-mail.</Text>

        <View style={styles.legal}>
          <Icon name="lock" size={14} color={c.muted} />
          <Text style={styles.note}>
            Paiement sécurisé • résiliable sans frais
          </Text>
        </View>
      </ScrollView>

      {/* Gérer : changer d'offre, paiement, et « Résilier » tout en bas */}
      <BottomSheet
        visible={sheet === "manage"}
        title={`Bringo Mind ${plan?.name ?? ""}`}
        subtitle={`${plan?.price ?? ""} ${plan?.per ?? ""}`}
        onClose={close}
      >
        <SheetOption
          icon="swap_horiz"
          label="Changer d’offre"
          onPress={() => {
            close();
            scroll.current?.scrollTo({
              y: plansY.current - 12,
              animated: true,
            });
          }}
        />
        <SheetOption
          icon="credit_card"
          label="Moyen de paiement"
          onPress={() => setSheet("card")}
        />
        {current !== "free" ? (
          cancelled ? (
            <SheetOption
              icon="replay"
              label="Reprendre l’abonnement"
              onPress={() => {
                close();
                void billingActions.resume();
                setToast({ text: `Abonnement ${plan?.name ?? ""} conservé` });
              }}
            />
          ) : (
            <SheetOption
              icon="cancel"
              label="Résilier"
              danger
              onPress={() => setSheet("cancel")}
            />
          )
        ) : null}
      </BottomSheet>

      {/* Changer d'offre */}
      <BottomSheet
        visible={!!change}
        title={change ? `Passer à ${plans.find((p) => p.code === change)?.name ?? ""} ?` : ""}
        subtitle={
          change
            ? change === "free"
              ? "Vous gardez vos données. Au-delà de votre quota, les nouveaux documents ne pourront plus être ajoutés."
              : `Nouveau tarif : ${price(change)} ${plans.find((p) => p.code === change)?.per ?? ""}, appliqué au prochain prélèvement.`
            : undefined
        }
        onClose={close}
      >
        <PrimaryButton
          label="Confirmer le changement"
          icon="check"
          onPress={() => {
            if (!change) return;
            void billingActions.change(change);
            setPicked(null);
            close();
            setToast({
              text: `Offre ${plans.find((p) => p.code === change)?.name ?? ""} choisie`,
            });
          }}
        />
        <SecondaryButton label="Garder mon offre" onPress={close} />
      </BottomSheet>

      {/* Résilier : ce qui se passe, clairement */}
      <BottomSheet
        visible={sheet === "cancel"}
        title="Résilier votre abonnement ?"
        subtitle={`Vous gardez ${plan?.name ?? ""} jusqu’à la fin de la période en cours.`}
        onClose={close}
      >
        {[
          {
            icon: "check",
            text: "Vos tâches, rappels, événements et documents sont conservés",
          },
          {
            icon: "remove",
            text: "Kora et les connexions externes seront limitées",
          },
          {
            icon: "replay",
            text: "Vous pouvez reprendre votre abonnement à tout moment",
          },
        ].map((line) => (
          <View key={line.text} style={styles.cancelLine}>
            <Icon
              name={line.icon}
              size={20}
              color={line.icon === "remove" ? c.error : c.link}
            />
            <Text style={styles.cancelText}>{line.text}</Text>
          </View>
        ))}
        <SecondaryButton
          label="Résilier"
          danger
          onPress={() => {
            void billingActions.cancel();
            close();
            setToast({ text: "Résiliation enregistrée" });
          }}
        />
        <SecondaryButton label={`Garder ${plan?.name ?? ""}`} onPress={close} />
      </BottomSheet>

      {/* Carte : la saisie se fait chez le prestataire de paiement */}
      <BottomSheet
        visible={sheet === "card"}
        title="Moyen de paiement"
        subtitle="Pour votre sécurité, la carte se modifie sur la page sécurisée de notre prestataire de paiement."
        onClose={close}
      >
        <PrimaryButton
          label="Ouvrir la page sécurisée"
          icon="open_in_new"
          onPress={() => {
            close();
            setToast({
              text: "Ouverture de la page de paiement sécurisée",
            });
          }}
        />
        <SecondaryButton label="Plus tard" onPress={close} />
      </BottomSheet>

      {toast ? (
        <UndoToast
          key={toast.text}
          text={toast.text}
          onUndo={toast.undo}
          onHide={() => setToast(null)}
          bottom={24}
        />
      ) : null}
    </SafeAreaView>
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
    card: {
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    offerTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
    },
    offerName: {
      fontFamily: FontFamily.headingBold,
      fontSize: 19,
      lineHeight: 25,
      color: c.text,
    },
    pill: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: Radius.full,
      backgroundColor: c.dark ? "#0E3B3A" : "#D9F8F8",
    },
    pillEnding: {
      backgroundColor: c.tintAmber,
    },
    pillDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: TURQUOISE,
    },
    pillDotEnding: {
      backgroundColor: c.amberText,
    },
    pillText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.dark ? "#7FF0E4" : "#047A70",
    },
    pillTextEnding: {
      color: c.amberText,
    },
    offerBottom: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.divider,
    },
    offerPrice: {
      fontFamily: FontFamily.headingBold,
      fontSize: 24,
      lineHeight: 30,
      color: c.text,
    },
    offerPer: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      color: c.muted,
    },
    offerMeta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    manage: {
      height: 40,
      paddingHorizontal: 18,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      alignItems: "center",
      justifyContent: "center",
    },
    manageText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.solidText,
    },
    section: {
      marginTop: 22,
      marginBottom: 8,
      marginLeft: 4,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      color: c.muted,
    },
    sectionInline: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      color: c.muted,
    },
    sectionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 22,
      marginBottom: 8,
      marginHorizontal: 4,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    usageRow: {
      flexDirection: "row",
      gap: 10,
    },
    usageTile: {
      flex: 1,
      gap: 4,
      padding: 12,
      borderRadius: 16,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    usageIcon: {
      width: 32,
      height: 32,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    usageValue: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
    },
    usageLabel: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    track: {
      height: 5,
      marginTop: 6,
      borderRadius: 3,
      backgroundColor: c.track,
      overflow: "hidden",
    },
    fill: {
      height: 5,
      borderRadius: 3,
      backgroundColor: TURQUOISE,
    },
    compareHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 22,
      marginBottom: 10,
      marginLeft: 4,
    },
    segments: {
      flexDirection: "row",
      padding: 3,
      gap: 3,
      borderRadius: Radius.full,
      backgroundColor: c.dark ? "#0F1B33" : "#E6EBF0",
    },
    segment: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 34,
      paddingHorizontal: 14,
      borderRadius: Radius.full,
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
    save: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: Radius.full,
      backgroundColor: TURQUOISE,
    },
    saveText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: "#0C1A37",
    },
    plansScroll: {
      marginHorizontal: -Space.gutter,
    },
    plansRow: {
      gap: 12,
      paddingHorizontal: Space.gutter,
      alignItems: "stretch",
    },
    plan: {
      width: 260,
      gap: 10,
      padding: 16,
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    planOn: {
      borderWidth: 2,
      borderColor: TURQUOISE,
      padding: 15,
    },
    planTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    planName: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
      color: c.text,
    },
    yours: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: Radius.full,
      backgroundColor: TURQUOISE,
    },
    yoursText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: "#0C1A37",
    },
    planPrice: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
    },
    planPer: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      color: c.muted,
    },
    perks: {
      flex: 1,
      gap: 6,
    },
    perk: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
    },
    perkText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    downgrade: {
      paddingVertical: 8,
      textAlign: "center",
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
      textDecorationLine: "underline",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginLeft: 14,
      backgroundColor: c.divider,
    },
    cardLogo: {
      width: 48,
      height: 32,
      borderRadius: 6,
      backgroundColor: "#1A1F71",
      alignItems: "center",
      justifyContent: "center",
    },
    cardLogoText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 13,
      lineHeight: 16,
      fontStyle: "italic",
      color: "#FFFFFF",
    },
    rowTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    rowMeta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    amount: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    note: {
      marginTop: 8,
      marginLeft: 4,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    legal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      marginTop: 16,
    },
    cancelLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    cancelText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
