import React, {Component} from 'react'
import {View, StatusBar, Text} from 'react-native'
import {TabNavigator, StackNavigator} from 'react-navigation'
import Profile from './Profile'
import Contacts from './Contacts'
import Chat from './Chat'
import {white, purple} from '../utils/constants'
import {Constants} from 'expo'
import ChatStatusBar from './ChatStatusBar'
import Register from './Register'
import Login from './Login'

const Tabs = TabNavigator({
  Contacts: {
    screen: Contacts,
  },
  Profile: {
    screen: Profile,
  },
}, {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: white,
    style: {
      height: 56,
      backgroundColor: purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
})

const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs,
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: 'Chat',
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      }
    }
  },
})

export default class Main extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ChatStatusBar backgroundColor={purple} barStyle="light-content" />
        <MainNavigator />
      </View>
    )
  }
}
