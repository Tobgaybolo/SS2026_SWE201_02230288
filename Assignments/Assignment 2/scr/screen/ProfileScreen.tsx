import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ProfileScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with Profile */}
                <View style={styles.header}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarInitials}>KW</Text>
                    </View>
                    <Text style={styles.profileName}>Karma Wangchuk</Text>
                    <Text style={styles.profileSubtitle}>BE Software Engineering • Year 2</Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>7</Text>
                            <Text style={styles.statName}>Day streak</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>24</Text>
                            <Text style={styles.statName}>Sessions</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>38h</Text>
                            <Text style={styles.statName}>Studied</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.container}>
                    {/* Preferences Section */}
                    <Text style={styles.sectionHeader}>PREFERENCES</Text>
                    <View style={styles.card}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingIcon}>
                                <Text style={styles.settingIconText}>🎨</Text>
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingLabel}>Theme</Text>
                            </View>
                            <Text style={styles.settingValue}>Light</Text>
                        </View>

                        <View style={styles.settingDivider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingIcon}>
                                <Text style={styles.settingIconText}>⏱️</Text>
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingLabel}>Focus duration</Text>
                            </View>
                            <Text style={styles.settingValue}>25 min</Text>
                        </View>

                        <View style={styles.settingDivider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingIcon}>
                                <Text style={styles.settingIconText}>🔔</Text>
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingLabel}>Notifications</Text>
                            </View>
                            <View style={styles.toggle}>
                                <View style={styles.toggleIndicator} />
                            </View>
                        </View>
                    </View>

                    {/* Data Section */}
                    <Text style={styles.sectionHeader}>DATA</Text>
                    <View style={styles.card}>
                        <Pressable style={styles.cardButton}>
                            <Text style={styles.cardButtonText}>Export data</Text>
                            <Text style={styles.cardButtonArrow}>›</Text>
                        </Pressable>

                        <View style={styles.cardDivider} />

                        <Pressable style={styles.cardButton}>
                            <Text style={styles.cardButtonTextDanger}>Reset all data</Text>
                            <Text style={styles.cardButtonArrow}>›</Text>
                        </Pressable>
                    </View>

                    {/* About Section */}
                    <View style={styles.aboutCard}>
                        <Pressable style={styles.cardButton} onPress={() => navigation.navigate('Animations')}>
                            <Text style={styles.cardButtonText}>Animation Demo</Text>
                            <Text style={styles.cardButtonArrow}>›</Text>
                        </Pressable>
                        <View style={styles.cardDivider} />
                        <Pressable style={styles.cardButton}>
                            <Text style={styles.cardButtonText}>Version</Text>
                            <Text style={styles.versionValue}>1.0.0</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#7c5cff',
        paddingVertical: 32,
        paddingHorizontal: 18,
        alignItems: 'center',
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 16,
    },
    avatarInitials: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    statName: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    container: {
        padding: 18,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9ca3af',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e6eef8',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingIconText: {
        fontSize: 18,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
    },
    settingValue: {
        fontSize: 13,
        color: '#9ca3af',
    },
    settingDivider: {
        height: 1,
        backgroundColor: '#e6eef8',
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#7c5cff',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 4,
    },
    toggleIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ffffff',
    },
    cardButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    cardButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
    },
    cardButtonTextDanger: {
        fontSize: 15,
        fontWeight: '500',
        color: '#dc2626',
    },
    cardButtonArrow: {
        fontSize: 18,
        color: '#d1d5db',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#e6eef8',
    },
    aboutCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e6eef8',
    },
    versionValue: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '600',
    },
});

export default ProfileScreen;
