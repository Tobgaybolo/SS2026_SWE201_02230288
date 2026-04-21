import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./scr/navigation/MainStackNavigator";
import React from "react";

export default function App() {
  return (
    // NavigationContainer keeps the app's screen navigation state in one place.
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}