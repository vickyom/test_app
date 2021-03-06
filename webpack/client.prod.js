const { clientCommon, PATHS } = require("./common.config")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const BrotliPlugin = require("brotli-webpack-plugin")
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const WorkboxPlugin = require("workbox-webpack-plugin")
const webpack = require("webpack")

const clientProdConfig = Object.assign(clientCommon, {
	devtool: "source-map",
	entry: { main: PATHS.CLIENT },
	output: Object.assign(clientCommon.output, {
		filename: "js/[name].[chunkhash].js",
		chunkFilename: "js/[name].[chunkhash].js"
	}),
	plugins: clientCommon.plugins.concat([
		new ExtractCssChunks({ filename: "[name].[chunkhash].css" }),
		new UglifyJSPlugin({
			parallel: true,
			sourceMap: true,
			extractComments: true,
			uglifyOptions: {
				ecma: 6,
				compress: {
					dead_code: true,
					drop_debugger: true,
					hoist_funs: true,
					inline: true,
					join_vars: true,
					reduce_vars: true,
					warnings: true,
					drop_console: true,
					keep_infinity: true
				}
			}
		}),
		new CompressionPlugin({
			test: /\.(html|css)$|^(?!sw).*\.js$/,
			threshold: 10240,
			minRatio: 0.8,
			algorithm: "gzip"
		}),
		new BrotliPlugin({
			test: /\.(css|html)$|^(?!sw).*\.js$/,
			threshold: 10240,
			minRatio: 0.8
		}),
		new webpack.DefinePlugin({
			__DEV__: false,
			__PROD__: true,
			__SERVER__: false,
			__CLIENT__: true,
			"process.env.NODE_ENV": JSON.stringify("production")
		}),
		new WorkboxPlugin()
		// new BundleAnalyzerPlugin({
		// 	openAnalyzer: false,
		// 	generateStatsFile: true,
		// 	statsFilename: "stats.json"
		// })
	])
})

module.exports = clientProdConfig
