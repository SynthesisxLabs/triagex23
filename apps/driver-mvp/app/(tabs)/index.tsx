import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');
const FARE_PER_RIDE = 150;

export default function DriverDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState('');
  const [driverId, setDriverId] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  
  const [stats, setStats] = useState({ trips: '0', earnings: '$0', rating: '4.9' });
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [recentMission, setRecentMission] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!driverId) return;

    checkPendingRequest();

    const subscription = supabase
      .channel('driver_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_requests',
        },
        (payload) => {
          if (payload.new && (payload.new as any).status === 'requested' && !(payload.new as any).driver_id) {
             fetchRequestDetails((payload.new as any).id);
          } else if (payload.new && (payload.new as any).status !== 'requested') {
             setActiveRequest((prev: any) => {
                 if (prev && prev.id === (payload.new as any).id) {
                     setTimeout(checkPendingRequest, 1000); // Check if another is waiting
                     return null;
                 }
                 return prev;
             });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [driverId]);

  const checkPendingRequest = async () => {
    try {
      // First, check if there's an active assigned mission
      const { data: activeMission } = await supabase
        .from('ride_requests')
        .select('id')
        .eq('driver_id', driverId)
        .in('status', ['accepted', 'arrived', 'transporting'])
        .limit(1)
        .single();
        
      if (activeMission) {
        // Driver has an ongoing mission, clear alerts
         setActiveRequest(null);
         return;
      }

      // If no active mission, check for unassigned pending requests
      const { data } = await supabase
        .from('ride_requests')
        .select(`
          id,
          pickup_address,
          patients ( profiles ( full_name ) )
        `)
        .is('driver_id', null)
        .eq('status', 'requested')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data) {
        setActiveRequest({
          id: data.id,
          patientName: (data.patients as any)?.profiles?.full_name || 'Emergency Patient',
          pickupAddress: data.pickup_address || 'Unknown Location'
        });
      }
    } catch (e) {
      // no pending request
    }
  };

  const handleManualSearch = async () => {
    setIsSearching(true);
    await checkPendingRequest();
    setTimeout(() => setIsSearching(false), 800);
  };

  const fetchRequestDetails = async (requestId: string) => {
    try {
      const { data } = await supabase
        .from('ride_requests')
        .select(`
          id,
          pickup_address,
          patients ( profiles ( full_name ) )
        `)
        .eq('id', requestId)
        .single();
        
      if (data) {
        setActiveRequest({
          id: data.id,
          patientName: (data.patients as any)?.profiles?.full_name || 'Emergency Patient',
          pickupAddress: data.pickup_address || 'Unknown Location'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (profile) setDriverName(profile.full_name);

      const { data: driver } = await supabase.from('drivers').select('id').eq('profile_id', user.id).single();
      if (!driver) return;
      
      setDriverId(driver.id);

      const { data: rides } = await supabase
        .from('ride_requests')
        .select(`
          id, created_at, status,
          patients ( profiles ( full_name ) )
        `)
        .eq('driver_id', driver.id)
        .order('created_at', { ascending: false });

      if (rides) {
        const completedRides = rides.filter(r => r.status === 'completed');
        
        setStats({
          trips: completedRides.length.toString(),
          earnings: `$${completedRides.length * FARE_PER_RIDE}`,
          rating: '4.9' 
        });

        if (completedRides.length > 0) {
          const recent = completedRides[0];
          setRecentMission({
            patientName: (recent.patients as any)?.profiles?.full_name || 'Patient',
            date: new Date(recent.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            price: `$${FARE_PER_RIDE}`
          });
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = [
    { id: '1', label: 'Trips', value: stats.trips, icon: 'car-outline' },
    { id: '2', label: 'Earnings', value: stats.earnings, icon: 'cash-outline' },
    { id: '3', label: 'Rating', value: stats.rating, icon: 'star-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: theme.text + '99' }]}>Welcome back,</Text>
            <Text style={[styles.driverName, { color: theme.text }]}>
              {loading ? 'Loading...' : (driverName || 'Driver')}
            </Text>
          </View>
          <View style={[styles.statusToggle, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Text style={[styles.statusText, { color: isOnline ? '#4CAF50' : theme.text + '60' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {displayStats.map((stat) => (
            <View key={stat.id} style={[styles.statBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <Ionicons name={stat.icon as any} size={20} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '60' }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Incoming Mission Alert */}
        {isOnline && activeRequest && (
          <TouchableOpacity 
            style={[styles.missionAlert, { backgroundColor: theme.primary }]}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/active-mission', params: { requestId: activeRequest.id } })}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="notifications" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>New Emergency Request!</Text>
              <Text style={styles.alertSubtitle}>Patient: {activeRequest.patientName} • Just now</Text>
              {activeRequest.pickupAddress && (
                <Text style={styles.alertSubtitle} numberOfLines={1}>📍 {activeRequest.pickupAddress}</Text>
              )}
            </View>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Current Status Card */}
        <View style={[styles.statusCard, { backgroundColor: theme.secondary, borderColor: theme.border, marginTop: isOnline ? 0 : 20 }]}>
          <View style={[styles.statusIconContainer, { backgroundColor: isOnline ? '#4CAF5020' : theme.text + '10' }]}>
            <Ionicons name={isOnline ? "radio-outline" : "moon-outline"} size={32} color={isOnline ? '#4CAF50' : theme.text + '40'} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              {isOnline ? 'Searching for Missions' : 'You are currently Offline'}
            </Text>
            <Text style={[styles.statusSubtitle, { color: theme.text + '60' }]}>
              {isOnline ? 'Incoming requests will appear here' : 'Go online to receive emergency calls'}
            </Text>
            {isOnline && !activeRequest && (
              <TouchableOpacity 
                style={{ 
                  marginTop: 12, 
                  backgroundColor: theme.primary, 
                  paddingVertical: 10, 
                  paddingHorizontal: 16, 
                  borderRadius: 12, 
                  alignSelf: 'flex-start', 
                  flexDirection: 'row', 
                  alignItems: 'center' 
                }}
                onPress={handleManualSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 6 }} />
                ) : (
                  <Ionicons name="search" size={16} color="#FFF" style={{ marginRight: 6 }} />
                )}
                <Text style={{ color: '#FFF', fontFamily: 'InstrumentSans-Bold', fontSize: 14 }}>
                  {isSearching ? 'Searching...' : 'Search Trips'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Map Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Live Map View</Text>
        </View>
        <View style={[styles.mapContainer, { borderColor: theme.border }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay} />
          <View style={styles.driverMarker}>
            <LinearGradient
              colors={[theme.gradientStart, theme.gradientEnd]}
              style={styles.markerGradient}
            >
              <Ionicons name="medical" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Mission</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={{ color: theme.primary, fontFamily: 'InstrumentSans-Bold' }}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentMission ? (
          <View style={[styles.historyCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <View style={styles.historyInfo}>
              <View style={[styles.historyIcon, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
              </View>
              <View style={styles.historyText}>
                <Text style={[styles.patientName, { color: theme.text }]}>{recentMission.patientName}</Text>
                <Text style={[styles.tripInfo, { color: theme.text + '60' }]}>Emergency Transport • {recentMission.date}</Text>
              </View>
              <Text style={[styles.tripPrice, { color: theme.text }]}>{recentMission.price}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.historyCard, { backgroundColor: theme.secondary, borderColor: theme.border, alignItems: 'center', paddingVertical: 24 }]}>
            <Text style={{ color: theme.text + '80', fontFamily: 'InstrumentSans-Regular' }}>No recent missions</Text>
          </View>
        )}
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
  },
  driverName: {
    fontSize: 24,
    fontFamily: 'InstrumentSans-Bold',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Bold',
    marginRight: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  missionAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 16,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  alertSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'InstrumentSans-Medium',
    marginTop: 2,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 30,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
    marginLeft: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  statusSubtitle: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  driverMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  markerGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCard: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Bold',
  },
  tripInfo: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  tripPrice: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
});
