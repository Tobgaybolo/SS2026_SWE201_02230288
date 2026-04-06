import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PurpleScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Purple Screen</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'purple',
	},
	text: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
});
