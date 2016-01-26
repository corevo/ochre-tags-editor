var webpack = require('webpack'),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var plugins = [
    //new CommonsChunkPlugin('./public/common.js'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
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
        filename: 'assets/bin/[name].js',
        path: './public',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /app(\/|\\).*\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    // https://github.com/babel/babel-loader#options
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=assets/bin/fonts/[name].[ext]&limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=assets/bin/images/[name].[ext]"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?name=assets/bin/css/[name].[ext]"
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    }
};
