import React from 'react'
import {View, StatusBar} from 'react-native'
import {purple} from '../utils/constants'
import {Constants} from 'expo'

export default function ChatStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}
