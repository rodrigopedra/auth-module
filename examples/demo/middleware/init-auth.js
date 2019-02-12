import SessionStorageStore from '../auth/SessionStorageStore'

export default async function initAuthMiddleware ({ app }) {
  app.$auth.$storage.addCustomStore(SessionStorageStore)

  await app.$auth.init()
}
