const path = require('path');
const  HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: './src/index.html',
            minify: true
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'static', to: 'static' },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    devServer: {
        contentBase: __dirname + "dist",
        port:9999,
        open:true,
        proxy: {
            '/api': {
                target: 'http://localhost:80',
                // 路径重写
                // 如果不重写 /api会添加到url中，比如（/api/sys/user/all => http://192.168.0.2:8888/api/sys/user/all）
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
    ,
    performance: {
        hints: false
    }

};