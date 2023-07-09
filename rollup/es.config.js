import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/index.js',
  plugins: [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]),
  output: {
    esModule: true,
    file: './es.js',
  }
};
