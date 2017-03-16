const fs = require('fs');
var path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
        const fullDir = path.join(__dirname, dir)
        const entry = path.join(fullDir, 'app.js')
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries[dir] = entry;
        }

        return entries
    }, {}),
    resolve: {
        alias: {
            talqsInteraction: path.resolve(__dirname, '../dist/talqsInteraction')
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: ['babel-loader', 'eslint-loader'] },
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared')
    ]
}
