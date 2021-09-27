module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'SWU WEBVPN Converter'
    }
  },
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production' ? '/swu-webvpn-converter/' : '/'
}
