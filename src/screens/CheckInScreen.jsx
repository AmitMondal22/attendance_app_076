import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, AppState } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from "react-native";

const TARGET_LOCATION = {
  latitude: 22.5079851,
  longitude: 88.3727971,
  radius: 200, // 200 meters radius
};

const CheckInScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      getCurrentLocation();
    }
  }, [locationPermissionGranted]);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermissionGranted(true);
        } else {
          Alert.alert("Permission Denied", "Location permission is required.");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setLocationPermissionGranted(true);
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!locationPermissionGranted) return;

    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserLocation({ latitude, longitude });
        checkProximity(latitude, longitude);

        // Animate map to user's new position
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }, 500);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        Alert.alert("Location Error", "Could not fetch location.");
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  }, [locationPermissionGranted]);

  const checkProximity = (lat, lng) => {
    const distance = getDistance(lat, lng, TARGET_LOCATION.latitude, TARGET_LOCATION.longitude);
    setIsWithinRadius(distance <= TARGET_LOCATION.radius);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const handleClockIn = () => {
    Alert.alert(isWithinRadius ? "Success" : "Error", isWithinRadius ? "Checked In Successfully!" : "You are outside the check-in area.");
  };

  return (
    <View style={styles.container}>
      {/* <MapView
        // ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: TARGET_LOCATION.latitude,
          longitude: TARGET_LOCATION.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        region={{
          latitude: TARGET_LOCATION.latitude,
          longitude: TARGET_LOCATION.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        // scrollEnabled={false} // Prevent user from moving map
        // zoomEnabled={false} // Prevent zooming
        // rotateEnabled={false} // Disable rotation
        // pitchEnabled={false} // Disable tilt
      >
        <Marker coordinate={TARGET_LOCATION} title="Target Location" />
        <Circle center={TARGET_LOCATION} radius={TARGET_LOCATION.radius} strokeColor="rgba(0, 150, 255, 0.5)" fillColor="rgba(0, 150, 255, 0.2)" />
      </MapView> */}
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 22.5079851,
          longitude: 88.3727971,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      <Marker coordinate={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
        } 
          strockColor="rgba(0, 150, 255, 0.5)"
        />

        </MapView>

      <View style={styles.bottomContainer}>
        <Text style={styles.locationText}>
          {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching location..."}
        </Text>

        <TouchableOpacity
          style={[styles.clockInButton, !isWithinRadius && styles.disabledButton]}
          onPress={handleClockIn}
          disabled={!isWithinRadius}
        >
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  map: { flex: 1 },

  bottomContainer: { padding: 20, backgroundColor: "#1E1E1E", alignItems: "center" },
  locationText: { fontSize: 16, color: "#BBBBBB", marginVertical: 10 },
  clockInButton: { backgroundColor: "#6200EE", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  disabledButton: { backgroundColor: "gray" },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});

export default CheckInScreen;
