// S-04 - Mot de passe oublié | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
import { forgotPassword } from '../services/auth.service';

/** Message si le serveur exige l'anti-robot (Cloudflare Turnstile), pas encore affiché par l'app. */
const CAPTCHA_MESSAGE =
  'Le serveur exige une vérification anti-robot que l’application ne sait pas encore afficher. Faites la demande depuis app.bringomind.com.';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const formStyles = useFormStyles();
  const { c, styles } = useLook();
  const [email, setEmail] = useState(IS_DEMO ? 'claire.martin@email.fr' : '');
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resent, setResent] = useState(false);

  const valid = EMAIL_PATTERN.test(email.trim());
  const emailError = touched && email.length > 0 && !valid;

  /** Envoie (ou renvoie) le lien. Réponse 202 identique que le compte existe ou non. */
  const send = async (): Promise<boolean> => {
    setError(null);
    if (IS_DEMO) return true;
    try {
      await forgotPassword(email);
      return true;
    } catch (reason) {
      setError(isApiError(reason) && reason.fieldErrors().captcha ? CAPTCHA_MESSAGE : displayMessage(reason));
      return false;
    }
  };

  const handleSend = async () => {
    if (!valid || loading) return;
    setLoading(true);
    if (IS_DEMO) {
      // Démo : simule l'envoi du lien.
      setTimeout(() => {
        setLoading(false);
        setSent(true);
      }, 700);
      return;
    }
    const ok = await send();
    setLoading(false);
    if (ok) setSent(true);
  };

  if (sent) {
    return (
      <AuthScreen back>
        <AuthIconTile name="mark_email_read" />
        <AuthTitle
          lead="Vérifiez votre"
          accent="boîte mail"
          subtitle={
            <>
              Si un compte existe pour{' '}
              <Text style={styles.emailStrong}>{email}</Text>, un lien de réinitialisation vient
              d’être envoyé. Il est valable 60 minutes.
            </>
          }
        />

        <AuthCard>
          <StepRow index="1" text="Ouvrez l’e-mail de Bringo Mind" active />
          <View style={styles.stepDivider} />
          <StepRow index="2" text="Cliquez sur « Réinitialiser mon mot de passe »" />
          <View style={styles.stepDivider} />
          <StepRow index="3" text="Choisissez un nouveau mot de passe" />
        </AuthCard>

        {resent ? (
          <InfoNote icon="check_circle" iconColor={c.success} tone="success">
            Un nouvel e-mail vient d’être envoyé.
          </InfoNote>
        ) : null}
        <FormError message={error} />

        <PrimaryButton label="J’ai reçu le lien" onPress={() => router.push('/reset-password')} />

        <View style={styles.links}>
          <TextLink
            label="Renvoyer l’e-mail"
            icon="refresh"
            onPress={() => {
              void send().then((ok) => setResent(ok));
            }}
          />
          <TextLink
            label="Utiliser une autre adresse e-mail"
            muted
            onPress={() => {
              setSent(false);
              setResent(false);
            }}
          />
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen back>
      <AuthIconTile name="lock_reset" />
      <AuthTitle
        lead="Mot de passe"
        accent="oublié ?"
        subtitle="Indiquez l’adresse associée à votre compte et nous vous enverrons un lien sécurisé."
      />

      <AuthCard>
        <Text style={formStyles.fieldLabel}>Adresse e-mail</Text>
        <View
          style={[
            formStyles.inputRow,
            focused && formStyles.inputRowFocused,
            emailError && formStyles.inputRowError,
          ]}>
          <Icon
            name="mail"
            size={20}
            color={emailError ? c.error : focused ? c.link : c.muted}
          />
          <TextInput
            style={formStyles.inputInline}
            placeholder="vous@email.fr"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            accessibilityLabel="Adresse e-mail"
            aria-invalid={emailError}
          />
        </View>
        {emailError ? (
          <View style={formStyles.errorRow} accessibilityLiveRegion="polite">
            <Icon name="error" size={16} color={c.error} />
            <Text style={formStyles.errorText}>Saisissez une adresse e-mail valide.</Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Envoyer le lien"
          icon="send"
          loadingLabel="Envoi…"
          disabled={!valid}
          loading={loading}
          onPress={handleSend}
        />
        <FormError message={error} />
      </AuthCard>

      <InfoNote icon="info">
        Pensez à vérifier vos courriers indésirables. Le lien expire au bout de 60 minutes pour
        votre sécurité.
      </InfoNote>

      <View style={styles.links}>
        <TextLink
          label="Retour à la connexion"
          icon="arrow_back"
          muted
          onPress={() => router.replace('/login')}
        />
      </View>
    </AuthScreen>
  );
}

function StepRow({ index, text, active }: { index: string; text: string; active?: boolean }) {
  const { styles } = useLook();
  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepIndex, active && styles.stepIndexActive]}>
        <Text style={[styles.stepIndexText, active && styles.stepIndexTextActive]}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
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
    emailStrong: {
      fontFamily: FontFamily.bodySemiBold,
      color: c.text,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    stepIndex: {
      width: 28,
      height: 28,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepIndexActive: {
      backgroundColor: c.link,
      borderColor: c.link,
    },
    stepIndexText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    stepIndexTextActive: {
      color: c.solidText,
    },
    stepText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
    stepDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
      marginLeft: 40,
    },
    links: {
      alignItems: 'center',
      gap: 16,
      marginTop: Space.lg,
    },
  });
}
