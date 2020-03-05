import * as vscode from 'vscode'
import * as path from 'path'
import callVscode from './callVscodeExtension'
const loadScript = (context: vscode.ExtensionContext, jsName: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `<script>document.write('<script src="${jsName}.js"><\\/script>')</script>`
  }

  const assets = require('./webpack-assets.json')
  return `<script src="${vscode.Uri.file(context.asAbsolutePath(`out/${assets[jsName]['js']}`)).with({ scheme: 'vscode-resource' }).toString()}"></script>`
}

export const activate = (context: vscode.ExtensionContext) => {
  vscode.window.setStatusBarMessage('你好， 耗子！')

  context.subscriptions.push(
    vscode.commands.registerCommand('HelloWorld.open', () => {
      const panel = vscode.window.createWebviewPanel('HelloWorld', 'Hello, World!!!', vscode.ViewColumn.Active, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [ vscode.Uri.file(path.join(context.extensionPath, 'out')) ]
      })

      panel.webview.onDidReceiveMessage(message => {
        callVscode(message, panel, context)
      }, undefined, context.subscriptions)

      panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          ${process.env.NODE_ENV === 'development' ? `<base href="http://127.0.0.1:${require('../webpack.config').PORT}">` : ''}
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        </head>
        <body>
          <div id="app"></div>
          ${loadScript(context, 'vendor')}
          ${loadScript(context, 'app')}
        </body>
        </html>
      `
    })
  )
}

export const deactivate = () => { /* noop */ }
