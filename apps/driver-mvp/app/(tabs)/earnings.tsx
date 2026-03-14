import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

const FARE_PER_RIDE = 150; // Mock fixed fare

export default function EarningsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [chartLabels, setChartLabels] = useState<string[]>(['M','T','W','T','F','S','S']);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: driver } = await supabase.from('drivers').select('id').eq('profile_id', user.id).single();
      if (!driver) return;

      const { data: rides } = await supabase
        .from('ride_requests')
        .select('created_at, status')
        .eq('driver_id', driver.id)
        .eq('status', 'completed');

      if (!rides) {
        setLoading(false);
        return;
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let total = 0;
      let today = 0;
      let week = 0;
      let month = 0;

      let dailyTotals = [0, 0, 0, 0, 0, 0, 0];
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      
      const orderedLabels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        orderedLabels.push(dayLabels[d.getDay()]);
      }
      setChartLabels(orderedLabels);

      rides.forEach(ride => {
        const rideDate = new Date(ride.created_at);
        total += FARE_PER_RIDE;

        if (rideDate.getTime() >= startOfToday.getTime()) {
          today += FARE_PER_RIDE;
        }
        if (rideDate.getTime() >= startOfWeek.getTime()) {
          week += FARE_PER_RIDE;
        }
        if (rideDate.getTime() >= startOfMonth.getTime()) {
          month += FARE_PER_RIDE;
        }

        const rideDayStart = new Date(rideDate.getFullYear(), rideDate.getMonth(), rideDate.getDate()).getTime();
        const diffTime = startOfToday.getTime() - rideDayStart;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 7) {
            const arrayIndex = 6 - diffDays;
            dailyTotals[arrayIndex] += FARE_PER_RIDE;
        }
      });

      setTotalBalance(total);
      setTodayEarnings(today);
      setWeekEarnings(week);
      setMonthEarnings(month);
      setChartData(dailyTotals);

    } catch (err) {
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  const earningStats = [
    { label: 'Today', value: `$${todayEarnings}` },
    { label: 'This Week', value: `$${weekEarnings}` },
    { label: 'This Month', value: `$${monthEarnings}` },
  ];

  const maxChartValue = Math.max(...chartData, 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Earnings</Text>
        <Text style={[styles.headerSubtitle, { color: theme.text + '60' }]}>Financial overview of your service</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <>
            {/* Main Earnings Card */}
            <LinearGradient
              colors={[theme.gradientStart, theme.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainCard}
            >
              <Text style={styles.mainCardLabel}>Total Balance</Text>
              <Text style={styles.mainCardValue}>${totalBalance.toFixed(2)}</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.footerLabel}>Available for Payout</Text>
                  <Text style={styles.footerValue}>${totalBalance > 0 ? totalBalance.toFixed(2) : '0.00'}</Text>
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

        {/* Monthly Performance (Dynamic Chart) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Performance</Text>
        </View>
        <View style={[styles.chartContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <View style={styles.barContainer}>
            {chartData.map((amount, i) => {
              const heightPercentage = amount === 0 ? 5 : (amount / maxChartValue) * 100;
              return (
                <View key={i} style={styles.barItem}>
                  <View style={[styles.bar, { height: `${heightPercentage}%`, backgroundColor: i === 6 ? theme.primary : theme.primary + '30' }]} />
                  <Text style={[styles.barLabel, { color: i === 6 ? theme.text : theme.text + '40' }]}>{chartLabels[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Payouts - Kept as mock for UI sake since no payouts table exists yet */}
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
          </>
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
