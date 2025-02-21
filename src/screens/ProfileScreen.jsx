import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${user.user_data.full_name}&size=128`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.user_data.full_name}</Text>
        <Text style={styles.designation}>{user.user_data.deg}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Email: </Text>
          {user.user_data.email}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Mobile: </Text>
          {user.user_data.mobile}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Address: </Text>
          {user.user_data.address}
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    width: "90%",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  designation: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginVertical: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
