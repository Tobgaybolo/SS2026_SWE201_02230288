import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeScreen from "../screen/HomeScreen";
import ContactsScreen from "../screen/ContactsScreen";
import ScheduleScreen from "../screen/ScheduleScreen";
import NoticeBoardScreen from "../screen/NoticeBoardScreen";


const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: "gray",
                tabBarInactiveTintColor: "black",
                tabBarStyle: {
                    backgroundColor: "white",
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
                headerShown: false,
            }}
            >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Contacts" 
                component={ContactsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Schedule" 
                component={ScheduleScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="NoticeBoard" 
                component={NoticeBoardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="bullhorn" size={size} color={color} />
                    ),
                }}
            />


        </Tab.Navigator>
    );
}

export default BottomTabs;