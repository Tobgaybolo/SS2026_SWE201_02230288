import React from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const WEEKLY_CLASSES = [
	{ day: "Monday", courses: ["SWE201: Mobile Dev (9:00 - 10:30)", "MAT202: Discrete Math (14:00 - 15:00)"] },
	{ day: "Tuesday", courses: ["SWE205: Software Testing (10:00 - 11:30)"] },
	{ day: "Wednesday", courses: ["SWE201 Lab (13:00 - 15:00)", "ENG204: Technical Writing (16:00 - 17:00)"] },
	{ day: "Thursday", courses: ["SWE203: Database Systems (9:30 - 11:00)"] },
	{ day: "Friday", courses: ["Project Consultation (11:00 - 12:00)", "Sports Hour (15:00 - 16:00)"] },
];

function ScheduleScreen() {
	const { width } = useWindowDimensions();
	const wideLayout = width >= 700;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Weekly Timetable</Text>
			<Text style={styles.subtitle}>A simple overview of classes for the week.</Text>

			<View style={[styles.grid, wideLayout && styles.gridWide]}>
				{WEEKLY_CLASSES.map((item) => (
					<View key={item.day} style={[styles.dayCard, wideLayout && styles.dayCardWide]}>
						<Text style={styles.dayLabel}>{item.day}</Text>
						{item.courses.map((course) => (
							<Text key={course} style={styles.course}>
								• {course}
							</Text>
						))}
					</View>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#f4f7fb",
		paddingHorizontal: 16,
		paddingVertical: 18,
	},
	title: {
		fontSize: 26,
		fontWeight: "800",
		color: "#0f2d46",
	},
	subtitle: {
		marginTop: 6,
		color: "#475467",
		marginBottom: 14,
	},
	grid: {
		gap: 10,
	},
	gridWide: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	dayCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#d0d5dd",
		padding: 14,
	},
	dayCardWide: {
		width: "48%",
	},
	dayLabel: {
		fontSize: 17,
		fontWeight: "700",
		color: "#101828",
		marginBottom: 6,
	},
	course: {
		color: "#344054",
		lineHeight: 22,
	},
});

export default ScheduleScreen;
