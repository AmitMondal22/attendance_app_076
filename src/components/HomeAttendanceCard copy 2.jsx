import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Button, Platform, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const HomeAttendanceCard = () => {
  const [location, setLocation] = useState(null);

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

  // Open location settings if location services are turned off
  const openLocationSettings = () => {
    Linking.openSettings(); // Opens the app's settings page
  };

  // Function to get current location
  const getCurrentLocation = () => {
    console.log("Requesting current location...");

    // First attempt with getCurrentPosition
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        console.log("Position:", position.coords);
       
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
        // enableHighAccuracy: true, // Request high accuracy
        // timeout: 60000, // Increased timeout to 60 seconds
        // maximumAge: 10000, // Cache the location for 10 seconds
        maximumAge: 1000,
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {location ? (
        <Text>
          Latitude: {location.latitude}{"\n"}
          Longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Loading current location...</Text>
      )}
      <Button
        title="Open Location Settings"
        onPress={openLocationSettings}
      />
    </View>
  );
};

export default HomeAttendanceCard;
