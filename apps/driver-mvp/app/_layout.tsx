import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '../utils/supabase';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error if called too early */
});

export const unstable_settings = {
  initialRouteName: '(auth)/onboarding',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'InstrumentSans-Regular': InstrumentSans_400Regular,
    'InstrumentSans-Medium': InstrumentSans_500Medium,
    'InstrumentSans-SemiBold': InstrumentSans_600SemiBold,
    'InstrumentSans-Bold': InstrumentSans_700Bold,
  });

  useEffect(() => {
    console.log('[LAYOUT] Font loaded:', fontsLoaded, 'Font error:', fontError);
  }, [fontsLoaded, fontError]);

  // Timeout fallback: if fonts don't load within 3s, proceed anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!appReady) {
        console.log('[LAYOUT] Font loading timed out — proceeding without custom fonts');
        setAppReady(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [appReady]);

  // When fonts load (or error), mark as ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      console.log('[LAYOUT] Fonts resolved, marking app ready');
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Hide splash once app is ready
  const onLayoutReady = useCallback(async () => {
    if (appReady) {
      console.log('[LAYOUT] Hiding splash screen');
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Handle Auth Session Errors (e.g., Invalid Refresh Token redbox)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any) => {
      if (event === 'SIGNED_OUT') {
        // Session was cleared or refresh token was invalid
        const router = require('expo-router').router;
        router.replace('/(auth)/onboarding');
      }
    });

    // Proactively catch background session restoration errors
    supabase.auth.getSession().catch((err: any) => {
      console.log('[AUTH] Session restore error caught:', err);
      supabase.auth.signOut();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)/login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(profileSetup)/profileSetUp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="active-mission" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
