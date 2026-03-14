import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DocsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Doctors & AI</Text>
        <Text style={[styles.headerSubtitle, { color: theme.text + '80' }]}>Choose how you&apos;d like to consult</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* AI Doctor Card */}
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}
          activeOpacity={0.9}
          onPress={() => router.push('/ai-chat')}
        >
          <LinearGradient
            colors={[theme.primary + '10', theme.primary + '05']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                <Ionicons name="sparkles" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>AI Health Companion</Text>
                <Text style={[styles.cardDescription, { color: theme.text + '80' }]}>
                  Instantly chat with our AI to check symptoms, get guidance, and understand your health.
                </Text>
                <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={[styles.badgeText, { color: theme.primary }]}>AVAILABLE 24/7</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text + '30'} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Normal Doctor Booking Card */}
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}
          activeOpacity={0.9}
          onPress={() => router.push('/doctor-booking')}
        >
          <LinearGradient
            colors={['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="calendar" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Book a Doctor</Text>
                <Text style={[styles.cardDescription, { color: theme.text + '80' }]}>
                  Schedule an appointment or call a specialized doctor for a professional consultation.
                </Text>
                <View style={[styles.badge, { backgroundColor: '#4CAF5020' }]}>
                  <Text style={[styles.badgeText, { color: '#4CAF50' }]}>PROFESSIONAL CARE</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text + '30'} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Informational Section */}
        <View style={[styles.infoSection, { backgroundColor: theme.secondary + '50', borderColor: theme.border }]}>
          <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.text + '90' }]}>
            All consultations are private and secure. Our AI is a guide, not a final diagnosis.
          </Text>
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
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardGradient: {
    padding: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 6,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'InstrumentSans-Bold',
    letterSpacing: 0.5,
  },
  infoSection: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 12,
    lineHeight: 18,
  },
});
