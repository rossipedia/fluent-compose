import path from 'path';
import uglify from 'rollup-plugin-uglify';

export default [
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-compose.js'),
    format: 'cjs',
  },
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-compose.umd.js'),
    format: 'umd',
    moduleName: 'fluentcompose'
  },
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-compose.umd.min.js'),
    format: 'umd',
    moduleName: 'fluentcompose',
    // sourceMap: true
    plugins: [
      uglify({
        compress: true,
        mangle: true,
      }),
    ],
  },
];
