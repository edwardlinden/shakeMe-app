import React, { Component } from 'react';
import { Text, StyleSheet, View, Vibration, Platform, Image } from 'react-native';
import { Accelerometer, LinearGradient } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import backEndInstance from "../Data/backendModel";

export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            stateString: "nothing.",
            accelerometerData: {},
            shook: false,
            status: "LOADING",
            line: "",
            id: 0,
            upvoted: false, //TODO move this check into user or something?
            downvoted: false,
            upvotes: 0,
            downvotes: 0
        }
        this.vibrate = this.vibrate.bind(this);
        this.getNewLine = this.getNewLine.bind(this);
        this.handleShake = this.handleShake.bind(this);
        this._subscribe = this._subscribe.bind(this);
        this.checkAccData = this.checkAccData.bind(this);
        this.handleUpvote = this.handleUpvote.bind(this);
        this.handleDownvote = this.handleDownvote.bind(this);
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
        console.log(this.props.navigation.getParam('backend'));
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
                backEndInstance.voteCounts(res._id).then(votes => {
                    if (res.tweet !== undefined) { //There is (at least) one empty entry in the API.
                        this.setState({
                            status: "LOADED",
                            line: JSON.stringify(res.tweet),
                            id: JSON.stringify(res._id),
                            upvoted: false,
                            downvoted: false,
                            upvotes: JSON.parse(votes)[0],
                            downvotes: JSON.parse(votes)[1]
                        });
                    }
                    else {
                        this.setState({
                            status: "LOADED",
                            line: " If you were a potato, you'd be a really nice potato. ",
                            id: JSON.stringify(res._id),
                            upvoted: false,
                            downvoted: false,
                            upvotes: JSON.parse(votes)[0],
                            downvotes: JSON.parse(votes)[1]
                        })
                    }
                });
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
                //console.log("handling shake");
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

    handleUpvote() {
        let newUp;
        let newDown;
        let backend = this.props.navigation.getParam('backend');
        console.log("upvoting id ", this.state.id);
        //backend.upvote(this.state.id);
        if(!this.state.upvoted && !this.state.downvoted) { //no votes
            console.log("no votes, id: ", this.state.id);
            backend.upvote(this.state.id);
            newUp = JSON.parse(this.state.upvotes)+1;
            this.setState({
                upvoted: true,
                upvotes: newUp
            });
        } else if(!this.state.upvoted && this.state.downvoted){ //has been downvoted
            console.log("Has been downvoted, upvoting, id: ", this.state.id);
            backend.removeDownvote(this.state.id);
            backend.upvote(this.state.id);
            newUp = JSON.parse(this.state.upvotes)+1;
            newDown = JSON.parse(this.state.downvotes)-1;
            this.setState({
                upvoted: true,
                downvoted: false,
                upvotes: newUp,
                downvotes: newDown
            });
        } else { //has been upvoted
            console.log("Removing upvote, id: ", this.state.id);
            backend.removeUpvote(this.state.id);
            newUp = JSON.parse(this.state.upvotes)-1;
            this.setState({
                upvoted: false,
                upvotes: newUp
            })
        }
    }
    handleDownvote() {
        let newDown;
        let newUp;
        let backend = this.props.navigation.getParam('backend');
        console.log("downvoting id ", this.state.id);
        //backend.downvote(this.state.id);
        if(!this.state.downvoted && !this.state.upvoted) { //no votes
            console.log("no votes, id: ", this.state.id);
            backend.downvote(this.state.id);
            newDown = JSON.parse(this.state.downvotes)+1;
            this.setState({
                downvoted: true,
                downvotes: newDown
            });
        } else if(!this.state.downvoted && this.state.upvoted){ //has been upvoted
            console.log("Has been upvoted, downvoting, id: ", this.state.id);
            backend.removeUpvote(this.state.id);
            backend.downvote(this.state.id);
            newUp = JSON.parse(this.state.upvotes)-1;
            newDown = JSON.parse(this.state.downvotes)+1;
            this.setState({
                upvoted: false,
                downvoted: true,
                upvotes: newUp,
                downvotes: newDown
            });
        } else { //has been downvoted
            console.log("Removing downvote, id: ", this.state.id);
            backend.removeDownvote(this.state.id);
            newDown = JSON.parse(this.state.downvotes)-1;
            this.setState({
                downvoted: false,
                downvotes: newDown
            })
        }
    }

    render() {
        let content = "loading...";
        if(this.state.status === "LOADED") {
            content = this.state.line.substr(1, this.state.line.length - 2); //substr to trim the "" off the ends
            //this.props.navigation.getParam('backend').upvote(this.state.id);
            //console.log("upvoting id ", this.state.id);
        }
        if(this.state.status === "ERROR") content = "error :(";
        let upvoteColor = this.state.upvoted?'#359f47':'#56c969';
        let downvoteColor = this.state.downvoted?'#cc3245':'#ff465f';

        return (
            <LinearGradient style={styles.container} colors={['#ff5263', '#ffd6d9']}>
                <LinearGradient
                    style={styles.pickupLineBox}
                    colors={['#ff8b94', '#ff5263']}>
                    <Text style={styles.text}>{content}</Text>
                </LinearGradient>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this.handleUpvote}
                        title={JSON.stringify(this.state.upvotes)}
                        icon={{name: 'thumb-up', size: 30, color: upvoteColor}}
                        accessibilityLabel="Like"
                        color="#ff8b94"
                        buttonStyle={{backgroundColor: '#98dea4', borderRadius: 10, marginRight: 10}}
                    /><Button
                        onPress={this.handleDownvote}
                        title={JSON.stringify(this.state.downvotes)}
                        icon={{name: 'thumb-down', size: 30, color: downvoteColor}}
                        accessibilityLabel="Dislike"
                        color="#ff8b94"
                        buttonStyle={{backgroundColor: '#ff677a', borderRadius: 10, marginRight: 10}}
                    />
                </View>
                <Image
                    style={styles.shakeGif}
                    source={require('../assets/images/test.gif')}
                    resizeMode="contain"/>

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
    alignItems: 'center',

  },
  buttonContainer: {
        flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  pickupLineBox: {
    margin: 30,
    marginTop: 80,
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 30,
    elevation: 25,
  },
    shakeGif: {
        marginTop: 50,
        width: 200,
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
