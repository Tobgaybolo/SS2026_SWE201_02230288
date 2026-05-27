import React from "react";
import ContactManagerScreen from "./src/screens/ContactManagerScreen";

// Root component for the app. Keeps `App.tsx` tiny and delegates
// the UI to `ContactManagerScreen` for clarity and testing.
export default function App() {
  return <ContactManagerScreen />;
}