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

interface DashboardStats {
  totalLogbooks: number;
  totalAttendance: number;
  totalFeedbacks: number;
  pendingReviews: number;
}

export default function StudentHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLogbooks: 0,
    totalAttendance: 0,
    totalFeedbacks: 0,
    pendingReviews: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      setUserId(user.id);

      // Fetch profile
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();
      if (profile?.name) setStudentName(profile.name);
      else setStudentName(user.email?.split('@')[0] || 'Student');

      // Fetch stats
      const [logbooksRes, attendanceRes, feedbacksRes, notifCount] = await Promise.all([
        supabase.from('logbooks').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('attendance').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('logbook_reviews').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        getUnreadNotificationCount(user.id),
      ]);

      setStats({
        totalLogbooks: logbooksRes.count || 0,
        totalAttendance: attendanceRes.count || 0,
        totalFeedbacks: feedbacksRes.count || 0,
        pendingReviews: 0,
      });
      setUnreadCount(notifCount);
    } catch (e) {
      console.error('Error fetching student data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleLogout = async () => {
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
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image source={require('../public/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.headerTitle}>CST Internship Portal</Text>
              <Text style={styles.headerSubtitle}>Student Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => router.push('/notifications')}
            >
              <Text style={styles.notifIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.85}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeGreeting}>Hello, 👋</Text>
            <Text style={styles.welcomeName}>{studentName}</Text>
            <Text style={styles.welcomeDesc}>Here's your internship progress at a glance</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.statNumber}>{stats.totalLogbooks}</Text>
              <Text style={[styles.statLabel, { color: '#3B82F6' }]}>Logbooks{'\n'}Submitted</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.statNumber}>{stats.totalAttendance}</Text>
              <Text style={[styles.statLabel, { color: '#22C55E' }]}>Attendance{'\n'}Records</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
              <Text style={styles.statNumber}>{stats.totalFeedbacks}</Text>
              <Text style={[styles.statLabel, { color: '#F97316' }]}>Feedbacks{'\n'}Received</Text>
            </View>
          </View>

          {/* Action cards */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.cardsGrid}>
            {/* Logbook */}
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/logbook')} activeOpacity={0.85}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.actionCardEmoji}>📓</Text>
              </View>
              <Text style={styles.actionCardTitle}>Submit Logbook</Text>
              <Text style={styles.actionCardDesc}>Record today's work, skills & challenges</Text>
              <View style={styles.actionCardArrow}>
                <Text style={styles.actionCardArrowText}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Attendance */}
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/attendance')} activeOpacity={0.85}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#DCFCE7' }]}>
                <Text style={styles.actionCardEmoji}>✅</Text>
              </View>
              <Text style={styles.actionCardTitle}>Mark Attendance</Text>
              <Text style={styles.actionCardDesc}>Log your check-in and check-out times</Text>
              <View style={styles.actionCardArrow}>
                <Text style={styles.actionCardArrowText}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Feedbacks */}
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/feedbacks')} activeOpacity={0.85}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#FEF9C3' }]}>
                <Text style={styles.actionCardEmoji}>💬</Text>
              </View>
              <Text style={styles.actionCardTitle}>View Feedbacks</Text>
              <Text style={styles.actionCardDesc}>Read supervisor reviews on your logbooks</Text>
              <View style={styles.actionCardArrow}>
                <Text style={styles.actionCardArrowText}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Monthly Reflection */}
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/monthly-reflection')} activeOpacity={0.85}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#F3E8FF' }]}>
                <Text style={styles.actionCardEmoji}>📅</Text>
              </View>
              <Text style={styles.actionCardTitle}>Monthly Reflection</Text>
              <Text style={styles.actionCardDesc}>Submit your monthly progress summary</Text>
              <View style={styles.actionCardArrow}>
                <Text style={styles.actionCardArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.notifBanner} onPress={() => router.push('/notifications')} activeOpacity={0.85}>
              <Text style={styles.notifBannerIcon}>🔔</Text>
              <View style={styles.notifBannerText}>
                <Text style={styles.notifBannerTitle}>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
                <Text style={styles.notifBannerDesc}>Tap to view feedback and updates</Text>
              </View>
              <Text style={styles.notifBannerArrow}>→</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: '#0F172A',
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
  headerSubtitle: { color: '#38BDF8', fontSize: 10, fontWeight: '600' },
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
  welcomeSection: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  welcomeGreeting: { color: '#94A3B8', fontSize: 14 },
  welcomeName: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 2 },
  welcomeDesc: { color: '#64748B', fontSize: 13, marginTop: 4 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },

  cardsGrid: { paddingHorizontal: 16, gap: 12 },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  actionCardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionCardEmoji: { fontSize: 24 },
  actionCardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  actionCardDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  actionCardArrow: { position: 'absolute', right: 20, top: '50%' },
  actionCardArrowText: { color: '#94A3B8', fontSize: 20, fontWeight: '300' },

  notifBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
    gap: 12,
  },
  notifBannerIcon: { fontSize: 24 },
  notifBannerText: { flex: 1 },
  notifBannerTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  notifBannerDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  notifBannerArrow: { color: '#F97316', fontSize: 18, fontWeight: '700' },
});
