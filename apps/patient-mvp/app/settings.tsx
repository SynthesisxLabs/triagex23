import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [biometrics, setBiometrics] = useState(true);

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        { id: '1', title: 'Push Notifications', icon: 'notifications-outline', type: 'switch', value: notifications, onValueChange: setNotifications },
        { id: '2', title: 'Dark Mode', icon: 'moon-outline', type: 'switch', value: darkMode, onValueChange: setDarkMode },
        { id: '3', title: 'Language', icon: 'globe-outline', type: 'link', value: 'English' },
      ]
    },
    {
      title: 'Security',
      items: [
        { id: '4', title: 'Biometric Lock', icon: 'finger-print-outline', type: 'switch', value: biometrics, onValueChange: setBiometrics },
        { id: '5', title: 'Change Password', icon: 'lock-closed-outline', type: 'link' },
        { id: '6', title: 'Two-Factor Auth', icon: 'shield-checkmark-outline', type: 'link', value: 'Enabled' },
      ]
    },
    {
      title: 'About',
      items: [
        { id: '7', title: 'Terms of Service', icon: 'document-text-outline', type: 'link' },
        { id: '8', title: 'Privacy Policy', icon: 'shield-outline', type: 'link' },
        { id: '9', title: 'App Version', icon: 'information-circle-outline', type: 'info', value: '1.0.2' },
      ]
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionHeader, { color: theme.text + '60' }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '10' }]}>
                        <Ionicons name={item.icon as any} size={20} color={theme.primary} />
                      </View>
                      <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                    </View>
                    
                    {item.type === 'switch' ? (
                      <Switch 
                        value={item.value as boolean} 
                        onValueChange={item.onValueChange}
                        trackColor={{ false: '#767577', true: theme.primary }}
                        thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : item.value ? '#FFFFFF' : '#f4f3f4'}
                      />
                    ) : (
                      <TouchableOpacity style={styles.itemRight}>
                        {item.value && (
                          <Text style={[styles.itemValue, { color: theme.text + '60' }]}>{item.value as string}</Text>
                        )}
                        {item.type === 'link' && (
                          <Ionicons name="chevron-forward" size={18} color={theme.text + '30'} />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                  {itemIndex < section.items.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 10,
  },
  sectionCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginRight: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  deleteButton: {
    marginTop: 40,
    padding: 20,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Bold',
    color: '#FF3B30',
  },
});
