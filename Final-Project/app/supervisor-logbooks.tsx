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
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../supabase';

interface LogbookEntry {
  id: string;
  date: string;
  activities_performed: string;
  skills_learned: string;
  challenges_faced: string;
  status: string;
  created_at: string;
  user_id: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: '#D97706', bg: '#FEF3C7', label: '⏳ Pending Review' },
  reviewed: { color: '#1D4ED8', bg: '#DBEAFE', label: '👁 Reviewed' },
  approved: { color: '#16A34A', bg: '#DCFCE7', label: '✅ Approved' },
  needs_revision: { color: '#DC2626', bg: '#FEE2E2', label: '⚠ Needs Revision' },
};

export default function SupervisorLogbooks() {
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams<{ studentId: string; studentName: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>([]);
  const [supervisorId, setSupervisorId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchLogbooks = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      setSupervisorId(user.id);

      let query = supabase
        .from('logbooks')
        .select('*')
        .order('date', { ascending: false });

      if (studentId) {
        query = query.eq('user_id', studentId);
      } else {
        // All assigned students
        const { data: studentProfiles } = await supabase
          .from('student_profiles')
          .select('user_id')
          .eq('supervisor_id', user.id);
        const ids = studentProfiles?.map((s) => s.user_id) || [];
        if (ids.length > 0) query = query.in('user_id', ids);
        else { setLogbooks([]); setLoading(false); setRefreshing(false); return; }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogbooks(data || []);
    } catch (e) {
      console.error('Error fetching logbooks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId, router]);

  useEffect(() => { fetchLogbooks(); }, [fetchLogbooks]);

  const onRefresh = () => { setRefreshing(true); fetchLogbooks(); };

  const filteredLogbooks = filterStatus === 'all'
    ? logbooks
    : logbooks.filter((l) => l.status === filterStatus);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const handleReview = (logbook: LogbookEntry) => {
    router.push({
      pathname: '/supervisor-feedback',
      params: {
        logbookId: logbook.id,
        studentId: logbook.user_id,
        studentName: studentName || 'Student',
        logbookDate: logbook.date,
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{studentName ? `${studentName}'s Logbooks` : 'All Logbooks'}</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterBarContent}
        >
          {['all', 'pending', 'reviewed', 'approved', 'needs_revision'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterPill, filterStatus === status && styles.filterPillActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.filterPillText, filterStatus === status && styles.filterPillTextActive]}>
                {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#38BDF8" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
          >
            {filteredLogbooks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📓</Text>
                <Text style={styles.emptyTitle}>No Logbooks Found</Text>
                <Text style={styles.emptyDesc}>
                  {filterStatus !== 'all' ? 'Try a different filter.' : 'No logbooks have been submitted yet.'}
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.countText}>{filteredLogbooks.length} logbook{filteredLogbooks.length !== 1 ? 's' : ''}</Text>
                {filteredLogbooks.map((logbook) => {
                  const cfg = STATUS_CONFIG[logbook.status] || STATUS_CONFIG.pending;
                  return (
                    <View key={logbook.id} style={styles.logbookCard}>
                      <View style={styles.cardTop}>
                        <Text style={styles.cardDate}>{formatDate(logbook.date)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                        </View>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Activities Performed</Text>
                        <Text style={styles.fieldValue} numberOfLines={3}>{logbook.activities_performed}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Skills Learned</Text>
                        <Text style={styles.fieldValue} numberOfLines={2}>{logbook.skills_learned}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Challenges Faced</Text>
                        <Text style={styles.fieldValue} numberOfLines={2}>{logbook.challenges_faced}</Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.reviewBtn,
                          logbook.status !== 'pending' && styles.reviewBtnSecondary,
                        ]}
                        onPress={() => handleReview(logbook)}
                        activeOpacity={0.85}
                      >
                        <Text style={[
                          styles.reviewBtnText,
                          logbook.status !== 'pending' && styles.reviewBtnTextSecondary,
                        ]}>
                          {logbook.status === 'pending' ? '✏️  Write Review' : '📝  Update Review'}
                        </Text>
                      </TouchableOpacity>
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
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { color: '#A78BFA', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', flex: 1, textAlign: 'center' },
  filterBar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', maxHeight: 56 },
  filterBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterPillActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterPillTextActive: { color: '#FFFFFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  countText: { color: '#64748B', fontSize: 13, marginBottom: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  logbookCard: {
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardDate: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 13, color: '#334155', lineHeight: 20 },
  reviewBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  reviewBtnSecondary: { backgroundColor: '#F1F5F9' },
  reviewBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  reviewBtnTextSecondary: { color: '#475569' },
});
