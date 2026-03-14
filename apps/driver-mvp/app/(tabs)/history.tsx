import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const trips = [
  { id: '1', patient: 'Sarah Mitchell', date: '12 May, 2:30 PM', service: 'Basic Life Support', status: 'Completed', earnings: '$180', icon: 'medical' },
  { id: '2', patient: 'Robert Chen', date: '11 May, 10:15 AM', service: 'Cardiac Care', status: 'Completed', earnings: '$250', icon: 'heart' },
  { id: '3', patient: 'Emma Wilson', date: '11 May, 04:45 PM', service: 'Trauma Response', status: 'Completed', earnings: '$220', icon: 'warning' },
  { id: '4', patient: 'James Taylor', date: '10 May, 01:20 PM', service: 'Basic Life Support', status: 'Completed', earnings: '$180', icon: 'medical' },
  { id: '5', patient: 'Olivia Brown', date: '09 May, 09:00 AM', service: 'Emergency Transport', status: 'Cancelled', earnings: '$0', icon: 'close-circle' },
];

export default function TripHistory() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const renderItem = ({ item }: { item: typeof trips[0] }) => (
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
            <Text style={[styles.historyCount, { color: theme.text + '80' }]}>Recent (5)</Text>
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
