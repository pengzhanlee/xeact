// webpack.config.js

var webpack = require('webpack');
var path = require('path');
var libraryName = 'index';
var outputFile = libraryName + '.js';

var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
};

module.exports = config;
