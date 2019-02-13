import { isUnset, isSet } from './utilities'
import StateStore from './StateStore'
import LocalStorageStore from './LocalStorageStore'
import CookieStore from './CookieStore'

export default class Storage {
  constructor (ctx, options) {
    this.ctx = ctx
    this.options = options

    this._initStores()
  }

  // ------------------------------------
  // Universal
  // ------------------------------------

  setUniversal (key, value, isJson) {
    // Local state
    this.setState(key, value)

    // Cookies
    this.setCookie(key, value)

    // Local Storage
    this.setLocalStorage(key, value, isJson)

    // Custom Stores
    this._customStores.forEach((store) => { store.set(key, value, { isJson }) })

    return value
  }

  getUniversal (key, isJson) {
    // Local state
    let value = this.getState(key)

    // Cookies
    if (isUnset(value)) {
      value = this.getCookie(key, isJson)
    }

    // Local Storage
    if (isUnset(value)) {
      value = this.getLocalStorage(key, isJson)
    }

    // Custom Stores
    if (isUnset(value)) {
      value = this._customStores.reduce((value, store) => {
        if (isUnset(value)) {
          return store.get(key, isJson)
        }

        return value
      }, value)
    }

    return value
  }

  syncUniversal (key, defaultValue, isJson) {
    let value = this.getUniversal(key, isJson)

    if (isUnset(value) && isSet(defaultValue)) {
      value = defaultValue
    }

    if (isSet(value)) {
      this.setUniversal(key, value)
    }

    return value
  }

  _initStores () {
    // To minimize breaking changes, wee keep state, local and cookie stores as properties
    this._stateStore = new StateStore(this.ctx, this.options)
    this.state = this._stateStore.init()

    this._localStorageStore = new LocalStorageStore(this.ctx, this.options)
    this._cookieStore = new CookieStore(this.ctx, this.options, !!process.server)

    const customStores = this.options.stores || {}
    this._customStores = Object.keys(customStores).map((key) => {
      const StoreClass = require('~/auth/stores/' + customStores[key]).default
      return new StoreClass(this.ctx, this.options, !!process.server)
    })
  }

  // ------------------------------------
  // Local state (reactive)
  // ------------------------------------

  setState (key, value) {
    this._stateStore.set(key, value)

    return value
  }

  getState (key) {
    return this._stateStore.get(key)
  }

  watchState (key, fn) {
    return this._stateStore.watch(key, fn)
  }

  // ------------------------------------
  // Local storage
  // ------------------------------------

  setLocalStorage (key, value, isJson) {
    return this._localStorageStore.set(key, value, { isJson })
  }

  getLocalStorage (key, isJson) {
    return this._localStorageStore.get(key, isJson)
  }

  // ------------------------------------
  // Cookies
  // ------------------------------------

  setCookie (key, value, options = {}) {
    return this._cookieStore.set(key, value, options)
  }

  getCookie (key, isJson) {
    return this._cookieStore.get(key, isJson)
  }
}
