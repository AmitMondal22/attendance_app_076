import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator, Image, View, Text, StyleSheet } from "react-native";

import ProfileScreen from "../screens/ProfileScreen";
import HomeStack from "./HomeStack";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../AuthContext";
import SlockInScreen from "../screens/SlockInScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true, // Show labels
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel, // Label styling
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "#888",
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="home" size={focused ? 30 : 26} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Activity"
            component={SlockInScreen} // Replace with correct screen
            options={{
              tabBarLabel: "Activity",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="check-circle" size={focused ? 30 : 26} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={HomeStack} // Replace with correct screen
            options={{
              tabBarLabel: "Tasks",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="chat" size={focused ? 30 : 26} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Training"
            component={HomeStack} // Replace with correct screen
            options={{
              tabBarLabel: "Training",
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="book" size={focused ? 30 : 26} color={color} />
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
                    style={[
                      styles.profileIcon,
                      focused && styles.profileIconActive,
                    ]}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 15,
    right: 15,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 25,
    elevation: 8, // Shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },
  profileIconActive: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
});
