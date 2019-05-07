import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Text, StyleSheet, View } from 'react-native';

/*
* Sandbox screen for playing around and learning React Native in*/
export default class SandboxScreen extends Component {
  static navigationOptions = {
    title: 'sandbox',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (<View style={styles.container}>
          <Text style={styles.text}>Text!</Text>
      </View>
  );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffaaff',
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    text: {
      fontSize: 45
    }
});
