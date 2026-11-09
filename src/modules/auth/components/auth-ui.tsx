// Éléments visuels partagés par les écrans d'authentification.
// Style de référence : l'écran de connexion validé (fond lavande, accents turquoise, bouton noir).
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

/** Fond décoratif : reflet turquoise en haut, vagues lavande en bas. */
export function AuthBackground() {
  return (
    <View style={styles.decor} pointerEvents="none">
      <View style={styles.blobTop} />
      <View style={styles.waveBottom} />
      <View style={styles.waveBottomInner} />
    </View>
  );
}

type AuthScreenProps = {
  children: ReactNode;
  /** Affiche la flèche retour en haut à gauche. */
  back?: boolean;
  /** Centre verticalement le contenu (écrans de succès, démarrage). */
  centered?: boolean;
  /** Contenu fixé en bas de l'écran, hors défilement. */
  footer?: ReactNode;
};

/** Cadre commun : zone sûre, fond, clavier, défilement et largeur maximale. */
export function AuthScreen({ children, back, centered, footer }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <AuthBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, centered && styles.contentCentered]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {back ? <BackButton /> : null}
          {children}
        </ScrollView>
        {footer ? <View style={styles.fixedFooter}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function BackButton() {
  return (
    <View style={styles.topBar}>
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressedIcon]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Retour"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}>
        <Icon name="arrow_back" size={26} color={Tint.navy} />
      </Pressable>
    </View>
  );
}

/** Logo et nom de l'application. `compact` : petit carré seul. */
export function AuthBrand({ compact, large }: { compact?: boolean; large?: boolean }) {
  if (compact) {
    return <BrandLogo size={40} />;
  }

  return (
    <View style={[styles.brandRow, large && styles.brandColumn]}>
      <BrandLogo size={large ? 96 : 64} />
      <View style={large && styles.brandTextCentered}>
        <Text style={[styles.wordmark, large && styles.wordmarkLarge]}>
          Bringo <Text style={styles.accent}>Mind</Text>
        </Text>
        <Text style={[styles.tagline, large && styles.taglineCentered]}>
          Organisez • Gérez • Avancez
        </Text>
      </View>
    </View>
  );
}

type AuthTitleProps = {
  lead: string;
  accent: string;
  subtitle?: ReactNode;
  centered?: boolean;
};

/** Titre sur deux lignes, la seconde en turquoise et soulignée. */
export function AuthTitle({ lead, accent, subtitle, centered }: AuthTitleProps) {
  return (
    <View style={[styles.titleBlock, centered && styles.titleBlockCentered]}>
      <Text style={[styles.title, centered && styles.textCentered]}>
        {lead}
        {'\n'}
        <Text style={styles.accent}>{accent}</Text>
      </Text>
      <View style={[styles.titleUnderline, centered && styles.titleUnderlineCentered]} />
      {subtitle ? (
        <Text style={[styles.subtitle, centered && styles.textCentered]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

/** Pictogramme dans un carré turquoise clair. */
export function AuthIconTile({ name, size = 64 }: { name: string; size?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Icon name={name} size={Math.round(size * 0.48)} color={Tint.primary} filled />
    </View>
  );
}

export function AuthCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Bouton principal noir. */
export function PrimaryButton({
  label,
  onPress,
  icon = 'arrow_forward',
  disabled,
  loading,
  loadingLabel,
  style,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && !inactive && styles.primaryButtonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}>
      {loading ? (
        <>
          <ActivityIndicator color={Serene.onPrimary} />
          <Text style={styles.primaryButtonText}>{loadingLabel ?? label}</Text>
        </>
      ) : (
        <>
          <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>
            {label}
          </Text>
          {icon ? (
            <Icon
              name={icon}
              size={22}
              color={Serene.onPrimary}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

/** Bouton secondaire blanc bordé. */
export function SecondaryButton({ label, onPress, icon, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed, style]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={20} color={Tint.navy} /> : null}
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

type LinkProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  /** Icône placée après le texte. */
  trailingIcon?: string;
  muted?: boolean;
};

/** Lien texte turquoise en gras (ou gris si `muted`). */
export function TextLink({ label, onPress, icon, trailingIcon, muted }: LinkProps) {
  const color = muted ? Serene.onSurfaceVariant : Tint.primary;
  return (
    <Pressable
      style={({ pressed }) => [styles.link, pressed && styles.pressedLink]}
      hitSlop={8}
      accessibilityRole="link"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Text style={[styles.linkText, { color }]}>{label}</Text>
      {trailingIcon ? <Icon name={trailingIcon} size={18} color={color} /> : null}
    </Pressable>
  );
}

/** Note d'information discrète. */
export function InfoNote({
  icon,
  iconColor = Serene.onSurfaceVariant,
  children,
  tone = 'neutral',
}: {
  icon: string;
  iconColor?: string;
  children: ReactNode;
  tone?: 'neutral' | 'success';
}) {
  return (
    <View style={[styles.note, tone === 'success' && styles.noteSuccess]}>
      <Icon name={icon} size={20} color={iconColor} />
      <Text style={[styles.noteText, tone === 'success' && styles.noteTextSuccess]}>{children}</Text>
    </View>
  );
}

/** Séparateur « ou ». */
export function Divider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/** Styles de formulaire communs (libellés, champs, erreurs, pied de page). */
export const formStyles = StyleSheet.create({
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
    marginBottom: 10,
  },
  fieldLabelSpaced: {
    marginTop: 20,
  },
  required: {
    color: Serene.error,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
  },
  inputRowFocused: {
    borderColor: Tint.primary,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  inputRowError: {
    borderColor: Serene.error,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    outlineWidth: 0,
  },
  inputInline: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Space.lg,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  centerRow: {
    alignItems: 'center',
    marginTop: Space.md,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Tint.softer,
  },
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: Space.md,
    paddingBottom: 40,
  },
  contentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fixedFooter: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: Space.lg,
    paddingTop: Space.sm,
  },
  decor: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  blobTop: {
    position: 'absolute',
    top: -120,
    right: -110,
    width: 300,
    height: 300,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
    opacity: 0.28,
  },
  waveBottom: {
    position: 'absolute',
    bottom: -260,
    left: -80,
    right: -80,
    height: 330,
    borderRadius: 400,
    backgroundColor: Tint.lavender,
    opacity: 0.9,
  },
  waveBottomInner: {
    position: 'absolute',
    bottom: -300,
    right: -160,
    width: 420,
    height: 340,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
    opacity: 0.25,
  },
  topBar: {
    height: 44,
    justifyContent: 'center',
    marginBottom: Space.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  pressedIcon: {
    opacity: 0.55,
  },
  pressedLink: {
    opacity: 0.65,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandColumn: {
    flexDirection: 'column',
    gap: 18,
  },
  brandTextCentered: {
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: Tint.navy,
  },
  wordmarkLarge: {
    fontSize: 34,
    lineHeight: 40,
  },
  accent: {
    color: Tint.primary,
  },
  tagline: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  taglineCentered: {
    textAlign: 'center',
    marginTop: 6,
  },
  titleBlock: {
    marginTop: 28,
  },
  titleBlockCentered: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: Tint.navy,
  },
  textCentered: {
    textAlign: 'center',
  },
  titleUnderline: {
    width: 150,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    marginTop: 6,
    marginLeft: 14,
    transform: [{ rotate: '-2deg' }],
  },
  titleUnderlineCentered: {
    marginLeft: 0,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
    marginTop: 16,
  },
  iconTile: {
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: Space.lg,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 22,
    shadowColor: Tint.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonDisabled: {
    // Bouton noir estompé : reste reconnaissable comme bouton, sans se confondre avec un champ.
    opacity: 0.3,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonPressed: {
    backgroundColor: Tint.blackPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 18,
    lineHeight: 23,
    color: Serene.onPrimary,
  },
  primaryButtonTextDisabled: {
    color: Serene.onPrimary,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  secondaryPressed: {
    backgroundColor: Tint.soft,
    transform: [{ scale: 0.99 }],
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Space.lg,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
  },
  noteSuccess: {
    borderColor: '#bbf7d0',
    backgroundColor: Serene.successContainer,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  noteTextSuccess: {
    fontFamily: FontFamily.bodyMedium,
    color: Serene.success,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Tint.border,
  },
  dividerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
});
