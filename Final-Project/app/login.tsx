import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { getUserRole } from '../hooks/use-auth';
import { registerForPushNotificationsAsync, savePushToken } from '../hooks/use-notifications';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    if (!supabase) {
      Alert.alert('Configuration Error', 'Supabase is not configured. Please check your .env file.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error('No user returned from login.');

      // Register for push notifications
      const token = await registerForPushNotificationsAsync();
      if (token) await savePushToken(user.id, token);

      // Determine role and route accordingly
      const role = await getUserRole(user.id);

      if (role === 'supervisor') {
        router.replace('/supervisor-home');
      } else if (role === 'student') {
        router.replace('/student-home');
      } else {
        // Default to student if role not set
        router.replace('/student-home');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image source={require('../public/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerTitle}>College of Science and Technology</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>← Home</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.loginCard}>
              {/* Logo accent */}
              <View style={styles.logoAccent}>
                <Image source={require('../public/images/logo.png')} style={styles.cardLogo} resizeMode="contain" />
              </View>

              <Text style={styles.loginTitle}>Welcome Back</Text>
              <Text style={styles.loginSubtitle}>Sign in to your CST Internship Portal account</Text>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@cst.edu.bt"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={styles.showPasswordBtn}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginBtnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Info note */}
              <View style={styles.infoNote}>
                <Text style={styles.infoNoteText}>
                  🔒 You will be directed to your dashboard based on your account role (Student or Supervisor).
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  flex: { flex: 1 },
  header: {
    height: 72,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  logo: { width: 40, height: 40, borderRadius: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  backButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  logoAccent: { alignItems: 'center', marginBottom: 20 },
  cardLogo: { width: 72, height: 72, borderRadius: 16 },
  loginTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  loginSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 60 },
  showPasswordBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  showPasswordText: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  loginBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 2,
  },
  loginBtnDisabled: { backgroundColor: '#94A3B8' },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  infoNote: {
    marginTop: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  infoNoteText: { color: '#0369A1', fontSize: 12, lineHeight: 18 },
});
