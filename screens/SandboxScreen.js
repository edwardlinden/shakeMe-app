import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Text, StyleSheet, View, Button, Vibration, Alert } from 'react-native';
import { Accelerometer } from 'expo';

/*
* Sandbox screen for playing around and learning React Native in*/
export default class SandboxScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            accelerometerData: {},
            raisedHand: false
        }
    }
  static navigationOptions = {
    title: 'sandbox',
  };

  componentWillMount(){
      this._subscribe();
  }

  componentWillUnmount(){
      this._unsubscribe();
  }

  _subscribe(){
      this._subscription = Accelerometer.addListener((accelerometerData) => {
          this.setState({ accelerometerData });
          this.checkAccData();
      });
      Accelerometer.setUpdateInterval(1000);
  }

  _unsubscribe(){
      this._subscription && this._subscription.remove();
      this._subscription = null;
  }

  checkAccData(){
      const { z } = this.state.accelerometerData;

      if(z > 2){
          this.vibrate();
      }
  }

  vibrate(){
      Vibration.vibrate(200);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (
          <View style={styles.container}>
              <Text style={styles.text}>x: {JSON.stringify(this.state.accelerometerData.x)}</Text>
              <Text style={styles.text}>y: {JSON.stringify(this.state.accelerometerData.y)}</Text>
              <Text style={styles.text}>z: {JSON.stringify(this.state.accelerometerData.z)}</Text>
              <Button title={"Vibrate"} onPress={this.vibrate}/>
        </View>
  );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#aabbff',
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    text: {
      fontSize: 45
    }
});
