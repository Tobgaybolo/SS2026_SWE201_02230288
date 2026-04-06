import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, Contact, RootStackParamList } from "../navigationTypes";

type Props = CompositeScreenProps<
	BottomTabScreenProps<BottomTabParamList, "Contacts">,
	NativeStackScreenProps<RootStackParamList>
>;

const CONTACTS: Contact[] = [
	{
		id: "1",
		name: "IT Helpdesk",
		role: "Technical Support",
		phone: "+975-2-555111",
		email: "ithelpdesk@college.edu.bt",
		office: "Block A, Room 102",
	},
	{
		id: "2",
		name: "Student Services",
		role: "Academic and Welfare",
		phone: "+975-2-555222",
		email: "studentservices@college.edu.bt",
		office: "Admin Building, Counter 1",
	},
	{
		id: "3",
		name: "Library Desk",
		role: "Library Assistance",
		phone: "+975-2-555333",
		email: "library@college.edu.bt",
		office: "Library Ground Floor",
	},
	{
		id: "4",
		name: "Hostel Office",
		role: "Accommodation Support",
		phone: "+975-2-555444",
		email: "hosteloffice@college.edu.bt",
		office: "Hostel Reception",
	},
];

function ContactsScreen({ navigation }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Important Contacts</Text>
			<FlatList
				data={CONTACTS}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<Pressable
						style={styles.item}
						onPress={() => navigation.navigate("ContactDetails", { contact: item })}
					>
						<Text style={styles.itemTitle}>{item.name}</Text>
						<Text style={styles.itemMeta}>{item.role}</Text>
						<Text style={styles.itemHint}>Tap to view full contact details</Text>
					</Pressable>
				)}
			/>
		</View>
	);
}

export default ContactsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f7fb",
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	heading: {
		fontSize: 24,
		fontWeight: "800",
		color: "#0f2d46",
		marginBottom: 10,
	},
	listContent: {
		paddingBottom: 18,
		gap: 10,
	},
	item: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#d0d5dd",
		borderRadius: 12,
		padding: 14,
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOpacity: 0.08,
				shadowOffset: { width: 0, height: 2 },
				shadowRadius: 5,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	itemTitle: {
		fontSize: 18,
		color: "#101828",
		fontWeight: "700",
	},
	itemMeta: {
		marginTop: 4,
		color: "#475467",
		fontWeight: "600",
	},
	itemHint: {
		marginTop: 6,
		color: "#667085",
	},
});
