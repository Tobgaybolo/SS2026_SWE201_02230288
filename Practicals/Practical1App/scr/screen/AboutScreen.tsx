import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function AboutScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Screen</Text>
            <Text style={styles.subtitle}>This is a simple {"\n"}React Native app using Expo and navigation.</Text>
            <View style={styles.button}>
                <Button title="Go Back" 
                    onPress={() => navigation.goBack()} 
                    color='#FFFFFF'    
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#26619C',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
    },
    subtitle: {
        marginTop: 8,
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 18,
        backgroundColor:'#19191a',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
    }
});

export default AboutScreen;