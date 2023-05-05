import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import LoginScreen from './screens/LoginScreen'
import DetailsScreen from './screens/DetailsScreen'
import ProfileScreen from './screens/ProfileScreen'
import MatchScreen from './screens/MatchScreen'
import MessageScreen from './screens/MessageScreen'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Messages" component={MessageScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Match" component={MatchScreen} />
        </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;
