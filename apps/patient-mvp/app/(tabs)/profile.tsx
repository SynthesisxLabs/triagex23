import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      router.replace('/(auth)/onboarding');
    }
  };

  const menuItems = [
    { id: '1', title: 'Medical Records', icon: 'document-text-outline', color: '#4CAF50' },
    { id: '2', title: 'Orders & Prescriptions', icon: 'cart-outline', color: '#2196F3' },
    { id: '3', title: 'Emergency Contacts', icon: 'people-outline', color: '#FF9800' },
    { id: '4', title: 'Payment Methods', icon: 'card-outline', color: '#9C27B0' },
    { id: '5', title: 'Settings', icon: 'settings-outline', color: '#607D8B', route: '/settings' },
    { id: '6', title: 'Help & Support', icon: 'help-circle-outline', color: '#00BCD4' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Image 
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.text }]}>
            {loading ? 'Loading...' : profile?.full_name || 'Patient Profile'}
          </Text>
          <Text style={[styles.email, { color: theme.text + '80' }]}>
            {loading ? 'Loading...' : profile?.email || 'No email attached'}
          </Text>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary + '10' }]}>
            <Text style={{ color: theme.primary, fontFamily: 'InstrumentSans-Bold' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Health Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>A+</Text>
            <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Blood Group</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>72</Text>
            <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Weight (kg)</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>180</Text>
            <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Height (cm)</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.menuContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.text + '30'} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontFamily: 'InstrumentSans-Bold',
  },
  email: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
  },
  editButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: (width - 64) / 3,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
  },
  menuContainer: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
});
