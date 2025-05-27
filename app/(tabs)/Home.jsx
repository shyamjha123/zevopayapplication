import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Book from "./assests/book.png";
import BBPS from "./assests/BBPS.png";
import Prepaid from "./assests/Prepaid.png";
import DMT from "./assests/DMT.png";
import QUICK from "./assests/QUICK.png";
import Payout from "./assests/Payout.png";
import Logo from "./assests/logo.png";

const data = [
  {
    id: "1",
    title: "AEPS",
    img: Book,
    text: "Aadhaar Enabled Payment System (AEPS) is a payment service that allows a bank customer to use Aadhaar as his/her identity to access his/her Aadhaar enabled bank account and perform basic banking transactions.",
  },
  {
    id: "2",
    title: "BBPS",
    img: BBPS,
    text: "Bharat Bill Payment System (BBPS) is an online bill payment system. National Payments Corporation of India (NPCI) functioning as a sanctioned Bharat Bill Payment Central Unit (BBPCU) is responsible for setting standards.",
  },
  {
    id: "3",
    title: "Mobile Prepaid Recharge",
    img: Prepaid,
    text: "Bharat Bill Payment System (BBPS) is an online bill payment system. National Payments Corporation of India (NPCI) functioning as a sanctioned Bharat Bill Payment Central Unit (BBPCU) is responsible for setting standards.",
  },
  {
    id: "4",
    title: "DMT",
    img: DMT,
    text: "Domestic Money Transfer Service enables customers to transfer money to any bank account all around India anytime instantly with reliability and convenience.Domestic Money Transfers allow you to send funds across bank accounts in India.",
  },
  {
    id: "5",
    title: "Quick Transfer",
    img: QUICK,
    text: "As part of our comprehensive B2B services, ZevoPay offers assistance with PAN (Permanent Account Number) card application and related services. We understand the importance of PAN cards for businesses and individuals in India.",
  },
  {
    id: "6",
    title: "Payout",
    img: Payout,
    text: "B2B recharge service refers to a business-to-business service that allows businesses to recharge or top-up the prepaid accounts of their customers or employees. This service is commonly used by businesses in industries such as banking.",
  },
];

const numColumns = 2;

const Card = ({ title, img, text }) => {
  const [pressed, setPressed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.card, pressed && { backgroundColor: "#0003CD" }]}
    >
      <View
        style={[styles.iconContainer, pressed && { backgroundColor: "red" }]}
      >
        <Image source={img} style={styles.image} />
      </View>
      <Text style={[styles.textTitle, pressed && { color: "white" }]}>
        {title}
      </Text>
      <Text style={[styles.textFooter, pressed && { color: "white" }]}>
        {expanded ? text : `${text.substring(0, 100)}...`}
      </Text>
      <Pressable onPress={toggleExpanded} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>
          {expanded ? "Read Less" : "Read More"}
        </Text>
      </Pressable>
    </Pressable>
  );
};

const Home = () => {
  const renderItem = ({ item }) => (
    <Card title={item.title} img={item.img} text={item.text} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.detailcontainer}>
        <Ionicons name="call" size={32} color="white" />
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "500" }}>
          zevosoft@gmail.com
        </Text>
        <Ionicons name="location" size={32} color="white" />
      </View>
      <View style={styles.Iconcontainer}>
        <Image source={Logo} style={styles.imagelogo} />
        <View style={styles.Iconbox}>
          <Ionicons name="logo-facebook" size={30} color="blue" />
        </View>
        <View style={styles.Iconbox}>
          <Ionicons name="logo-instagram" size={30} color="blue" />
        </View>
        <View style={styles.Iconbox}>
          <Ionicons name="logo-linkedin" size={30} color="blue" />
        </View>
        <View style={styles.Iconbox}>
          <Ionicons name="logo-whatsapp" size={30} color="blue" />
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
  },
  flatListContent: {
    justifyContent: "space-between",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    padding: 20,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  iconContainer: {
    height: 60,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#0000FF",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  textTitle: {
    textAlign: "center",
    color: "#212529",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textFooter: {
    // paddingLeft:9,
    color: "black",
    fontSize: 14,
    marginBottom: 10,
  },
  readMoreButton: {
    marginTop: 10,
  },
  readMoreText: {
    color: "#0000FF",
    fontSize: 14,
  },
  detailcontainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0003CD",
  },
  Iconcontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 80,
    backgroundColor: "#0003CD",
    marginTop: 2,
  },
  Iconbox: {
    display: "flex",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    width: 42,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  imagelogo: {
    backgroundColor: "#fff",
    width: 140,
    borderRadius: 3,
    height: 60,
    resizeMode: "contain",
  },
});

export default Home;
