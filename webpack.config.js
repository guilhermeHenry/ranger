const URL_NODE_MODULES = 'C:\\Users\\gui20\\AppData\\Roaming\\npm\\node_modules';
const HtmlWebpackPlugin = require(URL_NODE_MODULES + '\\html-webpack-plugin');
const MiniCssExtractPlugin = require(URL_NODE_MODULES + '\\mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app.js',
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js'
	},
	devServer:{
		port: 4848
	},
	module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
        	// Creates `style` nodes from JS strings
          {loader: MiniCssExtractPlugin.loader},
          // Translates CSS into CommonJS
          {loader: URL_NODE_MODULES + '\\css-loader'},
          // Compiles Sass to CSS
          {loader: URL_NODE_MODULES + '\\sass-loader'},
        ],
      },
    ],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'bundle.css',
		})
	]
}