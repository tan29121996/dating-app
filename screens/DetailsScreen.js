import React, { useState, useEffect } from 'react';
import { Button, Text, View, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const DetailsScreen = () => {
  const user = auth.currentUser;

  const { params } = useRoute();

  const { card } = params;

  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState(null);

  useEffect(() => {
    onSnapshot(doc(db, 'users', card.id), (snapshot) => {
      // if profile exists
      if (snapshot.exists()) {
        // display the existing profile details
        setName(snapshot.data().displayName);
        setImage(snapshot.data().photoURL);
        setJob(snapshot.data().job);
        setAge(snapshot.data().age);
        setBio(snapshot.data().bio);
      }
    })
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#281D37' }}>
      <Header title={name}/>
      <Image
        style={{
          height: '50%',
          width: '90%',
          marginHorizontal: '5%',
          marginTop: '5%',
          borderRadius: 20,
          borderWidth: 3,
          borderColor: '#5D2150',
        }}
        source={{uri: image}}
      />
      <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 60 }}>
          <View style={{ paddingLeft: '7%', paddingTop: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#FEECEF' }}>{name}</Text>
          </View>
          <View style={{
            marginTop: 20,
            marginHorizontal: '5%',
            height: 60,
            width: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            borderWidth: 3,
            borderColor: '#5D2150',
            backgroundColor: '#D03867' }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 28, color: '#FEECEF' }}>
              {age}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: '#FEECEF', paddingLeft: '3%' }}>{job}</Text>
          <View style={{ marginVertical: 25, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: 'rgba(66,41,98, 0.8)' }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: '#FEECEF' }}
            >
              Short bio:
            </Text>
            <Text style={{ paddingTop: 10, paddingBottom: 7, color: '#FEECEF' }}>{bio}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default DetailsScreen
