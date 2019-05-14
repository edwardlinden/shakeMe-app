import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, Vibration, Platform } from 'react-native';
import { Accelerometer, LinearGradient } from 'expo';

export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            stateString: "nothing.",
            accelerometerData: {},
            shook: false,
            status: "LOADING",
            line: ""
        }
    }
    static navigationOptions = {
        header: null
    }
    prevX = 0;
    prevY = 0;
    prevZ = 0;
    static NOISE = 1;

    componentWillMount(){
        /*ShakeEventExpo.addListener(() => {
            Alert.alert('Shaking!!!', "aaaaaa!");
        });*/
        console.log(this.props.navigation.getParam('model'));
        this.getNewLine();
        this._subscribe();

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

        if(Math.abs(this.prevX + this.prevY + this.prevZ - x - y - z) > HomeScreen.NOISE){
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
        HomeScreen.vibrate();
        this.setState({
            shook:true,
            status: "LOADING"});
        console.log("shaken");
        this.getNewLine();
        setTimeout(() => {this._subscribe()}, 2000);
    }


    static vibrate(){
        Vibration.vibrate(200);
    }

    render() {
        let content = "loading...";
        if(this.state.status === "LOADED") content = this.state.line.substr(1, this.state.line.length-2); //substr to trim the "" off the ends

        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <LinearGradient style={styles.container} colors={['#ff5263', '#ffd6d9']}>
                <LinearGradient
                    colors={['#ffd6d9', '#ff5263']}>
                    <Text style={styles.text}>{content}</Text>
                </LinearGradient>
            </LinearGradient>
        );
    }
}


const styles = StyleSheet.create({
    text: {
        fontSize: 45,
        textAlign: 'center',
        color: 'white',
    },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingLeft: 30,
    paddingRight: 30,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
