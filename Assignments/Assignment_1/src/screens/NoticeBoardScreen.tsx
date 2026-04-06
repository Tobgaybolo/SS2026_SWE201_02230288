import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Notice = {
	id: string;
	title: string;
	body: string;
	postedOn: string;
};

const NOTICES: Notice[] = [
	{
		id: "n1",
		title: "Orientation Week",
		body: "Department orientation starts Monday at 9:00 in Auditorium Hall.",
		postedOn: "Apr 04",
	},
	{
		id: "n2",
		title: "Library Account Setup",
		body: "New students can activate online access at the library desk until Friday.",
		postedOn: "Apr 05",
	},
	{
		id: "n3",
		title: "Club Registration",
		body: "Campus clubs will host booths in the main courtyard from 1:00 PM.",
		postedOn: "Apr 06",
	},
];

function NoticeBoardScreen() {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Notice Board</Text>
			<Text style={styles.subtitle}>Tap a notice to highlight it for quick review.</Text>

			<FlatList
				data={NOTICES}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => {
					const selected = item.id === selectedId;

					return (
						<Pressable
							onPress={() => setSelectedId(selected ? null : item.id)}
							style={[styles.noticeCard, selected && styles.noticeCardSelected]}
						>
							<Text style={[styles.noticeTitle, selected && styles.noticeTitleSelected]}>{item.title}</Text>
							<Text style={[styles.noticeBody, selected && styles.noticeBodySelected]}>{item.body}</Text>
							<Text style={[styles.noticeMeta, selected && styles.noticeMetaSelected]}>
								Posted: {item.postedOn}
							</Text>
						</Pressable>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f7fb",
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	title: {
		fontSize: 24,
		color: "#0f2d46",
		fontWeight: "800",
	},
	subtitle: {
		marginTop: 4,
		color: "#475467",
		marginBottom: 10,
	},
	listContent: {
		paddingBottom: 18,
		gap: 10,
	},
	noticeCard: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#d0d5dd",
		borderRadius: 12,
		padding: 14,
	},
	noticeCardSelected: {
		backgroundColor: "#0f2d46",
		borderColor: "#0f2d46",
	},
	noticeTitle: {
		fontSize: 17,
		fontWeight: "700",
		color: "#101828",
	},
	noticeTitleSelected: {
		color: "#ffffff",
	},
	noticeBody: {
		marginTop: 5,
		lineHeight: 21,
		color: "#475467",
	},
	noticeBodySelected: {
		color: "#e4e7ec",
	},
	noticeMeta: {
		marginTop: 8,
		fontSize: 12,
		color: "#667085",
		fontWeight: "600",
	},
	noticeMetaSelected: {
		color: "#d0d5dd",
	},
});

export default NoticeBoardScreen;
