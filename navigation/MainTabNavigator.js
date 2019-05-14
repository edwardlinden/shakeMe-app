import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import modelInstance from "../Data/shakeMeModel";
import TabBarIcon from '../components/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SandboxScreen from '../screens/SandboxScreen';

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen,
      params: {'model': modelInstance}, headerMode: 'none'}
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Pick-Up',
  tabBarOptions: {
      activeTintColor: '#ff2f43',
      inactiveTintColor: '#ff2f43',
  },
  tabBarIcon: ({ focused }) => (
    <Ionicons
      focused={focused}
      color="#ff2f43"
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
        inactiveTintColor: '#ff2f43',
    },
    tabBarIcon: ({ focused }) => (
        <Ionicons
            focused={focused}
            color="#ff2f43"
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
});
