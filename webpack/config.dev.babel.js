const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const portFinderSync = require('portfinder-sync');
const fibers = require('fibers');
const sass = require('sass');

// Recognizes certain classes of webpack errors and cleans
// https://www.npmjs.com/package/friendly-errors-webpack-plugin
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// Replace outdate friendly-errors-webpack-plugin above
// https://github.com/sodatea/friendly-errors-webpack-plugin
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');

// Creation of HTML files
// https://webpack.js.org/plugins/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This plugin extracts CSS into separate files
// https://webpack.js.org/plugins/mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// A ESLint plugin for webpack
// https://webpack.js.org/plugins/eslint-webpack-plugin/
const ESLintPlugin = require('eslint-webpack-plugin');

const htmlFileNames = fs.readdirSync('./src/views/');

const getEntries = () => {
  // Define the entry points of our application (can be multiple for different sections of a website)
  const entries = [
    './src/js/app.js',
    './src/scss/app.scss'
  ];

  htmlFileNames.forEach((filename) => {
    entries.push(`./src/views/${filename}`);
  });

  return entries;
};

const esLintPluginOptions = {
  extensions: ['js', 'jsx'],
  exclude: [
    '/node_modules/',
    '/bower_components/'
  ],
  // ...eslintOptions, // these are the options we'd previously passed in
};

const getPlugins = () => {
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      // Should the console be cleared between each compilation?
      // default is true
      clearConsole: true,
    }),

    // Save compiled SCSS into separated CSS file: [name].css or [name].[hash].css
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css'
    }),

    new ESLintPlugin(esLintPluginOptions),

    // Provide jQuery and Popper.js dependencies
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
    })
  ];
  htmlFileNames.forEach((filename) => {
    const splitted = filename.split('.');
    if (splitted[1] === 'html') {
      plugins.push(
        new HtmlWebpackPlugin({
          template: `./src/views/${filename}`,
          filename: `./${filename}`,

          // Compress HTML
          minify: false,

          // Link tags as self-closing
          xhtml: true,

          // Inject scripts to bottom body
          inject: 'body'
        }),
      );
    }
  });

  return plugins;
};

module.exports = {
  mode: 'development',
  entry: getEntries(),

  // Define the destination directory and filenames of compiled resources
  output: {
    // Bundle relative name: [name].js or [name].[hash].js
    filename: 'assets/js/[name].js',

    // Base build directory
    path: path.resolve(__dirname, '../dist')
  },

  //
  plugins: getPlugins(),

  // Define development options
  devtool: 'source-map',

  // production mode optimization
  optimization: {
    minimizer: [
      // CSS optimizer
      new OptimizeCSSAssetsPlugin(),

      // JS optimizer by default
      new TerserPlugin(),
    ],
  },

  // Define loaders configuration
  module: {
    rules: [

      // Html file
      {
        test: /\.(html)$/,
        loader: path.resolve(__dirname, 'loader/html-loader.js'),
        options: {
          html: htmlFileNames
        }
      },

      // Use babel for JS files
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      // Compile and extract SCSS files
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          // Inject CSS to page
          // fallback to style-loader in development with MiniCssExtractPlugin
          MiniCssExtractPlugin.loader,

          // Translates CSS into CommonJS modules
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },

          // Run post css actions
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },

          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'expanded',
                fiber: fibers
              },
              // Prefer `dart-sass`
              implementation: sass
            }
          }
        ],
      },

      // Images loader
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },

      // Fonts loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ],
      },

      // Svg inline 'data:image' loader
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      }
    ]
  },

  //
  resolve: {
    extensions: ['.js', '.jpg', '.html', '.scss'],
    modules: [
      path.resolve(__dirname, 'scripts'),
      'node_modules'
    ],
    alias: {
      jquery: 'jquery/dist/jquery.slim.min.js'
    }
  },

  //
  devServer: {
    contentBase: './src/views',
    watchContentBase: true,
    hot: true,
    port: portFinderSync.getPort(8080),
    compress: true,
    open: false,
    inline: true,

    // Setting friendly-errors-webpack-plugin
    quiet: true,

    historyApiFallback: true,
    before(app) {
      app.use('/assets', express.static('./src/assets'));
      app.use('/images', express.static('./src/assets/images'));
      app.use('/fonts', express.static('./src/assets/fonts'));
      app.use('/temp', express.static('./src/assets/temp'));
    }
  }
};
