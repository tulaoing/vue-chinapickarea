'use strict'

var path = require("path");
var webpack = require("webpack");
var pkg = require('./package.json');
var banner = `${pkg.name} v${pkg.version}\n${pkg.description}\n${pkg.homepage}\n@author ${pkg.author}`;

module.exports = {
	entry: {
		'vue-chinapickarea': path.join(__dirname, 'src/index.js')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		library: 'vue-chinapickarea',
		libraryTarget: 'umd',
		filename: "[name].js"
	},
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue-loader',
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}]
	}
};