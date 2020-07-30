const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/tortugas-en-el-tiempo/' : '/',
  configureWebpack: {
    node: {
      process: true,
    },
    plugins: [
      new MonacoEditorPlugin({
        features: [],
        languages: ["javascript", "typescript"],
      })
    ]
  },
  runtimeCompiler: true,
}