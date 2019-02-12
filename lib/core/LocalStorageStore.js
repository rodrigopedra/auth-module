import { isUnset } from './utilities'

export default class LocalStorageStore {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options
  }

  get (key, isJson) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    const value = localStorage.getItem(_key)
    if (value === 'false') {
      return false
    }

    return isJson ? JSON.parse(value) : value
  }

  set (key, value, { isJson }) {
    if (typeof localStorage === 'undefined' || !this.options.localStorage) {
      return
    }

    const _key = this.options.localStorage.prefix + key

    if (isUnset(value)) {
      localStorage.removeItem(_key)
    } else {
      localStorage.setItem(_key, isJson ? JSON.stringify(value) : value)
    }

    return value
  }
}
