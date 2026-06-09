import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';

interface FeedbackItem {
  id: string;
  review_text: string;
  rating: number;
  status: string;
  created_at: string;
  logbook: {
    date: string;
    activities_performed: string;
  } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  reviewed: { bg: '#DBEAFE', text: '#1D4ED8' },
  approved: { bg: '#DCFCE7', text: '#16A34A' },
  needs_revision: { bg: '#FEE2E2', text: '#DC2626' },
};

const STATUS_LABELS: Record<string, string> = {
  reviewed: 'Reviewed',
  approved: '✓ Approved',
  needs_revision: '⚠ Needs Revision',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, { color: star <= rating ? '#F59E0B' : '#E2E8F0' }]}>★</Text>
      ))}
    </View>
  );
}

export default function FeedbacksScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const fetchFeedbacks = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data, error } = await supabase
        .from('logbook_reviews')
        .select(`
          id, review_text, rating, status, created_at,
          logbook:logbook_id ( date, activities_performed )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks((data as any) || []);
    } catch (e) {
      console.error('Error fetching feedbacks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  const onRefresh = () => { setRefreshing(true); fetchFeedbacks(); };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Feedbacks</Text>
          <View style={{ width: 60 }} />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#38BDF8" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
          >
            {feedbacks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyTitle}>No Feedbacks Yet</Text>
                <Text style={styles.emptyDesc}>
                  Once your supervisor reviews your logbooks, feedback will appear here.
                </Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/logbook')}>
                  <Text style={styles.emptyBtnText}>Submit a Logbook</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.countText}>{feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} received</Text>
                {feedbacks.map((item) => {
                  const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.reviewed;
                  return (
                    <View key={item.id} style={styles.feedbackCard}>
                      {/* Card header */}
                      <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                          <Text style={styles.logbookDate}>
                            Logbook: {item.logbook?.date ? formatDate(item.logbook.date) : 'N/A'}
                          </Text>
                          <Text style={styles.reviewDate}>Reviewed {formatDate(item.created_at)}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                            {STATUS_LABELS[item.status] || item.status}
                          </Text>
                        </View>
                      </View>

                      {/* Logbook summary */}
                      {item.logbook?.activities_performed && (
                        <View style={styles.logbookPreview}>
                          <Text style={styles.logbookPreviewLabel}>Your Activities:</Text>
                          <Text style={styles.logbookPreviewText} numberOfLines={2}>
                            {item.logbook.activities_performed}
                          </Text>
                        </View>
                      )}

                      {/* Rating */}
                      {item.rating > 0 && (
                        <View style={styles.ratingRow}>
                          <StarRating rating={item.rating} />
                          <Text style={styles.ratingText}>{item.rating}/5</Text>
                        </View>
                      )}

                      {/* Review text */}
                      <View style={styles.reviewSection}>
                        <Text style={styles.reviewLabel}>Supervisor's Feedback:</Text>
                        <Text style={styles.reviewText}>{item.review_text}</Text>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  countText: { color: '#64748B', fontSize: 13, marginBottom: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: '#0F172A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  emptyBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderLeft: { flex: 1 },
  logbookDate: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  reviewDate: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  logbookPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  logbookPreviewLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 4 },
  logbookPreviewText: { fontSize: 13, color: '#334155', lineHeight: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  stars: { flexDirection: 'row' },
  star: { fontSize: 18 },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  reviewSection: {},
  reviewLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  reviewText: { fontSize: 14, color: '#334155', lineHeight: 22 },
});
