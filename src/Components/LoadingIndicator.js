import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Colors } from '../Config/theme';
import { View } from './View';

const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={Colors.orange} />
    </View>
  );
};

export default LoadingIndicator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
