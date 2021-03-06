import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-videocam'
          : 'md-videocam'
      }
    />
  ),
};

const GalleryStack = createStackNavigator({
  Gallery: GalleryScreen,
});

GalleryStack.navigationOptions = {
  tabBarLabel: 'Gallery',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-photos' : 'md-photos'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  GalleryStack,
});
