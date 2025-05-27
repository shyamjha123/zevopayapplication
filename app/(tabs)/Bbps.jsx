import { View, StyleSheet, Text, TextInput, Button, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react';
import { dummyBbpsBillerIddata, dummyBbpsCategorydata } from './dummydatabbps/Dummydatabbps';


const Bbps = () => {
    const [state, setState] = React.useState({
        open: false,
        value: null,
        categorylist: dummyBbpsCategorydata,
        BillerId:dummyBbpsBillerIddata
    });

    return (
        <View style={styles.container}>
            <Text style={styles.Textstyle}>Bharat Bill Payment System</Text>
            <View style={styles.Childrencontainer}>
                <DropDownPicker
                    open={state.open}
                    placeholder='Select Category'
                    value={state.value}
                    items={state.categorylist}
                    setOpen={(open) => setState(prev => ({ ...prev, open }))}
                    setValue={(callback) =>
                        setState(prev => ({ ...prev, value: callback(prev.value) }))
                    }
                    setItems={(items) => setState(prev => ({ ...prev, items }))}
                />
                <DropDownPicker
                    open={state.open}
                    placeholder='Select Biller Id'
                    value={state.value}
                    items={state.BillerId}
                    setOpen={(open) => setState(prev => ({ ...prev, open }))}
                    setValue={(callback) =>
                        setState(prev => ({ ...prev, value: callback(prev.value) }))
                    }
                    setItems={(items) => setState(prev => ({ ...prev, items }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder='K Number'
                />
                <TextInput
                    style={styles.input}
                    placeholder='ENTER BILL AMOUNT'
                />

                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>FETCH BILL</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Bbps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
        padding: 20,
    },
    Textstyle: {
        color: "black",
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        // paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
        // marginVertical: 10,
        elevation: 2, // subtle shadow (Android)
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    Childrencontainer: {
        marginTop:20,
        gap: 30
    },
    button: {
        backgroundColor: 'rgb(8, 48, 144)',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
