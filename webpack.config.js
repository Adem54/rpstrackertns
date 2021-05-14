const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack
  webpack.chainWebpack(config => {
    config.plugin('DefinePlugin').tap(args => {
      Object.assign(args[0], {
        'global.TNS_ENV': JSON.stringify(!!env.production ? 'prod' : 'dev')
      })

      return args
    })
  })

	return webpack.resolveConfig();
};


