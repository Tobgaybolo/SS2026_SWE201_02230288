import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./scr/navigation/MainStackNavigator";
import React from "react";
import BottomTabs from "./scr/navigation/BottomTabs";
export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}