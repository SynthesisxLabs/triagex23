import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverProfile() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const menuItems = [
    { title: 'Personal Information', icon: 'person-outline', color: '#0C28FD' },
    { title: 'Vehicle Documents', icon: 'document-text-outline', color: '#4CAF50' },
    { title: 'Driver License', icon: 'card-outline', color: '#FF9800' },
    { title: 'Security Settings', icon: 'shield-checkmark-outline', color: '#9C27B0' },
    { title: 'App Language', icon: 'globe-outline', color: '#00BCD4' },
    { title: 'Help & Support', icon: 'help-circle-outline', color: '#607D8B' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Account</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.text }]}>John Doe</Text>
          <Text style={[styles.id, { color: theme.text + '60' }]}>Badge ID: TX-8829</Text>
          
          <View style={styles.badgeRow}>
            <View style={[styles.ratingBadge, { backgroundColor: '#FFD70020' }]}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.badgeText}>4.9 (240 trips)</Text>
            </View>
            <View style={[styles.experienceBadge, { backgroundColor: theme.primary + '10' }]}>
              <Ionicons name="time" size={14} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>2 Years Exp.</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.menuContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.text + '30'} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/onboarding')}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: theme.text + '40' }]}>Version 1.0.24-TX</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'InstrumentSans-Bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontFamily: 'InstrumentSans-Bold',
  },
  id: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  experienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Bold',
    marginLeft: 6,
    color: '#333',
  },
  menuContainer: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
  },
});
