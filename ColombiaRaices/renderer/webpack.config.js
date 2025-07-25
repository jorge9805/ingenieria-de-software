const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
    publicPath: './',
  },
  
  // Optimización para Sprint 11 - Code Splitting
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor libraries (React, etc.)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20
        },
        // Reservation components (Sprint 11)
        reservations: {
          test: /[\\/]src[\\/]components[\\/]reservations[\\/]/,
          name: 'reservations',
          chunks: 'all',
          priority: 15
        },
        // Common components
        common: {
          test: /[\\/]src[\\/]components[\\/]common[\\/]/,
          name: 'common',
          chunks: 'all',
          priority: 10
        }
      }
    },
    runtimeChunk: 'single'
  },devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3006,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions']
                }
              }],
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ]
          }
        },
      },{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/images',
          to: 'images',
        },
      ],
    }),
  ],
};
