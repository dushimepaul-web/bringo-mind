// États communs des écrans (dossier directeur : chargement, vide et erreur sur chaque écran ;
// guide d'API : messages selon le code d'erreur, jamais selon le texte du serveur).
import { useNetworkState } from 'expo-network';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { PrimaryButton, SecondaryButton, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import type { QueryState } from '@/hooks/use-query';
import { isApiError, isNetworkError, userMessage } from '@/lib/api';
import { useDemoState } from '@/lib/demo-state';

/** Cartes grises qui pulsent pendant le chargement (respecte « réduire les animations »). */
export function LoadingState({ rows = 4, label = 'Chargement…' }: { rows?: number; label?: string }) {
  const [opacity] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (reduce) return;
        loop = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: false }),
            Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: false }),
          ]),
        );
        loop.start();
      })
      .catch(() => undefined);
    return () => loop?.stop();
  }, [opacity]);

  return (
    <View style={styles.stack} accessibilityRole="progressbar" accessibilityLabel={label}>
      {Array.from({ length: rows }, (_, index) => (
        <Animated.View key={index} style={[kitStyles.card, styles.skeleton, { opacity }]}>
          <View style={styles.skeletonIcon} />
          <View style={styles.flex}>
            <View style={[styles.skeletonLine, styles.skeletonWide]} />
            <View style={[styles.skeletonLine, styles.skeletonShort]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

/** Erreur avec « Réessayer » ; le titre et le message dépendent du type d'erreur. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const offline = isNetworkError(error);
  const requestId = isApiError(error) ? error.requestId : undefined;
  return (
    <View style={[kitStyles.card, styles.center]} accessibilityLiveRegion="polite">
      <View style={[styles.bigIcon, styles.bigIconError]}>
        <Icon name={offline ? 'cloud_off' : 'error'} size={30} color={Serene.error} />
      </View>
      <Text style={styles.title}>{offline ? 'Pas de connexion' : 'Impossible de charger'}</Text>
      <Text style={styles.text}>{userMessage(error)}</Text>
      <PrimaryButton label="Réessayer" icon="refresh" style={styles.button} onPress={onRetry} />
      {requestId ? <Text style={styles.reference}>Référence : {requestId.slice(0, 8)}</Text> : null}
    </View>
  );
}

/** État vide avec une action claire (dossier directeur : « états vides explicites avec une action »). */
export function EmptyState({
  icon,
  title,
  text,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={[kitStyles.card, styles.center]}>
      <View style={styles.bigIcon}>
        <Icon name={icon} size={30} color={Tint.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      {actionLabel && onAction ? (
        <SecondaryButton label={actionLabel} icon="add" style={styles.button} onPress={onAction} />
      ) : null}
    </View>
  );
}

/**
 * Affiche le contenu quand la ressource est prête, sinon le chargement ou l'erreur.
 * `empty` : état vide à montrer quand la démo simule un nouveau compte (ou quand la liste est vide).
 */
export function QueryView({
  query,
  children,
  empty,
  isEmpty = false,
  loadingRows,
}: {
  query: QueryState;
  children: ReactNode;
  empty?: Parameters<typeof EmptyState>[0];
  isEmpty?: boolean;
  loadingRows?: number;
}) {
  if (query.status === 'loading') return <LoadingState rows={loadingRows} />;
  if (query.status === 'error') return <ErrorState error={query.error} onRetry={query.reload} />;
  if (empty && (query.empty || isEmpty)) return <EmptyState {...empty} />;
  return <>{children}</>;
}

/** Bandeau « hors ligne » global (réseau réel du téléphone, ou simulation de la démo). */
export function OfflineBanner() {
  const network = useNetworkState();
  const demoState = useDemoState();
  const offline = demoState === 'offline' || network.isInternetReachable === false || network.isConnected === false;
  if (!offline) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Icon name="cloud_off" size={18} color={Serene.onPrimary} />
      <Text style={styles.bannerText}>Hors ligne : vous voyez les dernières données enregistrées.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  stack: {
    gap: 10,
  },
  skeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Tint.lavender,
  },
  skeletonLine: {
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Tint.lavender,
  },
  skeletonWide: {
    width: '80%',
    marginBottom: 8,
  },
  skeletonShort: {
    width: '50%',
  },
  center: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 26,
  },
  bigIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bigIconError: {
    backgroundColor: '#fee2e2',
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
    textAlign: 'center',
  },
  text: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  reference: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Tint.navy,
  },
  bannerText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
});
