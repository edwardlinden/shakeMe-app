import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import ShakeEventExpo from './ShakeEventExpo';
import { Text, StyleSheet, View, Button, Vibratio } from 'react-native';
import { Accelerometer } from 'expo';

/*
* Sandbox screen for playing around and learning React Native in*/
export default class SandboxScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            stateString: "nothing.",
            accelerometerData: {},
            shook: false,
            status: "LOADING",
            line: ""
        }
        this.vibrate = this.vibrate.bind(this);
        this.getNewLine = this.getNewLine.bind(this);
        this.handleShake = this.handleShake.bind(this);
        this._subscribe = this._subscribe.bind(this);
        this.checkAccData = this.checkAccData.bind(this);
    }
  static navigationOptions = {
    title: 'sandbox',
  };

  prevX = 0;
  prevY = 0;
  prevZ = 0;
  static NOISE = 1;

  componentWillMount(){
      /*ShakeEventExpo.addListener(() => {
          Alert.alert('Shaking!!!', "aaaaaa!");
      });*/
      //console.log(this.props.navigation.getParam('model'));
      this.getNewLine();
      //this._subscribe();

  }

  componentWillUnmount(){
      //ShakeEventExpo.removeListener();
      this._unsubscribe();
  }

  getNewLine(){
      this.props.navigation.getParam('model').getRandomPickUpLine().then(res =>
          this.setState({
              status: "LOADED",
              line: JSON.stringify(res.tweet)
          })
      );
  }

    _subscribe(){
        this._subscription = Accelerometer.addListener((accData) => {
            this.checkAccData();
            this.prevX = this.state.accelerometerData.x;
            this.prevY = this.state.accelerometerData.y;
            this.prevZ = this.state.accelerometerData.z;
            this.setState({ accelerometerData: accData });
        });
        Accelerometer.setUpdateInterval(100);
    }

    _unsubscribe(){
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    checkAccData(){
        const { x, y, z } = this.state.accelerometerData;

        if(Math.abs(this.prevX + this.prevY + this.prevZ - x - y - z) > SandboxScreen.NOISE){
            //console.log(this.state.shook);
            if(!this.state.shook){
                this.handleShake();
            } else {
                this.setState({shook: false});
            }
        }
    }

    handleShake(){
      this._unsubscribe();
      this.vibrate();
      this.setState({
          shook:true,
          status: "LOADING"});
      console.log("shaken");
      this.getNewLine();
      setTimeout(() => {this._subscribe()}, 5000);
    }


  vibrate(){
      Vibration.vibrate(200);
  }

  render() {
      let content = "loading...";
      if(this.state.status === "LOADED") content = this.state.line.substr(1, this.state.line.length-2); //substr to trim the "" off the ends

    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (
          <View style={styles.container}>
              <Text style={styles.text}>{content} note: shaking is turned off in sandbox</Text>
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
