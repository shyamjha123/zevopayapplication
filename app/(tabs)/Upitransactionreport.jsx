import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import XLSX from "xlsx";

const Upitransactionreport = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);


  const showDatePicker = (pickerType) => {
    setCurrentPicker(pickerType);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.log(date, 'date');
    console.log("Raw date:", date);
    console.log("Formatted:", format(date, "yyyy-MM-dd"));

    const formattedDate = format(date, "yyyy-MM-dd");
    if (currentPicker === "from") {
      setStartDate(formattedDate);
    } else if (currentPicker === "to") {
      setEndDate(formattedDate);
    }
    hideDatePicker();
  };


 const fetchTransactions = async (useDateRange = false, page = 1) => {
        if (page === 1) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const token = await AsyncStorage.getItem("token");
            let url = `https://zevopay.online/api/v1/user/upireport?page=${page}`;

            if (startDate && endDate) {
                const formattedStart = format(startDate, "yyyy-MM-dd");
                console.log(formattedStart, "start");

                const formattedEnd = format(endDate, "yyyy-MM-dd");
                console.log(formattedEnd, "start");
                url += `&startDate=${formattedStart}&endDate=${formattedEnd}`;
                console.log(url, 'urlbase');

            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const jsonResponse = await response.json();
            console.log(jsonResponse, "payoutreportresponse");

            if (jsonResponse && Array.isArray(jsonResponse.data)) {
                if (page === 1) {
                    setTransactions(jsonResponse.data);
                } else {
                    setTransactions(prev => [...prev, ...jsonResponse.data]);
                }

                setCurrentPage(jsonResponse.meta.currentPage);
                setLastPage(jsonResponse.meta.lastPage);
            } else {
                if (page === 1) setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };


  useEffect(() => {
    // Fetch data by default when the component loads
    fetchTransactions(false, 1);
  }, []);


  const fetchAllTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let page = 1;
      let allTransactions = [];
      let lastPage = 1;

      do {
        let url = `https://zevopay.online/api/v1/user/upireport?page=${page}`;

        if (startDate && endDate) {
          const formattedStart = format(startDate, "yyyy-MM-dd");
          const formattedEnd = format(endDate, "yyyy-MM-dd");
          url += `&startDate=${formattedStart}&endDate=${formattedEnd}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const jsonResponse = await response.json();

        if (jsonResponse && Array.isArray(jsonResponse.data)) {
          allTransactions = [...allTransactions, ...jsonResponse.data];
          lastPage = jsonResponse.meta.lastPage;
          page++;
        } else {
          break;
        }

      } while (page <= lastPage);

      return allTransactions;

    } catch (error) {
      console.error("Error fetching all transactions:", error);
      return [];
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && currentPage < lastPage) {
      fetchTransactions(false, currentPage + 1);
    }
  };

  const renderTransactionCard = ({ item }) => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.card}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}>Name: {item.user.name} </Text>
          <Text style={styles.cardText}>Beneficiary: vas.{item.van.toLowerCase()}@idbi</Text>
          <Text style={styles.cardText}>Amount: {Number(item.tranAmt).toFixed(2)}</Text>
          <Text style={styles.cardText}>Transaction ID: {item.utr}</Text>
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
    const allTransactions = await fetchAllTransactions();
    console.log(allTransactions, "aagytransactions");

    if (allTransactions.length === 0) {
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

    console.log(allTransactions, 'transactions');

    // 🔹 Prepare transaction data
    const exportData = [
      ["Sno", "Name", "Beneficiary", "Amount", "Transaction ID", "Date"], // Headers
      ...allTransactions.map((item, index) => [
        index + 1,
        item.user.name || "-",
        item.van ? `vas.${item.van.toLowerCase()}@idbi` : "-",
        Number(item.tranAmt).toFixed(2) || "-",
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
    XLSX.utils.book_append_sheet(wb, ws, "UPI Report");

    // 🔹 Write file
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const fileUri = FileSystem.documentDirectory + "UPI_Report.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export UPI Report",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  const handlePDFExport = async () => {
     const allTransactions = await fetchAllTransactions();
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

    const transactionRows = allTransactions
      .map((item,index) => {
        return `
                        <tr>
                           <td>${index + 1}</td>
                            <td>${item.user.name || "-"}</td>
                            <td>${item.van ? `${item.van.toLowerCase()}@idbi` : "-"}</td>
                            <td>${Number(item.tranAmt).toFixed(2) || "-"}</td>
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
                                 <th>Sno</th>
                                <th>Name</th>
                                <th>Beneficiary</th>
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

      <View style={{ width: "100%", flex: 1, backgroundColor: "lightgray" }}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionCard}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#007BB5" />
            ) : null
          }
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

export default Upitransactionreport;
