import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import ContactDetailsScreen from "../screens/ContactDetailsScreen";
import { RootStackParamList } from "../navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CampusTabs"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0f2d46",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name="CampusTabs"
        component={BottomTabs}
        options={{ title: "Campus Companion", headerShown: false }}
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