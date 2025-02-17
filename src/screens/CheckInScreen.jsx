import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, AppState } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from "react-native";

const TARGET_LOCATION = {
  latitude: 22.4612238,
  longitude: 88.3919277,
  radius: 200, // Change the radius to 200 meters
};

const CheckInScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: TARGET_LOCATION.latitude,
    longitude: TARGET_LOCATION.longitude,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    setMapRegion({
      latitude: TARGET_LOCATION.latitude,
      longitude: TARGET_LOCATION.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let appStateSubscription = null;

    const requestPermissionAndWatch = async () => {
      const granted = await requestLocationPermission();
      if (granted && isMounted) {
        getCurrentLocation();
      }
    };

    requestPermissionAndWatch();

    appStateSubscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active" && locationPermissionGranted) {
        getCurrentLocation();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        if (watchId) Geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    });

    return () => {
      isMounted = false;
      if (watchId) Geolocation.clearWatch(watchId);
      if (appStateSubscription) appStateSubscription.remove();
    };
  }, [locationPermissionGranted, watchId]);

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
          setLocationPermissionGranted(true);
          return true;
        } else {
          console.log("Location permission denied");
          Alert.alert('Permission Denied', 'Location permission is required for this feature.');
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setLocationPermissionGranted(true);
      return true;
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!locationPermissionGranted) return;

    if (watchId) Geolocation.clearWatch(watchId);

    // Set a larger distance filter for location updates
    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserLocation((prevLocation) => {
          if (!prevLocation || prevLocation.latitude !== latitude || prevLocation.longitude !== longitude) {
            checkProximity(latitude, longitude);

            // Update the map region with animateToRegion for smooth transition
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude,
                  longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                },
                500
              );
            }
            console.log("User Location:", { latitude, longitude });
            return { latitude, longitude };
          }
          return prevLocation;
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        Alert.alert("Location Error", "Could not fetch location. Please try again.");
      },
      {
        maximumAge: 1000, // Cache the location for 10 seconds
        distanceFilter: 10, // Only update if the location has changed by 10 meters
      }
    );

    setWatchId(id);
  }, [locationPermissionGranted]);

  const checkProximity = (lat, lng) => {
    const distance = getDistance(lat, lng, TARGET_LOCATION.latitude, TARGET_LOCATION.longitude);
    setIsWithinRadius(distance <= TARGET_LOCATION.radius);  // 200 meters radius
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert distance to meters
  };

  const handleClockIn = () => {
    if (isWithinRadius) {
      Alert.alert("Success", "You are within the check-in area.");
    } else {
      Alert.alert("Error", "You are outside the check-in area.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        mapType="satellite"
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true} // Ensure this is true
        followsUserLocation={true} // Ensures map follows user location
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={TARGET_LOCATION} title="Target Location" />
        <Circle center={TARGET_LOCATION} radius={TARGET_LOCATION.radius} strokeColor="rgba(0, 150, 255, 0.5)" fillColor="rgba(0, 150, 255, 0.2)" />
      </MapView>
      <View style={styles.bottomContainer}>
        <Text style={styles.locationText}>Current Location: {userLocation ? `Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Fetching..."}</Text>
        {isWithinRadius && (
          <TouchableOpacity
            style={[styles.clockInButton, !isWithinRadius && styles.disabledButton]}
            onPress={handleClockIn}
            disabled={!isWithinRadius}
          >
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
        )}
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

const darkMapStyle = [{ elementType: "geometry", stylers: [{ color: "#212121" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] }];

export default CheckInScreen;
