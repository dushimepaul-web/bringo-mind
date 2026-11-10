// Composants communs aux écrans Documents.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

import { CATEGORIES, addedLabel } from '../data';
import type { DocItem } from '../types';

/** Vignette colorée selon la catégorie. */
export function DocIcon({ doc, size = 48 }: { doc: DocItem; size?: number }) {
  const category = CATEGORIES[doc.category];
  return (
    <View style={[styles.icon, { width: size, height: size, backgroundColor: category.bg }]}>
      <Icon name={category.icon} size={size * 0.46} color={category.fg} />
    </View>
  );
}

/** Pastille « Personnel » ou « Foyer ». */
export function ScopeTag({ doc }: { doc: DocItem }) {
  const shared = doc.scope === 'household';
  return (
    <View style={[styles.scope, shared && styles.scopeShared]}>
      <Icon name={shared ? 'group' : 'lock'} size={13} color={shared ? Tint.primary : Serene.onSurfaceVariant} />
      <Text style={[styles.scopeText, shared && styles.scopeTextShared]}>{shared ? 'Foyer' : 'Personnel'}</Text>
    </View>
  );
}

/** Ligne de liste : toute la carte ouvre le détail (pas de bouton imbriqué). */
export function DocRow({ doc }: { doc: DocItem }) {
  const category = CATEGORIES[doc.category];
  return (
    <Pressable
      style={({ pressed }) => [kitStyles.card, styles.row, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${doc.title}, ${category.label}, ${doc.scope === 'household' ? 'partagé avec le foyer' : 'personnel'}`}
      onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
      <DocIcon doc={doc} />
      <View style={styles.flex}>
        <Text style={styles.title} numberOfLines={2}>
          {doc.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {doc.status ?? `Ajouté ${addedLabel(doc.addedAt)}`}
        </Text>
        <View style={styles.tags}>
          <Text style={[styles.category, { color: category.fg }]}>{category.label}</Text>
          <ScopeTag doc={doc} />
          {doc.review ? (
            <View style={styles.review}>
              <Text style={styles.reviewText}>À vérifier</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minWidth: 0,
  },
  icon: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  title: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  meta: {
    marginTop: 2,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  category: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
  },
  scope: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
  },
  scopeShared: {
    backgroundColor: '#e6f6f3',
  },
  scopeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  scopeTextShared: {
    color: Tint.primary,
  },
  review: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: '#fef3c7',
  },
  reviewText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: '#92400e',
  },
});
