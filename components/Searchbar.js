import React, { useEffect } from 'react'
import { View, TextInput, BackHandler, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { fullUrl } from '../lib/url.js'
import colors from '../config/colors.js'

export default function SearchBar({
  currentSearchbar,
  handleReload,
  searchbarRef,
  handleChangeText,
  handleSubmit,
  handleFocus,
  handleBlur,
  security,
  handler,
  handleShare
}) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (searchbarRef.current.isFocused()) {
          searchbarRef.current.blur()
          return true
        }
        return false
      }
    )
    return () => backHandler.remove()
  }, [])
  if (currentSearchbar.substring(0,7) === 'http://') {
     security = 'unlock';
  }
  else {
     security = 'lock';
  }
  if (currentSearchbar === 'https://app.imasse.com/') {
    currentSearchbar = '';
  }
  return (
    //currentSearchbar
    <View style={styles.container}>
      <Feather
        name={security}
        size={22}
        color={colors.text_gray}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.textField}
        value={currentSearchbar}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search or enter URL"
        keyboardAppearance="light"
        keyboardType="web-search"
        textContentType="URL"
        clearTextOnFocus={true} // iOS only
        selectTextOnFocus={true} // for Android
        enablesReturnKeyAutomatically={true}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        ref={searchbarRef}
      />
      <TouchableOpacity style={styles.btn} onPress={handleReload}>
      <Feather 
        name="refresh-ccw"
        size={22}
        color={colors.text_gray}
        style={styles.searchIcon}
        />     
         </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg_gray,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 10
  },
  searchIcon: {
    marginHorizontal: 10
  },
  textField: {
    flex: 1,
    fontSize: 18,
    color: colors.text_gray
  }
})
