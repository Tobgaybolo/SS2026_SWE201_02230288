import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import NoticeBoardScreen from "../screens/NoticeBoardScreen";
import { BottomTabParamList } from "../navigationTypes";

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerStyle: { backgroundColor: "#0f2d46" },
				headerTintColor: "#ffffff",
				tabBarActiveTintColor: "#0f2d46",
				tabBarInactiveTintColor: "#667085",
				tabBarStyle: {
					height: 64,
					paddingBottom: 8,
					paddingTop: 6,
				},
			}}
		>
			<Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
			<Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: "Contacts" }} />
			<Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: "Timetable" }} />
			<Tab.Screen
				name="NoticeBoard"
				component={NoticeBoardScreen}
				options={{ title: "Notice Board" }}
			/>
		</Tab.Navigator>
	);
}

export default BottomTabs;
