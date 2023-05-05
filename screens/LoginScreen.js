import React, { useState, useCallback } from 'react';
import { Alert, TextInput, StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const uri = 'https://www.maxpixel.net/static/photo/1x/Romance-Love-Couple-Sunset-Holding-Hands-Kissing-698660.jpg';
const pic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk4eev3YoHxwMli1D6-AtmXUcMi75eVivgcNk6Yojx3uRGfjxFnOYFpCGyb-DrNMQUXWE&usqp=CAU';

// Get Window dimensions
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
	  Alert.alert('User created. Please Login.');
    })
    .catch(error => {
      Alert.alert(error.message);
    })
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userData) => {
      // Check if user already has a profile
      onSnapshot(doc(db, 'users', userData.user.uid), (snapshot) => {
        // if profile exists
        if (snapshot.exists()) {
          // go to home screen
          navigation.navigate('Home');
        // if profile does not exist
        } else if (!snapshot.exists()) {
          // go to update profile screen
          navigation.navigate('Profile');
        }
      })
    })
    .catch(error => {
	  Alert.alert(error.message);
    })
  }


  useFocusEffect(
    useCallback(() => {
      // Disable back button
      const onBackPress = () => {
        return true;
    }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{uri}} style={[{ height: windowHeight, width: windowWidth, resizeMode:'cover' }, StyleSheet.absoluteFill]}/>
      <View style={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }}>
          <View style={{
            height: 600,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingVertical: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          >
            <Image
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#03899a', margin: 5 }}
              source={{uri: pic}} />
            <View>
              <TextInput
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  color: '#462D64',
                  alignSelf: 'center',
                  height: 50,
                  width: 250,
                  borderRadius: 15,
                  padding: 15,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }}
                onChangeText={(email) => setEmail(email)}
                keyboardType={'email-address'}
                placeholder='Email'
                autoCapitalize="none"
              />
            </View>
            <View>
              <TextInput
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  color: '#462D64',
                  alignSelf: 'center',
                  height: 50,
                  width: 250,
                  borderRadius: 15,
                  padding: 15,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }}
                onChangeText={(password) => setPassword(password)}
                placeholder='Password'
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <View style={{ height: 180, width: 240, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: '#02ab6d',
                  height: 50,
                  width: 110,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30
                }}
                testID='loginButton'
              >
                <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF', textAlign: 'center' }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSignUp}
                style={{
                  backgroundColor: '#038ebc',
                  height: 50,
                  width: 110,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30
                }}
                testID='signupButton'
              >
                <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF', textAlign: 'center' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image
            style={{ height: 80, width: 280, alignSelf: 'center', marginTop: 20 }}
            source={require('../Images/logo.png')}
          />
      </View>
    </View>
  )
}

export default LoginScreen
