import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = Math.min(screenWidth - 16, 440);
const slideWidth = cardWidth - 24;
const gridImageSize = Math.floor((cardWidth - 24) / 3);

function GridItem({ src, label }: { src: any; label: string }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const flipped = useRef(false);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  function toggleFlip() {
    const toValue = flipped.current ? 0 : 180;
    Animated.spring(flipAnim, { toValue, friction: 8, useNativeDriver: true }).start(
      () => (flipped.current = !flipped.current)
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={toggleFlip}>
      <View style={{ width: gridImageSize, height: gridImageSize }}>
        <Animated.View style={[styles.flipCard, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Image source={src} style={[styles.gridImage, { width: gridImageSize, height: gridImageSize }]} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={[styles.flipCard, styles.gridBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <View style={[styles.gridImage, styles.gridImageBack, { width: gridImageSize, height: gridImageSize }]}>
            <Text style={styles.gridLabel}>{label}</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -(slideWidth * 3),
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    const timeout = setTimeout(() => animation.start(), 3000);
    return () => { clearTimeout(timeout); animation.stop(); };
  }, [translateX]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image
              source={require('../public/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>College of Science and Technology</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Hero section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Internship Portal</Text>
            <Text style={styles.heroSubtitle}>
              Manage your internship journey — logbooks, attendance, and supervisor feedback all in one place.
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              activeOpacity={0.85}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.heroButtonText}>Get Started →</Text>
            </TouchableOpacity>
          </View>

          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📓</Text>
              <Text style={styles.featureTitle}>Logbooks</Text>
              <Text style={styles.featureDesc}>Submit daily work entries</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureTitle}>Attendance</Text>
              <Text style={styles.featureDesc}>Mark check-in & check-out</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureTitle}>Feedback</Text>
              <Text style={styles.featureDesc}>Get supervisor reviews</Text>
            </View>
          </View>

          {/* Carousel */}
          <View style={styles.content}>
            <View style={styles.transparentCard}>
              <View style={styles.carouselViewport}>
                <Animated.View style={[styles.carouselTrack, { transform: [{ translateX }] }]}>
                  <Image source={require('../public/images/bg1.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                  <Image source={require('../public/images/bg 2.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                  <Image source={require('../public/images/bg 3.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                  <Image source={require('../public/images/bg1.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                </Animated.View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Partner Organisations</Text>
              <Text style={styles.sectionSubtitle}>Tap a logo to see intern names</Text>
            </View>

            <View style={styles.gridContainer}>
              <GridItem src={require('../public/images/abit.png')} label="JIGDEN SHAKYA&#10;KARMA CHOING ZANGMO&#10;Thinley Dorji&#10;Tshering Norbu" />
              <GridItem src={require('../public/images/dhi.png')} label="PEMA LOSEL MAURER&#10;SONAM ZANGMO&#10;WANGCHUK GYELTSHEN&#10;YESHEY ZHENNUE&#10;SONAM CHOKI" />
              <GridItem src={require('../public/images/ds.png')} label="SONAM CHOKI&#10;GAYLAY CHODEN" />
              <GridItem src={require('../public/images/gcbs.png')} label="SONAM WANGMO&#10;NAMGAY LHAMO&#10;SANGAY TENZIN&#10;TANDIN WANGCHUCK" />
              <GridItem src={require('../public/images/gt.png')} label="KINLEY TOBGAY" />
              <GridItem src={require('../public/images/ibest.png')} label="SONAM DORJI&#10;NYENDRAK YOEZER&#10;JIGME NGAWANG&#10;PHUNTSHO NAMGAYAL" />
              <GridItem src={require('../public/images/itceh.png')} label="LHENDUP DORJI&#10;SHERAB NIMA" />
              <GridItem src={require('../public/images/ricb.png')} label="NORBU DENDUP" />
              <GridItem src={require('../public/images/ttp.png')} label="SANGAY CHODEN&#10;YESHEY LHADEN" />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 College of Science and Technology, Bhutan</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    minHeight: 72,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  logo: { width: 48, height: 48, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  loginButton: {
    minWidth: 80,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  heroSection: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  heroSubtitle: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  heroButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  heroButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },

  featuresRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  featureIcon: { fontSize: 24, marginBottom: 6 },
  featureTitle: { color: '#0F172A', fontSize: 12, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  featureDesc: { color: '#64748B', fontSize: 10, textAlign: 'center' },

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  transparentCard: {
    width: '100%',
    maxWidth: cardWidth,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  carouselViewport: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,23,42,0.08)',
  },
  carouselTrack: { flexDirection: 'row', width: slideWidth * 4, height: '100%' },
  carouselImage: { width: slideWidth, height: '100%' },

  sectionHeader: { alignSelf: 'flex-start', paddingLeft: 4, marginBottom: 12 },
  sectionTitle: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  sectionSubtitle: { color: '#64748B', fontSize: 12, marginTop: 2 },

  gridContainer: {
    width: '100%',
    maxWidth: cardWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: { borderRadius: 12, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  flipCard: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ perspective: 1000 }],
  },
  gridBack: { alignItems: 'center', justifyContent: 'center' },
  gridImageBack: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  gridLabel: { color: '#0F172A', fontWeight: '700', fontSize: 10, textAlign: 'center' },

  footer: { padding: 24, alignItems: 'center' },
  footerText: { color: '#94A3B8', fontSize: 11 },
});
