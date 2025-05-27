import { View, Text } from 'react-native'
// import {Link} from 
import { Link, useRouter } from "expo-router";

const Home = () => {
  return (
    <View>
    <Link  href="/Profile">
      <Text>click</Text>
      </Link>
    </View>
  )
}

export default Home