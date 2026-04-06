import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Image,
    useWindowDimensions,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../navigationTypes";

type Props = BottomTabScreenProps<BottomTabParamList, "Home">;

function HomeScreen({ navigation }: Props) {
    const { width } = useWindowDimensions();
    const imageHeight = Math.min(260, Math.max(160, width * 0.45));

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Campus Companion</Text>
                <Text style={styles.subtitle}>Quick access to student essentials at one place.</Text>

                <Image
                    source={{
                        uri: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=60",
                    }}
                    style={[styles.heroImage, { height: imageHeight }]}
                    resizeMode="cover"
                />

                <View style={styles.grid}>
                    <Pressable style={styles.cardButton} onPress={() => navigation.navigate("Contacts")}>
                        <Text style={styles.cardTitle}>Important Contacts</Text>
                        <Text style={styles.cardText}>IT helpdesk, student services, library and more.</Text>
                    </Pressable>

                    <Pressable style={styles.cardButton} onPress={() => navigation.navigate("Schedule")}>
                        <Text style={styles.cardTitle}>Weekly Timetable</Text>
                        <Text style={styles.cardText}>Check your classes for each day at a glance.</Text>
                    </Pressable>

                    <Pressable style={styles.cardButton} onPress={() => navigation.navigate("NoticeBoard")}>
                        <Text style={styles.cardTitle}>Notice Board</Text>
                        <Text style={styles.cardText}>Latest announcements for new and returning students.</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#f4f7fb",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2d46",
    },
    subtitle: {
        marginTop: 6,
        color: "#475467",
        fontSize: 16,
    },
    heroImage: {
        width: "100%",
        borderRadius: 14,
        marginTop: 16,
    },
    grid: {
        marginTop: 16,
        gap: 12,
  },
    cardButton: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#d0d5dd",
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#0f2d46",
    },
    cardText: {
        marginTop: 4,
        color: "#344054",
        lineHeight: 21,
    },
});

export default HomeScreen;