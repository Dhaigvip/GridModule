const fs = require('fs');
var webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const postcssImports = require('postcss-import');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "scripts", "styles", "vendor", "main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";
//const projectRoot = "C:\\temp\\ngtest\\ngtest";
const projectRoot = __dirname;
const postcssPlugins = function (loader) {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@licen[cs]e|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
        autoprefixer: false,
        safe: true,
        mergeLonghand: false,
        discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
    };
    return [
        postcssImports({
            resolve: (url, context) => {
                return new Promise((resolve, reject) => {
                    loader.resolve(context, url, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
            },
            load: (filename) => {
                return new Promise((resolve, reject) => {
                    loader.fs.readFile(filename, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const content = data.toString();
                        resolve(content);
                    });
                });
            }
        }),
        postcssUrl({
            filter: ({ url }) => url.startsWith('~'),
            url: ({ url }) => {
                const fullPath = path.join(projectRoot, 'node_modules', url.substr(1));
                return path.relative(loader.context, fullPath).replace(/\\/g, '/');
            }
        }),
        postcssUrl([
            {
                // Only convert root relative URLs, which CSS-Loader won't process into require().
                filter: ({ url }) => url.startsWith('/') && !url.startsWith('//'),
                url: ({ url }) => {
                    if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                        // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                        return `${deployUrl.replace(/\/$/, '')}${url}`;
                    }
                    else if (baseHref.match(/:\/\//)) {
                        // If baseHref contains a scheme, include it as is.
                        return baseHref.replace(/\/$/, '') +
                            `/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                    }
                    else {
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                    }
                }
            },
            {
                // TODO: inline .cur if not supporting IE (use browserslist to check)
                filter: (asset) => !asset.hash && !asset.absolutePath.endsWith('.cur'),
                url: 'inline',
                // NOTE: maxSize is in KB
                maxSize: 10
            }
        ]),
        autoprefixer(),
    ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};




module.exports = (envOptions) => {

    envOptions = envOptions || {};

    const config = {
        //"devtool": "source-map",

        "resolve": {
            "extensions": [
                ".ts",
                ".js"
            ],
            "modules": [
                "./node_modules",
                "./node_modules"
            ],
            "symlinks": true,
            "alias": rxPaths(),
            "mainFields": [
                "browser",
                "module",
                "main"
            ]
        },
        "resolveLoader": {
            "modules": [
                "./node_modules",
                "./node_modules"
            ],
            "alias": rxPaths()
        },
        "entry": {
            /*The point or points to enter the application.
            At this point the application starts executing.
            If an array is passed all items will be executed.
            If a string or array of strings is passed, the chunk is named main
            */
            "main": [
                "./src/main.ts"
            ],
            "vendor": ["bootstrap"],
            "polyfills": [
                "./src/polyfills.ts"
            ],
            "styles": [
                "./node_modules/bootstrap/dist/css/bootstrap.min.css",
                "./node_modules\\tcm-base-module\\bundles\\coreStyle.css",
                "./src\\library\\bundles\\grid1.css"
            ],

            "scripts": [

                "./node_modules\\tcm-base-module\\bundles\\tcmcore.js",
                "./src\\library\\bundles\\grid1.js"
            ]
        },
        "output": {
            "path": path.join(process.cwd(), "dist"),
            "filename": "[name].bundle.js",
            //This option determines the name of non-entry chunk files
            "chunkFilename": "[id].chunk.js"
        },
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery",
            "jquery": "$"
        },
        "module": {
            "rules": [
                {
                    "test": /\.html$/,
                    "loader": "raw-loader"
                },
                {
                    "test": /\.(eot|svg|cur)$/,
                    "loader": "file-loader",
                    "options": {
                        "name": "[name].[hash:20].[ext]",
                        "limit": 10000
                    }
                },
                {
                    "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                    "loader": "url-loader",
                    "options": {
                        "name": "[name].[hash:20].[ext]",
                        "limit": 10000
                    }
                },
                {

                    "exclude": [
                        path.join(process.cwd(), "./src\\library\\bundles\\grid1.css"),
                        path.join(process.cwd(), "./node_modules\\tcm-base-module\\bundles\\coreStyle.css"),
                        path.join(process.cwd(), "./node_modules/bootstrap/dist/css/bootstrap.min.css")

                    ],
                    "test": /\.css$/,
                    "use": [
                        "exports-loader?module.exports.toString()",
                        {
                            "loader": "css-loader",
                            "options": {
                                "sourceMap": false,
                                "import": false
                            }
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "postcss",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        }
                    ]
                },
                {
                    "include": [
                        path.join(process.cwd(), "./src\\library\\bundles\\grid1.css"),
                        path.join(process.cwd(), "./node_modules\\tcm-base-module\\bundles\\coreStyle.css"),
                        path.join(process.cwd(), "./node_modules/bootstrap/dist/css/bootstrap.min.css")
                    ],
                    "test": /\.css$/,
                    "use": [
                        "style-loader",
                        {
                            "loader": "css-loader",
                            "options": {
                                "sourceMap": false,
                                "import": false
                            }
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "postcss",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        }
                    ]
                },
                {
                    "test": /\.ts$/,
                    "loader": "@ngtools/webpack"
                }
            ]
        },
        "plugins": [
            new NoEmitOnErrorsPlugin(),
            new CopyWebpackPlugin([
                {
                    "context": "src",
                    "to": "",
                    "from": {
                        "glob": projectRoot + "\\src\\jquery\\*",
                        "dot": true
                    }
                },
                {
                    "context": "src",
                    "to": "",
                    "from": {
                        "glob": projectRoot + "\\src\\web.config",
                        "dot": true
                    }
                },
                {
                    "context": "src",
                    "to": "",
                    "from": {
                        "glob": projectRoot + "\\src\\assets\\**\\*",
                        "dot": true
                    }
                },
                {
                    "context": "src",
                    "to": "",
                    "from": {
                        "glob": projectRoot + "\\src\\favicon.ico",
                        "dot": true
                    }
                }
            ], {
                    "ignore": [
                        ".gitkeep",
                        "**/.DS_Store",
                        "**/Thumbs.db"
                    ],
                    "debug": "warning"
                }),
            new ProgressPlugin(),
            new CircularDependencyPlugin({
                "exclude": /(\\|\/)node_modules(\\|\/)/,
                "failOnError": false,
                "onDetected": false,
                "cwd": projectRoot
            }),
            new NamedLazyChunksWebpackPlugin(),
            new HtmlWebpackPlugin({
                "template": "./src\\index.html",
                "filename": "./index.html",
                "hash": false,
                "inject": true,
                "compile": true,
                "favicon": false,
                "minify": false,
                "cache": true,
                "showErrors": true,
                "chunks": "all",
                "excludeChunks": [],
                "title": "Webpack App",
                "xhtml": true,
                "chunksSortMode": function sort(left, right) {
                    let leftIndex = entryPoints.indexOf(left.names[0]);
                    let rightindex = entryPoints.indexOf(right.names[0]);
                    if (leftIndex > rightindex) {
                        return 1;
                    }
                    else if (leftIndex < rightindex) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            }),
            new BaseHrefWebpackPlugin({}),
            new CommonsChunkPlugin({
                "name": [
                    "inline"
                ],
                "minChunks": null
            }),
            new CommonsChunkPlugin({
                "name": [
                    "vendor"
                ],
                "minChunks": (module) => {
                    return module.resource
                        && (module.resource.startsWith(nodeModules)
                            || module.resource.startsWith(genDirNodeModules)
                            || module.resource.startsWith(realNodeModules));
                },
                "chunks": [
                    "main"
                ]
            }),
            new SourceMapDevToolPlugin({
                "filename": "[file].map[query]",
                "moduleFilenameTemplate": "[resource-path]",
                "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
                "sourceRoot": "webpack:///"
            }),
            new CommonsChunkPlugin({
                "name": [
                    "main"
                ],
                "minChunks": 2,
                "async": "common"
            }),
            new NamedModulesPlugin({}),
            new AngularCompilerPlugin({
                "mainPath": "main.ts",
                "platform": 0,
                "hostReplacementPaths": {
                    "environments\\environment.ts": "environments\\environment.ts"
                },
                "sourceMap": true,
                "tsConfigPath": "src\\tsconfig.app.json",
                "skipCodeGeneration": true,
                "compilerOptions": {}
            })
        ],
        "node": {
            "fs": "empty",
            "global": true,
            "crypto": "empty",
            "tls": "empty",
            "net": "empty",
            "process": true,
            "module": false,
            "clearImmediate": false,
            "setImmediate": false
        },
        "devServer": {
            "historyApiFallback": true
        }
    }
    if (envOptions.MODE === 'prod') {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    warnings: false,
                    screw_ie8: true
                },
                comments: false
            })
        )
    }
    return config;
};
