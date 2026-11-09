// S-04 - Mot de passe oublié | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import {
  AuthCard,
  AuthIconTile,
  AuthScreen,
  AuthTitle,
  InfoNote,
  PrimaryButton,
  TextLink,
  formStyles,
} from '../components/auth-ui';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('claire.martin@email.fr');
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resent, setResent] = useState(false);

  const valid = EMAIL_PATTERN.test(email.trim());
  const emailError = touched && email.length > 0 && !valid;

  const handleSend = () => {
    if (!valid || loading) return;
    setLoading(true);
    // Démo : simule l'envoi du lien.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
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
              Un lien de réinitialisation a été envoyé à{' '}
              <Text style={styles.emailStrong}>{email}</Text>. Il est valable 30 minutes.
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
          <InfoNote icon="check_circle" iconColor={Serene.success} tone="success">
            Un nouvel e-mail vient d’être envoyé.
          </InfoNote>
        ) : null}

        <PrimaryButton label="J’ai reçu le lien" onPress={() => router.push('/reset-password')} />

        <View style={styles.links}>
          <TextLink label="Renvoyer l’e-mail" icon="refresh" onPress={() => setResent(true)} />
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
            color={emailError ? Serene.error : focused ? Tint.primary : Serene.onSurfaceVariant}
          />
          <TextInput
            style={formStyles.inputInline}
            placeholder="vous@email.fr"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
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
            <Icon name="error" size={16} color={Serene.error} />
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
      </AuthCard>

      <InfoNote icon="info">
        Pensez à vérifier vos courriers indésirables. Le lien expire au bout de 30 minutes pour
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
  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepIndex, active && styles.stepIndexActive]}>
        <Text style={[styles.stepIndexText, active && styles.stepIndexTextActive]}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emailStrong: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.navy,
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
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexActive: {
    backgroundColor: Tint.primary,
    borderColor: Tint.primary,
  },
  stepIndexText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  stepIndexTextActive: {
    color: Serene.onPrimary,
  },
  stepText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
  stepDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Tint.border,
    marginLeft: 40,
  },
  links: {
    alignItems: 'center',
    gap: 16,
    marginTop: Space.lg,
  },
});
