import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./src/navigations/MainStackNavigator";
import React from "react";
export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}