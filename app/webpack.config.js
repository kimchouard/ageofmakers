/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path');
const AntdScssThemePlugin = require('antd-scss-theme-plugin');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

// scriptName values: content, game, list, popup, event (special case!)
export default (scriptName, isBgScript) => {
  let rules = [
    {
      test: (isBgScript) ? /\.(js)?$/ : /\.(jsx|js)?$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      include: path.join(__dirname, 'src'),
      query: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    },
  ]

  // Add more module rules if not bg script
  if (!isBgScript) {
    rules.push({
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, './node_modules/compass-mixins/lib'),
                  path.resolve(__dirname, './node_modules/font-awesome/scss'),
                  path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
                ],
              },
            },
          },
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          AntdScssThemePlugin.themify('less-loader'),
        ],
      },
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}
    );
  }

  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',

    entry: [
      `./app/src/${(scriptName === 'event') ? 'index' : 'scripts/' + scriptName}.js`
    ],

    plugins: [
      new AntDesignThemePlugin({
        varFile: path.join(__dirname, './src/sass/variables.less'),
      }),
      new AntdScssThemePlugin('./src/sass/antdTheme.scss'),
    ],

    output: {
      filename: `${scriptName}.js`,
      path: path.join(__dirname, '../', 'build'),
      publicPath: (isBgScript) ? undefined : '/',
    },

    resolve: {
      extensions: (isBgScript) ? ['.js', '.json'] : ['.js', '.jsx', '.scss', '.json'],
      modules: ['node_modules']
    },

    module: {
      rules,
    },
  };
}
