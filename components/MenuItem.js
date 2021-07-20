import React from 'react'
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

import colors from '../config/colors.js'

export default function MenuItem({
    title,
    feather,
    url,
    action,
    urlState,
    editing,
    handleBookmarkPress,
    handleBookmarkLongPress,
    handleShare,
    handleActionPress,
    handleDelete
}) {
    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => {
                handleBookmarkPress(url)
           }}
           // onLongPress={handleBookmarkLongPress}
        >
            <Feather
                name={feather}
                size={16}
                color={colors.text_gray}
            />
            <Text 
                // eslint-disable-next-line react-native/no-inline-styles
                style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                numberOfLines={1}
            >
                 {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: colors.bg_white,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 20
    },
    text: {
        marginLeft: 10,
        fontWeight: '400',
        maxWidth: 200
    }
})