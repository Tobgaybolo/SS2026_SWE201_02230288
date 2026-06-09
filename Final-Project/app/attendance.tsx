import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';

export default function Attendance() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [remarks, setRemarks] = useState('');

  const setNowCheckIn = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    setCheckIn(`${h}:${m}`);
  };

  const setNowCheckOut = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    setCheckOut(`${h}:${m}`);
  };

  const handleSubmit = async () => {
    if (!date.trim() || !checkIn.trim() || !checkOut.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in the date, check-in, and check-out times.');
      return;
    }
    if (!supabase) {
      Alert.alert('Error', 'Supabase is not configured. Check your .env file.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { error } = await supabase.from('attendance').insert({
        user_id: user.id,
        date,
        check_in_time: checkIn,
        check_out_time: checkOut,
        remarks: remarks.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Attendance Marked! ✅', `Attendance recorded for ${date}.`, [
        {
          text: 'OK',
          onPress: () => {
            setDate(new Date().toISOString().split('T')[0]);
            setCheckIn('');
            setCheckOut('');
            setRemarks('');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✅  Mark Attendance</Text>
          <View style={{ width: 60 }} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.intro}>
              <Text style={styles.introText}>
                Record your daily attendance. Use the "Now" button to quickly set the current time.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Check-In Time *</Text>
              <Text style={styles.hint}>Format: HH:MM (24-hour)</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="09:00"
                  placeholderTextColor="#94A3B8"
                  value={checkIn}
                  onChangeText={setCheckIn}
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity style={styles.nowBtn} onPress={setNowCheckIn}>
                  <Text style={styles.nowBtnText}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Check-Out Time *</Text>
              <Text style={styles.hint}>Format: HH:MM (24-hour)</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="17:00"
                  placeholderTextColor="#94A3B8"
                  value={checkOut}
                  onChangeText={setCheckOut}
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity style={styles.nowBtn} onPress={setNowCheckOut}>
                  <Text style={styles.nowBtnText}>Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Remarks (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any notes about today's attendance (e.g., worked from home, half day, etc.)..."
                placeholderTextColor="#94A3B8"
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Attendance</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  header: {
    height: 60,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  intro: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },
  introText: { color: '#15803D', fontSize: 13, lineHeight: 20 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  label: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  hint: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: { minHeight: 80, lineHeight: 22 },
  timeRow: { flexDirection: 'row', gap: 10 },
  timeInput: { flex: 1 },
  nowBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowBtnText: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  submitBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  submitBtnDisabled: { backgroundColor: '#94A3B8' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
