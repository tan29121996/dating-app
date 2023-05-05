import * as React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default function App() {
  return (
    <SafeAreaView style={styles.SafeArea}>
      <NavigationContainer>
        <StackNavigator/>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeArea: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});
