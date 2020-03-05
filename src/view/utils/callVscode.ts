import { genGuid } from './lib'

declare var acquireVsCodeApi: any
const vscode = acquireVsCodeApi()
interface IUUIDMap {
  [key: string]: {
    resolve: any
    reject: any
  }
}
let UUIDMap: IUUIDMap = {}

window.addEventListener('message', event => {
  const message = event.data || {}
  if (message.type !== 'callVscodeReply') return
  const { success, uuid, data } = message.data
  if (UUIDMap[uuid]) {
    UUIDMap[uuid][success ? 'resolve' : 'reject'](data)
    delete UUIDMap[uuid]
  }
})

export default async (callPath: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uuid = callPath + genGuid()
    UUIDMap[uuid] = { resolve, reject }
    vscode.postMessage({ callPath, args, uuid })
  })
}
