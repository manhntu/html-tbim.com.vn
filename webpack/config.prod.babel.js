const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const fibers = require('fibers');
const sass = require('sass');

// Creation of HTML files
// https://webpack.js.org/plugins/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Copies individual files or entire directories, which already exist, to the build directory.
// https://webpack.js.org/plugins/copy-webpack-plugin/
const CopyWebpackPlugin = require('copy-webpack-plugin');

// A webpack plugin to remove/clean your build folder(s).
// https://github.com/johnagan/clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// This plugin extracts CSS into separate files
// https://webpack.js.org/plugins/mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const htmlFileNames = fs.readdirSync('./src/views/');

const getEntries = () => {
  const entries = [
    './src/js/app.js',
    './src/scss/app.scss'
  ];

  htmlFileNames.forEach((filename) => {
    entries.push(`./src/views/${filename}`);
  });

  return entries;
};

const getPlugins = () => {
  const plugins = [
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        { from: `${__dirname}/../src/assets/`, to: `${__dirname}/../dist/assets/` }
      ]
    }),

    // Save compiled SCSS into separated CSS file: [name].bundle.css or [name].[hash].bundle.css
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].bundle.css'
    }),

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
    if (filename.substr(0, 1) !== '_') {
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
    }
  });

  return plugins;
};

module.exports = {
  mode: 'production',
  entry: getEntries(),

  // Define the destination directory and filenames of compiled resources
  output: {
    // Bundle relative name: [name].bundle.js or [name].[hash].bundle.js
    filename: 'assets/js/[name].bundle.js',

    // Base build directory
    path: path.resolve(__dirname, '../dist')
  },

  //
  plugins: getPlugins(),

  // Define development options
  devtool: 'source-map',

  // Define loaders configuration
  module: {
    rules: [
      //
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
        use: ['babel-loader'],
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
        ]
      },

      // Fonts loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }],
      },

      // Svg inline 'data:image' loader
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      }
    ],
  },

  resolve: {
    extensions: ['.js', '.jpg', '.html', '.scss'],
    modules: [
      path.resolve(__dirname, 'scripts'),
      'node_modules'
    ],
    alias: {
      jquery: 'jquery/dist/jquery.min.js'
    }
  }
};
