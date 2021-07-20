import React from 'react'
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

import colors from '../config/colors.js'

export default function BookmarkItem({
    title,
    url,
    editing,
    handleBookmarkPress,
    handleBookmarkLongPress,
    handleDelete
}) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                if (editing) return // prevent bookmark triggering when editing
                handleBookmarkPress(url)
            }}
            onLongPress={handleBookmarkLongPress}
        >
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: 'https://www.google.com/s2/favicons?domain=' + url,
                }}
            />
            <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
                numberOfLines={1}
            >
                {title}
            </Text>
            {editing && (
                <TouchableOpacity
                    style={styles.cross}
                    onPress={() => handleDelete(url)}
                >
                    <Feather name="x-square" size={24} color={colors.text_gray} />
                </TouchableOpacity>
            )}
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
        fontWeight: '400',
        maxWidth: 200
    },
    cross: {
        marginLeft: 'auto'
    },
    tinyLogo: {
        width: 16,
        height: 16,
        marginRight: 10
    }
})