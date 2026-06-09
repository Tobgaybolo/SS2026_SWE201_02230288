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

export default function Logbook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState('');
  const [skills, setSkills] = useState('');
  const [challenges, setChallenges] = useState('');

  const handleSubmit = async () => {
    if (!date.trim() || !activities.trim() || !skills.trim() || !challenges.trim()) {
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

      const { error } = await supabase.from('logbooks').insert({
        user_id: user.id,
        date,
        activities_performed: activities.trim(),
        skills_learned: skills.trim(),
        challenges_faced: challenges.trim(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Submitted! 🎉', 'Your logbook entry has been submitted. Your supervisor will review it shortly.', [
        {
          text: 'OK',
          onPress: () => {
            setDate(new Date().toISOString().split('T')[0]);
            setActivities('');
            setSkills('');
            setChallenges('');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit logbook. Please try again.');
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
          <Text style={styles.headerTitle}>📓  Daily Logbook</Text>
          <View style={{ width: 60 }} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.intro}>
              <Text style={styles.introText}>
                Record your internship activities for the day. Be specific and detailed for better feedback.
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
              <Text style={styles.label}>Activities Performed *</Text>
              <Text style={styles.hint}>What tasks and activities did you do today?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Attended morning standup, worked on user authentication module, reviewed API documentation, attended meeting with team lead..."
                placeholderTextColor="#94A3B8"
                value={activities}
                onChangeText={setActivities}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Skills Learned *</Text>
              <Text style={styles.hint}>What new knowledge or skills did you gain?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Learned about JWT authentication, practiced REST API design principles..."
                placeholderTextColor="#94A3B8"
                value={skills}
                onChangeText={setSkills}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Challenges Faced *</Text>
              <Text style={styles.hint}>What difficulties did you encounter? How did you handle them?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Had trouble understanding the codebase initially, but resolved it by reading the documentation..."
                placeholderTextColor="#94A3B8"
                value={challenges}
                onChangeText={setChallenges}
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
                <Text style={styles.submitBtnText}>Submit Logbook Entry</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.noteText}>
              📌 Your supervisor will be notified to review this entry.
            </Text>
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
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  introText: { color: '#1D4ED8', fontSize: 13, lineHeight: 20 },
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
    marginBottom: 14,
  },
  submitBtnDisabled: { backgroundColor: '#94A3B8' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  noteText: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
});
