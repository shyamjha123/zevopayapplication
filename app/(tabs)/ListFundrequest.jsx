import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListFundrequest = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // 🔹 userName state


  const fetchUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    } catch (error) {
      console.error("Error fetching userName:", error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch("https://zevopay.online/api/v1/user/my-requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data && typeof data === "object") {
        const formattedData = Object.values(data); // convert object with numeric keys into array
        setTransactions(formattedData);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();   // 🔹 fetch name from AsyncStorage
    fetchRequests();   // 🔹 fetch transactions
  }, []);

  const renderTransactionCard = ({ item }) => {
    const status =
      item.actions && item.actions.length > 0 && item.actions[0].status
        ? item.actions[0].status
        : "PENDING";

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.card}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.cardText}>Member ID: {item.userUid}</Text>
            <Text style={styles.cardText}>Name: {userName || item.name || "-"}</Text>
            <Text style={styles.cardText}>Bank Name: {item.bankName}</Text>
            <Text style={styles.cardText}>UTR/RRN: {item.utrRrn}</Text>
            <Text style={styles.cardText}>Amount: {item.amount}</Text>
            <Text style={styles.cardText}>Narration/Remark: {item.narration || "-"}</Text>
            <Text style={styles.cardText}>Status: {status}</Text>
            <Text style={styles.carddate}>
              {new Date(item.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BB5" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderTransactionCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noData}>No Requests Found</Text>}
        />
      )}
    </View>
  );
};

export default ListFundrequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "95%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
  },
  carddate: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

