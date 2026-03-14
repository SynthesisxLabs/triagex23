import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

export default function EmergencyBookingScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'searching' | 'booked'>('idle');
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (bookingStatus === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [bookingStatus]);

  const handleBook = async () => {
    setBookingStatus('searching');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: patient } = await supabase.from('patients').select('id').eq('profile_id', user.id).single();
      if (!patient) throw new Error("No patient record found");

      const { data: hospital } = await supabase.from('hospitals').select('id').limit(1).single();
      if (!hospital) throw new Error("No hospitals available");

      const { data: ride, error } = await supabase.from('ride_requests').insert({
        patient_id: patient.id,
        hospital_id: hospital.id,
        pickup_address: '123 Healthcare Ave, Medical District',
        status: 'requested'
      }).select().single();

      if (error) throw error;
      
      setCurrentRideId(ride.id);

      const channel = supabase.channel(`public:ride_requests:id=eq.${ride.id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'ride_requests', 
          filter: `id=eq.${ride.id}` 
        }, async (payload: any) => {
          if (payload.new.status === 'accepted' && payload.new.driver_id) {
            const { data: driverData } = await supabase
              .from('drivers')
              .select(`
                vehicle_number,
                profiles (
                  full_name,
                  avatar_url
                )
              `)
              .eq('id', payload.new.driver_id)
              .single();
              
            setDriverInfo(driverData);
            setBookingStatus('booked');
            supabase.removeChannel(channel);
          }
        })
        .subscribe();
        
    } catch (error) {
      console.error('Error booking emergency:', error);
      setBookingStatus('idle');
      alert('Failed to book emergency. Please try again.');
    }
  };

  const handleCancel = async () => {
    setBookingStatus('idle');
    if (currentRideId) {
      supabase.removeAllChannels();
      await supabase.from('ride_requests').update({ status: 'cancelled' }).eq('id', currentRideId);
      setCurrentRideId(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Emergency Booking</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bookingStatus === 'idle' ? (
          <>
            <View style={styles.mapPlaceholder}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop' }} 
                style={styles.mapImage}
              />
              <View style={styles.mapOverlay} />
              <View style={styles.locationCard}>
                <Ionicons name="location" size={24} color="#FF4B2B" />
                <View style={styles.locationText}>
                  <Text style={styles.locationTitle}>Your Location</Text>
                  <Text style={styles.locationSubtitle}>123 Healthcare Ave, Medical District</Text>
                </View>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Service</Text>
              
              <TouchableOpacity 
                style={[styles.serviceCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceIcon, { backgroundColor: '#FF4B2B20' }]}>
                  <Ionicons name="medical" size={24} color="#FF4B2B" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: theme.text }]}>Basic Life Support</Text>
                  <Text style={[styles.servicePrice, { color: theme.text + '80' }]}>Est: $150 - $250</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.serviceCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceIcon, { backgroundColor: '#0C28FD20' }]}>
                  <Ionicons name="flash" size={24} color="#0C28FD" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: theme.text }]}>Advanced Cardiac Care</Text>
                  <Text style={[styles.servicePrice, { color: theme.text + '80' }]}>Est: $350 - $500</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity activeOpacity={0.9} style={styles.emergencyButton} onPress={handleBook}>
                <LinearGradient
                  colors={['#FF4B2B', '#FF416C']}
                  style={styles.emergencyGradient}
                >
                  <Text style={styles.emergencyButtonText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : bookingStatus === 'searching' ? (
          <View style={styles.statusContainer}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.innerCircle}>
                <Ionicons name="medical" size={48} color="#FF4B2B" />
              </View>
            </Animated.View>
            <Text style={[styles.statusTitle, { color: theme.text }]}>Locating Ambulance...</Text>
            <Text style={[styles.statusSubtitle, { color: theme.text + '80' }]}>Connecting you to the nearest emergency service</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={{ color: '#FF4B2B', fontFamily: 'InstrumentSans-Bold' }}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookedContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.statusTitle, { color: theme.text }]}>Ambulance Booked!</Text>
            <Text style={[styles.statusSubtitle, { color: theme.text + '80' }]}>ETA: 8 Minutes</Text>
            
            <View style={[styles.driverCard, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <Image 
                source={{ uri: driverInfo?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' }} 
                style={styles.driverImage}
              />
              <View style={styles.driverInfo}>
                <Text style={[styles.driverName, { color: theme.text }]}>{driverInfo?.profiles?.full_name || 'Driver Assigned'}</Text>
                <Text style={[styles.vehicleInfo, { color: theme.text + '80' }]}>Ambulance • {driverInfo?.vehicle_number || 'N/A'}</Text>
              </View>
              <TouchableOpacity style={[styles.callButton, { backgroundColor: theme.primary }]}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.trackButton} onPress={() => setBookingStatus('idle')}>
              <LinearGradient
                colors={[theme.gradientStart, theme.gradientEnd]}
                style={styles.trackGradient}
              >
                <Text style={styles.trackButtonText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'InstrumentSans-Bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  locationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationText: {
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Bold',
    color: '#FF4B2B',
    textTransform: 'uppercase',
  },
  locationSubtitle: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Medium',
    color: '#000000',
    marginTop: 2,
  },
  optionsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  servicePrice: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  emergencyButton: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF4B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF4B2B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4B2B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 22,
    fontFamily: 'InstrumentSans-Bold',
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Regular',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  cancelButton: {
    marginTop: 40,
    padding: 10,
  },
  bookedContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  driverCard: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
  vehicleInfo: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 30,
  },
  trackGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InstrumentSans-Bold',
  },
});
