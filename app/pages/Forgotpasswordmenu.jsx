import { View, Text } from 'react-native'
import React from 'react'

const Forgotpasswordmenu = () => {
  return (
    <View>
    <Text style={styles.text}>Change Password</Text>
    <TextInput
      style={styles.input}
      placeholder="Old Password"
      secureTextEntry={true}
      placeholderTextColor="gray"
    />
    <TextInput
      style={styles.input}
      placeholder="New Password"
      secureTextEntry={true}
      placeholderTextColor="gray"
    />
    <TextInput
      style={styles.input}
      placeholder="Confirm Password"
      secureTextEntry={true}
      placeholderTextColor="gray"
    />
    </View>
  )
}

export default Forgotpasswordmenu