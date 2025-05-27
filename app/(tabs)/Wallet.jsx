import React, { useState } from "react";
import { Button, View, StyleSheet, Text, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Wallet = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          backgroundColor: "lightgray",
          width: "30%",
          height: "9%",
          marginTop: 30,
          paddingLeft: 10,
          borderRadius: 10,
        }}
        onPress={showDatePicker}
      >
        <View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Date</Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>From</Text>
          </View>

          <View
            style={{
              backgroundColor: "darkgray",
              width: "60%",
              height: 2,
              marginTop: 30,
            }}
          ></View>
        </View>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "lightgray",
          width: "30%",
          height: "9%",
          marginTop: 30,
          paddingLeft: 10,
          borderRadius: 10,
        }}
        onPress={showDatePicker}
      >
        <View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Date</Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>To</Text>
          </View>

          <View
            style={{
              backgroundColor: "darkgray",
              width: "60%",
              height: 2,
              marginTop: 30,
            }}
          ></View>
        </View>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Pressable
        style={{
          marginTop: 30,
          backgroundColor: "#4A90E2",
          width: "20%",
          height: "8%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>FIND</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop:20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
});

export default Wallet;
