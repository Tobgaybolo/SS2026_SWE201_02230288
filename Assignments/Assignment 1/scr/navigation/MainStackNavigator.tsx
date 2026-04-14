import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import ContactDetailsScreen from "../screen/ContactDetailsScreen";

const Stack = createStackNavigator();

function MainStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Tabs">
            <Stack.Screen
                name="Tabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ContactDetails"
                component={ContactDetailsScreen}
                options={{ title: "Contact Details" }}
            />
        </Stack.Navigator>
    );
}

export default MainStackNavigator;