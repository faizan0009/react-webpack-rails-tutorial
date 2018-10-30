/* eslint comma-dangle: ["error",
  {"functions": "never", "arrays": "only-multiline", "objects": "only-multiline"} ] */

// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const { resolve } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const devBuild = process.env.NODE_ENV !== 'production';

module.exports = {

  // the project dir
  context: resolve(__dirname),
  entry: {
    // This will contain the app entry points defined by
    // webpack.client.rails.hot.config and webpack.client.rails.build.config

    // See use of 'vendor' in the CommonsChunkPlugin inclusion below.
    'vendor-bundle': [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery',
      'turbolinks',
    ],

    // This will contain the app entry points defined by webpack.hot.config and webpack.rails.config
    'app-bundle': [
      'webpack-dev-server/client?http://localhost:3035',
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      './app/bundles/comments/startup/clientRegistration',
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      libs: resolve(__dirname, 'app/libs'),
    },
    modules: [
      'client/app',
      'client/node_modules',
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
      TRACE_TURBOLINKS: devBuild,
    }),


    new ManifestPlugin({
      publicPath: output.publicPath,
      writeToFileEmit: true
    }),
  ],
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader',
      },
      {
        test: /\.(woff2?|jpe?g|png|gif|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
            limit: 10000,
          },
        },
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            query: 'jQuery'
          },
          {
            loader: 'expose-loader',
            query: '$'
          }
        ]
      },
      {
        test: require.resolve('turbolinks'),
        use: {
          loader: 'imports-loader?this=>window'
        },
      },

      // Use one of these to serve jQuery for Bootstrap scripts:

      // Bootstrap 3
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        use: {
          loader: 'imports-loader',
          options: {
            jQuery: 'jquery',
          },
        },
      },

      // Bootstrap 4
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: {
          loader: 'imports-loader',
          options: {
            jQuery: 'jquery',
          },
        },
      },
    ],
  },
};
