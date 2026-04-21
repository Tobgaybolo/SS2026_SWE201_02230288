import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AboutScreen({ navigation }: any) {
    const { width } = useWindowDimensions();
    // This is the same screen-size check used on Home, so both screens respond consistently.
    const isWide = width >= 600;

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* SafeAreaView avoids clashes with the notch, status bar, and rounded corners. */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>Responsive Profile</Text>
                    <Text style={styles.subtitle}>
                        This screen also uses responsive containers and scrolling
                    </Text>

                    {/* These cards behave like a simple adaptive grid. */}
                    <View style={[styles.sectionWrap, isWide && styles.sectionWrapWide]}>
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Responsive Principle</Text>
                            <Text style={styles.sectionText}>
                                Name, email, and other details can be shown here. The layout uses
                                full-width containers and padding so it looks good on both small and
                                large devices.
                            </Text>
                        </View>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>User Experience</Text>
                            <Text style={styles.sectionText}>
                                Settings and preferences are grouped in responsive blocks that adapt
                                to available space.
                            </Text>
                        </View>
                    </View>

                    {/* Go back to Home so the navigation flow stays easy to test. */}
                    <Pressable style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Go Back</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,
        // Makes the scroll area fill the screen instead of collapsing too small.
    },
    container: {
        flex: 1,
        padding: 18,
        // We still keep flex here so the spacing behaves nicely inside ScrollView.
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 8,
        color: '#374151',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
        lineHeight: 22,
    },
    sectionWrap: {
        width: '100%',
        flexDirection: 'column',
        // Default to a column layout on phones.
        gap: 12,
    },
    sectionWrapWide: {
        // On wider screens, the cards can sit side by side.
        flexDirection: 'row',
    },
    sectionCard: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dce2ea',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 6,
    },
    sectionText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    button: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#111827',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default AboutScreen;