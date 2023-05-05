import * as React from 'react';
import { Text, View } from 'react-native';

const SenderMessage= ({ message }) => {
  return (
    <View style={{ backgroundColor: '#4f2a69', borderRadius: 20, padding: '5%', margin: '3%', alignSelf: 'flex-end' }}>
      <Text style={{ color: 'white' }}>
        {message.message}
      </Text>
    </View>
  );
}

export default SenderMessage