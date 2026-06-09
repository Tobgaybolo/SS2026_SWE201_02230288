import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="student-home" options={{ headerShown: false }} />
        <Stack.Screen name="supervisor-home" options={{ headerShown: false }} />
        <Stack.Screen name="logbook" options={{ headerShown: false }} />
        <Stack.Screen name="attendance" options={{ headerShown: false }} />
        <Stack.Screen name="monthly-reflection" options={{ headerShown: false }} />
        <Stack.Screen name="feedbacks" options={{ headerShown: false }} />
        <Stack.Screen name="supervisor-logbooks" options={{ headerShown: false }} />
        <Stack.Screen name="supervisor-feedback" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
