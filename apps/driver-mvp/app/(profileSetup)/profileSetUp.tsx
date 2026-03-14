import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DriverProfileSetUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dobText, setDobText] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [ambulanceType, setAmbulanceType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const ambulanceTypes = ['Basic (BLS)', 'Advanced (ALS)', 'Cardiac Care', 'Trauma'];

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    setDobText(`${day} / ${month} / ${year}`);
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
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
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
            <Text style={[styles.label, { color: theme.text }]}>Date of Birth</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowPicker(true)}
              style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}
            >
              <Text style={[styles.input, { color: dobText ? theme.text : theme.text + '40' }]}>
                {dobText || 'DD / MM / YYYY'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.text + '80'} />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Section: Professional Info */}
          <Text style={[styles.sectionHeader, { color: theme.primary, marginTop: 10 }]}>Professional Details</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Badge ID / Employee Code</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: TX-8829"
                placeholderTextColor={theme.text + '40'}
                value={badgeId}
                onChangeText={setBadgeId}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Driving License Number</Text>
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
            <Text style={[styles.label, { color: theme.text }]}>Ambulance Type</Text>
            <View style={styles.chipContainer}>
              {ambulanceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setAmbulanceType(type)}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: ambulanceType === type ? theme.primary : theme.secondary,
                      borderColor: ambulanceType === type ? theme.primary : theme.border
                    }
                  ]}
                >
                  <Text style={[
                    styles.chipText, 
                    { color: ambulanceType === type ? '#FFFFFF' : theme.text }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Vehicle Plate Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ex: KA 01 AB 1234"
                placeholderTextColor={theme.text + '40'}
                value={plateNumber}
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.replace('/(tabs)')}
          style={styles.completeButtonContainer}
        >
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Finish Setup</Text>
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
