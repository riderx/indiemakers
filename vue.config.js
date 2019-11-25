const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: '/',
    configureWebpack: {
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
            // new BundleAnalyzerPlugin()
        ]
    },
    pwa: {
        themeColor: '#9456b7',
        msTileColor: '#9456b7',
        assetsVersion: '1',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'GenerateSW',
        manifestOptions: {
            name: 'INDIE MAKER FRANCE',
            short_name: 'IMF'
        }
    }
}