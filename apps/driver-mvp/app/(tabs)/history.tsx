import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

export default function TripHistory() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [trips, setTrips] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: driver } = await supabase.from('drivers').select('id').eq('profile_id', user.id).single();
      if (!driver) return;

      const { data: rideData } = await supabase
        .from('ride_requests')
        .select(`
          id,
          status,
          created_at,
          patients (
            profiles (
              full_name
            )
          )
        `)
        .eq('driver_id', driver.id)
        .order('created_at', { ascending: false });

      if (rideData) {
        const formattedTrips = rideData.map((ride: any) => ({
          id: ride.id,
          patient: ride.patients?.profiles?.full_name || 'Unknown Patient',
          date: new Date(ride.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          service: 'Emergency Transport',
          status: ride.status.charAt(0).toUpperCase() + ride.status.slice(1),
          earnings: ride.status === 'completed' ? '$150' : '$0',
          icon: ride.status === 'cancelled' ? 'close-circle' : 'medical'
        }));
        setTrips(formattedTrips);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.tripCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
      <View style={[styles.tripIcon, { backgroundColor: item.status === 'Completed' ? theme.primary + '15' : '#FF3B3015' }]}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={item.status === 'Completed' ? theme.primary : '#FF3B30'} 
        />
      </View>
      <View style={styles.tripInfo}>
        <Text style={[styles.patientName, { color: theme.text }]}>{item.patient}</Text>
        <Text style={[styles.tripDate, { color: theme.text + '60' }]}>{item.date}</Text>
        <View style={styles.serviceRow}>
          <Text style={[styles.serviceText, { color: theme.text + '80' }]}>{item.service}</Text>
          <View style={styles.dot} />
          <Text style={[styles.statusText, { color: item.status === 'Completed' ? '#4CAF50' : '#FF3B30' }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.earningContainer}>
        <Text style={[styles.earningText, { color: theme.text }]}>{item.earnings}</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.text + '30'} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Trip History</Text>
        <Text style={[styles.headerSubtitle, { color: theme.text + '60' }]}>Your recent life-saving missions</Text>
      </SafeAreaView>

      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={[styles.historyCount, { color: theme.text + '80' }]}>
              {loading ? 'Loading...' : `Recent (${trips.length})`}
            </Text>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
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
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  historyCount: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Bold',
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  tripIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
    marginLeft: 16,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  tripDate: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Medium',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    marginHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Bold',
  },
  earningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningText: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
    marginRight: 8,
  },
});
