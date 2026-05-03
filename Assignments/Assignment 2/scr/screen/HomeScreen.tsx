import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    useWindowDimensions,
} from "react-native";
import { Animated } from 'react-native';
import TaskCard from '../components/TaskCard';
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreen({ navigation }: any) {
    const { width } = useWindowDimensions();
    const isWide = width >= 600;
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    }, [fade]);

    const todaysTasks = [
        { id: "1", title: "Read Chapter 4 — OS", due: "10:00 AM", completed: true, tag: "CS", color: "#7c3aed" },
        { id: "2", title: "SWE201 Assignment 2", due: "11:59 PM", completed: false, tag: "SWE", color: "#3b82f6" },
        { id: "3", title: "Linear Algebra problem set", due: "Tomorrow", completed: false, tag: "MATH", color: "#dc2626" },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Purple Gradient Header */}
                <Animated.View style={[styles.header, { opacity: fade }] }>
                    <Text style={styles.greeting}>Good morning,</Text>
                    <Text style={styles.name}>Karma Wangchuk</Text>
                    <Text style={styles.date}>Saturday, 3 May 2026</Text>
                    
                    <View style={styles.streakBadge}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <Text style={styles.streakText}>7-day streak</Text>
                    </View>
                </Animated.View>

                <View style={styles.container}>
                    {/* Stat Cards */}
                    <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>4</Text>
                            <Text style={styles.statLabel}>Tasks left</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>2h</Text>
                            <Text style={styles.statLabel}>Studied</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>68%</Text>
                            <Text style={styles.statLabel}>Done</Text>
                        </View>
                    </View>

                    {/* Start Session CTA */}
                    <Pressable 
                      style={styles.ctaButton}
                      onPress={() => navigation.navigate('TaskSelection')}
                    >
                        <View style={styles.ctaContent}>
                            <View>
                                <Text style={styles.ctaLabel}>Current focus</Text>
                                <Text style={styles.ctaTitle}>Start a session</Text>
                            </View>
                            <View style={styles.playButton}>
                                <Text style={styles.playIcon}>▶</Text>
                            </View>
                        </View>
                    </Pressable>

                    {/* Today's Tasks */}
                    <Animated.View style={{ opacity: fade }}>
                      <Text style={styles.sectionTitle}>Today's tasks</Text>
                      {todaysTasks.map((task) => (
                          <TaskCard
                              key={task.id}
                              title={task.title}
                              subtitle={task.due}
                              onPress={() => navigation.navigate('Detail', { task })}
                          />
                      ))}
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f0f4f8",
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: "#7c5cff",
        paddingTop: 50,
        paddingBottom: 32,
        paddingHorizontal: 18,
    },
    greeting: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.7)",
        marginBottom: 16,
    },
    streakBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    streakEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    streakText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 14,
    },
    container: {
        padding: 18,
        paddingTop: -24,
    },
    statsRow: {
        flexDirection: "column",
        gap: 12,
        marginBottom: 20,
        marginTop: -20,
    },
    statsRowWide: {
        flexDirection: "row",
    },
    statBox: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e6eef8",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#7c5cff",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: "#9ca3af",
    },
    ctaButton: {
        backgroundColor: "#7c5cff",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
    },
    ctaContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    ctaLabel: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.7)",
        marginBottom: 4,
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#ffffff",
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    playIcon: {
        color: "#ffffff",
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#7c5cff",
        marginBottom: 12,
    },
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#e6eef8",
    },
    taskCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#7c5cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: "#e6eef8",
    },
    checkmark: {
        color: "#7c5cff",
        fontWeight: "700",
        fontSize: 14,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 2,
    },
    taskCompleted: {
        textDecorationLine: "line-through",
        color: "#9ca3af",
    },
    taskDue: {
        fontSize: 12,
        color: "#9ca3af",
    },
    taskTag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: "600",
    },
});

export default HomeScreen;
