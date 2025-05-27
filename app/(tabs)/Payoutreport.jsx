
// // latest 
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import XLSX from "xlsx";

const Payoutreport = () => {
    const [state, setState] = useState({
        currentPicker: null,
        isDatePickerVisible: false,
        startDate: null,
        endDate: null,
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);

    useEffect(() => {
        fetchTransactions(); // Fetch transactions on component mount
    }, []);

    const showDatePicker = (pickerType) => {

        setState((prevState) => ({
            ...prevState,
            currentPicker: pickerType,
            isDatePickerVisible: true,
        }));
    };

    const handleConfirm = (date) => {
        const formattedDate = format(date, "MM-dd-yyyy");
        setState((prevState) => ({
            ...prevState,
            isDatePickerVisible: false,
            [prevState.currentPicker === "from" ? "startDate" : "endDate"]: formattedDate,
        }));
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const url = state.startDate && state.endDate
                ? `https://zevopay.online/api/v1/wallet/transactions?start_date=${state.startDate}&end_date=${state.endDate}`
                : `https://zevopay.online/api/v1/wallet/transactions`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const jsonResponse = await response.json();

            console.log(jsonResponse, "jsonResponse");

            if (jsonResponse && jsonResponse.data && Array.isArray(jsonResponse.data)) {
                const filteredData = jsonResponse.data.filter((item) => item.type === "payout");
                setTransactions(filteredData);

                console.log(transactions, "transactionreport");
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

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
            ["Name", "Beneficiary Acc No", "IFSC Code", "Amount", "Remarks", "Status", "Transaction ID", "RRN NO", "Date"], // Headers
            ...transactions.map((item) => [
                item.beneficiaryName,
                item.creditAccountNumber,
                item.beneficiaryIFSC,
                item.amount,
                item.paymentDescription,
                item.status,
                ["SUCCESS", "PENDING", "FAILED"].includes(item.status) ? item.id : item.transactionID,
                item.transactionReferenceNo,
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
                        <td>${item.beneficiaryName || "-"}</td>
                        <td>${item.creditAccountNumber || "-"}</td>
                        <td>${item.beneficiaryIFSC || "-"}</td>
                        <td>${item.amount || "-"}</td>
                        <td>${item.paymentDescription || "-"}</td>
                        <td>${item.status || "-"}</td>
                        <td>${["SUCCESS", "PENDING", "FAILED"].includes(item.status) ? item.id : item.transactionID}</td>
                        <td>${item.transactionReferenceNo || "-"}</td>
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
                            <th>Beneficiary Acc No</th>
                            <th>IFSC</th>
                            <th>Amount</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                            <th>RRN No</th>
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

    const renderTransactionCard = ({ item }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.cardText}>Name: {item.beneficiaryName}</Text>
                <Text style={styles.cardText}>Beneficiary Acc No: {item.creditAccountNumber}</Text>
                <Text style={styles.cardText}>IFSC Code: {item.beneficiaryIFSC}</Text>
                <Text style={styles.cardText}>Amount: ₹{item.amount}</Text>
                <Text style={styles.cardText}>
                Remarks: {item.paymentDescription === "." ? "" : item.paymentDescription}
              </Text>
                <Text
                    style={[
                        styles.cardText,
                        { color: item.status === "SUCCESS" || item.status === "REFUNDED" ? "green" : "red" }
                    ]}
                >
                    Status: {item.status}
                </Text>
                <Text style={styles.cardText}>
                    Transaction ID: {["SUCCESS", "PENDING", "FAILED"].includes(item.status) ? item.id : item.transactionID}
                </Text>

                <Text style={styles.cardText}>RRN NO: {item.transactionReferenceNo}</Text>
                <Text style={styles.cardText}>Date: {new Date(item.created_at).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.rowContainer}>
                <Pressable style={styles.dateButton} onPress={() => showDatePicker("from")}>
                    <View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text style={styles.dateText}>Date</Text>
                            <Text style={styles.dateText}>From</Text>
                        </View>
                        <Text style={styles.selectedDate}>{state.startDate || "Select"}</Text>
                    </View>
                </Pressable>

                <Pressable style={styles.dateButton} onPress={() => showDatePicker("to")}>
                    <View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text style={styles.dateText}>Date</Text>
                            <Text style={styles.dateText}>To</Text>
                        </View>
                        <Text style={styles.selectedDate}>{state.endDate || "Select"}</Text>
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
                isVisible={state.isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setState((prevState) => ({ ...prevState, isDatePickerVisible: false }))}
            />
            <View style={styles.cardContainer}>
                {loading ? <ActivityIndicator size="large" color="#007BB5" /> : <FlatList data={transactions} renderItem={renderTransactionCard} />}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
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
    dateButton: {
        backgroundColor: "rgba(211, 211, 211, 0.5)",
        width: "24%",
        height: 60,
        paddingLeft: 10,
        borderRadius: 10,
        justifyContent: "center",
    },
    findButton: {
        backgroundColor: "#007BB5",
        width: "24%",
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    exportButton: {
        backgroundColor: "#007BB5",
        width: "24%",
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    excelButtonText: {
        color: "white",
        fontWeight: "bold",
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
    findButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    dateText: {
        color: "white",
        fontWeight: "bold",
    },
    cardContainer: { flex: 1, width: "100%", backgroundColor: "lightgray" },
    card: { backgroundColor: "white", padding: 15, margin: 10, borderRadius: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 5 },
    cardText: { color: "gray", fontSize: 16, marginBottom: 5 },
    selectedDate: { color: "gray" },
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
});

export default Payoutreport;















































