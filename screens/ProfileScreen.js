import React, { useEffect, useState, useCallback } from 'react';
import { Alert, Text, View, TextInput, Image, TouchableOpacity, Dimensions, BackHandler, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

// Get Window dimensions
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ProfileScreen= () => {
  const navigation = useNavigation();

  const user = auth.currentUser;

  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState(null);

  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: name,
      photoURL: image,
      job: job,
      age: age,
      bio: bio,
      match: false,
      timestamp: serverTimestamp()
    }).then(() => {
      navigation.navigate('Home');
    }).catch(error => {
      Alert.alert(error.message);
    });
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  useEffect(() => {
    onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      // if user profile exists
      if (snapshot.exists()) {
        // display the existing user profile details
        setName(snapshot.data().displayName);
        setImage(snapshot.data().photoURL);
        setJob(snapshot.data().job);
        setAge(snapshot.data().age);
        setBio(snapshot.data().bio);
      }
    })
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Go back to home screen on back press instead of login screen
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
    }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={'Update Profile'}  go='Home'/>
      <ScrollView>
      <View style={{ height: 950, paddingBottom: 70, justifyContent: 'space-evenly', backgroundColor: '#281D37' }}>
        <Image
          style={{ height: 80, width: 280, alignSelf: 'center' }}
          source={require('../Images/logo.png')}
        />

        <Text style={{
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: '#BE3D8D',
          textAlign: 'center' }}
        >
          Profile pic:
        </Text>
        <TouchableOpacity
          onPress={uploadImage}
          style={{
            alignSelf: 'center',
            height: 50,
            width: '50%',
            borderRadius: 30,
            padding: 15,
            backgroundColor: '#D03867'
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF', textAlign: 'center' }}>Upload Image</Text>
        </TouchableOpacity>

        <Text style={{
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: '#BE3D8D',
          textAlign: 'center' }}
        >
          Name:
        </Text>
        <TextInput
          value={name}
          onChangeText={text => setName(text)}
          style={{
            fontSize: 16,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            color: '#462D64',
            alignSelf: 'center',
            height: 50,
            width: '80%',
            borderRadius: 30,
            borderWidth: 3,
            borderColor: '#BE3D8D',
            padding: 15,
            backgroundColor: '#D3B2E0'
          }}
          placeholder='Enter your name'
        />

        <Text style={{
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: '#BE3D8D',
          textAlign: 'center' }}
        >
          Job:
        </Text>
        <TextInput
          value={job}
          onChangeText={text => setJob(text)}
          style={{
            fontSize: 16,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            color: '#462D64',
            alignSelf: 'center',
            height: 50,
            width: '80%',
            borderRadius: 30,
            borderWidth: 3,
            borderColor: '#BE3D8D',
            padding: 15,
            backgroundColor: '#D3B2E0'
          }}
          placeholder='Enter your occupation'
        />

        <Text style={{
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: '#BE3D8D',
          textAlign: 'center' }}
        >
          Age:
        </Text>
        <TextInput
          value={age}
          onChangeText={text => setAge(text)}
          style={{
            fontSize: 16,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            color: '#462D64',
            alignSelf: 'center',
            height: 50,
            width: '80%',
            borderRadius: 30,
            borderWidth: 3,
            borderColor: '#BE3D8D',
            padding: 15,
            backgroundColor: '#D3B2E0'
          }}
          placeholder='Enter your age'
          keyboardType={'numeric'}
          maxLength={3}
        />

        <Text style={{
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: '#BE3D8D',
          textAlign: 'center' }}
        >
          Short bio:
        </Text>
        <TextInput
          value={bio}
          onChangeText={text => setBio(text)}
          style={{
            fontSize: 16,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            color: '#462D64',
            alignSelf: 'center',
            height: 200,
            width: '80%',
            borderRadius: 30,
            borderWidth: 3,
            borderColor: '#BE3D8D',
            padding: 15,
            backgroundColor: '#D3B2E0',
            textAlignVertical: 'top'
          }}
          placeholder='Give a short bio about yourself'
          multiline={true}
        />

        <TouchableOpacity
          onPress={updateUserProfile}
          style={{
            backgroundColor: '#D03867',
            height: 70,
            width: '60%',
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 50,
            borderRadius: 30
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF', textAlign: 'center' }}>Update profile</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen
