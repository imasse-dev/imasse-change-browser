import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, BackHandler, View, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import Toolbar from './components/Toolbar.js'
import Frame from './components/Frame.js'
import Nav from './components/Nav.js'
import Bookmarks from './components/Bookmarks.js'
import Menu from './components/Menu.js'
import SearchEngines from './components/SearchEngines.js'
import Tab from './components/Tabs.js'


import { smoothScroll } from './lib/scroll.js'
import { useStoredState } from './lib/storage.js'
import { formatQuery, getBaseUrl, getDisplayStr } from './lib/url.js'
import { alert, lightHaptics, successHaptics } from './lib/alert.js'
import { bookmarkExists, useBookmarks } from './lib/bookmark.js'
import { tabExists, useTabs } from './lib/tab.js'

import colors from './config/colors.js'

export default function App() {

  // App
  const [isFirstLaunch, setIsFirstLaunch] = useStoredState(
    '@isFirstLaunch',
    true
  )

  const launched = () => {
    if (isFirstLaunch) setIsFirstLaunch(false)
  }
  
  // WebView
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  const [currentUrl, setCurrentUrl] = useState('https://app.imasse.com')
  // Searchbar
  const [currentSearchbar, setCurrentSearchbar] = useState('')
  const [seachbarFocused, setSeachbarFocused] = useState(false)

  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarks, dispatchBookmarks] = useBookmarks()

  //tabs
  const [tabed, setTabed] = useState(false)
  const [tabs, dispatchTabs] = useTabs()

  const [menuFocused, setMenuFocused] = useState(false)

  const [tabFocused, setTabFocused] = useState(false)

  const webviewRef = useRef(null)
  const searchbarRef = useRef(null)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && !seachbarFocused) {
          webviewRef.current.goBack()
          return true
        }
        return false
      }
    )
    return () => backHandler.remove()
  }, [canGoBack])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar
          style="dark"
          translucent={false} // Android
          backgroundColor={colors.bg_white}
        />
        <Toolbar
          {...{
            currentSearchbar,
            seachbarFocused,
            searchbarRef,
            webviewRef
          }}
          handleChangeText={setCurrentSearchbar}
          handleSubmit={({ nativeEvent: { text } }) => {
            launched()
            setCurrentUrl(formatQuery(text))
            successHaptics()
          }}
          handleFocus={() => {
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setSeachbarFocused(true)
            setMenuFocused(false)
            setTabFocused(false)
            lightHaptics()
          }}
          handleBlur={() => {
            setSeachbarFocused(false)
            setCurrentSearchbar(isFirstLaunch ? '' : getDisplayStr(currentUrl)) 
          }}
          handleReload={() => {
            if (isFirstLaunch) return
            webviewRef.current.reload()
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setMenuFocused(false)
            setTabFocused(false)
            lightHaptics()
            
          }}
        />
        <Frame
          {...{ currentUrl, webviewRef, isFirstLaunch }}
          handleStateChange={(navState) => {
            setCanGoBack(navState.canGoBack)
            setCanGoForward(navState.canGoForward)
            if (navState.url === 'about:blank') {
              return // do not chnage currentUrl to about:blank
            }
            setCurrentUrl(navState.url) // prevent text update when textinput is in focus
            if (!seachbarFocused)
              setCurrentSearchbar(getDisplayStr(navState.url))
          }}
          handleLoad={() => {
            if (isFirstLaunch) setCurrentSearchbar('Welcome')
            webviewRef.current.injectJavaScript(smoothScroll)
            setBookmarked(bookmarkExists(currentUrl, bookmarks))
            setTabed(tabExists(currentUrl, tabs))
          }}
          handleRequest={(request) => {
            // prevent links from opening apps
            if (
              [
                'instagram',
                'twitter',
                'facebook',
                'youtube',
                'linkedin'
              ].reduce((acc, val) => request.url.includes(val) || acc, false) &&
              request.navigationType === 'click'
            ) {
              setCurrentUrl(request.url)
              return false
            }
            return true
          }}
        />
        {tabFocused && (
          <Tab
            tabs={tabs}
            handleDelete={(url) => {
              if (currentUrl === url) {
                const redirectTo = 'window.location = "https://app.imasse.com"';
                webviewRef.current.injectJavaScript(redirectTo)
              }
              dispatchTabs({ type: 'REMOVE', payload: url })
              setTabFocused(false)
            }}
            handleReset={() => {
              setTabFocused(false)
              const redirectTo = 'window.location = "https://app.imasse.com"';
              alert(
                'Clear All Tabs',
                'Are you sure that you want to clear all tabs?',
                () => {
                webviewRef.current.injectJavaScript(redirectTo)
                dispatchTabs({ type: 'RESET' })
                }
              )
              setTabed(false)
            }}
            handleSpacePress={() => searchbarRef.current.blur()}
            handleBookmarkPress={(url) => {
              setTabFocused(false)
              launched()
              searchbarRef.current.blur()
              setCurrentUrl(url)
              successHaptics()
            }}
            handleMenuBlur={() => {
              setMenuFocused(false)
              //   lightHaptics()
            }}
            handleNewTab={() => {
              setTabFocused(false)
              const redirectTo = 'window.location = "https://app.imasse.com"';
              webviewRef.current.injectJavaScript(redirectTo);
              lightHaptics()
            }}
          />
        )}
        {menuFocused && (
          <Menu
           handleSpacePress={() => searchbarRef.current.blur()}
            handleBookmarkPress={(url) => {
              setMenuFocused(false)
              launched()
              searchbarRef.current.blur()
              setCurrentUrl(url)
              successHaptics()
            }}
            handleShare={async () => {
              lightHaptics()
              setMenuFocused(false)
              try {
                await Share.share({
                  message: `${currentUrl}`,
                  url: currentUrl
                })
              } catch (error) {
                Alert.alert(error.message)
              }
            }}
            handleBookmark={() => {
              setMenuFocused(false)
              if (!bookmarked) {
                dispatchBookmarks({ type: 'ADD', payload: currentUrl })
                setBookmarked(true)
              } 
              lightHaptics()
            }}
            handleSE={() => {
                setSeFocused(true)
                setMenuFocused(false)
                lightHaptics()
            }}
            handleCite={() => {
              const newURL = 'https://www.imasse.com/?cite=' + currentUrl;
              const redirectTo = 'window.location = "' + newURL + '"';
              webviewRef.current.injectJavaScript(redirectTo)
              lightHaptics()
            }}
            handleMenuBlur={() => {
              setMenuFocused(false)
              //   lightHaptics()
            }}
          />
        )}
       {seachbarFocused && (
          <Bookmarks
            bookmarks={bookmarks}
            handleSpacePress={() => searchbarRef.current.blur()}
            handleBookmarkPress={(url) => {
              launched()
              searchbarRef.current.blur()
              setCurrentUrl(url)
              successHaptics()
            }}
            handleActionPress={(action) => {
              launched()
              searchbarRef.current.blur()
              setCurrentUrl(url)
              successHaptics()
            }}
            handleDelete={(url) => {
              dispatchBookmarks({ type: 'REMOVE', payload: url })
              // update bookmark button state if current page is removed from bookmarks
              if (getBaseUrl(currentUrl) == url.slice(8)) setBookmarked(false)
              lightHaptics()
            }}
            handleReset={() => {
              alert(
                'Reset All Bookmarks',
                'Are you sure that you want to reset all bookmarks?',
                () => dispatchBookmarks({ type: 'RESET' })
              )
            }}
          />
        )}
        <Nav
          {...{ canGoBack, canGoForward, menuFocused, tabFocused }}
          handleGoBack={() => {
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setMenuFocused(false)
            setTabFocused(false)
            if (webviewRef.current) webviewRef.current.goBack()
            lightHaptics()
          }}
          handleGoForward={() => {
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setMenuFocused(false)
            setTabFocused(false)
            if (webviewRef.current) webviewRef.current.goForward()
            lightHaptics()
          }}
          handleHome={() => {
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setMenuFocused(false)
            setTabFocused(false)
            const redirectTo = 'window.location = "https://app.imasse.com"';
            webviewRef.current.injectJavaScript(redirectTo);
            lightHaptics()
          }}
          
          handleMenu={() => {
            dispatchTabs({ type: 'REMOVE', payload: currentUrl })
            setTabed(false)
            setTabFocused(false)
            if (!menuFocused) {
              setMenuFocused(true)
              lightHaptics()
            } else {
            setMenuFocused(false)
            lightHaptics()
            }
          }}
          handleTab={() => {
            setMenuFocused(false)
            if (!tabed) {
              dispatchTabs({ type: 'ADD', payload: currentUrl })
              setTabed(true)
            }
            if (!tabFocused) {
              setTabFocused(true)
              lightHaptics()     
            } else {
              dispatchTabs({ type: 'REMOVE', payload: currentUrl })
              setTabed(false)
              setTabFocused(false)
              lightHaptics()
            }
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_white
  }
})
