import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, TextInput, View, Platform, Keyboard, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const MessageScreen = () => {
  const navigation = useNavigation();

  const user = auth.currentUser;

  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })
        )
      )
    );
  }, [matchDetails, db])

  useFocusEffect(
    useCallback(() => {
      // Go back to chat screen on back press
      const onBackPress = () => {
        navigation.goBack();
        return true;
    }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      userId: user.uid,
      message: input,
      timestamp: serverTimestamp(),
    })
    setInput('');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#281D37' }}>
      <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}/>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={'3%'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            inverted={-1}
            style={{ padding: '3%' }}
            keyExtractor={item => item.id}
            renderItem={({ item : message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View style={{ flexDirection: 'row', padding: '3%' }}>
          <TextInput
            style={{
              fontSize: 16,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              color: '#462D64',
              alignSelf: 'center',
              height: 50,
              width: '85%',
              borderRadius: 30,
              borderWidth: 3,
              borderColor: '#BE3D8D',
              padding: 15,
              backgroundColor: '#D3B2E0'
            }}
            placeholder='Send message'
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <TouchableOpacity onPress={sendMessage} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name='send' size={30} color='#bd429c'/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default MessageScreen
