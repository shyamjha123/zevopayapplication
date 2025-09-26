
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import Api from "../common/api/apiconfig";


// const QUICK_EMOJIS = ["😀", "😍", "👍", "😂", "😢", "🎉"];
const emojis = ['😀', '😢', '😮', '😡', '❤️', '🙏'];


const Mainwallet = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [prevFetchedData, setPrevFetchedData] = useState(null); // Track the previous fetched data
  const [showEmojis, setShowEmojis] = useState(false);
  const [showEmojisId, setShowEmojisId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState({});
  const [deletedEmojis, setDeletedEmojis] = useState({});
  const [emojiData, setEmojiData] = useState(null); // State to store emoji press data
  const [modetype, setModetype] = useState(''); // Assuming modetype is coming from elsewhere
  const [counter, setCounter] = useState(0); // Example state to refresh UI
  const [userapi, setUserapi] = useState([]);
  const { USER_URL, REACTION_URL, TRANSACTION_URL } = Api;
  // 1. Define your “hide” list in lower‑case
  const hideBalanceIds = ["k00000060", "te00000056"];
  useEffect(() => {
    // Set up an interval to update the counter every second (simulate a page refresh)
    const intervalId = setInterval(() => {
      setCounter(prevCounter => prevCounter + 1); // Simulate refresh by updating the state
    }, 10000); // 1000ms = 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Em

  useEffect(() => {
    // Fetch default data on component mount
    fetchDefaultTransactions();
  }, []);



  const fetchUserApi = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(USER_URL, {
        headers: {
          // method:"GET",
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new error(`HTTP error! : status : ${response.status}`);
      }
      const data = await response.json();
      setUserapi(data);
      console.log(data.mode, "dataresponseofUser");
    } catch (err) {
      console.log(err, "err")
    }

  };

  useEffect(() => {
    fetchUserApi();
  }, [])

  const handleEmojiPress = async (emoji, itemId, modetype) => {
    console.log(modetype, "modetypehggg");

    try {
      const token = await AsyncStorage.getItem("token");
      if (emoji === '👀') {
        await Haptics.selectionAsync();
      } else {
        await Haptics.selectionAsync();
      }

      setSelectedEmojis((prev) => {
        const isSameEmoji = prev[itemId] === emoji;
        return { ...prev, [itemId]: isSameEmoji ? null : emoji };
      });

      setShowEmojisId(null);

      const isSameEmoji = selectedEmojis[itemId] === emoji;
      const finalEmoji = isSameEmoji ? null : emoji;

      const response = await fetch(REACTION_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: itemId,
          type: modetype,
          reaction: finalEmoji,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error('Failed to update emoji');
      }

      const data = await response.json();
      console.log('Emoji updated on server:', data);

    } catch (error) {
      console.error('Error in handleEmojiPress:', error.message);
    }
  };

  // useEffect to call handleEmojiPress whenever emojiData changes
  useEffect(() => {
    if (emojiData) {
      const { emoji, itemId, modetype } = emojiData;
      handleEmojiPress(emoji, itemId, modetype);
    }
  }, [emojiData]); // This effect will run when emojiData changes

  const fetchDefaultTransactions = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated. Token is missing.");
        return;
      }

      const response = await fetch(
        TRANSACTION_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newTransactions = data.data;
        console.log(newTransactions, "newTransactions");
        setPrevFetchedData(newTransactions);
        setInitialBalance(parseFloat(newTransactions[0]?.tranAmt || 0));
        const updatedTransactions = calculateFinalBalances(newTransactions);
        setTransactions(updatedTransactions);
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

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTransactions(); // or any fetch logic
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTransactions = async () => {

    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated. Token is missing.");
        return;
      }

      const response = await fetch(
        `${TRANSACTION_URL}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data, "dataresponseaagyahey: ");

      if (response.ok) {
        const newTransactions = data.data;
        console.log(newTransactions, "newTransactions")

        if (
          JSON.stringify(newTransactions) === JSON.stringify(prevFetchedData)
        ) {
          Alert.alert("No new data", "There is no new data to update.");
          setIsButtonDisabled(true);
          return;
        }

        setPrevFetchedData(newTransactions);
        setInitialBalance(parseFloat(newTransactions[0]?.tranAmt || 0));
        const updatedTransactions = calculateFinalBalances(newTransactions);
        console.log(updatedTransactions, "updatedTransactions");

        setTransactions(updatedTransactions.reverse());
        console.log(transactions, "transactionsresponseaayahey")
        setIsButtonDisabled(false);
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

  const calculateFinalBalances = (transactions) => {
    let currentBalance = initialBalance;

    // ✅ Reverse transactions for bottom-to-top balance calculation
    let reversedTransactions = [...transactions].reverse();

    let updatedTransactions = reversedTransactions.map((transaction) => {
      let debitAmount = 0;
      let creditAmount = parseFloat(transaction.tranAmt) || 0;

      // ✅ For HDFC_VA transactions → use amount.d[0]
      if (transaction.type === "HDFC_VA" && transaction.amount?.d?.length > 0) {
        creditAmount = parseFloat(transaction.amount.d[0]);
        currentBalance += creditAmount;
      }

      // ✅ Condition for normal debit transactions
      if (transaction.mode === "CASH DEBIT") {
        debitAmount = parseFloat(transaction.tranAmt);
      } else if (transaction.type === "payout" && transaction.status !== "REFUNDED") {
        const payoutAmount = parseFloat(transaction.amount || 0);
        const surcharge = transaction.surchargeAmount || 0;
        debitAmount = payoutAmount + surcharge;
      } else if (transaction.type === "payout" && transaction.status === "PENDING" && transaction.transactionType === "IMPS") {
        const payoutAmount = parseFloat(transaction.amount || 0);
        const surcharge = transaction.surchargeAmount || 0;
        debitAmount = payoutAmount + surcharge;
      }


      //  Condition for refunded payouts (amount should be credited back)
      if (transaction.type === "payout" && transaction.status === "REFUNDED") {
        const refundAmount = parseFloat(transaction.amount || 0);
        const surcharge = parseFloat(transaction.surchargeAmount || 0);
        creditAmount = refundAmount + surcharge;
        currentBalance += creditAmount;  //  ADD BACK TO OVERALL BALANCE
      }

      //  Regular balance updates
      if (transaction.mode === "CASH DEBIT" || (transaction.type === "payout" && transaction.status !== "REFUNDED")) {
        currentBalance -= debitAmount;
      } else {
        currentBalance += parseFloat(transaction.tranAmt || 0);
      }

      return { ...transaction, calculatedBalance: currentBalance };
    });

    //  Reverse back to original order so latest remains on top
    return updatedTransactions.reverse();
  };


  const renderTransactionCard = ({ item }) => {
    const selectedEmoji = selectedEmojis[item.id];
    const showEmojis = showEmojisId === item.id;

    // Calculate the correct debit amount for UI
    let debitAmount = parseFloat(item.tranAmt) || 0; // Default transaction amount

    //  Updated condition: Only calculate if type === "payout" and status !== "REFUNDED"
    if (item.type === "payout" && item.status !== "REFUNDED") {
      const payoutAmount = parseFloat(item.amount || 0);
      const surcharge = item.surchargeAmount || 0;
      debitAmount = payoutAmount + surcharge;
    } else if (item.type === "payout" && item.status === "PENDING" && item.transactionType === "IMPS") {
      const payoutAmount = parseFloat(item.amount || 0);
      const surcharge = item.surchargeAmount || 0;
      debitAmount = payoutAmount + surcharge;
    }


    //  New condition: If type === "payout" && status === "REFUNDED", credit should be amount + surchargeAmount
    let creditAmount = parseFloat(item.tranAmt) || 0;

    if (item.type === "payout" && item.status === "REFUNDED") {
      const refundAmount = parseFloat(item.amount || 0);
      const surcharge = parseFloat(item.surchargeAmount || 0);
      creditAmount = refundAmount + surcharge;
    } else if (item.type === "HDFC_VA" && item.amount?.d?.length > 0) {
      creditAmount = parseFloat(item.amount.d[0]); // Use amount.d[0]
    }

    return (
      <TouchableOpacity activeOpacity={0.9}
        onPress={() => setShowEmojisId(item.id)}
        style={{ justifyContent: "center", alignItems: "center" }}>

        <View style={styles.card}>

          <View style={{ flexDirection: "column" }}>
            {/*  Emoji display logic */}
            {(selectedEmoji !== undefined || item.reaction) && (
              <TouchableOpacity onPress={() => handleEmojiPress(selectedEmoji ?? item.reaction, item.id, item.type)}>
                <Text style={styles.selectedEmoji}>
                  {selectedEmoji ?? item.reaction}
                </Text>
              </TouchableOpacity>
            )}
            {showEmojis && (
              <Animatable.View animation="fadeInUp" duration={300} style={styles.emojiContainer}>
                {emojis.map((emoji, index) => (
                  <TouchableOpacity key={index} onPress={() => handleEmojiPress(emoji, item.id, item.type)}>
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </Animatable.View>
            )}
            {!hideBalanceIds.includes(userapi?.userId?.toLowerCase()) && (
              <Text style={styles.cardText}>
                Remaining Balance: {item.calculatedBalance.toFixed(2)}
              </Text>
            )}

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
            <Text style={styles.narrationtext}>
              {
              item.type === "payout" && item.status !== "REFUNDED"
            ? item.transactionReferenceNo
              ? `Payout First / ${item.transactionReferenceNo} / ${item.id}`
              : item.errorMessage && item.errorMessage.includes(":")
                ? `Payout First / ${item.errorMessage.split(":")[1]?.trim()} / ${item.id}`
                : `Payout First / ${item.errorMessage ? item.errorMessage : "PENDING"} / ${item.id}`
            : item.type === "payout" && item.status === "REFUNDED"
              ? `Payout Refunded / ${item.paymentDescription} / ${item.transactionID}`
              : item.type === "HDFC_VA"
                ? (() => {
                  // 🔹 Extract method from transactionDesc before "payment"
                  let method = item.transactionDesc?.split(" ")[0] || "UNKNOWN";
                  return `Add Amt By ${method} / ${item.userReferenceNumber}`;
                })()
                : item.mode === "UPI"
                  ? `Add Amt By UPI / ${item.utr}`
                  : item.mode === "IMPS"
                    ? `Add Amt By virtual A/C / IMPS / ${item.Sender_receiver_info?.split("/")[1]}`
                    : item.mode === "NEFT"
                      ? `Add Amt By virtual A/C / NEFT / ${item.utr}`
                      : item.mode === "RTGS"
                        ? `Add Amt By virtual A/C / RTGS / ${item.utr}`
                        : item.mode === "CASH CREDIT"
                          ? `Admin - Add Fund - ${item.Sender_receiver_info}`
                          : item.mode === "CASH DEBIT"
                            ? `Admin - Deduct Fund - ${item.Sender_receiver_info}`
                            : item.Sender_receiver_info

              }
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            {item.mode === "CASH DEBIT" || (item.type === "payout" && item.status !== "REFUNDED") ? (
              <Text style={{ color: "blue" }}>
                <Text style={{ color: "red" }}>{debitAmount.toFixed(2)}</Text> Dr
              </Text>
            ) : (
              <Text style={{ color: "blue" }}>
                <Text style={{ color: "lightgreen" }}>{creditAmount.toFixed(2)}</Text> Cr
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Pressable
          style={styles.dateButton}
          onPress={() => showDatePicker("from")}
        >
          <View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.dateText}>Date</Text>
              <Text style={styles.dateText}>From</Text>
            </View>
            <Text style={styles.selectedDate}>{startDate || "Select"}</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.dateButton}
          onPress={() => showDatePicker("to")}
        >
          <View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.dateText}>Date</Text>
              <Text style={styles.dateText}>To</Text>
            </View>
            <Text style={styles.selectedDate}>{endDate || "Select"}</Text>
          </View>
        </Pressable>
        <Pressable
          style={[
            styles.findButton,
            isButtonDisabled && { backgroundColor: "#B0BEC5" },
          ]}
          onPress={fetchTransactions}
          disabled={isButtonDisabled}
        >
          <Text style={styles.findButtonText}>FIND</Text>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007BB5" // optional: customize color
            />
          }
        />
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%", // Adjust the width of the entire row
    marginBottom: 30,
  },
  dateButton: {
    backgroundColor: "rgba(211, 211, 211, 0.5)",
    width: "30%", // Reduced width for Date From/To buttons
    height: 50,
    paddingLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
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
    width: "20%", // Find button smaller width
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
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    marginVertical: 10,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,

  },
  cardText: {
    color: "#007BB5",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },
  narrationtext: {
    color: "gray",
    fontSize: 14,
    marginBottom: 5,

  },
  carddate: {
    color: "#007BB5",
    fontSize: 16,

  },
  selectedEmoji: {
    fontSize: 15,

  },
  emojiContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 25,
    marginTop: -15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
  },
  emoji: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});

export default Mainwallet;

















