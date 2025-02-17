import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator, Image, View } from "react-native";

import ProfileScreen from "../screens/ProfileScreen";
import HomeStack from "./HomeStack";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../AuthContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarInactiveTintColor: "#888",
            tabBarActiveTintColor: "#007AFF",
            tabBarStyle: {
              height: 75,
              paddingBottom: 10,
              borderTopWidth: 0,
              elevation: 5, // Android shadow effect
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="home" size={focused ? 32 : 28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Activity"
            component={HomeStack} // Replace with correct screen
            options={{
              tabBarLabel: "Activity",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="check-circle" size={focused ? 32 : 28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={HomeStack} // Replace with correct screen
            options={{
              tabBarLabel: "Tasks",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="chat" size={focused ? 32 : 28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Training"
            component={HomeStack} // Replace with correct screen
            options={{
              tabBarLabel: "Training",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="book" size={focused ? 32 : 28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused }) => {
                const profileImage = user?.profilePicture || "https://via.placeholder.com/150"; // Fallback image
                return (
                  <Image
                    source={{ uri: profileImage }}
                    style={{
                      width: focused ? 36 : 30,
                      height: focused ? 36 : 30,
                      borderRadius: 18,
                      borderWidth: focused ? 2 : 0,
                      borderColor: "#007AFF",
                      backgroundColor: "#ddd", // Avoid blank space if image fails
                    }}
                    onError={() => console.log("Image failed to load")}
                  />
                );
              },
            }}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}
