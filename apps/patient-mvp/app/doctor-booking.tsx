import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const doctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, reviews: 124, image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.8, reviews: 89, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrician', rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name: 'Dr. James Smith', specialty: 'General Physician', rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop' },
];

const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

export default function DoctorBookingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Book Appointment</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Specialist</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsRow}>
          {doctors.map((doctor) => (
            <TouchableOpacity 
              key={doctor.id} 
              style={[
                styles.doctorCard, 
                { backgroundColor: theme.secondary, borderColor: selectedDoctor.id === doctor.id ? theme.primary : theme.border }
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
              <Text style={[styles.doctorName, { color: theme.text }]} numberOfLines={1}>{doctor.name}</Text>
              <Text style={[styles.doctorSpecialty, { color: theme.text + '70' }]}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.text }]}>{doctor.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.detailCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Text style={[styles.detailTitle, { color: theme.text }]}>Doctor Details</Text>
          <View style={styles.detailInfo}>
            <Image source={{ uri: selectedDoctor.image }} style={styles.detailImage} />
            <View style={styles.detailText}>
              <Text style={[styles.detailName, { color: theme.text }]}>{selectedDoctor.name}</Text>
              <Text style={[styles.detailSpecialty, { color: theme.text + '70' }]}>{selectedDoctor.specialty}</Text>
              <Text style={[styles.detailAbout, { color: theme.text + '90' }]}>
                Experience of over 10 years in clinical medicine. Specialist in advanced patient care and diagnosis.
              </Text>
            </View>
          </View>
          <View style={[styles.statsRow, { borderColor: theme.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>10+</Text>
              <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Exp. Years</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{selectedDoctor.reviews}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Reviews</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{selectedDoctor.rating}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Rating</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>Available Slots</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity 
              key={time} 
              style={[
                styles.timeSlot, 
                { 
                  backgroundColor: selectedTime === time ? theme.primary : theme.secondary,
                  borderColor: selectedTime === time ? theme.primary : theme.border
                }
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeSlotText, 
                { color: selectedTime === time ? '#FFFFFF' : theme.text }
              ]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.confirmButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
          onPress={() => alert('Appointment Booked!')}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginVertical: 20,
  },
  doctorsRow: {
    flexDirection: 'row',
  },
  doctorCard: {
    width: 140,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 16,
    alignItems: 'center',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Bold',
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Bold',
    marginLeft: 4,
  },
  detailCard: {
    marginTop: 30,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginBottom: 20,
  },
  detailInfo: {
    flexDirection: 'row',
  },
  detailImage: {
    width: 100,
    height: 120,
    borderRadius: 16,
  },
  detailText: {
    flex: 1,
    marginLeft: 20,
  },
  detailName: {
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  detailSpecialty: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Medium',
    marginTop: 4,
  },
  detailAbout: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: (width - 60) / 3,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSlotText: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-SemiBold',
  },
  confirmButton: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
});
