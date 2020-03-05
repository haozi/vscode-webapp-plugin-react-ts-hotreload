import * as vscode from 'vscode'

interface IMessage {
  uuid: string,
  callPath: string,
  args: any[]
}
const safeGet = (data: any, path: string): [any, string[]] => {
  let ret
  const keys = path.split('.')

  const len = keys.length
  for (let i = 0; i < len; ++i) {
    ret = (i ? ret : data)[keys[i]]
    if (ret == null) break
  }
  return [ret, keys]
}
export default ({ callPath, args, uuid }: IMessage, panel: vscode.WebviewPanel, context: vscode.ExtensionContext) => {
  const reply = (success: 0 | 1, data?: any) => {
    panel.webview.postMessage({
      type: 'callVscodeReply',
      data: {
        uuid,
        success,
        data
      }
    })
  }
  try {
    const [func, keys] = safeGet(vscode, callPath)
    const parentPath = keys.slice(0, keys.length - 1).join('.')
    const caller = safeGet(vscode, parentPath) || vscode
    if (typeof func !== 'function') throw new Error(`${parentPath} call ${callPath} is not function`)
    func.apply(caller, args)
    reply(1)
  } catch (e) {
    reply(0, e.message)
  }
}
