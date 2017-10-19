var path = require('path');
var webpack = require('webpack');
var production = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        'xeact': './src/index.js',
        'env': './src/ceEnv.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist' ),
        filename: production ? '[name].min.js' : '[name].js',
        // library: 'xeact',
        // libraryTarget: 'umd'
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
    plugins: production ? [
        new webpack.optimize.UglifyJsPlugin({
            exclude: ['env'],
            compress: { warnings: false },
        })
    ] : []
};
