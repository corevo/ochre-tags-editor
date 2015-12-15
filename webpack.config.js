var webpack = require('webpack'),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var plugins = [
    //new CommonsChunkPlugin('./public/common.js'),
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({}));
}

module.exports = {
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
    entry: {
        index: './app/app'
    },
    output: {
        filename: './public/assets/bin/[name].js'
    },
    module: {
        loaders: [
            {
                test: /app(\/|\\).*\.(js||jsx)$/,
                loader: 'babel',
                query: {
                    // https://github.com/babel/babel-loader#options
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    }
};
