/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path');

// scriptName values: content, game, list, popup, event (special case!)
export default (scriptName, isBgScript) => {
  let rules = [
    {
      test: (isBgScript) ? /\.(js)?$/ : /\.(jsx|js)?$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      include: path.join(__dirname, 'src'),
      query: {
        presets: [
          '@babel/preset-env', 
          '@babel/preset-react',
          {
            "plugins": [
              "@babel/plugin-proposal-class-properties"
            ]
          }
        ]
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
                  path.resolve(__dirname, './node_modules/bootstrap/scss')
                ],
              },
            },
          },
        ]
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
