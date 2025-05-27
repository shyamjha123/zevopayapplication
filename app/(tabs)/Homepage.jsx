import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
// import Book from './assets/book.png';

import Book from "./assests/book.png";

const data = [
  { id: '1', title: 'AEPS', img: Book, text: "Aadhaar Enabled Payment System (AEPS) is a payment service that allows a bank customer to use Aadhaar as his/her identity to access his/her Aadhaar enabled bank account and perform basic banking transactions." },
  { id: '2', title: 'BBPS', img: Book, text: "Bharat Bill Payment System (BBPS) is an online bill payment system. National Payments Corporation of India (NPCI) functioning as a sanctioned Bharat Bill Payment Central Unit (BBPCU) is responsible for setting standards." },
  { id: '3', title: 'Mobile Prepaid Recharge', img: Book, text: "Bharat Bill Payment System (BBPS) is an online bill payment system. National Payments Corporation of India (NPCI) functioning as a sanctioned Bharat Bill Payment Central Unit (BBPCU) is responsible for setting standards." },
  { id: '4', title: 'DMT', img: Book, text: "Domestic Money Transfer Service enables customers to transfer money to any bank account all around India anytime instantly with reliability and convenience.Domestic Money Transfers allow you to send funds across bank accounts in India." },
  { id: '5', title: 'Quick Transfer', img: Book, text: "As part of our comprehensive B2B services, ZevoPay offers assistance with PAN (Permanent Account Number) card application and related services. We understand the importance of PAN cards for businesses and individuals in India." },
  { id: '6', title: 'Payout', img: Book, text: "B2B recharge service refers to a business-to-business service that allows businesses to recharge or top-up the prepaid accounts of their customers or employees. This service is commonly used by businesses in industries such as banking." },
];

const numColumns = 2;

const Card = ({ title, img, text }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Image source={img} style={styles.image} />
    </View>
    <Text style={styles.textTitle}>{title}</Text>
    <Text style={styles.textFooter}>{text}</Text>
  </View>
);

const Homepage = () => {
  const renderItem = ({ item }) => (
    <Card title={item.title} img={item.img} text={item.text} />
  );

  return (
    <View style={styles.container}>
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
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'lightcoral',
    padding: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconContainer: {
    flex: 1,
  height:60,
    padding:10,
    justifyContent: 'center',
    backgroundColor: '#0000FF',
    alignItems: 'center',
    // height:80,
    borderRadius:5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  textTitle: {
    textAlign: 'center',
    color: '#212529',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textFooter: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
});

export default Homepage;

