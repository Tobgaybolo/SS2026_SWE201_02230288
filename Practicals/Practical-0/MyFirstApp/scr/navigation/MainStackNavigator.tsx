import { createStackNavigator } from "@react-navigation/stack";
import PurpleScreen from "../screen/PurpleScreen";
import TomatoScreen from "../screen/TomatoScreen";
import GoldScreen from "../screen/GoldScreen";

const Stack = createStackNavigator();

function MainStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Tomato"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Purple" component={PurpleScreen} />
            <Stack.Screen name="Tomato" component={TomatoScreen} />
            <Stack.Screen name="Gold" component={GoldScreen} />
        </Stack.Navigator>
    );
}

export default MainStackNavigator;