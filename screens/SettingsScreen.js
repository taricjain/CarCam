import React from 'react';
import { Text, View, StatusBar } from 'react-native';

import { styles } from '../styles/SettingsScreenStyles';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'CarCam Inc.',
  };

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.content}>Hi guys! Nothing to see here, as of now!</Text>
      </View>
    );
  }
}
