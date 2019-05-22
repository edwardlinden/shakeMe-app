import React from 'react';
import { Platform } from 'react-native';
import {createStackNavigator, createBottomTabNavigator, Navigation} from 'react-navigation';
import modelInstance from "../Data/shakeMeModel";
import backEndInstance from "../Data/backendModel";
import TabBarIcon from '../components/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SandboxScreen from '../screens/SandboxScreen';

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen,
      params: {'model': modelInstance, 'backend': backEndInstance}, headerMode: 'none'}
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Pick-Up',
  tabBarOptions: {
      activeTintColor: '#ff2f43',
      inactiveTintColor: '#fe8d99',
      style: {backgroundColor: '#ffe6e8'},
  },
  tabBarIcon: ({ focused }) => (
    <Ionicons
      focused={focused}
      color={focused?"#ff2f43":'#fe8d99'}
      size={28}
      name={
        Platform.OS === 'ios'
          ? `ios-albums`
          : 'md-albums'
      }
    />
  ),
};


const SandboxStack = createStackNavigator({
  Settings: {screen: SandboxScreen, params: {'model': modelInstance}},
});

SandboxStack.navigationOptions = {
  tabBarLabel: 'Sandbox',
    tabBarOptions: {
        activeTintColor: '#ff2f43',
        inactiveTintColor: '#fe8d99',
        style: {backgroundColor: '#ffe6e8'},
    },
    tabBarIcon: ({ focused }) => (
        <Ionicons
            focused={focused}
            color={focused?"#ff2f43":'#fe8d99'}
            size={28}
            name={
                Platform.OS === 'ios'
                    ? `ios-star-outline`
                    : 'md-star-outline'
            }
        />
    ),
};

export default createBottomTabNavigator({
  HomeStack,
  SandboxStack,
},
{
    style: {backgroundColor: '#00e6e8'}
});
