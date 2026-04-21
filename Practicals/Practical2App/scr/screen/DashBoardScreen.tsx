import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreen({ navigation }: any) {
    const { width } = useWindowDimensions();
    const isWide = width >= 600;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>Responsive DashBoard</Text>
                    <Text style={styles.subtitle}>
                        This screen demonstrates a responsive layout that adapts to different
                        screen sizes
                    </Text>

                    <View style={[styles.cardRow, isWide && styles.cardRowWide]}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Card 1</Text>
                            <Text style={styles.cardText}>
                                This card stretches to fill available space using flex.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Card 2</Text>
                            <Text style={styles.cardText}>
                                On wider screens, cards appear side by side. On smaller screens,
                                they stack vertically.
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.button}
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <Text style={styles.buttonText}>Go to Profile</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f3f6fa",
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 18,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#1f2a37",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: "#364152",
        textAlign: "center",
        marginBottom: 18,
    },
    cardRow: {
        width: "100%",
        flexDirection: "column",
        gap: 12,
    },
    cardRowWide: {
        flexDirection: "row",
    },
    card: {
        flex: 1,
        width: "100%",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dde4ee",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2a37",
        marginBottom: 6,
    },
    cardText: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
    },
    infoSection: {
        width: "100%",
        marginTop: 16,
        padding: 16,
        backgroundColor: "#eaf2ff",
        borderRadius: 12,
    },
    infoHeading: {
        fontSize: 17,
        fontWeight: "600",
        color: "#1b4f99",
    },
    infoText: {
        marginTop: 6,
        fontSize: 14,
        color: "#24446c",
        lineHeight: 20,
    },
    button: {
        marginTop: 18,
        alignSelf: "center",
        backgroundColor: "#0f172a",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
  },
});

export default HomeScreen;