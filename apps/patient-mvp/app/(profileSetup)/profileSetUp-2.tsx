import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '../../utils/supabase';

export default function ProfileSetUpStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const finishSetup = async () => {
    setLoading(true);
    console.log('=== PATIENT PROFILE SETUP START ===');
    console.log('[PROFILE] Params received:', JSON.stringify(params));

    try {
      // Step 1: Get session
      console.log('[PROFILE] Getting current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('[PROFILE] Session found:', !!session);
      console.log('[PROFILE] Session error:', sessionError?.message);

      if (sessionError || !session) {
        console.log('[PROFILE] No session! Trying getUser...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[PROFILE] Auth user from getUser:', user?.id);
        
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

      // Step 2: Update full_name and phone in profiles
      console.log('[PROFILE] Updating profiles table with name:', params.name);
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: (params.name as string) || 'New Patient',
          role: 'patient',
        })
        .eq('id', userId);
      
      if (profileError) {
        console.log('[PROFILE] Profile update error:', profileError.message);
        throw new Error('Failed to update profile: ' + profileError.message);
      }
      console.log('[PROFILE] Profile updated ✓');

      // Step 3: Check for existing patient record
      console.log('[PROFILE] Checking for existing patient record...');
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle();

      // Build emergency contact string
      const emergency_contact = emergencyName && emergencyPhone 
        ? `${emergencyName} (${emergencyPhone})`
        : emergencyName || emergencyPhone || null;

      // Convert ISO string to just a date string (YYYY-MM-DD) for the date column
      let dateOfBirth: string | null = null;
      if (params.dobIso) {
        const d = new Date(params.dobIso as string);
        dateOfBirth = d.toISOString().split('T')[0]; // '2000-01-15'
      }

      // Build medical notes from allergies + conditions
      const medicalNotes = [
        allergies ? `Allergies: ${allergies}` : '',
        conditions ? `Chronic Conditions: ${conditions}` : '',
      ].filter(Boolean).join('\n') || null;

      const patientData = {
        profile_id: userId,
        blood_group: (params.bloodGroup as string) || null,
        date_of_birth: dateOfBirth,
        gender: params.gender ? (params.gender as string).toLowerCase() : null,
        emergency_contact,
        medical_notes: medicalNotes,
      };

      console.log('[PROFILE] Patient data to save:', JSON.stringify(patientData));

      if (existingPatient) {
        // Update existing
        console.log('[PROFILE] Patient record exists, updating...');
        const { error: updateErr } = await supabase
          .from('patients')
          .update(patientData)
          .eq('profile_id', userId);

        if (updateErr) {
          console.log('[PROFILE] Patient update error:', updateErr.message);
          throw new Error('Failed to update patient record: ' + updateErr.message);
        }
        console.log('[PROFILE] Patient record updated ✓');
      } else {
        // Insert new
        console.log('[PROFILE] Inserting new patient record...');
        const { error: insertErr } = await supabase
          .from('patients')
          .insert(patientData);

        if (insertErr) {
          console.log('[PROFILE] Patient insert error:', insertErr.message, insertErr.details, insertErr.hint);
          throw new Error('Failed to create patient record: ' + insertErr.message);
        }
        console.log('[PROFILE] Patient record created ✓');
      }

      console.log('[PROFILE] All data saved! Navigating to tabs...');
      console.log('=== PATIENT PROFILE SETUP COMPLETE ===');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.log('[PROFILE] FAILED:', err.message);
      console.log('=== PATIENT PROFILE SETUP FAILED ===');
      Alert.alert('Setup Failed', err.message || 'An error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View style={[styles.progressIndicator, { backgroundColor: theme.primary, width: '100%' }]} />
            </View>
            <Text style={[styles.progressText, { color: theme.text + '80' }]}>Step 2 of 2</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Medical Context</Text>
          <Text style={[styles.subtitle, { color: theme.text + '99' }]}>
            This information helps our AI and doctors provide accurate care during emergencies.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Allergies</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border, height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
              <TextInput
                style={[styles.input, { color: theme.text, textAlignVertical: 'top' }]}
                placeholder="Ex: Peanuts, Penicillin, etc. (Optional)"
                placeholderTextColor={theme.text + '40'}
                value={allergies}
                onChangeText={setAllergies}
                multiline
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Chronic Conditions</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border, height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
              <TextInput
                style={[styles.input, { color: theme.text, textAlignVertical: 'top' }]}
                placeholder="Ex: Diabetes, Asthma, etc. (Optional)"
                placeholderTextColor={theme.text + '40'}
                value={conditions}
                onChangeText={setConditions}
                multiline
              />
            </View>
          </View>

          <View style={styles.divider}>
            <Text style={[styles.dividerText, { color: theme.text + '60' }]}>Emergency Contact</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Contact Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: Jane Doe"
                placeholderTextColor={theme.text + '40'}
                value={emergencyName}
                onChangeText={setEmergencyName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Contact Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="+1 234 567 890"
                placeholderTextColor={theme.text + '40'}
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={finishSetup}
          disabled={loading}
          style={styles.doneButtonContainer}
        >
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButton}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.doneButtonText}>Finish Setup</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Medium',
    marginTop: 4,
  },
  titleContainer: {
    marginBottom: 32,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-SemiBold',
    marginBottom: 8,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'InstrumentSans-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  doneButtonContainer: {
    marginTop: 32,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
});
