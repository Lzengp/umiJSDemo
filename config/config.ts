// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const CompressionPlugin = require('compression-webpack-plugin');
const { REACT_APP_ENV } = process.env;

// 在config文件目录下的config.js,
// chainWebpack: webpackPlugin,这样配置webpack就🆗,

// 我这里是针对生产环境写的带代码，

const webpackPlugin = (config) => {
  // if (process.env.NODE_ENV === 'production') {
  config.merge({
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minChunks: 2,
        automaticNameDelimiter: '.',
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /^.*node_modules[\\/](?!ag-grid-|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar).*$/,
            chunks: 'all',
            priority: 10,
          },
          virtualized: {
            name: 'virtualized',
            test: /[\\/]node_modules[\\/]react-virtualized/,
            chunks: 'all',
            priority: 10,
          },
          rcselect: {
            name: 'rc-select',
            test: /[\\/]node_modules[\\/]rc-select/,
            chunks: 'all',
            priority: 10,
          },
          // antd: {
          //     name: 'antd',
          //     test: /[\\/]node_modules[\\/]antd/,
          //     chunks: 'all',
          //     priority: 10,
          // },
          rcdrawer: {
            name: 'rcdrawer',
            test: /[\\/]node_modules[\\/]rc-drawer/,
            chunks: 'all',
            priority: 10,
          },
          rctimepicker: {
            name: 'rctimepicker',
            test: /[\\/]node_modules[\\/]rc-time-picker/,
            chunks: 'all',
            priority: 10,
          },
          ag: {
            name: 'ag',
            test: /[\\/]node_modules[\\/]ag-grid-/,
            chunks: 'all',
            priority: 10,
          },
          // antd: {
          //     name: "antd",
          //     test: /[\\/]node_modules[\\/]antd[\\/]/,
          //     chunks: "all",
          //     priority: 9
          // },
          rctree: {
            name: 'rctree',
            test: /[\\/]node_modules[\\/]rc-tree/,
            chunks: 'all',
            priority: -1,
          },
          rccalendar: {
            name: 'rccalendar',
            test: /[\\/]node_modules[\\/]rc-calendar[\\/]/,
            chunks: 'all',
            priority: -1,
          },
          rctable: {
            name: 'rctable',
            test: /[\\/]node_modules[\\/]rc-table[\\/]es[\\/]/,
            chunks: 'all',
            priority: -1,
          },
          wang: {
            name: 'wang',
            test: /[\\/]node_modules[\\/]wangeditor[\\/]/,
            chunks: 'all',
            priority: -1,
          },
          // lodash: {
          //     name: 'lodash',
          //     test: /[\\/]node_modules[\\/]lodash[\\/]/,
          //     chunks: 'all',
          //     priority: -2,
          // },
          bizcharts: {
            name: 'bizcharts',
            test: /[\\/]node_modules[\\/]bizcharts[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          xlsx: {
            name: 'xlsx',
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            chunks: 'async',
            priority: 10,
          },
        },
      },
    },
  });
  config.plugin('compression-webpack-plugin').use(
    new CompressionPlugin({
      // filename: '[path].gz[query]',
      algorithm: 'gzip', // 指定生成gzip格式
      test: new RegExp('\\.(js|css)$'), // 匹配哪些格式文件需要压缩
      threshold: 10240, // 对超过10k的数据进行压缩
      minRatio: 0.6, // 压缩比例，值为0~1
    })
  );
  }
};

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: webpackPlugin,
});
