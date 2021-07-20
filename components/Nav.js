import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import {
  Feather,
} from '@expo/vector-icons'

import colors from '../config/colors.js'

export default function Nav({
  canGoBack,
  canGoForward,
  handleGoBack,
  handleGoForward,
  handleHome,
  handleTab,
  handleMenu,
  menuFocused,
  menuIcon,
  tabFocused,
  tabIcon
}) 
{
  if (menuFocused) {
    menuIcon = 'x-square'
  } else {
    menuIcon = 'menu'
  }
  if (tabFocused) {
    tabIcon = 'x-square'
  } else {
    tabIcon = 'plus-square'
  }
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.btn, { opacity: canGoBack ? 1 : 0.2 }]}
          onPress={handleGoBack}
          disabled={!canGoBack}
        >
          <Feather name="arrow-left" size={24} color={colors.text_gray} />
        </TouchableOpacity>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.btn, { opacity: canGoForward ? 1 : 0.2 }]}
          onPress={handleGoForward}
          disabled={!canGoForward}
        >
          <Feather name="arrow-right" size={24} color={colors.text_gray} />
        </TouchableOpacity>
      </View>
      <View style={styles.btns}>
              <TouchableOpacity style={styles.btn} onPress={handleHome}>
          <Feather name="home" size={24} color={colors.text_gray}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleTab}>
          <Feather name={tabIcon} size={24} color={colors.text_gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleMenu}>
          <Feather name={menuIcon} size={24} color={colors.text_gray} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: 50,
    width: '100%',
    backgroundColor: colors.bg_white,
    borderTopWidth: 1,
    borderColor: colors.separator
  },
  nav: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btns: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10
  }
})
