import React, { useEffect, useState } from 'react';
import { Button, Text, View, TouchableOpacity, FlatList } from 'react-native';
import ChatRow from './ChatRow';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const ChatList = () => {
  const [matches, setMatches] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    let getData;

    const fetchMatches = async () => {
      getData = onSnapshot(
        query(
        collection(db, 'matches'),
        where ('usersMatched', 'array-contains', user.uid)
      ),
      (snapshot) => {
        setMatches(
          snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    };

    fetchMatches();

    return getData;
  }, [user]);

  return (
    matches.length > 0 ? (
      <FlatList
        style={{ flex:1, padding: '2%' }}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: '#F6D5F0' }}>No matches at the moment</Text>
      </View>
    )
  )
}

export default ChatList
