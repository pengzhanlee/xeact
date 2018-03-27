const path = require('path');
const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = {
    entry: {
        'xeact': './src/index.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: production ? '[name].min.js' : '[name].js',
        library: 'xeact',
        libraryTarget: 'umd'
    },
    devtool: production ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            'xeact': path.resolve(__dirname, 'src/index'),
        }
    },
    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
        },
        {
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
    ],
    plugins: [
        new ConcatPlugin({
            uglify: false,
            sourceMap: false,
            name: 'env',
            outputPath: './',
            fileName: '[name].js',
            filesToConcat: [
                path.resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
                path.resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js'),
            ],
        })
    ]
};
