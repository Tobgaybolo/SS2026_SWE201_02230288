import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screen/ProfileScreen";
import DashBoardScreen from "../screen/DashBoardScreen";
const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    // This stack controls how the app moves between the Home and About screens.
    <Stack.Navigator 
      initialRouteName="DashBoard"
      screenOptions={{
        headerShown: true,
        // Keep the header dark so the title stands out clearly.
        headerStyle: {
          backgroundColor: '#000000',
        },
        // White text gives us enough contrast against the dark header.
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      {/* DashBoard is the first screen the user sees when the app opens. */}
      <Stack.Screen name="DashBoard" component={DashBoardScreen}/>
      {/* Profile is the second screen used to demonstrate forward and back navigation. */}
      <Stack.Screen 
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile', headerBackVisible: false }}/>
    </Stack.Navigator>
  );
}

export default MainStackNavigator;