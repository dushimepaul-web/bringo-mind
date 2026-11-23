// S-06 - Vérification e-mail | Module M01 Comptes et authentification | Phase S2
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputInstance, View } from 'react-native';

import { Icon } from '@/components/icon';
import { displayMessage, isApiError } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import {
  AuthCard,
  AuthIconTile,
  AuthScreen,
  AuthTitle,
  FormError,
  InfoNote,
  PrimaryButton,
  TextLink,
  useFormStyles,
} from '../components/auth-ui';
import { resendVerification, tokenFromLink, verifyEmail } from '../services/auth.service';

const EMAIL = 'claire.martin@email.fr';

export default function VerifyEmailScreen() {
  return IS_DEMO ? <VerifyEmailDemo /> : <VerifyEmailApi />;
}

/**
 * Mode API. Le backend envoie un lien (valable 24 h, usage unique) :
 * https://app.bringomind.com/verify-email?token=…
 * - ouvert dans l'app (lien universel ou bringomind://verify-email?token=…) : vérification automatique ;
 * - sinon, la personne colle le lien reçu.
 * La vérification n'ouvre pas de session : il faut ensuite se connecter.
 */
function VerifyEmailApi() {
  const formStyles = useFormStyles();
  const { c, styles } = useLook();
  const params = useLocalSearchParams<{ email?: string; token?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (raw: string) => {
    const token = tokenFromLink(raw);
    if (token.length < 10 || loading) return;
    setLoading(true);
    setError(null);
    try {
      await verifyEmail(token);
      setVerified(true);
    } catch (reason) {
      setError(
        isApiError(reason) && (reason.status === 400 || reason.status === 410)
          ? 'Ce lien n’est plus valable (déjà utilisé ou expiré). Demandez-en un nouveau ci-dessous.'
          : displayMessage(reason),
      );
    } finally {
      setLoading(false);
    }
  };

  // Lien ouvert dans l'app : vérification immédiate.
  useEffect(() => {
    const token = params.token;
    if (!token) return;
    // Différé pour ne pas déclencher de setState synchrone dans l'effet.
    const timer = setTimeout(() => void verify(token), 0);
    return () => clearTimeout(timer);
    // Une seule fois, au premier affichage avec ce jeton.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  const resend = async () => {
    if (!email.trim() || resending) return;
    setResending(true);
    setError(null);
    try {
      await resendVerification(email);
      setResent(true);
    } catch (reason) {
      const fields = isApiError(reason) ? reason.fieldErrors() : {};
      setError(
        fields.captcha
          ? 'Le serveur exige une vérification anti-robot que l’application ne sait pas encore afficher. Demandez un nouveau lien depuis app.bringomind.com.'
          : displayMessage(reason),
      );
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AuthScreen centered>
        <View style={styles.successBody}>
          <AuthIconTile name="verified" size={88} />
          <AuthTitle
            centered
            lead="Adresse"
            accent="confirmée"
            subtitle="Votre compte est activé. Connectez-vous pour accéder à votre espace."
          />
        </View>
        <PrimaryButton label="Se connecter" onPress={() => router.replace('/login')} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen back>
      <AuthIconTile name="mark_email_unread" />
      <AuthTitle
        lead="Vérifiez votre"
        accent="adresse e-mail"
        subtitle={params.email ? 'Nous avons envoyé un lien de confirmation à' : 'Ouvrez le lien de confirmation reçu par e-mail.'}
      />
      {params.email ? (
        <View style={styles.emailPill}>
          <Icon name="mail" size={16} color={c.link} />
          <Text style={styles.emailText}>{params.email}</Text>
        </View>
      ) : null}

      <AuthCard>
        <Text style={formStyles.fieldLabel}>Lien reçu par e-mail</Text>
        <View style={formStyles.inputRow}>
          <Icon name="link" size={20} color={c.muted} />
          <TextInput
            style={formStyles.inputInline}
            placeholder="Collez ici le lien de l’e-mail"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={link}
            onChangeText={setLink}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void verify(link)}
            accessibilityLabel="Lien de confirmation"
          />
        </View>
        <PrimaryButton
          label="Confirmer mon adresse"
          icon="check"
          loadingLabel="Vérification…"
          disabled={tokenFromLink(link).length < 10}
          loading={loading}
          onPress={() => void verify(link)}
        />
        <FormError message={error} />

        <View style={styles.resendBlock}>
          <Text style={formStyles.footerText}>
            {resent ? 'Si l’adresse peut être utilisée, un nouvel e-mail vient d’être envoyé.' : 'Vous n’avez rien reçu ?'}
          </Text>
          {params.email ? null : (
            <View style={[formStyles.inputRow, styles.resendInput]}>
              <Icon name="mail" size={20} color={c.muted} />
              <TextInput
                style={formStyles.inputInline}
                placeholder="vous@email.fr"
                placeholderTextColor={c.muted}
                selectionColor={c.link}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                accessibilityLabel="Adresse e-mail"
              />
            </View>
          )}
          <TextLink
            label={resending ? 'Envoi…' : resent ? 'Renvoyer à nouveau' : 'Renvoyer le lien'}
            icon="refresh"
            onPress={() => void resend()}
          />
        </View>
      </AuthCard>

      <InfoNote icon="schedule">Le lien est valable 24 heures et ne sert qu’une fois. Pensez à vérifier vos spams.</InfoNote>

      <View style={styles.links}>
        <TextLink label="J’ai confirmé mon adresse : me connecter" trailingIcon="chevron_right" onPress={() => router.replace('/login')} />
        <TextLink label="Modifier l’adresse e-mail" muted onPress={() => router.replace('/register')} />
      </View>
    </AuthScreen>
  );
}

/** Démo : code à 6 chiffres simulé (maquette d'origine). */
function VerifyEmailDemo() {
  const formStyles = useFormStyles();
  const { c, styles } = useLook();
  // Démo : code prérempli.
  const [code, setCode] = useState('482913');
  const [codeFocused, setCodeFocused] = useState(true);
  const [resend, setResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRef = useRef<TextInputInstance>(null);

  const digits = code.replace(/\D/g, '').slice(0, 6);
  const complete = digits.length === 6;

  const handleVerify = () => {
    if (!complete || loading) return;
    setLoading(true);
    // Démo : simule la vérification du code.
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 700);
  };

  if (verified) {
    return (
      <AuthScreen centered>
        <View style={styles.successBody}>
          <AuthIconTile name="verified" size={88} />
          <AuthTitle
            centered
            lead="Adresse"
            accent="confirmée"
            subtitle="Votre compte est activé. Bienvenue dans Bringo Mind, Claire."
          />
        </View>
        <PrimaryButton label="Accéder à mon espace" onPress={() => router.replace('/dashboard')} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen back>
      <AuthIconTile name="mark_email_unread" />
      <AuthTitle
        lead="Vérifiez votre"
        accent="adresse e-mail"
        subtitle="Nous avons envoyé un code à 6 chiffres à"
      />
      <View style={styles.emailPill}>
        <Icon name="mail" size={16} color={c.link} />
        <Text style={styles.emailText}>{EMAIL}</Text>
      </View>

      <AuthCard>
        <Text style={formStyles.fieldLabel}>Code de vérification</Text>
        <Pressable
          style={styles.codeRow}
          onPress={() => inputRef.current?.focus()}
          accessibilityRole="button"
          accessibilityLabel="Saisir le code à 6 chiffres">
          {Array.from({ length: 6 }).map((_, index) => {
            const digit = digits[index];
            const current = codeFocused && index === Math.min(digits.length, 5) && !complete;
            return (
              <View
                key={index}
                style={[
                  styles.codeBox,
                  digit ? styles.codeBoxFilled : null,
                  current ? styles.codeBoxFocused : null,
                ]}>
                <Text style={styles.codeDigit}>{digit ?? ''}</Text>
              </View>
            );
          })}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={digits}
            onChangeText={setCode}
            onFocus={() => setCodeFocused(true)}
            onBlur={() => setCodeFocused(false)}
            keyboardType="number-pad"
            inputMode="numeric"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
            accessibilityLabel="Code de vérification"
          />
        </Pressable>

        <PrimaryButton
          label="Vérifier mon adresse"
          icon="check"
          loadingLabel="Vérification…"
          disabled={!complete}
          loading={loading}
          onPress={handleVerify}
        />

        <View style={styles.resendBlock}>
          <Text style={formStyles.footerText}>
            {resend ? 'E-mail renvoyé à l’instant.' : 'Vous n’avez rien reçu ?'}
          </Text>
          <TextLink
            label={resend ? 'Renvoyer à nouveau' : 'Renvoyer le code'}
            icon="refresh"
            onPress={() => setResend(true)}
          />
        </View>
      </AuthCard>

      <InfoNote icon="schedule">Le code expire dans 10 minutes. Pensez à vérifier vos spams.</InfoNote>

      <View style={styles.links}>
        <TextLink
          label="Configurer mon profil plus tard"
          trailingIcon="chevron_right"
          muted
          onPress={() => router.replace('/dashboard')}
        />
        <TextLink label="Modifier l’adresse e-mail" onPress={() => router.push('/register')} />
      </View>
    </AuthScreen>
  );
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (clair ou sombre). */
function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    emailPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
    },
    emailText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    codeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    codeBox: {
      flex: 1,
      height: 56,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    codeBoxFilled: {
      backgroundColor: c.card,
    },
    codeBoxFocused: {
      borderWidth: 1.5,
      borderColor: c.link,
      backgroundColor: c.card,
    },
    codeDigit: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
    },
    hiddenInput: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
    },
    resendBlock: {
      alignItems: 'center',
      gap: 6,
      marginTop: Space.md,
    },
    resendInput: {
      alignSelf: 'stretch',
    },
    links: {
      alignItems: 'center',
      gap: 16,
      marginTop: Space.lg,
    },
    successBody: {
      alignItems: 'center',
      marginBottom: Space.sm,
    },
  });
}
