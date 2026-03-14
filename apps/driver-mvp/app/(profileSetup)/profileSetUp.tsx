import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

export default function DriverProfileSetUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const vehicleTypes = ['Basic (BLS)', 'Advanced (ALS)', 'Cardiac Care', 'Trauma'];

  const handleComplete = async () => {
    if (!name || !licenseNumber || !vehicleType || !vehicleNumber) {
      Alert.alert('Incomplete', 'Please fill all required fields to continue.');
      return;
    }

    setLoading(true);
    console.log('=== DRIVER PROFILE SETUP START ===');

    try {
      // Step 1: Get current session
      console.log('[PROFILE] Getting current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('[PROFILE] Session found:', !!session);
      console.log('[PROFILE] Session error:', sessionError?.message);

      if (sessionError || !session) {
        console.log('[PROFILE] No session! Trying to get user from auth state...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[PROFILE] Auth user:', user?.id);
        
        if (!user) {
          throw new Error('Not authenticated. Please go back and log in again.');
        }
      }

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('Could not determine user ID. Please log in again.');
      }

      console.log('[PROFILE] User ID:', userId);
      console.log('[PROFILE] User email:', session.user.email);

      // Step 2: Update the profiles table (full_name, phone, role)
      console.log('[PROFILE] Updating profiles table...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: name,
          phone: phone || null,
          role: 'driver',
        })
        .eq('id', userId);

      if (profileError) {
        console.log('[PROFILE] Profile update error:', profileError.message);
        throw new Error('Failed to update profile: ' + profileError.message);
      }
      console.log('[PROFILE] Profile updated ✓');

      // Step 3: Check if a driver record already exists (prevent duplicates)
      console.log('[PROFILE] Checking for existing driver record...');
      const { data: existingDriver } = await supabase
        .from('drivers')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle();

      if (existingDriver) {
        // Update existing driver record
        console.log('[PROFILE] Driver record exists, updating...');
        const { error: updateErr } = await supabase
          .from('drivers')
          .update({
            license_number: licenseNumber,
            vehicle_number: vehicleNumber,
            vehicle_type: vehicleType,
            status: 'offline',
          })
          .eq('profile_id', userId);

        if (updateErr) {
          console.log('[PROFILE] Driver update error:', updateErr.message);
          throw new Error('Failed to update driver record: ' + updateErr.message);
        }
        console.log('[PROFILE] Driver record updated ✓');
      } else {
        // Insert new driver record
        console.log('[PROFILE] Inserting new driver record...');
        console.log('[PROFILE] Data:', { profile_id: userId, license_number: licenseNumber, vehicle_number: vehicleNumber, vehicle_type: vehicleType });
        
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            profile_id: userId,
            license_number: licenseNumber,
            vehicle_number: vehicleNumber,
            vehicle_type: vehicleType,
            status: 'offline',
            is_verified: false,
          });

        if (driverError) {
          console.log('[PROFILE] Driver insert error:', driverError.message, driverError.details, driverError.hint);
          throw new Error('Failed to create driver record: ' + driverError.message);
        }
        console.log('[PROFILE] Driver record created ✓');
      }

      console.log('[PROFILE] All data saved! Navigating to tabs...');
      console.log('=== DRIVER PROFILE SETUP COMPLETE ===');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('[PROFILE] FAILED:', error.message);
      console.log('=== DRIVER PROFILE SETUP FAILED ===');
      Alert.alert('Setup Failed', error.message || 'Could not complete profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.header} edges={['top']}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>Driver Setup</Text>
            <Text style={[styles.subtitle, { color: theme.text + '99' }]}>
              Complete your profile to start receiving emergency missions.
            </Text>
          </View>
        </SafeAreaView>

        <View style={styles.form}>
          {/* Section: Personal Info */}
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: John Doe"
                placeholderTextColor={theme.text + '40'}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: +91 9876543210"
                placeholderTextColor={theme.text + '40'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Section: Professional Info */}
          <Text style={[styles.sectionHeader, { color: theme.primary, marginTop: 10 }]}>Professional Details</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Driving License Number *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter license number"
                placeholderTextColor={theme.text + '40'}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>
          </View>

          {/* Section: Vehicle Info */}
          <Text style={[styles.sectionHeader, { color: theme.primary, marginTop: 10 }]}>Vehicle Details</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Ambulance Type *</Text>
            <View style={styles.chipContainer}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setVehicleType(type)}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: vehicleType === type ? theme.primary : theme.secondary,
                      borderColor: vehicleType === type ? theme.primary : theme.border
                    }
                  ]}
                >
                  <Text style={[
                    styles.chipText, 
                    { color: vehicleType === type ? '#FFFFFF' : theme.text }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Vehicle Plate Number *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: KA 01 AB 1234"
                placeholderTextColor={theme.text + '40'}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleComplete}
          style={styles.completeButtonContainer}
          disabled={loading}
        >
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.completeButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.completeButtonText}>Finish Setup</Text>
                <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerText: {
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'InstrumentSans-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-SemiBold',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    margin: 4,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'InstrumentSans-Medium',
  },
  completeButtonContainer: {
    marginTop: 20,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
});
