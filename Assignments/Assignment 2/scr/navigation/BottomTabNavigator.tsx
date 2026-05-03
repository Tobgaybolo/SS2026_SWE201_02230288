import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import CategoryScreen from '../screen/CategoryScreen';
import FocusTimerScreen from '../screen/FocusTimerScreen';
import ProfileScreen from '../screen/ProfileScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f172a',
        tabBarStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Tasks" component={CategoryScreen} options={{ tabBarIcon: () => <Text>📁</Text> }} />
      <Tab.Screen name="Focus" component={FocusTimerScreen} options={{ tabBarIcon: () => <Text>⏱️</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}
