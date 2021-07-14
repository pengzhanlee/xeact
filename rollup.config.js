import pkg from './package.json';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {terser} from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js'];
const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies);

const plugins = [
  nodeResolve({
    extensions,
    browser: true
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    extensions,
  }),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  (isProd && terser())
];

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins,
    external
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins,
    external
  },
];
