import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/uhtml.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: true,
    file: './uhtml.js',
  }
};
