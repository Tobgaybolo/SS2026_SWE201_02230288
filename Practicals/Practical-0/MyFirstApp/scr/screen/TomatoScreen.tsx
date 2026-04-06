import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TomatoScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Tomato Screen</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'tomato',
	},
	text: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
});
