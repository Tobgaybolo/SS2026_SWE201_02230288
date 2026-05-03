import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "../screen/DetailScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AnimationDemoScreen from "../screen/AnimationDemoScreen";
import TaskSelectionScreen from "../screen/TaskSelectionScreen";

const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      {/* Tabs as the main navigation */}
      <Stack.Screen 
        name="HomeTabs" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Detail screen for category navigation */}
      <Stack.Screen 
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Category Details' }}
      />
      {/* Animation demo reachable via settings/profile */}
      <Stack.Screen
        name="Animations"
        component={AnimationDemoScreen}
        options={{ title: 'Animation Demo' }}
      />
      {/* Task Selection Screen */}
      <Stack.Screen
        name="TaskSelection"
        component={TaskSelectionScreen}
        options={{ title: 'Select Task' }}
      />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;