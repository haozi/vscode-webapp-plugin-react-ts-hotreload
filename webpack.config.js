const path = require('path')
const tsImportPlugin = require('ts-import-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

const PORT = 52000

module.exports = (_, { mode }) => {
  mode && (process.env.NODE_ENV = mode)
  const isDev = mode === 'development'
  return {
    entry: {
      app: './src/view/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'out'),
      filename: isDev ? '[name].js' : '[name].[hash:7].js'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      }
    },
    devtool: isDev ? 'eval-source-map': false,
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json']
    },
    devServer: {
      port: PORT,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      disableHostCheck: true,
      quiet: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webview plugin',
        template: './src/view/index.html',
        inject: true,
      }),
      !isDev && new AssetsPlugin({ filename: './out/webpack-assets.json'}),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://127.0.0.1:${PORT}`],
        },
        onErrors (severity, errors) {
          if (severity !== 'error') return
          console.log(errors[0].message)
          const error = errors[0]
          const filename = error.file && error.file.split('!').pop()

          notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
          })
        }
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          options: {
            getCustomTransformers: () => ({
              before: [tsImportPlugin({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
              })]
            })
          }
        },
        {
          test: /\.(styl|stylus)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: true,
                // modifyVars: {
                //   '@body-background': 'var(--background-color)'
                // }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 0,
              },
            },
          ],
        }
      ]
    },
    performance: {
      hints: false
    }
  }
}

module.exports.PORT = PORT
