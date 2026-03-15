import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../utils/supabase';

const { width, height } = Dimensions.get('window');

export default function ActiveMission() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = params.requestId as string;

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [missionStep, setMissionStep] = useState(0); // 0: Pending, 1: Accepted, 2: Arrived, 3: Transporting
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      fetchMissionDetails();
    } else {
      setLoading(false);
    }
  }, [requestId]);

  const fetchMissionDetails = async () => {
    try {
      const { data } = await supabase
        .from('ride_requests')
        .select(`
          *,
          patients (
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', requestId)
        .single();

      if (data) {
        setPatientData(data);
        if (data.status === 'requested') setMissionStep(0);
        else if (data.status === 'accepted') setMissionStep(1);
        else if (data.status === 'arrived') setMissionStep(2);
        else if (data.status === 'transporting') setMissionStep(3);
        else if (data.status === 'completed' || data.status === 'cancelled') router.replace('/(tabs)');
      }
    } catch (error) {
       console.error('Error fetching mission details:', error);
    } finally {
       setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      if (missionStep === 0) {
        // Accept mission: Assign driver_id and mark accepted
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: driver } = await supabase.from('drivers').select('id').eq('profile_id', user.id).single();
        if (!driver) return;

        await supabase.from('ride_requests').update({ status: 'accepted', driver_id: driver.id }).eq('id', requestId);
        setMissionStep(1);
      } else if (missionStep === 1) {
        await supabase.from('ride_requests').update({ status: 'arrived' }).eq('id', requestId);
        setMissionStep(2);
      } else if (missionStep === 2) {
        await supabase.from('ride_requests').update({ status: 'transporting' }).eq('id', requestId);
        setMissionStep(3);
      } else if (missionStep === 3) {
        await supabase.from('ride_requests').update({ status: 'completed' }).eq('id', requestId);
        router.replace('/(tabs)');
      }
    } catch (e) {
       console.error('Error updating mission status:', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const patientProfile = patientData?.patients?.profiles;
  const patientName = patientProfile?.full_name || 'Emergency Patient';
  const patientAvatar = patientProfile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop';
  const pickupAddress = patientData?.pickup_address || 'Fetching Location...';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Map Background Placeholder */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.mapImage}
        />
        <View style={styles.mapOverlay} />
        
        {/* Navigation Info Bar */}
        {(missionStep > 0) && (
        <SafeAreaView style={styles.navInfo} edges={['top']}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
            style={styles.navInfoGradient}
          >
            <View style={styles.navRow}>
              <View style={styles.dirIcon}>
                <Ionicons name="navigate" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.dirText}>
                <Text style={styles.distanceText}>{missionStep === 1 ? 'Arriving Soon' : 'En Route'}</Text>
                <Text style={styles.streetText} numberOfLines={1}>{pickupAddress}</Text>
              </View>
              <View style={styles.etaBox}>
                <Text style={styles.etaTime}>{missionStep === 1 ? '-- min' : '-- min'}</Text>
                <Text style={styles.etaLabel}>ETA</Text>
              </View>
            </View>
          </LinearGradient>
        </SafeAreaView>
        )}
      </View>

      {/* Mission Control Panel */}
      <View style={[styles.controlPanel, { backgroundColor: theme.secondary }]}>
        <View style={styles.panelHeader}>
          <View style={styles.handle} />
        </View>
        
        <View style={styles.patientInfo}>
          <View style={styles.patientMain}>
            <View style={[styles.avatarContainer, { borderColor: theme.primary }]}>
              <Image 
                source={{ uri: patientAvatar }} 
                style={styles.patientAvatar}
              />
            </View>
            <View style={styles.patientDetails}>
              <Text style={[styles.patientName, { color: theme.text }]}>{patientName}</Text>
              <View style={styles.alertRow}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.alertText}>Critical: Breathing Issue</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.circleButton, { backgroundColor: '#4CAF5020' }]}>
              <Ionicons name="call" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circleButton, { backgroundColor: theme.primary + '10' }]}>
              <Ionicons name="chatbubble" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.missionFooter}>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={20} color={theme.primary} />
            <Text style={[styles.addressText, { color: theme.text + '90' }]} numberOfLines={2}>
              {pickupAddress}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.mainActionButton, { backgroundColor: missionStep === 3 ? '#4CAF50' : theme.primary }]}
            activeOpacity={0.8}
            onPress={handleAction}
          >
            <Text style={styles.buttonText}>
              {missionStep === 0 ? 'ACCEPT MISSION' :
               missionStep === 1 ? 'ARRIVED AT PICKUP' : 
               missionStep === 2 ? 'START TRANSPORTING' : 'FINISH MISSION'}
            </Text>
            <Ionicons name={missionStep === 0 ? "checkmark-circle" : "arrow-forward"} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sosButton}>
            <Text style={styles.sosText}>EMERGENCY SOS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
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
  navInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  navInfoGradient: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25,25,25,0.95)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dirIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#0C28FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dirText: {
    flex: 1,
    marginLeft: 16,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'InstrumentSans-Bold',
  },
  streetText: {
    color: '#FFFFFFCC',
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginTop: 2,
  },
  etaBox: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  etaTime: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  etaLabel: {
    color: '#FFFFFFCC',
    fontSize: 12,
    marginTop: 2,
  },
  controlPanel: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
  panelHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  patientMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    padding: 2,
  },
  patientAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  patientDetails: {
    marginLeft: 16,
  },
  patientName: {
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#FF3B30',
    fontFamily: 'InstrumentSans-Bold',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  missionFooter: {
    width: '100%',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'InstrumentSans-Medium',
    marginLeft: 12,
    lineHeight: 20,
  },
  mainActionButton: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
    marginRight: 12,
  },
  sosButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  sosText: {
    color: '#FF3B30',
    fontSize: 13,
    fontFamily: 'InstrumentSans-Bold',
    letterSpacing: 1,
  },
});
