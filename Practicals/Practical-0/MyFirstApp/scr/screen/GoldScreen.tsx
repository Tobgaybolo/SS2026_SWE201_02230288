import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GoldScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Gold Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gold',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
});