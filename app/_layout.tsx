import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/context/AppProvider';
import { colours } from '@/theme/tokens';

/**
 * There is no tab bar and no drawer on purpose: the school-year calendar is the
 * only navigation surface a child needs (PRD §5.1), and every screen carries
 * its own always-visible Home control (PRD §4.5).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colours.background },
            animation: 'fade',
          }}
        />
      </AppProvider>
    </SafeAreaProvider>
  );
}
