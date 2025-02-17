import React from "react";
import { AuthProvider } from "./src/AuthContext";
import AppNavigator from "./src/navigation/Navigation.js";


export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
