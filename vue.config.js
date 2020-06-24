module.exports = {
	publicPath: './',
	devServer: {
		port: 8080,
		disableHostCheck: true,
		proxy: process.env.NODE_ENV === 'development' ? 'https://jklz.cdjihui.com/' : 'https://jklzggh.cdjihui.com/'
	},
	css: {
		loaderOptions: {
			stylus: {
				'resolve url': true,
				'import': [
					'./src/theme'
				]
			}
		}
	},
	pluginOptions: {
		'cube-ui': {
			postCompile: true,
			theme: true
		}
	}
}
