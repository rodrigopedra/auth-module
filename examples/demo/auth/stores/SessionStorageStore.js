const isUnset = o => typeof o === 'undefined' || o === null

export default class SessionStorageStore {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options
    this.prefix = 'auth.'
  }

  get (key, isJson) {
    if (typeof sessionStorage === 'undefined') {
      return
    }

    const _key = this.prefix + key

    const value = sessionStorage.getItem(_key)
    if (value === 'false') {
      return false
    }

    return isJson ? JSON.parse(value) : value
  }

  set (key, value, { isJson }) {
    if (typeof sessionStorage === 'undefined') {
      return
    }

    const _key = this.prefix + key

    if (isUnset(value)) {
      sessionStorage.removeItem(_key)
    } else {
      sessionStorage.setItem(_key, isJson ? JSON.stringify(value) : value)
    }

    return value
  }
}
