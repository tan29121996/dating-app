import React, { useEffect, useCallback } from 'react';
import { Button, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import ChatList from '../components/ChatList';

const ChatScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Go back to home screen on back press instead of match screen
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
    }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#281D37' }}>
      <Header title='Chat' go='Home'/>
      <ChatList />
    </View>
  )
}

export default ChatScreen
