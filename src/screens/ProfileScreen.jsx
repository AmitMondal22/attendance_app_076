import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Email: {user.user_data.full_name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
