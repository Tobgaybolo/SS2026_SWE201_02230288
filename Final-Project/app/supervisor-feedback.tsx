import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../supabase';
import { sendNotificationToUser, sendLocalNotification } from '../hooks/use-notifications';

function StarSelector({ rating, onSelect }: { rating: number; onSelect: (r: number) => void }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onSelect(star)} activeOpacity={0.7} style={styles.starBtn}>
          <Text style={[styles.starIcon, { color: star <= rating ? '#F59E0B' : '#CBD5E1' }]}>★</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.ratingLabel}>{rating > 0 ? `${rating}/5` : 'Tap to rate'}</Text>
    </View>
  );
}

const STATUS_OPTIONS = [
  { value: 'approved', label: '✅ Approved', bg: '#DCFCE7', text: '#16A34A' },
  { value: 'reviewed', label: '👁 Reviewed', bg: '#DBEAFE', text: '#1D4ED8' },
  { value: 'needs_revision', label: '⚠ Needs Revision', bg: '#FEE2E2', text: '#DC2626' },
];

export default function SupervisorFeedback() {
  const router = useRouter();
  const { logbookId, studentId, studentName, logbookDate } = useLocalSearchParams<{
    logbookId: string;
    studentId: string;
    studentName: string;
    logbookDate: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('reviewed');
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [supervisorId, setSupervisorId] = useState<string | null>(null);

  useEffect(() => {
    fetchExistingReview();
  }, [logbookId]);

  const fetchExistingReview = async () => {
    if (!supabase || !logbookId) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setSupervisorId(user.id);

      const { data: existing } = await supabase
        .from('logbook_reviews')
        .select('*')
        .eq('logbook_id', logbookId)
        .eq('supervisor_id', user.id)
        .single();

      if (existing) {
        setExistingReviewId(existing.id);
        setReviewText(existing.review_text || '');
        setRating(existing.rating || 0);
        setStatus(existing.status || 'reviewed');
      }
    } catch {
      // No existing review is fine
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      Alert.alert('Missing Feedback', 'Please write your feedback before submitting.');
      return;
    }
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please give a rating (1–5 stars).');
      return;
    }
    if (!supabase || !logbookId || !studentId || !supervisorId) return;

    setSaving(true);
    try {
      const reviewPayload = {
        logbook_id: logbookId,
        supervisor_id: supervisorId,
        student_id: studentId,
        review_text: reviewText.trim(),
        rating,
        status,
        updated_at: new Date().toISOString(),
      };

      if (existingReviewId) {
        // Update existing review
        const { error } = await supabase
          .from('logbook_reviews')
          .update(reviewPayload)
          .eq('id', existingReviewId);
        if (error) throw error;
      } else {
        // Create new review
        const { error } = await supabase
          .from('logbook_reviews')
          .insert({ ...reviewPayload, created_at: new Date().toISOString() });
        if (error) throw error;
      }

      // Update logbook status
      await supabase
        .from('logbooks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', logbookId);

      // Send push notification to student
      const statusMsg =
        status === 'approved' ? 'approved ✅' : status === 'needs_revision' ? 'marked as needing revision ⚠' : 'reviewed 👁';
      await sendNotificationToUser(
        studentId,
        supervisorId,
        'Logbook Feedback Received',
        `Your logbook for ${logbookDate} has been ${statusMsg}. Rating: ${rating}/5`,
        { logbookId, screen: 'feedbacks' }
      );

      // Local notification for supervisor confirmation
      await sendLocalNotification(
        'Review Submitted',
        `Feedback for ${studentName}'s logbook (${logbookDate}) has been submitted.`
      );

      Alert.alert('Success! 🎉', 'Feedback submitted successfully. The student has been notified.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{existingReviewId ? 'Update Feedback' : 'Write Feedback'}</Text>
          <View style={{ width: 60 }} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Info banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerTitle}>📓 Logbook by {studentName}</Text>
              <Text style={styles.infoBannerDate}>{logbookDate ? formatDate(logbookDate) : 'N/A'}</Text>
            </View>

            {/* Rating */}
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Rating</Text>
              <Text style={styles.formHint}>How would you rate this logbook entry?</Text>
              <StarSelector rating={rating} onSelect={setRating} />
            </View>

            {/* Status */}
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Status</Text>
              <Text style={styles.formHint}>Set the review status for this logbook</Text>
              <View style={styles.statusOptions}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.statusOption,
                      status === opt.value && { backgroundColor: opt.bg, borderColor: opt.text },
                    ]}
                    onPress={() => setStatus(opt.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.statusOptionText, status === opt.value && { color: opt.text }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Review Text */}
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Your Feedback</Text>
              <Text style={styles.formHint}>Provide constructive feedback on the student's work, skills, and progress</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your detailed feedback here...&#10;&#10;Consider commenting on:&#10;• Quality of activities described&#10;• Skills development&#10;• Areas for improvement&#10;• Encouragement"
                placeholderTextColor="#94A3B8"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{reviewText.length} characters</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {existingReviewId ? '📤  Update Feedback' : '📤  Submit Feedback'}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.notifNote}>
              🔔 The student will receive a push notification when feedback is submitted.
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 60,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { color: '#A78BFA', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  infoBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoBannerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  infoBannerDate: { color: '#A78BFA', fontSize: 13, marginTop: 4 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  formLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  formHint: { fontSize: 12, color: '#64748B', marginBottom: 14 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starBtn: { padding: 4 },
  starIcon: { fontSize: 32 },
  ratingLabel: { fontSize: 14, color: '#64748B', marginLeft: 8, fontWeight: '600' },
  statusOptions: { gap: 8 },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  statusOptionText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 180,
    backgroundColor: '#F8FAFC',
    lineHeight: 22,
  },
  charCount: { fontSize: 11, color: '#94A3B8', textAlign: 'right', marginTop: 6 },
  submitBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: '#94A3B8' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  notifNote: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
