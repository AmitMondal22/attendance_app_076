import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions,FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeMenuGrid = ({ menuItems }) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 800 ? 5 : width > 600 ? 4 : 3; // Adjust based on screen size

  return (
    <FlatList
      data={menuItems}
      numColumns={numColumns}
      nestedScrollEnabled={true}
      key={numColumns} // Rerender on orientation change
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={numColumns > 3 ? styles.rowWide : styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: item.bgColor }]}>
          <Ionicons name={item.icon} size={28} color={item.iconColor} />
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
   
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingVertical: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  rowWide: {
    justifyContent: "space-around",
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    margin: 5,
    borderRadius: 10,
    // elevation: 3, // Shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});

export default HomeMenuGrid;
