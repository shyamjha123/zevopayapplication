import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React from "react";
import CommonCards from "../common/CommonCards"; // Adjust the path as necessary
import { Link, useRouter } from "expo-router";
const Funding = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <CommonCards
                    onPress={() => router.push("/AddFundrequest", { customTitle: "My Payout History" })}
                    iconname={"wallet-outline"}
                    color={"#007BB5"}
                    text={"Add Fund Request"}
                    footertext={"Add Your Fund request"}
                />

                <CommonCards
                    onPress={() => router.push("/ListFundrequest")}
                    iconname={"wallet"}
                    color={"goldenrod"}
                    text={"List Fund Request"}
                    footertext={"List Fund Request"}
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

    },
    scrollContainer: {
        paddingVertical: 20, // Optional: add padding to the top and bottom of the scroll content
        gap: 20
    },
});

export default Funding;
