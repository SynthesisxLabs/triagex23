import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const quickActions = [
    { id: '1', title: 'Find Doctor', icon: 'search', color: '#4CAF50' },
    { id: '2', title: 'Prescriptions', icon: 'document-text', color: '#FF9800' },
    { id: '3', title: 'Lab Reports', icon: 'flask', color: '#2196F3' },
    { id: '4', title: 'Payment', icon: 'card', color: '#9C27B0' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.userInfo}>
          <View>
            <Text style={[styles.greeting, { color: theme.text + '99' }]}>Hello,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>Daksh Hiran</Text>
          </View>
          <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Ionicons name="person" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SOS Card */}
        <TouchableOpacity style={styles.sosCard} activeOpacity={0.9} onPress={() => router.push('/(tabs)/EmergencyBooking')}>
          <LinearGradient
            colors={['#FF4B2B', '#FF416C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sosGradient}
          >
            <View style={styles.sosContent}>
              <View>
                <Text style={styles.sosTitle}>Emergency SOS</Text>
                <Text style={styles.sosSubtitle}>Quickly call an ambulance</Text>
              </View>
              <View style={styles.sosIconContainer}>
                <Ionicons name="medical" size={32} color="#FFFFFF" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Doctor Banner */}
        <TouchableOpacity 
          style={[styles.aiBanner, { backgroundColor: theme.secondary, borderColor: theme.border }]}
          onPress={() => router.push('/ai-chat')}
        >
          <View style={styles.aiInfo}>
            <Text style={[styles.aiTitle, { color: theme.text }]}>AI Symptom Checker</Text>
            <Text style={[styles.aiSubtitle, { color: theme.text + '80' }]}>Chat with our AI for instant health insights</Text>
            <View style={[styles.aiBadge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={{ color: theme.primary, fontFamily: 'InstrumentSans-Bold', fontSize: 12 }}>PRO FEATURE</Text>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.aiImage}
          />
        </TouchableOpacity>

        {/* Quick Actions Container */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Services</Text>
        </View>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={[styles.actionItem, { backgroundColor: theme.secondary, borderColor: theme.border }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Appointment</Text>
          <TouchableOpacity>
            <Text style={{ color: theme.primary, fontFamily: 'InstrumentSans-Bold' }}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.appointmentCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <View style={styles.doctorInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&auto=format&fit=crop' }} 
              style={styles.doctorImage}
            />
            <View style={styles.doctorText}>
              <Text style={[styles.doctorName, { color: theme.text }]}>Dr. Sarah Johnson</Text>
              <Text style={[styles.specialization, { color: theme.text + '80' }]}>Cardiologist</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble-ellipses" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.appointmentTime}>
            <View style={styles.timeInfo}>
              <Ionicons name="calendar" size={16} color={theme.primary} />
              <Text style={[styles.timeText, { color: theme.text }]}>June 12, 2024</Text>
            </View>
            <View style={styles.timeInfo}>
              <Ionicons name="time" size={16} color={theme.primary} />
              <Text style={[styles.timeText, { color: theme.text }]}>10:30 AM</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'InstrumentSans-Bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sosCard: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#FF4B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  sosContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  sosSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  sosIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBanner: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 30,
  },
  aiInfo: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  aiSubtitle: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 4,
    lineHeight: 18,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
  },
  aiImage: {
    width: 120,
    height: '100%',
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  actionItem: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-SemiBold',
  },
  appointmentCard: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  doctorText: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  specialization: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  appointmentTime: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 8,
  },
});
