import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const MatchScreen = () => {
  const navigation = useNavigation();

  const user = auth.currentUser;

  const { params } = useRoute();

  const { photo, userSwiped } = params;

  const [userName, setName] = useState('Default');

  useEffect(() => {
    onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      // if user profile exists and displayName is not null
      if (snapshot.exists() && snapshot.data().displayName != null) {
        // get displayName from user profile
        setName(snapshot.data().displayName);
      }
    })
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header title={'Match'}/>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281D37' }}>
      <View style={{ position: 'absolute', top: '38%' }}>
        <AntDesign name='heart' color='rgba(245, 70, 110, 0.5)' size={195}/>
      </View>
      <Image
        style={{ height: 50, width: 280 }}
        source={require('../Images/match.png')}
      />

      <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF', padding: '8%', textAlign: 'center', width: 300 }}>
        Congratulations, {userName}!
        You matched with {userSwiped.displayName}!
      </Text>

      <View style={{ height: '30%', width: '45%', flexDirection: 'row', justifyContent: 'center', margin: 15 }}>
        <Image
          style={{ height: 70, width: 70, margin: 10, borderRadius: 100, borderWidth: 3, borderColor: '#FEECEF' }}
          source={{uri: photo}}
        />
        <Image
          style={{ height: 70, width: 70, margin: 10, borderRadius: 100, borderWidth: 3, borderColor: '#FEECEF' }}
          source={{uri: userSwiped.photoURL}}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat');
        }}
        style={{
          backgroundColor: '#D03867',
          height: '10%',
          width: '70%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          borderRadius: 30
        }}
      >
        <Text style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold', color: '#FEECEF' }}>Start chatting</Text>
        <Ionicons name='chatbubbles-outline' size={36} color='#FEECEF'/>
      </TouchableOpacity>

      <View style={{ position: 'absolute', top: '55%' }}>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: '#ffc2db' }}>MATCH!</Text>
      </View>
      </View>
    </View>
  )
}

export default MatchScreen
