import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid } from "react-native";
import useLocation from "../hooks/apihooks/useLocation";

const HomeAttendanceCard = () => {
  const navigation = useNavigation();
  const {apiLocationCheck, apiLocationCheckOut, apiClockIn,apiClockOut, apiLocationTrack,apiLocationSettings} = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({});
  const [clockinSatas, setClocainSatas] = useState(true);
  const [clockoutSatas, setClocaoutSatas] = useState(true);
  const [use_targeted_location, setUse_targeted_location] = useState({});
  const [licastioSettingsIs, setLicastioSettingsIs] = useState({});


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);


  // var use_targeted_location = {
  //     latitude: 22.5079851,
  //     longitude: 88.3727971,
  //     radius: 200 // Radius in meters
  // };

  useEffect(() => {
    updateCurrentLocation();
  }, [currentLocation]);

  const updateCurrentLocation=async() => {
    await apiLocationTrack(position.coords.latitude, position.coords.longitude);
  }
  useEffect(() => {
    getCurrentLocation();
    get_locationsettings()
    check_out();
    check_in();
  }, []);
  const get_locationsettings = async()=>{
    let data = await apiLocationSettings();
    console.log(data.data.data.settings_data);
    const tdata= {
      latitude: data.data.data.settings_data.latitude,
      longitude: data.data.data.settings_data.longitude,
      radius: data.data.data.settings_data.redus, // 200 meters radius
    }
    setLicastioSettingsIs(data.data.data.settings_data.settings_id)
    console.log(".......", tdata);
    setUse_targeted_location(tdata);
  }
  const check_in = async()=>{
    let data = await apiLocationCheck();
    console.log("CCCCCCCCCc>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data, "****************");
    let clockindata=data.data.data.clock_in_data
    // console.log("zzz>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"data, convertToLocaleTime(clockindata), "****************");
    if(Object.keys(data.data.data.clock_in_data).length > 0 ){
      console.log("zzz>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",convertToLocaleTime(data.data.data.clock_in_data.in_time), "****************");
      
      setClocainSatas(false)
      setClockInTime(convertToLocaleTime(data.data.data.clock_in_data.in_time));

    }else{
      setClocainSatas(true)
      setClocaoutSatas(false)
    }
  }



  const check_out = async()=>{
    let data = await apiLocationCheckOut();
    console.log("TTTTTTTTTTTTTTTTTTTT", data, "****************");
    let clockindata=data.data.data.clock_out_data
    // console.log("zzz>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"data, convertToLocaleTime(clockindata), "****************");
    if(Object.keys(data.data.data.clock_out_data).length > 0 ){
      console.log("TTTTTTTTTTTTTTTTTTTTTTTT",convertToLocaleTime(data.data.data.clock_out_data.out_time), "****************");
      
      setClocaoutSatas(false)
      setClockOutTime(convertToLocaleTime(data.data.data.clock_out_data.out_time));

    }else{
      setClocaoutSatas(true)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
  
    const locationInterval = setInterval(() => {
      console.log("Fetching location...");
      handelLocationTesyt();
    }, 30000); // Calls getCurrentLocation every 30 seconds
  
    return () => {
      clearInterval(timer);
      clearInterval(locationInterval);
    };
  }, []);

  const handelLocationTesyt = async ()=>{
    await requestLocationPermission();
  }
  

  

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
//   const getCurrentLocation = async () => { // Mark function as async
//     console.log("Requesting current location...");

//     Geolocation.getCurrentPosition(
//       async (position) => { // Mark callback as async
//         setLocation(position.coords);
//         console.log("Position:", position.coords);
        
//         var checkdata = isWithinRadius(position.coords.latitude, position.coords.longitude);
//         try {
//           let abs =await apiLocationTrack(position.coords.latitude, position.coords.longitude); // Now 'await' works
//           console.log("BBBBBBBBBB", abs);
//         } catch (error) {
//           console.error("Error tracking location:", error);
//         }
//         console.log("Location", checkdata ? "You are within the radius" : "You are not within the radius");
//         // Alert.alert("Location", checkdata ? "You are within the radius" : "You are not within the radius");


//       },
//       (error) => {
//         console.log("Error:", error.message);
//         if (error.code === 3) {
//           // Timeout error
//           Alert.alert("Location Error", "Location request timed out. Trying again...");

//           // Use getLastKnownPosition as a fallback
//           getLastKnownLocation();
//         } else {
//           Alert.alert("Location Error", error.message);
//         }
//       },
//       {
//         maximumAge: 1000, // Optional: Allow cached location
//       }
//     );
// };

const getCurrentLocation = () => {
  console.log("Requesting current location...");
  
  Geolocation.getCurrentPosition(
    (position) => {
      setLocation(position.coords);
      console.log("Position:", position.coords);
      var checkdata=isWithinRadius(position.coords.latitude, position.coords.longitude);
      Alert.alert("Location", checkdata ? "You are within the radius" : "You are not within the radius");
      console.log("LLLLLLLLLLLLLLLLocations:", checkdata ? "You are within the radius" : undefined);

      setCurrentLocation(checkdata);
      // await apiLocationTrack(position.coords.latitude, position.coords.longitude);


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
    //  const TARGET_LOCATION = {
    //     latitude: 22.5079851,
    //     longitude: 88.3727971,
    //     radius: 200 // Radius in meters
    // };

    
    const earthRadius = 6371000; // Radius of the Earth in meters

    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    console.log("DDDDDDDDDDDDDDDDDZZZZZZZZZZZZZZZZ",use_targeted_location);
    // Haversine formula
    const dLat = toRadians(userLat - use_targeted_location.latitude);
    const dLon = toRadians(userLon - use_targeted_location.longitude);
    
    const lat1 = toRadians(use_targeted_location.latitude);
    const lat2 = toRadians(userLat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * 
              Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    console.log("DDDDDDDDDDDDDDDDD",use_targeted_location);

    return distance <= use_targeted_location.radius;
}

  const handleClockIn = async () => {
    console.log(">>>>>>>>>>>>>>>>>>>>????????????????????????");
    try {
      await requestLocationPermission(); // Wait for permission before setting clockInTime
    } catch (error) {
      console.error("Clock In Error:", error);
      Alert.alert("Clock In Error", "An error occurred during clock in.");
    }
    
    var checkdata = isWithinRadius(location.latitude, location.longitude);
    if (!checkdata) {
      Alert.alert("Location Error", "You are not within the radius");
      return;
    }else{
      let add_data =  await apiClockIn(location.latitude, location.longitude,licastioSettingsIs);
    
      setClocainSatas(false)
      setClockInTime(currentTime);
      console.log(locationdate, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", add_data, "****************");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", add_data, "****************");
    }
    
    
    // navigation.navigate("ClockIn");
  };


  function convertToLocaleTime(timeString) {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds);
      
      return date.toLocaleTimeString(); // Converts to system's locale format
  }

  const handleClockOut = async() => {
    try {
      await requestLocationPermission(); // Wait for permission before setting clockInTime
    } catch (error) {
      console.error("Clock In Error:", error);
      Alert.alert("Clock In Error", "An error occurred during clock in.");
    }
    var checkdata = isWithinRadius(location.latitude, location.longitude);
    if (!checkdata) {
      Alert.alert("Location Error", "You are not within the radius");
      return;
    }else{
      let add_data =  await apiClockOut(location.latitude, location.longitude,licastioSettingsIs);
      setClockOutTime(currentTime);
      
      setClocaoutSatas(false)
      console.log(locationdate, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", add_data, "****************");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", add_data, "****************");
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
        <TouchableOpacity style={styles.clockInButton} onPress={handleClockIn} disabled={!clockinSatas}>
          <Ionicons name="log-in" size={16} color="#fff" />
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clockOutButton} onPress={handleClockOut} disabled={!clockoutSatas}>
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
