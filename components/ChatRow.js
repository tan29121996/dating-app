import React, { useEffect, useState } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({matchDetails}) => {
  const navigation = useNavigation();

  const user = auth.currentUser;

  const [matchedUser, setMatchedUser] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    setMatchedUser(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user]
  );

  useEffect(() =>
    onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(1)
      ),
      snapshot =>
        setLastMessage(snapshot.docs[0]?.data()?.message)
    ), [matchDetails, db]
  );

  return (
    <View style={{ margin: '2%' }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          padding: '5%',
          backgroundColor: '#1d0529',
          borderRadius: 20,
          borderWidth: 2,
          borderColor: '#5D2150',
          alignItems: 'center'
        }}
        onPress={() => { navigation.navigate('Messages', {matchDetails})}}
      >
        <Image
          style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 2, borderColor: '#FEECEF', marginRight: '3%' }}
          source={{ uri: matchedUser?.photoURL }}
        />
        <View style={{ height: 50, paddingLeft: 5, justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F6D5F0' }}>{matchedUser?.displayName}</Text>
          <Text style={{ color: '#9881c5' }}>{lastMessage || 'No messages'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ChatRow
