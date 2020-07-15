const { override, useEslintRc, addLessLoader, addPostcssPlugins, fixBabelImports, addWebpackPlugin } = require('customize-cra');
const rewireAliases = require('react-app-rewire-aliases');
const path = require('path');
// const rewireEslint = require('react-app-rewire-eslint');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 
const dropConsole = () => {
  return config => {
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true
        }
      })
    }
    return config
  }
}
const rewireVendors = () => (config, dev) => {
  if (!config.optimization) {
    config.optimization = {};
  }
  config.optimization.splitChunks = {
    name: 'vendor',
    filename: 'static/js/vendor.[hash:8].js',
    chunks: 'all',
    // name: true,
    cacheGroups: {
      commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
      },
      vendor: { // 将第三方模块提取出来
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10, // 优先
          /* 为此缓存组创建块时，告诉webpack忽略splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequestss选项。*/
          enforce: true
      }
  }
  };
  config.entry = {
    main: './src/index.js',
  };
 
  return config;
}
const addCustomize = () => (config, env) => {
  if (process.env.NODE_ENV === 'production') {
    // 关闭sourceMap
    config.devtool = false;
    // 添加js打包gzip配置
    config.plugins.push(
      new UglifyJsPlugin()
    )
  }
  return config;
}
const addLessLoader1 = (loaderOptions = {}) => (config) => {
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const postcssNormalize = require("postcss-normalize");

  const cssLoaderOptions = loaderOptions.cssLoaderOptions || {};
  const lessLoaderOptions = loaderOptions.lessLoaderOptions || {};

  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const shouldUseSourceMap = isEnvProduction
    ? process.env.GENERATE_SOURCEMAP !== "false"
    : isEnvDevelopment; // true将css全部打包到style head
  const publicPath = config.output.publicPath;
  const shouldUseRelativeAssetPaths = publicPath.startsWith(".");

  // copy from react-scripts
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L93
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `publicPath` can be a relative path
        options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009",
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
          sourceMap: shouldUseSourceMap,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: shouldUseSourceMap,
          },
        },
        preProcessor // pre processor can use more option
      );
    }
    return loaders;
  };

  const lessLoader = {
    loader: require.resolve("less-loader"),
    // not the same as react-scripts
    options: Object.assign(
      {
        sourceMap: shouldUseSourceMap,
      },
      lessLoaderOptions,
    ),
  };

  const defaultCSSLoaderOption = {
    importLoaders: 2,
    sourceMap: shouldUseSourceMap,
  };

  const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf))
    .oneOf;

  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        Object.assign({}, defaultCSSLoaderOption, cssLoaderOptions, {
          modules: false,
        }),
        lessLoader,
      ),
    },
    {
      test: lessModuleRegex,
      use: getStyleLoaders(
        Object.assign({}, defaultCSSLoaderOption, cssLoaderOptions, {
          modules: true
        }),
        lessLoader,
      ),
    }
  );

  return config;
};
module.exports = {
  webpack: override(
    // fixBabelImports('import', {
    //   libraryName: 'antd-mobile',
    //   libraryDirectory: 'es',
    //   style: 'css',
    // }),
    fixBabelImports('import', {  //antd UI组件按需加载的处理
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
  }),
    rewireAliases.aliasesOptions({
      '@': path.resolve(__dirname, `./src`)
    }),
    addLessLoader1({cssModules: true}),
    // addPostcssPlugins([require('postcss-pxtorem')({ 
    //   rootValue: 108, 
    //   unitPrecision: 3,
    //   propList: ['*'], 
    //   minPixelValue: 3, 
    //   // selectorBlackList: ['am-'] 
    // })]),
    dropConsole(),
    // rewireVendors(),
    addCustomize(),
    // disableEsLint()
    useEslintRc(path.resolve(__dirname, '.eslintrc'))
  ),
  // devServer: overrideDevServer(
  //   devServerConfig()
  // )
}
