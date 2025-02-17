import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, AppState } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const TARGET_LOCATION = {
  latitude: 22.153756,
  longitude: 87.927534,
  radius: 100,
};

const CheckInScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const mapRef = useRef(null); // Ref for the map

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

    // Handle app state changes (background/foreground)
    appStateSubscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active" && locationPermissionGranted) {
        getCurrentLocation(); // Restart location tracking when app comes back to foreground
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        if (watchId) Geolocation.clearWatch(watchId); // Stop tracking in background/inactive
        setWatchId(null);
      }
    });


    return () => {
      isMounted = false;
      if (watchId) Geolocation.clearWatch(watchId);
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    // ... (This function remains the same)
  };

  const getCurrentLocation = useCallback(() => {
      if (!locationPermissionGranted) return;

      if (watchId) Geolocation.clearWatch(watchId);

      const id = Geolocation.watchPosition(
          (position) => {
              const { latitude, longitude } = position.coords;

              setUserLocation((prevLocation) => {
                  if (!prevLocation || prevLocation.latitude !== latitude || prevLocation.longitude !== longitude) {
                      checkProximity(latitude, longitude);
                      // Zoom to user location if it changes significantly
                      if (mapRef.current) {
                        mapRef.current.animateToRegion({
                          latitude,
                          longitude,
                          latitudeDelta: 0.002,
                          longitudeDelta: 0.002,
                        }, 500); // Animate over 500ms
                      }

                      return { latitude, longitude };
                  }
                  return prevLocation;
              });
          },
          (error) => {
              console.error("Geolocation error:", error);
              Alert.alert("Location Error", "Could not fetch location. Please try again.");
          },
          { enableHighAccuracy: true, distanceFilter: 10, timeout: 15000, maximumAge: 10000 } // Add timeout and maximumAge
      );

      setWatchId(id);
  }, [locationPermissionGranted]);


  const checkProximity = (lat, lng) => {
    // ... (This function remains the same)
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    // ... (This function remains the same)
  };

  const handleClockIn = () => {
     // ... (This function remains the same)
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Assign the ref to the MapView
        mapType="satellite"
        style={styles.map}
        initialRegion={{ // Use initialRegion for the first load
          latitude: TARGET_LOCATION.latitude,
          longitude: TARGET_LOCATION.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        region={userLocation ? { // Use region for dynamic updates
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        } : null}
        showsUserLocation={true}
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={TARGET_LOCATION} title="Target Location" />
        <Circle center={TARGET_LOCATION} radius={TARGET_LOCATION.radius} strokeColor="rgba(0, 150, 255, 0.5)" fillColor="rgba(0, 150, 255, 0.2)" />
      </MapView>
      <View style={styles.bottomContainer}>
        {/* ... (Rest of your UI) */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  map: { flex: 1 },
  bottomContainer: { padding: 20, backgroundColor: "#1E1E1E", alignItems: "center" },
  timeText: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  locationText: { fontSize: 16, color: "#BBBBBB", marginVertical: 10 },
  clockInButton: { backgroundColor: "#6200EE", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  disabledButton: { backgroundColor: "gray" },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});

const darkMapStyle = [{ elementType: "geometry", stylers: [{ color: "#212121" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] }];

export default CheckInScreen;