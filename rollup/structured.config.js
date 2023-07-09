import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/structured.js',
  plugins: [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]),
  output: {
    esModule: true,
    file: './structured.js',
  }
};
