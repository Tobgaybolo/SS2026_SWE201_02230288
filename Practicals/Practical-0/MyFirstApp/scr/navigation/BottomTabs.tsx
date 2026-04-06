import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainStackNavigator from "./MainStackNavigator";
import GoldScreen from "../screen/GoldScreen";
import PurpleScreen from "../screen/PurpleScreen";
import TomatoScreen from "../screen/TomatoScreen";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Gold"
            screenOptions={{
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "tomato",
                tabBarStyle: {
                    backgroundColor: "black",
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
                headerShown: false,
            }}
            >
            <Tab.Screen 
            options={{
                tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="gold" size={24} color="gold" />                )
            }}
            name="Gold" component={GoldScreen}/>
            <Tab.Screen name="Purple" component={PurpleScreen} />
            <Tab.Screen name="Tomato" component={TomatoScreen} />
        </Tab.Navigator>
    );
}

export default BottomTabs;