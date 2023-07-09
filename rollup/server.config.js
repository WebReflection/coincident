import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/server.js',
  plugins: [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]),
  output: {
    esModule: true,
    file: './server.js',
  }
};
