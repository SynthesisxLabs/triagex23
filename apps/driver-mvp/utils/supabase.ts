import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://plraftmudigboygpdtal.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscmFmdG11ZGlnYm95Z3BkdGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTE0MTIsImV4cCI6MjA4OTA2NzQxMn0.fISFO7XbkEq0oCvmccephv8xEE8KVlq3lnQE6GTZ084'

// Custom storage adapter using expo-secure-store (works in Expo Go)
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key)
      }
      return await SecureStore.getItemAsync(key)
    } catch {
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value)
        return
      }
      await SecureStore.setItemAsync(key, value)
    } catch {
      // Silently fail - storage is best-effort
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key)
        return
      }
      await SecureStore.deleteItemAsync(key)
    } catch {
      // Silently fail
    }
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
