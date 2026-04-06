import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.subtitle}>Welcome to the basic multi-screen application.</Text>
            <View style={styles.button}>
                <Button 
                    title="Go to About" 
                    onPress={() => navigation.navigate('About')}
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
        padding: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    subtitle: {
        marginTop: 8,
        color: '#ffffff',
        fontSize: 16,
    },
    button: {
        marginTop: 18,
        backgroundColor:'#19191a',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
  },
});

export default HomeScreen;