const path = require('path');
const console = require('console');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require("webpack");

var node_dir = __dirname + '/node_modules';


const nodeModules = path.join(process.cwd(), 'node_modules');


module.exports = () => {
    return {
        entry: {
            "main": [
          "./src\\main.ts"
            ],
            "vendor": ["bootstrap"],
            "polyfills": [
                "./src\\polyfills.ts"
            ],
            "scripts": [
            "./src\\library\\bundles\\tcmcore.js",
            "./node_modules\\signalr\\jquery.signalR.js"
            ],
            "styles": [
                "./node_modules\\bootstrap\\dist\\css\\bootstrap.min.css",
                "./src\\library\\bundles\\coreStyle.css",
                "./node_modules\\ng2-toastr\\bundles\\ng2-toastr.min.css",
                "./node_modules\\@angular\\material\\prebuilt-themes\\indigo-pink.css",
            ]
        },
        output: {
            path: './dist',
            filename: '[name].bundle.js'
        },
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery",
            "jquery": "$"
        },
        resolve: {
            extensions: ['.js', '.ts', '.html']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loaders: [
                        'awesome-typescript-loader',
                        'angular2-template-loader'
                    ]
                },
                //source-map-loader extracts existing source maps from all JavaScript entries.This includes both inline source maps as well as those linked via URL.
                {
                    "enforce": "pre",
                    "test": /\.js$/,
                    "loader": "source-map-loader",
                    "exclude": [
                        /\/node_modules\//
                    ]
                },
                {
                    "test": /\.json$/,
                    "loader": "json-loader"
                },
                {
                    "test": /\.html$/,
                    "loader": "raw-loader"
                },
                //Instructs webpack to emit the required object as file and to return its public url.
                {
                    "test": /\.(eot|svg)$/,
                    "loader": "file-loader?name=[name].[hash:20].[ext]"
                },

                //The url-loader works like the file-loader, but can return a DataURL if the file is smaller than a byte limit.

                {
                    "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
                    "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
                },
                //Exports variables from inside the file by appending `exports[...] = ...` statements..
                {
                    "exclude": [
                        path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.min.css"),
                        path.join(process.cwd(), "./src\\library\\bundles\\coreStyle.css")

                    ],
                    "test": /\.css$/,
                    "use": [
                        "exports-loader?module.exports.toString()",
                        {
                            //The css-loader interprets @import and url() like import/require() and will resolve them.
                            "loader": "css-loader",
                            "options": {
                                "sourceMap": false,
                                "importLoaders": 1
                            }
                        }
                    ]
                },
                // Support for CSS as raw text
                // use 'null' loader in test mode (https://github.com/webpack/null-loader)
                // all css in src/style will be bundled in an external css file
                {
                    "include": [
                        path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.min.css"),
                        path.join(process.cwd(), "./src\\library\\bundles\\coreStyle.css")

                    ],
                    "test": /\.css$/,
                    "loaders": ExtractTextPlugin.extract({
                        "use": [
                            {
                                "loader": "css-loader",
                                "options": {
                                    "sourceMap": false,
                                    "importLoaders": 1
                                }
                            }
                        ],
                        "fallback": "style-loader",
                        "publicPath": ""
                    })
                },
            ]
        },
        "plugins": [
            //EnvironmentPlugin - configure environments.
            //new webpack.ProvidePlugin({
            //    jQuery: 'jquery',
            //    $: 'jquery',
            //    jquery: 'jquery'
            //}),
            new ExtractTextPlugin({
                "filename": "[name].bundle.css",
                "disable": true
            }),
        ],
        devtool: 'inline-source-map'
    };
};