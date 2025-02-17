import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Permissions } from "react-native"; // Import Permissions for iOS

const HomeAttendanceCard = () => {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null); // State for location errors

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const requestLocationPermission = async () => {
    try {
      let granted;
      if (Platform.OS === "android") {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      } else {  // iOS Permission Request
        granted = await Permissions.request('location');
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === 'granted') {
        return true;
      } else {
        Alert.alert("Permission Denied", "Location access is required.");
        return false;
      }
    } catch (err) {
      console.warn("Location permission error:", err);
      Alert.alert("Permission Error", "Error requesting location permission.");
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    console.log("Has permission:", hasPermission);
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationError(null); // Clear any previous errors
        console.log("Location:", { latitude, longitude }); // Log only when successful
      },
      (error) => {
        setLocationError(error.message); // Set the error message
        Alert.alert("Location Error", error.message); // Display a more user-friendly error
        console.error("Location Error:", error); // Keep the console error for debugging
      },
      {
        // enableHighAccuracy: true,
        // timeout: 15000,
        // maximumAge: 10000,  // Optional: Add maximumAge if you want to allow cached location
        maximumAge: 1000,  // Optional: Add maximumAge if you want to allow cached location
      }
    );
  };

  const handleClockIn = async () => {
    try {
      await getLocation(); // Wait for location before setting clockInTime
      setClockInTime(currentTime);
    } catch (error) {
      console.error("Clock In Error:", error);
      Alert.alert("Clock In Error", "An error occurred during clock in.");
    }
  };

  const handleClockOut = () => {
    try {
      setClockOutTime(currentTime);
    } catch (error) {
      console.error("Clock Out Error:", error);
      Alert.alert("Clock Out Error", "An error occurred during clock out.");
    }
  };

  useEffect(() => {
    if (location) {
      console.log("Location updated:", location);
    }
  }, [location]);

  return (
    <View style={styles.attendanceCard}>
      <View style={styles.attendanceRow}>
        <Text style={styles.attendanceTitle}>Clock In</Text>
        <Text style={styles.locationText}>{currentTime}</Text>
        <Text style={styles.attendanceTitle}>Clock Out</Text>
      </View>
      <View style={styles.attendanceRow}>
        <Text style={styles.clockTime}>{clockInTime || "--:--:--"}</Text>
        <Text style={styles.clockTime}>{clockOutTime || "--:--:--"}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.clockInButton} onPress={handleClockIn}>
          <Ionicons name="log-in" size={16} color="#fff" />
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clockOutButton} onPress={handleClockOut}>
          <Ionicons name="log-out" size={16} color="#fff" />
          <Text style={styles.buttonText}>Clock Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  attendanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clockTime: {
    fontSize: 20,
    fontWeight: "bold",
  },
  locationText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#007BFF",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  clockInButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  clockOutButton: {
    flexDirection: "row",
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
});

export default HomeAttendanceCard;
