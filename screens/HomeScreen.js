import React from 'react';
import { FlatList, ActivityIndicator, Text, View, ScrollView, StyleSheet  } from 'react-native';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      isLoading: true,
      dataSource: null
          };
  }

  componentDidMount(){
    return fetch('https://pebble-pickup.herokuapp.com/tweets/random')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.container}>
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item}</Text>}
          keyExtractor={({id}, index) => id}
        />
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  activeTitle: {
    color: 'red',
  },
});