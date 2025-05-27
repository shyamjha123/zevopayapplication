import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Modal
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import XLSX from "xlsx";

const Dmtreport = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userPhone, setUserPhone] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const phone = await AsyncStorage.getItem("userPhone");
        if (phone !== null) {
          setUserPhone(phone);
        }
      } catch (error) {
        console.log("Error fetching phone number", error);
      }
    };

    fetchPhone();
  }, []);



  const showDatePicker = (pickerType) => {
    setCurrentPicker(pickerType);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = format(date, "MM-dd-yyyy");
    if (currentPicker === "from") {
      setStartDate(formattedDate);
    } else if (currentPicker === "to") {
      setEndDate(formattedDate);
    }
    hideDatePicker();
  };

  const fetchTransactions = async (useDateRange = false) => {
    let url = "https://zevopay.online/api/v1/wallet/transactions";

    if (useDateRange) {
      if (!startDate || !endDate) {
        Alert.alert("Error", "Please select both start and end dates.");
        return;
      }
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated. Token is missing.");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Filter out transactions with mode "UPI"
        const filteredTransactions = data.data.filter(
          (transaction) =>
            transaction.mode !== "UPI" &&
            ["CASH CREDIT", "CASH DEBIT", "NEFT", "RTGS", "IMPS"].includes(transaction.mode)
        );
        setTransactions(filteredTransactions);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  console.log(transactions, "transactions")


  useEffect(() => {
    // Fetch data by default when the component loads
    fetchTransactions(false);
  }, []);

  const renderTransactionCard = ({ item }) => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.card}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Ionicons
              name={"phone-portrait-outline"}
              size={25}
              color={"red"}
            />
            <Text style={{ color: "gray" }}>{userPhone}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <MaterialIcons name="contact-page" size={25} color="skyblue" />
            <Text style={styles.cardText}>{item.user.name} </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <MaterialCommunityIcons name="bank" size={25} color="#007BB5" />
            <Text style={styles.cardText}>{item.van}</Text>
          </View>

          <Text style={styles.cardText}>₹ {item.tranAmt}</Text>
          <Text style={styles.cardText}>Txn Id: {item.utr}</Text>
          <Text style={styles.carddate}>
            {new Date(item.updated_at).toLocaleString("en-US", {
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


  const handleExport = async () => {
    if (transactions.length === 0) {
      alert("No data to export");
      return;
    }

    // 🔹 Get user info from AsyncStorage
    const keys = [
      "userName", "userEmail", "userPhone", "virtual_account", "status",
      "address", "aadharNumber", "panNumber", "state", "shopName",
      "shopAddress", "gstNumber", "businessPanNo", "landlineNumber",
      "landlineSTDCode", "country"
    ];

    const values = await AsyncStorage.multiGet(keys);
    const userInfo = Object.fromEntries(values);

    // 🔹 Prepare user info as a table
    const userInfoRows = [
      ["Field", "Value"], // Headers for user info
      ...Object.entries(userInfo).map(([key, value]) => [key, value])
    ];

    // 🔹 Add an empty row to separate user info and transactions
    const emptyRow = [[]];

    // 🔹 Prepare transaction data
    const exportData = [
      ["Name", "phoneNumber", "Virtual ACC No.", "Amount", "Txn Id", "Date"], // Headers
      ...transactions.map((item) => [
        item.user.name || "-",
        userPhone || "-",
        item.van || "-",
        item.tranAmt || "-",
        item.utr || "-",
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date(item.created_at))
      ])
    ];

    // 🔹 Combine everything
    const combinedData = [...userInfoRows, ...emptyRow, ...exportData];

    // 🔹 Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payout Report");

    // 🔹 Write file
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const fileUri = FileSystem.documentDirectory + "Payout_Report.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export Payout Report",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  const handlePDFExport = async () => {
    if (transactions.length === 0) {
      alert("No data to export");
      return;
    }

    const keys = [
      "userName", "userEmail", "userPhone", "virtual_account", "status",
      "address", "aadharNumber", "panNumber", "state", "shopName",
      "shopAddress", "gstNumber", "businessPanNo", "landlineNumber",
      "landlineSTDCode", "country"
    ];
    const values = await AsyncStorage.multiGet(keys);
    const userInfo = Object.fromEntries(values);

    const userInfoTable = Object.entries(userInfo)
      .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
      .join("");

    const transactionRows = transactions
      .map((item) => {
        return `
                      <tr>
                          <td>${item.user.name || "-"}</td>
                          <td>${userPhone || "-"}</td>
                          <td>${item.van || "-"}</td>
                          <td>${item.tranAmt || "-"}</td>
                          <td>${item.utr || "-"}</td>
                          <td>${new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date(item.created_at))}</td>
                      </tr>`;
      })
      .join("");

    const html = `
              <html>
                  <head>
                      <meta charset="utf-8" />
                      <style>
                          table {
                              width: 100%;
                              border-collapse: collapse;
                              margin-bottom: 20px;
                          }
                          th, td {
                              border: 1px solid #ccc;
                              padding: 8px;
                              text-align: left;
                          }
                          th {
                              background-color: #f2f2f2;
                          }
                          h2 {
                              margin-bottom: 10px;
                              color: #007BB5;
                          }
                      </style>
                  </head>
                  <body>
                      <h2>User Information</h2>
                      <table>
                          <tr><th>Field</th><th>Value</th></tr>
                          ${userInfoTable}
                      </table>
      
                      <h2>Transaction Details</h2>
                      <table>
                          <tr>
                              <th>Name</th>
                              <th>Phone number</th>
                              <th>Virtual Acc No.</th>
                              <th>Amount</th>
                              <th>Transaction ID</th>
                              <th>Date</th>
                          </tr>
                          ${transactionRows}
                      </table>
                  </body>
              </html>
          `;

    try {
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export Payout Report (PDF)",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.rowContainer}>
        <Pressable style={styles.dateButton} onPress={() => showDatePicker("from")}>
          <View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.dateText}>Date</Text>
              <Text style={styles.dateText}>From</Text>
            </View>
            <Text style={styles.selectedDate}>{startDate || "Select"}</Text>
          </View>
        </Pressable>

        <Pressable style={styles.dateButton} onPress={() => showDatePicker("to")}>
          <View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.dateText}>Date</Text>
              <Text style={styles.dateText}>To</Text>
            </View>
            <Text style={styles.selectedDate}>{endDate || "Select"}</Text>
          </View>
        </Pressable>

        <Pressable onPress={fetchTransactions} style={styles.findButton}>
          <Text style={styles.findButtonText}>FIND</Text>
        </Pressable>

        <Pressable onPress={() => setExportModalVisible(true)} style={styles.exportButton}>
          <Text style={styles.findButtonText}>EXPORT</Text>
        </Pressable>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.cardContainer}>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionCard}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <Modal
        visible={exportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Download Transaction History?</Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Pressable style={styles.excelButton} onPress={() => {
                setExportModalVisible(false);
                handleExport();
              }}>
                <Text style={styles.excelButtonText}>EXCEL</Text>
              </Pressable>
              <Pressable style={styles.excelButton} onPress={() => {
                setExportModalVisible(false);
                handlePDFExport();
              }}>
                <Text style={styles.excelButtonText}>PDF</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "lightgray"
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    alignSelf: "center",
    marginBottom: 20,
    gap: 5,
  },
  excelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  excelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "rgba(211, 211, 211, 0.5)",
    width: "24%",
    height: 60,
    paddingLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  exportButton: {
    backgroundColor: "#007BB5",
    width: "24%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedDate: {
    color: "gray",
    marginTop: 5,
  },
  findButton: {
    backgroundColor: "#007BB5",
    width: "20%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  findButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingTop: 20,
  },
  card: {
    flexDirection: "row",
    marginLeft: 20,
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: "gray",
    fontSize: 16,
    marginBottom: 5,
  },
  carddate: {
    color: "gray",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  excelButton: {
    backgroundColor: "#007BB5",
    width: "24%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    // color:"#fff"
  },
});

export default Dmtreport;
