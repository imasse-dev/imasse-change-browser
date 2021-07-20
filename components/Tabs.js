import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet
} from 'react-native'
import {
    Feather
} from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

import BookmarkItem from './BookmarkItem.js'
import { lightHaptics } from '../lib/alert.js'

import colors from '../config/colors.js'

export default function Tabs({
    tabs,
    handleSpacePress,
    handleBookmarkPress,
    handleDelete,
    handleReset,
    handleNewTab
}) {
    const [editing, setEditing] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [fadeAnim])

    const windowWidth = Dimensions.get('window').width
    const numColumns = Math.floor(windowWidth / 300)

    const renderItem = ({ item }) => (
        <BookmarkItem
            handleBookmarkLongPress={() => {
                if (editing) return
                setEditing(true)
                lightHaptics()
            }}
            {...{ handleBookmarkPress, editing, handleDelete, ...item }}
        />
    )

    return (
        <TouchableWithoutFeedback onPress={handleSpacePress}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <BlurView intensity={75} tint="dark" style={styles.box}>
                    <FlatList
                        data={tabs}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.url}
                        numColumns={numColumns}
                        key={numColumns} // rerender when numColumns changes
                        pagingEnabled={true}
                        pinchGestureEnabled={false}
                        keyboardShouldPersistTaps="always"
                    />
                    <View style={styles.btns}>
                        <TouchableOpacity style={styles.btn} onPress={handleNewTab}>
                            <Feather
                                name="plus-square"
                                size={24}
                                color={colors.bg_white}
                            />
                        </TouchableOpacity>
                        {editing && ( // only show reset button when editing
                            <TouchableOpacity style={styles.btn} onPress={handleReset}>
                                <Feather
                                    name="refresh-ccw"
                                    size={24}
                                    color={colors.bg_white}
                                />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => {
                                setEditing((editing) => !editing)
                                lightHaptics()
                            }}
                        >
                            {editing ? (
                                <Feather name="check-square" size={24} color={colors.bg_white} />
                            ) : (
                                <Feather
                                    name="edit"
                                    size={24}
                                    color={colors.bg_white}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
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
        height: '40%'
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
    }
})