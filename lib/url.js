//import { searchUrl } from '../App.js';

// eslint-disable-next-line no-useless-escape
const urlRegex = /^((https|http):\/\/)?(?<url>[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)$/
// eslint-disable-next-line no-useless-escape

const matchValidUrl = (str) => str.match(urlRegex)

const searchUrl = "https://www.imasse.com/?q="

export const formatQuery = (str) => {
  const match = matchValidUrl(str)
  return match
    ? `http://${match.groups.url}`
    : searchUrl + `${encodeURIComponent(str)}`
}

const getUrlVars = (url) =>
  url
    .slice(url.indexOf('?') + 1)
    .split('&')
    .reduce((acc, val) => {
      acc[val.split('=')[0]] = val.split('=')[1].replace(/[+]/g, '%20')
      return acc
    }, {})

export const getBaseUrl = (url) => url
export const getBaseName = (baseUrl) =>
  baseUrl
    .replace(/^.*?(www|m|mobile)\./, '')
    .replace(/\.(com|net|org|info|coop|int|co|org|ac|edu).*$/, '')

export const getDisplayStr = (url) =>
  url.slice(0, 30) === 'https://www.imasse.com/?'
    ? decodeURIComponent(getUrlVars(url).q)
    : getBaseUrl(url)
