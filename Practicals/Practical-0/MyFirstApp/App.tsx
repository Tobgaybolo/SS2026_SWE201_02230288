import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./scr/navigation/MainStackNavigator";
import React from "react";
import BottomTabs from "./scr/navigation/BottomTabs";
import FadeInBox from "./scr/animation/FadeInBox";
import SlideInCard from "./scr/animation/SlideInCard";
import StaggeredList from "./scr/animation/StaggeredList";
import HeartButton from "./scr/animation/HeartButton";
import MoveRight from "./scr/animation/MoveRight";
import AnimatedTodoList from "./scr/animation/AnimatedTodoList";
import LoadingScreen from "./scr/animation/LoadingScreen";

export default function App() {
  return (
    <LoadingScreen/>

  );
}