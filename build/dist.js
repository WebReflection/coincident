import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]);

export default [
  {
    plugins,
    input: './nrc/main.js',
    output: {
      esModule: true,
      file: './dist/main.js',
    }
  },
  {
    plugins,
    input: './nrc/worker.js',
    output: {
      esModule: true,
      file: './dist/worker.js',
    }
  },
  {
    plugins,
    input: './src/window/main.js',
    output: {
      esModule: true,
      file: './dist/window/main.js',
    }
  },
  {
    plugins,
    input: './src/window/worker.js',
    output: {
      esModule: true,
      file: './dist/window/worker.js',
    }
  },
  {
    plugins,
    input: './src/server/main.js',
    output: {
      esModule: true,
      file: './dist/server/main.js',
    }
  },
  {
    plugins,
    input: './src/server/worker.js',
    output: {
      esModule: true,
      file: './dist/server/worker.js',
    }
  },
];
