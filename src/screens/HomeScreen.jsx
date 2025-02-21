import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeMenuGrid from "../components/HomeMenuGrid";
import HomeAttendanceCard from "../components/HomeAttendanceCard";
import { AuthContext } from "../AuthContext";

const menuItems = [
  { id: "1", name: "Check In", icon: "log-in", bgColor: "#FFEBEE", iconColor: "#D32F2F" },
  { id: "2", name: "Check Out", icon: "log-out", bgColor: "#E3F2FD", iconColor: "#1976D2" },
  { id: "3", name: "Daily Attendance", icon: "calendar", bgColor: "#E8F5E9", iconColor: "#388E3C" },
  { id: "4", name: "Attendance Report", icon: "document-text", bgColor: "#FFF3E0", iconColor: "#F57C00" },
  { id: "5", name: "Leave Requests", icon: "briefcase", bgColor: "#EDE7F6", iconColor: "#673AB7" },
  { id: "6", name: "Overtime Requests", icon: "time", bgColor: "#F3E5F5", iconColor: "#9C27B0" },
  { id: "7", name: "Late Arrivals", icon: "alert-circle", bgColor: "#E0F7FA", iconColor: "#0097A7" },
  { id: "8", name: "Early Departures", icon: "arrow-back", bgColor: "#FFFDE7", iconColor: "#FBC02D" },
  { id: "9", name: "Work from Home", icon: "home", bgColor: "#FCE4EC", iconColor: "#D81B60" },
  { id: "10", name: "Shift Management", icon: "swap-horizontal", bgColor: "#ECEFF1", iconColor: "#607D8B" },
];


const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [clockInTime, setClockInTime] = useState("07:58:55");
  const [clockOutTime, setClockOutTime] = useState("--:--:--");
  const { width } = useWindowDimensions();

  console.log("VVVVVVVVVVVVVVVVVVV",user.user_data);

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
};



  return (
    <>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>Vedanta Hr</Text>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </View>

        {/* User Profile */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: `https://ui-avatars.com/api/?name=${user.user_data.full_name}&size=128` }} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>{user.user_data.full_name}</Text>
            <Text style={styles.profileRole}>{user.user_data.deg}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate()}</Text>
            <Text style={styles.timeText}></Text>
            {/* <Text style={styles.timeText}>08:28:23 WIB</Text> */}
          </View>
        </View>

        <HomeAttendanceCard/>

        {/* Attendance Section */}
        {/* <View style={styles.attendanceCard}>
          <View style={styles.attendanceRow}>
            <Text style={styles.attendanceTitle}>Clock In</Text>
            <Text style={styles.attendanceTitle}>Clock Out</Text>
          </View>
          <View style={styles.attendanceRow}>
            <Text style={styles.clockTime}>{clockInTime}</Text>
            <Text style={styles.clockTime}>{clockOutTime}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clockInButton}>
              <Ionicons name="log-in" size={16} color="#fff" />
              <Text style={styles.buttonText}>Clock In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clockOutButton}>
              <Ionicons name="log-out" size={16} color="#fff" />
              <Text style={styles.buttonText}>Clock Out</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Menu Grid */}
        <HomeMenuGrid menuItems={menuItems} numColumns={width > 600 ? 5 : 3} />

        {/* Announcement Section */}
        {/* <View style={styles.announcementHeader}>
          <Text style={styles.announcementTitle}>Announcements</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        <Image source={{ uri: "https://source.unsplash.com/random" }} style={styles.announcementImage} /> */}
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
  },
  dateContainer: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 14,
    color: "#000",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  attendanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  clockTime: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clockInButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  clockOutButton: {
    flexDirection: "row",
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAll: {
    color: "#E91E63",
    fontSize: 14,
  },
  announcementImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default HomeScreen;
