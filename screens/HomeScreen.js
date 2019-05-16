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
        this.vibrate = this.vibrate.bind(this);
        this.getNewLine = this.getNewLine.bind(this);
        this.handleShake = this.handleShake.bind(this);
        this._subscribe = this._subscribe.bind(this);
        this.checkAccData = this.checkAccData.bind(this);
    }
    static navigationOptions = {
        header: null
    };
    prevX = 0;
    prevY = 0;
    prevZ = 0;
    static NOISE = 1;

    componentWillMount(){
        console.log(this.props.navigation.getParam('model'));
        this.getNewLine();
        this._subscribe();

    }

    componentWillUnmount(){
        //ShakeEventExpo.removeListener();
        this._unsubscribe();
    }

    getNewLine(){
        try {
            this.props.navigation.getParam('model').getRandomPickUpLine().then(res => {
                if (res.tweet !== undefined) { //There is (at least) one empty entry in the API.
                    this.setState({
                        status: "LOADED",
                        line: JSON.stringify(res.tweet)
                    });
                }
                else {
                    this.setState({
                            status: "LOADED",
                            line: " If you were a potato, you'd be a really nice potato. "
                        })
                }
            });
        }
        catch (e) {
            console.log(e);
            this.setState({
                status: "ERROR"
            })
        }
    }

    _subscribe() {
        this._subscription = Accelerometer.addListener((accData) => {
            if (!this.checkAccData()) {
                this.prevX = this.state.accelerometerData.x;
                this.prevY = this.state.accelerometerData.y;
                this.prevZ = this.state.accelerometerData.z;
                this.setState({accelerometerData: accData});
            }
        });
        Accelerometer.setUpdateInterval(100);
    }

    _unsubscribe(){
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    checkAccData(){
        const { x, y, z } = this.state.accelerometerData;
        let maths = Math.abs(this.prevX + this.prevY + this.prevZ - x - y - z);
        if(maths > HomeScreen.NOISE){
            //console.log(this.state.shook);
            //console.log("shaken");
                console.log("handling shake");
                this.handleShake();

        }
        return false;
    }

    async handleShake(){
        this._unsubscribe();
        this.vibrate();
        this.setState({
            shook:true,
            status: "LOADING"});
        this.getNewLine();
        setTimeout(() => {this._subscribe()}, 2000);
    }


    vibrate(){
        Vibration.vibrate(200);
    }

    render() {
        let content = "loading...";
        if(this.state.status === "LOADED") content = this.state.line.substr(1, this.state.line.length-2); //substr to trim the "" off the ends
        if(this.state.status === "ERROR") content = "error :(";

        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <LinearGradient style={styles.container} colors={['#ff5263', '#ffd6d9']}>
                <LinearGradient
                    style={styles.pickupLineBox}
                    colors={['#ff8b94', '#ff5263']}>
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
        padding: 10,
    },
  container: {
    flex: 1,

  },
  pickupLineBox: {
    margin: 30,
    marginTop: 80,
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 30,
    elevation: 25,
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
