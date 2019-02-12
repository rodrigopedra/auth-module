import { isUnset } from './utilities'
import Cookies from 'js-cookie'
import { parse as parseCookie } from 'cookie'

export default class CookieStore {
  constructor (ctx, options, isServer) {
    this.ctx = ctx
    this.options = options
    this.isServer = isServer
  }

  get (key, isJson) {
    if (!this.options.cookie || (this.isServer && !this.ctx.req)) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const cookieStr = this.isServer
      ? this.ctx.req.headers.cookie
      : document.cookie

    const cookies = parseCookie(cookieStr || '') || {}
    const value = cookies[_key]
    if (value === 'false') {
      return false
    }
    return isJson ? JSON.parse(value) : value
  }

  set (key, value, options = {}) {
    if (this.isServer || !this.options.cookie) {
      return
    }

    const _key = this.options.cookie.prefix + key

    const _options = Object.assign({}, this.options.cookie.options, options)

    if (isUnset(value)) {
      Cookies.remove(_key, _options)
    } else {
      Cookies.set(_key, value, _options)
    }

    return value
  }
}
