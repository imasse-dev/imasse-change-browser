import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    FlatList,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native'
import {
    Feather
} from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

import MenuItem from './MenuItem.js'
import { lightHaptics } from '../lib/alert.js'

import colors from '../config/colors.js'

export default function Bookmarks({
    handleSpacePress,
    handleBookmarkPress,
    handleBookmark,
    handleDelete,
    handleShare,
    handleMenuBlur,
    handleSE,
    handleCite
}) {
    const [editing, setEditing] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current

    const DATA = [
        {
            title: 'Privacy',
            feather: 'file-text',
            action: 'handlePrivacy',
            url: 'https://www.imasse.com/privacy',
            urlState: 'true'
        },
        {
            title: 'Terms Of Service',
            feather: 'file-text',
            action: 'handleTerms',
            url: 'https://www.imasse.com/terms',
            urlState: 'true'
        },
        {
            title: 'Support',
            feather: 'help-circle',
            action: 'handleSupport',
            url: 'https://www.imasse.com/faq',
            urlState: 'true'
        },
    ];


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [fadeAnim])

    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height
    
    const numColumns = Math.floor(windowWidth / 300)

    const renderItem = ({ item }) => (
        <MenuItem
            handleBookmarkLongPress={() => {
                if (editing) return
                setEditing(true)
                lightHaptics()
            }}
            {...{ handleBookmarkPress, editing, handleDelete, ...item }}
        />
    )

    return (
        <TouchableWithoutFeedback onPress={handleMenuBlur}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <BlurView intensity={75} tint="dark" style={styles.box}>
                    <TouchableOpacity style={{
                        maxHeight: windowHeight - 240
                    }}
                      //  style={{ }}
                      >
                    <TouchableOpacity onPress={handleBookmark}
                        style={styles.container2}>
                    <Feather
                        name='bookmark'
                        size={16}
                        color={colors.text_gray}
                    />
                        <Text onPress={handleBookmark} style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                        numberOfLines={1}>Bookmark Page</Text>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={handleCite}
                            style={styles.container2}>
                            <Feather
                                name='book'
                                size={16}
                                color={colors.text_gray}
                            />
                            <Text onPress={handleCite} style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                                numberOfLines={1} onPress={handleCite}>Create Citation</Text>
                        </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare}
                        style={styles.container2}>
                        <Feather
                            name='share'
                            size={16}
                            color={colors.text_gray}
                        />
                        <Text onPress={handleShare} style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                            numberOfLines={1} onPress={handleShare}>Share</Text>
                    </TouchableOpacity>
                     {/*}   <TouchableOpacity onPress={handleSE}
                            style={styles.container2}>
                            <Feather
                                name='search'
                                size={16}
                                color={colors.text_gray}
                            />
                            <Text onPress={handleSE} style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                                numberOfLines={1} onPress={handleSE}>Search Engine</Text>
                        </TouchableOpacity>*/}
                        <TouchableOpacity
                            style={styles.divider}>
                        </TouchableOpacity>
                    <FlatList scrollEnabled={false}
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.url}
                        numColumns={numColumns}
                        key={numColumns} // rerender when numColumns changes
                        pagingEnabled={true}
                        pinchGestureEnabled={false}
                        keyboardShouldPersistTaps="always"
                    />
                    </TouchableOpacity>
                </BlurView>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 0,
        width: '100%',
        height: '50%',
       // maxHeight: 200
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: colors.bg_white,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    divider: {
        height: 15
    },
    box: {
        flexGrow: 0,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        padding: 10
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 10,
        height: 25
    },
    btn: {
        marginLeft: 10,
        paddingHorizontal: 10
    },
    text: {
        marginLeft: 10,
        fontWeight: '400',
        maxWidth: 200
    }
})