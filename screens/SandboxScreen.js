import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import ShakeEventExpo from './ShakeEventExpo';
import { Text, StyleSheet, View, Button, Vibration, Alert } from 'react-native';
import { Accelerometer } from 'expo';

/*
* Sandbox screen for playing around and learning React Native in*/
export default class SandboxScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            stateString: "nothing.",
            accelerometerData: {}
        }
    }
  static navigationOptions = {
    title: 'sandbox',
  };

  prevX = 0;
  prevY = 0;
  prevZ = 0;
  static NOISE = 0.7;

  componentWillMount(){
      /*ShakeEventExpo.addListener(() => {
          Alert.alert('Shaking!!!', "aaaaaa!");
      });*/
      this._subscribe();

  }

  componentWillUnmount(){
      //ShakeEventExpo.removeListener();
      this._unsubscribe();
  }

    _subscribe(){
        this._subscription = Accelerometer.addListener((accData) => {
            this.setState({ accelerometerData: accData });
            this.prevX = this.state.accelerometerData.x;
            this.prevY = this.state.accelerometerData.y;
            this.prevZ = this.state.accelerometerData.z;
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


  static vibrate(){
      Vibration.vibrate(200);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (
          <View style={styles.container}>
              <Text style={styles.text}>{Math.abs(this.prevX - this.state.accelerometerData.x)}</Text>
              <Button title={"Vibrate"} onPress={SandboxScreen.vibrate}/>
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
