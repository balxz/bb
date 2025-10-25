import { caching, Cache, StoreConfig } from 'cache-manager'
import { proto } from '../../WAProto'
import { BufferJSON, initAuthCreds, AuthenticationCreds, SignalDataSet, SignalDataTypeMap } from '../Utils'
import logger from '../Utils/logger'

export async function makeCacheManagerAuthState(
  store: StoreConfig,
  sessionKey: string
) {
  const defaultKey = (file: string) => `${sessionKey}:${file}`
  const databaseConn: Cache = await caching(store)

  const writeData = async (file: string, data: unknown) => {
    let ttl: number | undefined
    if (file === 'creds') {
      ttl = 63115200 // 2 years
    }
    await databaseConn.set(defaultKey(file), JSON.stringify(data, BufferJSON.replacer), ttl)
  }

  const readData = async (file: string): Promise<any | null> => {
    try {
      const data = await databaseConn.get<string>(defaultKey(file))
      if (data) {
        return JSON.parse(data, BufferJSON.reviver)
      }
      return null
    } catch (error) {
      logger.error(error)
      return null
    }
  }

  const removeData = async (file: string) => {
    try {
      return await databaseConn.del(defaultKey(file))
    } catch {
      logger.error(`Error removing ${file} from session ${sessionKey}`)
    }
  }

  const clearState = async () => {
    try {
      const keys = await databaseConn.store.keys(`${sessionKey}*`)
      await Promise.all(keys.map(async (key: string) => databaseConn.del(key)))
    } catch {
      // ignore errors
    }
  }

  const creds: AuthenticationCreds = (await readData('creds')) || initAuthCreds()

  return {
    clearState,
    saveCreds: () => writeData('creds', creds),
    state: {
      creds,
      keys: {
        get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
          const data: SignalDataSet<T> = {} as SignalDataSet<T>
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`)
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value)
              }
              data[id] = value
            })
          )
          return data
        },
        set: async (data: Partial<{ [T in keyof SignalDataTypeMap]: SignalDataSet<T> }>) => {
          const tasks: Promise<void>[] = []
          for (const category in data) {
            const items = data[category as keyof typeof data]
            if (!items) continue
            for (const id in items) {
              const value = items[id]
              const key = `${category}-${id}`
              tasks.push(value ? writeData(key, value) : removeData(key))
            }
          }
          await Promise.all(tasks)
        },
      },
    },
  }
}

export default makeCacheManagerAuthState