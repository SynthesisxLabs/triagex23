import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, ScrollView, 
  Alert, ActivityIndicator, Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

type AuthStep = 'email' | 'otp';

export default function PatientLoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // ── STEP 1: Send OTP ──
  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    console.log('=== PATIENT OTP: SEND START ===');
    console.log('[OTP] Email:', trimmedEmail);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          data: {
            role: 'patient',
          },
        },
      });

      if (error) {
        console.log('[OTP] Send error:', error.message);
        Alert.alert('Error', error.message);
        return;
      }

      console.log('[OTP] OTP sent successfully! ✓');
      setCountdown(60);
      animateTransition(() => setStep('otp'));
    } catch (err: any) {
      console.log('[OTP] Unexpected error:', err.message);
      Alert.alert('Error', err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
      console.log('=== PATIENT OTP: SEND END ===');
    }
  };

  // ── STEP 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    console.log('=== PATIENT OTP: VERIFY START ===');
    console.log('[OTP] Email:', email.trim().toLowerCase());
    console.log('[OTP] Code:', code);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: 'email',
      });

      if (error) {
        console.log('[OTP] Verify error:', error.message);
        Alert.alert('Invalid Code', 'The code you entered is incorrect or expired. Please try again.');
        return;
      }

      console.log('[OTP] Verified! User ID:', data.user?.id);
      console.log('[OTP] Session:', !!data.session);

      if (!data.session || !data.user) {
        console.log('[OTP] No session after verify - unexpected');
        Alert.alert('Error', 'Verification succeeded but no session was created. Please try again.');
        return;
      }

      const userId = data.user.id;

      // Ensure profile role is 'patient'
      console.log('[OTP] Setting profile role to patient...');
      await supabase
        .from('profiles')
        .update({ role: 'patient' })
        .eq('id', userId);
      console.log('[OTP] Profile role updated ✓');

      // Check if patient record exists → route accordingly
      console.log('[OTP] Checking for existing patient record...');
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle();

      if (patientData) {
        console.log('[OTP] Patient profile found → navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('[OTP] New patient → navigating to profile setup');
        router.replace('/(profileSetup)/profileSetUp-1');
      }
    } catch (err: any) {
      console.log('[OTP] Unexpected error:', err.message);
      Alert.alert('Error', err.message || 'Verification failed.');
    } finally {
      setLoading(false);
      console.log('=== PATIENT OTP: VERIFY END ===');
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    console.log('[OTP] Resending OTP to:', email);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { data: { role: 'patient' } },
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCountdown(60);
        setOtpDigits(['', '', '', '', '', '']);
        Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Input Handling ──
  const handleOtpChange = (text: string, index: number) => {
    const newDigits = [...otpDigits];
    
    // Handle paste (all 6 digits at once)
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = digits[i] || '';
      }
      setOtpDigits(newDigits);
      // Focus last filled or last input
      const lastIndex = Math.min(digits.length - 1, 5);
      otpRefs.current[lastIndex]?.focus();
      return;
    }

    newDigits[index] = text.replace(/\D/g, '');
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
    }
  };

  // ── RENDER ──
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
              <Ionicons name="heart" size={40} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>TriageX Patient</Text>
            <Text style={[styles.subtitle, { color: theme.text + '80' }]}>
              {step === 'email' ? 'Enter your email to get started' : 'Verify your identity'}
            </Text>
          </View>

          <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
            {step === 'email' ? (
              // ── EMAIL STEP ──
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
                  <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
                    <Ionicons name="mail-outline" size={20} color={theme.text + '60'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="patient@example.com"
                      placeholderTextColor={theme.text + '40'}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoFocus
                    />
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
                  <Text style={[styles.infoText, { color: theme.text + '80' }]}>
                    We&apos;ll send a 6-digit verification code to your email. No password needed.
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={handleSendOtp}
                  activeOpacity={0.8}
                  style={styles.primaryButton}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.gradientStart, theme.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Send Code</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              // ── OTP STEP ──
              <>
                <View style={styles.otpHeader}>
                  <TouchableOpacity 
                    onPress={() => animateTransition(() => { setStep('email'); setOtpDigits(['', '', '', '', '', '']); })}
                    style={styles.changeEmailButton}
                  >
                    <Ionicons name="arrow-back" size={16} color={theme.primary} />
                    <Text style={[styles.changeEmailText, { color: theme.primary }]}>Change email</Text>
                  </TouchableOpacity>
                  <Text style={[styles.sentToText, { color: theme.text + '99' }]}>
                    Code sent to {email.trim().toLowerCase()}
                  </Text>
                </View>

                <View style={styles.otpContainer}>
                  {otpDigits.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => { otpRefs.current[index] = ref; }}
                      style={[
                        styles.otpInput,
                        {
                          backgroundColor: theme.secondary,
                          borderColor: digit ? theme.primary : theme.border,
                          color: theme.text,
                          borderWidth: digit ? 2 : 1,
                        },
                      ]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={handleVerifyOtp}
                  activeOpacity={0.8}
                  style={styles.primaryButton}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.gradientStart, theme.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleResend}
                  disabled={countdown > 0}
                  style={styles.resendButton}
                >
                  <Text style={[styles.resendText, { color: countdown > 0 ? theme.text + '40' : theme.primary }]}>
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: 'InstrumentSans-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
    textAlign: 'center',
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
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 32,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'InstrumentSans-Regular',
    lineHeight: 18,
  },
  primaryButton: {
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0C28FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'InstrumentSans-Bold',
  },
  otpHeader: {
    marginBottom: 32,
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  changeEmailText: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-SemiBold',
  },
  sentToText: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-Regular',
    marginLeft: 2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
    paddingHorizontal: 4,
  },
  otpInput: {
    width: (width - 80) / 6,
    height: 60,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'InstrumentSans-Bold',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'InstrumentSans-SemiBold',
  },
});
