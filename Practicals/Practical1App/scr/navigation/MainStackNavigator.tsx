import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AboutScreen from "../screen/AboutScreen";
import HomeScreen from "../screen/HomeScreen";
const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen 
      name="About"
      component={AboutScreen}
      options={{ title: 'About', headerBackVisible: false }}/>
    </Stack.Navigator>
  );
}

export default MainStackNavigator;