import { getBaseUrl, getBaseName } from './url.js'
import { useStoredReducer } from './storage.js'

import defaultTabs from '../config/defaultTabs.js'

export const tabExists = (url, tabs) =>
    tabs.reduce(
        (acc, val) => val.url === `${getBaseUrl(url)}` || acc,
        false
    )

const formatTitle = (url) => {
    const baseName = getBaseName(getBaseUrl(url.slice(8)))
    return (baseName.match(/[.]/g) || []).length > 1
        ? getBaseUrl(url)
        : `${baseName[0].toUpperCase()}${baseName.slice(1)}`
}

const addTab = (url, tabs) => {
    const baseUrl = `${getBaseUrl(url)}`
    return [...tabs, { title: formatTitle(url), url: baseUrl, id: baseUrl }]
}

const removeTab = (url, tabs) =>
    tabs.filter((el) => el.url !== `${getBaseUrl(url)}`)

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return addTab(action.payload, state)
        case 'REMOVE':
            return removeTab(action.payload, state)
        case 'RESET':
            return defaultTabs
        default:
            return action.payload
    }
}

export const useTabs = () => {
    return useStoredReducer('@tabs', reducer)
}