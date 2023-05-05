import * as React from 'react';
import { Button, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, go }) => {
  const navigation = useNavigation();

  // Go to home if previous screen is match screen or login screen
  const handleNavigation = () => {
    if (go == 'Home') {
      navigation.navigate('Home');
    } else
    {
      navigation.goBack();
    }
  }

  return (
    <View style={{ padding: 2, flexDirection: 'row', alignItems: 'center', backgroundColor: '#281D37' }}>
      <TouchableOpacity
        onPress={handleNavigation}
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          height: 50,
          width: 50,
          borderRadius: 30
        }}
      >
        <Ionicons name='arrow-back-sharp' size={32} color='#F6D5F0'/>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F6D5F0' }}>{title}</Text>
      </View>
    </View>
  )
}

export default Header
