import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid } from "react-native";
import useLocation from "../hooks/apihooks/useLocation";

const HomeAttendanceCard = () => {
  const navigation = useNavigation();
  const {apiLocationCheck} = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    apiLocationCheck();
  }, []);
  const check_in = async()=>{

  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
  
    const locationInterval = setInterval(() => {
      console.log("Fetching location...");
      getCurrentLocation();
    }, 30000); // Calls getCurrentLocation every 30 seconds
  
    return () => {
      clearInterval(timer);
      clearInterval(locationInterval);
    };
  }, []);
  

  

  // Request location permission for Android 6.0 and above
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to function properly.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted");
          getCurrentLocation(); // Request location after permission
        } else {
          console.log("Location permission denied");
          Alert.alert('Permission Denied', 'Location permission is required for this feature.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS already handles permissions through info.plist
      getCurrentLocation();
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    console.log("Requesting current location...");
    
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        console.log("Position:", position.coords);
        var checkdata=isWithinRadius(position.coords.latitude, position.coords.longitude);
        Alert.alert("Location", checkdata ? "You are within the radius" : "You are not within the radius");

      },
      (error) => {
        console.log("Error:", error.message);
        if (error.code === 3) {
          // Timeout error
          Alert.alert("Location Error", "Location request timed out. Trying again...");
          // Use getLastKnownPosition as a fallback
          getLastKnownLocation();
        } else {
          Alert.alert("Location Error", error.message);
        }
      },
      {
        maximumAge: 1000,  // Optional: Add maximumAge if you want to allow cached location
      }
    );
  };

  // Use last known location as a fallback if current position fails
  const getLastKnownLocation = () => {
    Geolocation.getLastKnownPosition(
      (position) => {
        if (position) {
          setLocation(position.coords);
          console.log("Last known position:", position.coords);
          
        } else {
          Alert.alert("Location Error", "Could not get location. Please check your GPS.");
        }
      },
      (error) => {
        Alert.alert("Location Error", "Error retrieving last known location.");
      }
    );
  };


  const isWithinRadius = (userLat, userLon)=> {
    const TARGET_LOCATION = {
        latitude: 22.5079851,
        longitude: 88.3727971,
        radius: 200 // Radius in meters
    };

    const earthRadius = 6371000; // Radius of the Earth in meters

    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    // Haversine formula
    const dLat = toRadians(userLat - TARGET_LOCATION.latitude);
    const dLon = toRadians(userLon - TARGET_LOCATION.longitude);
    
    const lat1 = toRadians(TARGET_LOCATION.latitude);
    const lat2 = toRadians(userLat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * 
              Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= TARGET_LOCATION.radius;
}

  const handleClockIn = async () => {
    try {
      await requestLocationPermission(); // Wait for permission before setting clockInTime
      setClockInTime(currentTime);
    } catch (error) {
      console.error("Clock In Error:", error);
      Alert.alert("Clock In Error", "An error occurred during clock in.");
    }

    let locationdate= location

    // navigation.navigate("ClockIn");
  };

  const handleClockOut = () => {
    try {
      setClockOutTime(currentTime);
    } catch (error) {
      console.error("Clock Out Error:", error);
      Alert.alert("Clock Out Error", "An error occurred during clock out.");
    }
  };

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
