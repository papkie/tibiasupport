//https://medium.com/@Agro/developing-desktop-applications-with-electron-and-react-40d117d97564

const webpack = require('webpack');
const path = require('path');

const sourcePath = path.join(__dirname, './app/ui');

module.exports = {
  entry: {
    main: './app/ui/app.tsx',
    // vendor: [
    //   'react',
    //   'react-dom',
    // ]
  },
  output: {
    path: path.join(__dirname, './bin'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
  },
  devServer: {
    contentBase: sourcePath,
    hot: true,
    stats: {
      warnings: false
    },
    proxy: {
      // '/api': {
      //   target: 'http://localhost:3001'
      // },
    }
  },
  module: {
    loaders: [{
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin()
  ]
}
