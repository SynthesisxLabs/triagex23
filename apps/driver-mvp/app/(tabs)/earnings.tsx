import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function EarningsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const earningStats = [
    { label: 'Today', value: '$120' },
    { label: 'This Week', value: '$1,450' },
    { label: 'This Month', value: '$4,820' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Earnings</Text>
        <Text style={[styles.headerSubtitle, { color: theme.text + '60' }]}>Financial overview of your service</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Earnings Card */}
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <Text style={styles.mainCardLabel}>Total Balance</Text>
          <Text style={styles.mainCardValue}>$6,240.50</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerLabel}>Available for Payout</Text>
              <Text style={styles.footerValue}>$1,120.00</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          {earningStats.map((stat) => (
            <View key={stat.label} style={[styles.statBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.text + '60' }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Performance (Mockup Chart) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Performance</Text>
        </View>
        <View style={[styles.chartContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <View style={styles.barContainer}>
            {[40, 70, 50, 90, 60, 80, 55].map((height, i) => (
              <View key={i} style={styles.barItem}>
                <View style={[styles.bar, { height: height, backgroundColor: i === 3 ? theme.primary : theme.primary + '30' }]} />
                <Text style={[styles.barLabel, { color: theme.text + '40' }]}>{['M','T','W','T','F','S','S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Payouts */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Payouts</Text>
        </View>
        {[1, 2].map((i) => (
          <View key={i} style={[styles.payoutCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <View style={[styles.payoutIcon, { backgroundColor: '#4CAF5015' }]}>
              <Ionicons name="arrow-down-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.payoutInfo}>
              <Text style={[styles.payoutTitle, { color: theme.text }]}>Bank Transfer</Text>
              <Text style={[styles.payoutDate, { color: theme.text + '60' }]}>{i === 1 ? '10 May, 2024' : '03 May, 2024'}</Text>
            </View>
            <Text style={[styles.payoutAmount, { color: theme.text }]}>$500.00</Text>
          </View>
        ))}
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
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  mainCardLabel: {
    color: '#FFFFFFCC',
    fontSize: 14,
    fontFamily: 'InstrumentSans-Medium',
  },
  mainCardValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: 'InstrumentSans-Bold',
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF33',
  },
  footerLabel: {
    color: '#FFFFFF99',
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
  },
  footerValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginTop: 4,
  },
  withdrawButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  withdrawText: {
    color: '#0C28FD',
    fontSize: 14,
    fontFamily: 'InstrumentSans-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    width: (width - 68) / 3,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  chartContainer: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    height: 180,
    marginBottom: 30,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barItem: {
    alignItems: 'center',
    width: 30,
  },
  bar: {
    width: 10,
    borderRadius: 5,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'InstrumentSans-Bold',
    marginTop: 8,
  },
  payoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  payoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutInfo: {
    flex: 1,
    marginLeft: 16,
  },
  payoutTitle: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Bold',
  },
  payoutDate: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  payoutAmount: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
});
