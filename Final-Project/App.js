import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Easing, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { isSupabaseConfigured, supabase } from './supabase';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = Math.min(screenWidth - 16, 440);
const slideWidth = cardWidth - 24;
const gridImageSize = Math.floor((cardWidth - 24) / 3);

export default function App() {
    const [activeScreen, setActiveScreen] = useState('home');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;

    function GridItem({ src, label }) {
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
            Animated.spring(flipAnim, {
                toValue,
                friction: 8,
                useNativeDriver: true,
            }).start(() => (flipped.current = !flipped.current));
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

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: -(slideWidth * 3),
                    duration: 20000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        const timeout = setTimeout(() => {
            animation.start();
        }, 5000);

        return () => {
            clearTimeout(timeout);
            animation.stop();
        };
    }, [translateX]);

    function handleOpenLogin() {
        setActiveScreen('login');
    }

    function handleBackHome() {
        setActiveScreen('home');
    }

    async function handleLoginSubmit() {
        if (!isSupabaseConfigured || !supabase) {
            Alert.alert(
                'Supabase not configured',
                'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment first.'
            );
            return;
        }

        if (!email || !password) {
            Alert.alert('Missing information', 'Please enter both Gmail and password.');
            return;
        }

        try {
            setIsSubmitting(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                Alert.alert('Login failed', error.message);
                return;
            }

            Alert.alert('Success', 'Signed in with Supabase successfully.');
            setActiveScreen('student-dashboard');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (activeScreen === 'student-dashboard') {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

                    <View style={styles.header}>
                        <View style={styles.brandContainer}>
                            <Image
                                source={require('./public/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.headerTitle}>College of Science and Technology</Text>
                        </View>

                        <TouchableOpacity
                            onPress={async () => {
                                if (supabase) {
                                    await supabase.auth.signOut();
                                }
                                setActiveScreen('home');
                            }}
                            activeOpacity={0.85}
                            style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.dashboardScrollView} contentContainerStyle={styles.dashboardContent}>
                        <View style={styles.dashboardHeader}>
                            <Text style={styles.dashboardTitle}>Student Dashboard</Text>
                            <Text style={styles.dashboardSubtitle}>Welcome to your internship portal</Text>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Tasks Completed</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>85%</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>4</Text>
                                <Text style={styles.statLabel}>Weeks Left</Text>
                            </View>
                        </View>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Recent Activity</Text>
                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <Text style={styles.activityText}>Completed weekly report</Text>
                                <Text style={styles.activityTime}>2 hours ago</Text>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <Text style={styles.activityText}>Submitted project proposal</Text>
                                <Text style={styles.activityTime}>Yesterday</Text>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <Text style={styles.activityText}>Attended team meeting</Text>
                                <Text style={styles.activityTime}>2 days ago</Text>
                            </View>
                        </View>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
                            <View style={styles.taskItem}>
                                <Text style={styles.taskText}>Submit internship log</Text>
                                <Text style={styles.taskDue}>Due: Tomorrow</Text>
                            </View>
                            <View style={styles.taskItem}>
                                <Text style={styles.taskText}>Complete module 3 assessment</Text>
                                <Text style={styles.taskDue}>Due: In 3 days</Text>
                            </View>
                            <View style={styles.taskItem}>
                                <Text style={styles.taskText}>Prepare presentation</Text>
                                <Text style={styles.taskDue}>Due: Next week</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (activeScreen === 'login') {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

                    <View style={styles.header}>
                        <View style={styles.brandContainer}>
                            <Image
                                source={require('./public/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.headerTitle}>College of Science and Technology</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleBackHome}
                            activeOpacity={0.85}
                            style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Home</Text>
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView
                        style={styles.loginScreen}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={styles.loginCard}>
                            <Text style={styles.loginTitle}>Login</Text>
                            <Text style={styles.loginSubtitle}>Enter your Gmail and password to continue.</Text>

                            <Text style={styles.inputLabel}>Gmail</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="example@gmail.com"
                                placeholderTextColor="#94A3B8"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                            />

                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.submitButton} activeOpacity={0.9} onPress={handleLoginSubmit}>
                                <Text style={styles.submitButtonText}>{isSubmitting ? 'Signing in...' : 'Login'}</Text>
                            </TouchableOpacity>

                            <Text style={styles.supabaseNote}>
                                {isSupabaseConfigured ? 'Supabase connected and ready.' : 'Supabase env values are required.'}
                            </Text>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Image
                            source={require('./public/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.headerTitle}>College of Science and Technology</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleOpenLogin}
                        activeOpacity={0.85}
                        style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.portalTitleWrap}>
                        <Text style={styles.portalTitle}>Internship Portal</Text>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.transparentCard}>
                            <View style={styles.carouselViewport}>
                                <Animated.View style={[styles.carouselTrack, { transform: [{ translateX }] }]}>
                                    <Image source={require('./public/images/bg1.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                                    <Image source={require('./public/images/bg 2.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                                    <Image source={require('./public/images/bg 3.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                                    <Image source={require('./public/images/bg1.jpeg')} style={styles.carouselImage} resizeMode="cover" />
                                </Animated.View>
                            </View>
                        </View>

                        <View style={styles.organisationTitleWrap}>
                            <Text style={styles.portalTitle}>Organisation</Text>
                        </View>

                        <View style={styles.gridContainer}>
                            <GridItem src={require('./public/images/abit.png')} label="JIGDEN SHAKYA KARMA CHOING ZANGMO
 Thinley Dorji Tshering Norbu" />
                            <GridItem src={require('./public/images/dhi.png')} label="PEMA LOSEL MAURER

 SONAM ZANGMO WANGCHUK GYELTSHEN  YESHEY ZHENNUE SONAM CHOKI

" />
                            <GridItem src={require('./public/images/ds.png')} label="SONAM CHOKI GAYLAY CHODEN" />
                            <GridItem src={require('./public/images/gcbs.png')} label="SONAM WANGMO NAMGAY LHAMO SANGAY TENZIN TANDIN WANGCHUCK" />
                            <GridItem src={require('./public/images/gt.png')} label="KINLEY TOBGAY" />
                            <GridItem src={require('./public/images/ibest.png')} label="SONAM DORJI NYENDRAK YOEZER JIGME NGAWANG PHUNTSHO NAMGAYAL" />
                            <GridItem src={require('./public/images/itceh.png')} label="LHENDUP DORJI SHERAB NIMA" />
                            <GridItem src={require('./public/images/ricb.png')} label="NORBU DENDUP" />
                            <GridItem src={require('./public/images/ttp.png')} label="SANGAY CHODEN YESHEY LHADEN" />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
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
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexShrink: 1,
        marginTop: -2,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
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
    loginButtonText: {
        color: '#0F172A',
        fontSize: 13,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    portalTitleWrap: {
        paddingHorizontal: 24,
        paddingTop: 12,
        alignItems: 'center',
    },
    portalTitle: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    transparentCard: {
        width: '100%',
        maxWidth: cardWidth,
        paddingVertical: 30,
        paddingHorizontal: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.28)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    carouselViewport: {
        width: '100%',
        height: 240,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(15, 23, 42, 0.08)',
    },
    carouselTrack: {
        flexDirection: 'row',
        width: slideWidth * 4,
        height: '100%',
    },
    carouselImage: {
        width: slideWidth,
        height: '100%',
    },
    gridContainer: {
        width: '100%',
        maxWidth: cardWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    gridImage: {
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.06)'
    },
    flipCard: {
        backfaceVisibility: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ perspective: 1000 }],
    },
    gridBack: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridImageBack: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridLabel: {
        color: '#0F172A',
        fontWeight: '700',
        fontSize: 12,
        textAlign: 'center'
    },
    loginScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#F8FAFC',
    },
    loginCard: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 28,
        paddingHorizontal: 22,
        paddingVertical: 28,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    loginTitle: {
        color: '#0F172A',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },
    loginSubtitle: {
        color: '#475569',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 22,
        lineHeight: 19,
    },
    inputLabel: {
        color: '#0F172A',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
    },
    submitButton: {
        marginTop: 24,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    supabaseNote: {
        marginTop: 14,
        color: '#64748B',
        fontSize: 12,
        textAlign: 'center',
    },
    dashboardScrollView: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    dashboardContent: {
        padding: 24,
        paddingBottom: 32,
    },
    dashboardHeader: {
        marginBottom: 24,
    },
    dashboardTitle: {
        color: '#0F172A',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    dashboardSubtitle: {
        color: '#64748B',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    statNumber: {
        color: '#0F172A',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        color: '#64748B',
        fontSize: 12,
        textAlign: 'center',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    sectionTitle: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#38BDF8',
        marginRight: 12,
    },
    activityText: {
        flex: 1,
        color: '#334155',
        fontSize: 14,
    },
    activityTime: {
        color: '#94A3B8',
        fontSize: 12,
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    taskText: {
        flex: 1,
        color: '#334155',
        fontSize: 14,
    },
    taskDue: {
        color: '#F59E0B',
        fontSize: 12,
        fontWeight: '600',
    },
});
