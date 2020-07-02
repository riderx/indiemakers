// const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: '/',
    configureWebpack: {
        plugins: [
            // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: true
            }),
            // new BundleAnalyzerPlugin()
        ]
    },
    pwa: {
        themeColor: 'rgba(75, 39, 155, 1)',
        msTileColor: 'rgba(75, 39, 155, 1)',
        assetsVersion: '1',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'GenerateSW',
        manifestOptions: {
            name: 'INDIE MAKERS',
            short_name: 'IM'
        }
    }
}