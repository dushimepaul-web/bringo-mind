// S-06 - Vérification e-mail | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputInstance, View } from 'react-native';

import { Icon } from '@/components/icon';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import {
  AuthCard,
  AuthIconTile,
  AuthScreen,
  AuthTitle,
  InfoNote,
  PrimaryButton,
  TextLink,
  useFormStyles,
} from '../components/auth-ui';

const EMAIL = 'claire.martin@email.fr';

export default function VerifyEmailScreen() {
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
