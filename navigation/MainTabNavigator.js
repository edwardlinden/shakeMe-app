import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import modelInstance from "../Data/shakeMeModel";
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SandboxScreen from '../screens/SandboxScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Pick-Up',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};


const SandboxStack = createStackNavigator({
  Settings: {screen: SandboxScreen, params: {'model': modelInstance}},
});

SandboxStack.navigationOptions = {
  tabBarLabel: 'Sandbox',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-construct' : 'md-construct'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  SandboxStack,
});
