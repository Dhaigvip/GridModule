module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-webpack'),
            require('karma-sourcemap-loader')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        files: [
            { pattern: 'test/main.js', watched: false }
        ],
        exclude: [
        ],
        preprocessors: {
            'test/main.js': ['webpack', 'sourcemap']
        },
        webpack: require('./webpack.test.config')({ env: 'test' }),
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}
