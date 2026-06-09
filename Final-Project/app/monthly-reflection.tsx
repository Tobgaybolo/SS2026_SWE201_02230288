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

export default function MonthlyReflection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reflection, setReflection] = useState('');
  const [achievements, setAchievements] = useState('');
  const [improvements, setImprovements] = useState('');

  const handleSubmit = async () => {
    if (!month.trim() || !reflection.trim() || !achievements.trim() || !improvements.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before submitting.');
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

      const { error } = await supabase.from('monthly_reflections').insert({
        user_id: user.id,
        month: month.trim(),
        reflection_summary: reflection.trim(),
        key_achievements: achievements.trim(),
        areas_for_improvement: improvements.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Submitted! 🎉', 'Your monthly reflection has been recorded.', [
        {
          text: 'OK',
          onPress: () => {
            setMonth(new Date().toISOString().slice(0, 7));
            setReflection('');
            setAchievements('');
            setImprovements('');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit reflection. Please try again.');
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
          <Text style={styles.headerTitle}>📅  Monthly Reflection</Text>
          <View style={{ width: 60 }} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.intro}>
              <Text style={styles.introText}>
                Take a moment to reflect on your internship progress this month. Be honest and thoughtful in your responses.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Month *</Text>
              <Text style={styles.hint}>Format: YYYY-MM (e.g., 2025-06)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-06"
                placeholderTextColor="#94A3B8"
                value={month}
                onChangeText={setMonth}
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Reflection Summary *</Text>
              <Text style={styles.hint}>How was your overall internship experience this month?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your overall experience this month — what you worked on, what you learned, how you've grown..."
                placeholderTextColor="#94A3B8"
                value={reflection}
                onChangeText={setReflection}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Key Achievements *</Text>
              <Text style={styles.hint}>What are you most proud of this month?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List your top achievements, milestones completed, projects delivered, skills mastered..."
                placeholderTextColor="#94A3B8"
                value={achievements}
                onChangeText={setAchievements}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Areas for Improvement *</Text>
              <Text style={styles.hint}>What would you do differently? Where can you grow?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Identify areas where you struggled, skills you want to develop, habits you want to build..."
                placeholderTextColor="#94A3B8"
                value={improvements}
                onChangeText={setImprovements}
                multiline
                numberOfLines={4}
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
                <Text style={styles.submitBtnText}>Submit Monthly Reflection</Text>
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
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  introText: { color: '#6D28D9', fontSize: 13, lineHeight: 20 },
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
  textArea: { minHeight: 100, lineHeight: 22 },
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
