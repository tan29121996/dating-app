import * as React from 'react';
import { Text, View } from 'react-native';

const ReceiverMessage= ({ message }) => {
  return (
    <View style={{ backgroundColor: '#493951', borderRadius: 30, padding: '5%', margin: '2%', alignSelf: 'flex-start' }}>
      <Text style={{ color: 'white' }}>
        {message.message}
      </Text>
    </View>
  );
}

export default ReceiverMessage