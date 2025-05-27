import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Stack, useRouter } from 'expo-router'; // Use router for navigation

function BarcodeScannerScreen() {
  const router = useRouter(); // Use router for navigation
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const extractUPIandName = (data) => {
    try {
      const url = new URL(data.replace('upi://', 'https://')); // Replace 'upi://' to use URL


      console.log(url,"urldfdfdklkkk")
      const upiId = url.searchParams.get('pa'); // Get UPI ID from query param 'pa'
      const name = decodeURIComponent(url.searchParams.get('pn')); // Get Name from query param 'pn'
      
      if (upiId && name) {
        console.log(`UPI ID: ${upiId}`);
        console.log(`Name: ${name}`);
        
        // Navigate to the Upipayment screen with UPI ID and Name
        router.push({
          pathname: '/Upipayment',
          params: { upiId, name },
        }); // Use router.push to navigate
      } else {
        console.log('UPI ID or Name not found');
      }
    } catch (error) {
      console.log('Error parsing barcode data:', error);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    extractUPIandName(data); // Extract UPI ID and Name, then navigate
    // Alert.alert(`Bar code with data: ${data}`); // Removed alert
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
