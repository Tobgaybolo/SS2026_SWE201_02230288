import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { getUnreadNotificationCount } from '../hooks/use-notifications';

interface StudentSummary {
  user_id: string;
  name: string;
  organization: string | null;
  pendingLogbooks: number;
  totalLogbooks: number;
}

export default function SupervisorHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [supervisorName, setSupervisorName] = useState('Supervisor');
  const [supervisorId, setSupervisorId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      setSupervisorId(user.id);

      // Fetch supervisor profile
      const { data: profile } = await supabase
        .from('supervisor_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();
      if (profile?.name) setSupervisorName(profile.name);
      else setSupervisorName(user.email?.split('@')[0] || 'Supervisor');

      // Fetch assigned students
      const { data: studentProfiles } = await supabase
        .from('student_profiles')
        .select('user_id, name, organization')
        .eq('supervisor_id', user.id);

      const notifCount = await getUnreadNotificationCount(user.id);
      setUnreadCount(notifCount);

      if (!studentProfiles || studentProfiles.length === 0) {
        setStudents([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // For each student, fetch their logbook counts
      const studentIds = studentProfiles.map((s) => s.user_id);
      const [allLogbooks, reviewedLogbooks] = await Promise.all([
        supabase.from('logbooks').select('id, user_id, status').in('user_id', studentIds),
        supabase.from('logbooks').select('id, user_id').in('user_id', studentIds).in('status', ['reviewed', 'approved', 'needs_revision']),
      ]);

      const allLogs = allLogbooks.data || [];
      const reviewedLogs = reviewedLogbooks.data || [];

      let pending = 0;
      const mapped: StudentSummary[] = studentProfiles.map((sp) => {
        const total = allLogs.filter((l) => l.user_id === sp.user_id).length;
        const reviewed = reviewedLogs.filter((l) => l.user_id === sp.user_id).length;
        const pend = total - reviewed;
        pending += pend;
        return {
          user_id: sp.user_id,
          name: sp.name,
          organization: sp.organization,
          pendingLogbooks: pend,
          totalLogbooks: total,
        };
      });

      setStudents(mapped);
      setTotalPending(pending);
      setTotalReviewed(reviewedLogs.length);
    } catch (e) {
      console.error('Error fetching supervisor data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          if (supabase) await supabase.auth.signOut();
          router.replace('/');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image source={require('../public/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.headerTitle}>CST Internship Portal</Text>
              <Text style={styles.headerSubtitle}>Supervisor Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
              <Text style={styles.notifIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
        >
          {/* Welcome */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeGreeting}>Welcome, 👋</Text>
            <Text style={styles.welcomeName}>{supervisorName}</Text>
            <Text style={styles.welcomeDesc}>Review and manage your assigned students</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.statNumber}>{students.length}</Text>
              <Text style={[styles.statLabel, { color: '#3B82F6' }]}>Students{'\n'}Assigned</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
              <Text style={styles.statNumber}>{totalPending}</Text>
              <Text style={[styles.statLabel, { color: '#F97316' }]}>Pending{'\n'}Reviews</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.statNumber}>{totalReviewed}</Text>
              <Text style={[styles.statLabel, { color: '#22C55E' }]}>Reviews{'\n'}Done</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/supervisor-logbooks')}
              activeOpacity={0.85}
            >
              <View style={[styles.qaIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.qaEmoji}>📋</Text>
              </View>
              <View style={styles.qaText}>
                <Text style={styles.qaTitle}>Review Logbooks</Text>
                <Text style={styles.qaDesc}>
                  {totalPending > 0 ? `${totalPending} pending review${totalPending !== 1 ? 's' : ''}` : 'All caught up!'}
                </Text>
              </View>
              {totalPending > 0 && (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>{totalPending}</Text>
                </View>
              )}
              <Text style={styles.qaArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Student List */}
          <Text style={styles.sectionTitle}>Your Students</Text>
          {students.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👨‍🎓</Text>
              <Text style={styles.emptyTitle}>No Students Assigned</Text>
              <Text style={styles.emptyDesc}>
                Students will appear here once they are linked to your account in the database.
              </Text>
            </View>
          ) : (
            students.map((student) => (
              <TouchableOpacity
                key={student.user_id}
                style={styles.studentCard}
                onPress={() =>
                  router.push({
                    pathname: '/supervisor-logbooks',
                    params: { studentId: student.user_id, studentName: student.name },
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>{student.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  {student.organization && (
                    <Text style={styles.studentOrg}>📍 {student.organization}</Text>
                  )}
                  <Text style={styles.studentStats}>
                    {student.totalLogbooks} logbooks • {student.pendingLogbooks} pending
                  </Text>
                </View>
                {student.pendingLogbooks > 0 && (
                  <View style={styles.studentBadge}>
                    <Text style={styles.studentBadgeText}>{student.pendingLogbooks}</Text>
                  </View>
                )}
                <Text style={styles.studentArrow}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  headerSubtitle: { color: '#A78BFA', fontSize: 10, fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBtn: { position: 'relative', padding: 8 },
  notifIcon: { fontSize: 20 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  logoutBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  welcomeSection: { backgroundColor: '#1E293B', paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 },
  welcomeGreeting: { color: '#94A3B8', fontSize: 14 },
  welcomeName: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 2 },
  welcomeDesc: { color: '#64748B', fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 20, gap: 10, marginBottom: 4 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  quickActions: { paddingHorizontal: 16 },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  qaIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qaEmoji: { fontSize: 24 },
  qaText: { flex: 1 },
  qaTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  qaDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  qaArrow: { color: '#94A3B8', fontSize: 20 },
  pendingBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pendingBadgeText: { color: '#DC2626', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  studentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  studentOrg: { fontSize: 12, color: '#64748B', marginTop: 2 },
  studentStats: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  studentBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  studentBadgeText: { color: '#DC2626', fontSize: 12, fontWeight: '700' },
  studentArrow: { color: '#94A3B8', fontSize: 24 },
});
