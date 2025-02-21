import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import useReport from "../../hooks/apihooks/useReport";

const InReport = () => {
  const { apiIneRport } = useReport();
  const [data, setData] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    callapiData();
  }, []);

  const callapiData = async () => {
    const response = await apiIneRport();
    console.log("Response", response.data.data);
    setData(response.data.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Table Header */}
      <View style={[styles.tableHeader, { width: width * 0.95 }]}>
        <Text style={styles.headerText}>Date</Text>
        <Text style={styles.headerText}>Time</Text>
        <Text style={styles.headerText}>Latitude</Text>
        <Text style={styles.headerText}>Longitude</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.clock_out_id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.tableRow, { width: width * 0.95 }]}>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{item.out_time}</Text>
            <Text style={styles.cell}>{item.latitude.toFixed(6)}</Text>
            <Text style={styles.cell}>{item.longitude.toFixed(6)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 70,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    height: 60, // Fixed height
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default InReport;
