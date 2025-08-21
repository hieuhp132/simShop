const { override, disableEsLint, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  // Disable ESLint for faster builds
  disableEsLint(),
  
  // Disable source maps
  (config) => {
    config.devtool = false;
    
    // Remove source map plugins
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'SourceMapDevToolPlugin'
    );
    
    // Disable source map generation
    config.optimization = {
      ...config.optimization,
      minimize: false, // Disable minification to prevent source map issues
    };
    
    return config;
  },
  
  // Add webpack plugin to disable source maps
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.GENERATE_SOURCEMAP': JSON.stringify('false'),
    })
  )
); 