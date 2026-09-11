import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/ui/BigButton';
import { t, ui } from '@/i18n';
import { colours, space, type } from '@/theme/tokens';

/** A child should never reach here, but if they do it is one tap back home. */
export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.emoji}>🧭</Text>
      <Text style={styles.text}>That page is not here.</Text>
      <BigButton emoji="🏠" label={t(ui.home)} tone="happy" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.lg,
    backgroundColor: colours.background,
    padding: space.lg,
  },
  emoji: { fontSize: type.emojiXl },
  text: { fontSize: type.title, fontWeight: '800', color: colours.ink },
});
