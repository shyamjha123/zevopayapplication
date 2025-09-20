
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
import Api from "../common/api/apiconfig";
import useGlobalstatePayoutreport from '../../hooks/GlobalstatePayoutreport';

const Payoutreport = () => {
    const {
        state, setState,
        transactions, setTransactions,
        loading, setLoading,
        exportModalVisible, setExportModalVisible,
        currentPage, setCurrentPage,
        lastPage, setLastPage,
        isFetchingMore, setIsFetchingMore
    } = useGlobalstatePayoutreport()

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
        setState((prevState) => ({
            ...prevState,
            isDatePickerVisible: false,
            [prevState.currentPicker === "from" ? "startDate" : "endDate"]: date,
        }));
    };

    const fetchTransactions = async (useDateRange = false, page = 1) => {
        if (page === 1) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const token = await AsyncStorage.getItem("token");
            let url = `${Api.PAYOUTREPORT_URL}?page=${page}`;

            if (state.startDate && state.endDate) {
                const formattedStart = format(state.startDate, "yyyy-MM-dd");
                console.log(formattedStart, "start");

                const formattedEnd = format(state.endDate, "yyyy-MM-dd");
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

    const fetchAllTransactions = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            let page = 1;
            let allTransactions = [];
            let lastPage = 1;

            do {
                let url = `${Api.PAYOUTREPORT_URL}?page=${page}`;

                if (state.startDate && state.endDate) {
                    const formattedStart = format(state.startDate, "yyyy-MM-dd");
                    const formattedEnd = format(state.endDate, "yyyy-MM-dd");
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
            fetchTransactions(true, currentPage + 1);
        }
    };

    const handleExport = async () => {
        const allTransactions = await fetchAllTransactions();
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

        console.log(allTransactions, "transactiondetails");


        // 🔹 Prepare transaction data
        const exportData = [
            ["Sno", "Name", "Beneficiary Acc No", "IFSC Code", "Amount", "Remarks", "Status", "Transaction ID", "RRN NO", "Date"], // Headers
            ...allTransactions.map((item, index) => [
                index + 1,
                item.beneficiaryName || "-",
                item.creditAccountNumber || "-",
                item.beneficiaryIFSC || "-",
                Number(item.amount).toFixed(2) || "-",
                item.paymentDescription || "-",
                item.status,
                ["SUCCESS", "PENDING", "FAILED"].includes(item.status) ? item.id : item.transactionID,
                item.transactionReferenceNo || "-",
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
        const allTransactions = await fetchAllTransactions();

        if (allTransactions.length === 0) {
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
            .map((item, index) => {
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.beneficiaryName || "-"}</td>
                        <td>${item.creditAccountNumber || "-"}</td>
                        <td>${item.beneficiaryIFSC || "-"}</td>
                        <td>${Number(item.amount).toFixed(2) || "-"}</td>
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
                        <th>Sno</th>
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
                <Text style={styles.cardText}>Amount: ₹{Number(item.amount).toFixed(2)}</Text>
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
                        <Text style={styles.selectedDate}>  {state.startDate ? format(state.startDate, "MM-dd-yyyy") : "Select"}</Text>
                    </View>
                </Pressable>

                <Pressable style={styles.dateButton} onPress={() => showDatePicker("to")}>
                    <View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text style={styles.dateText}>Date</Text>
                            <Text style={styles.dateText}>To</Text>
                        </View>
                        <Text style={styles.selectedDate}>{state.endDate ? format(state.endDate, "MM-dd-yyyy") : "Select"}</Text>
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
                {loading ? <ActivityIndicator size="large" color="#007BB5" /> : <FlatList
                    data={transactions}
                    renderItem={renderTransactionCard}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingMore ? <ActivityIndicator size="small" color="#007BB5" /> : null
                    }
                />
                }
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















































