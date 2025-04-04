import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]);

export default [
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
  {
    plugins,
    input: './src/main.js',
    output: {
      esModule: true,
      file: './dist/main.js',
    }
  },
  {
    plugins,
    input: './src/worker.js',
    output: {
      esModule: true,
      file: './dist/worker.js',
    }
  },
  {
    plugins,
    input: './src/main_buffered.js',
    output: {
      esModule: true,
      file: './dist/main_buffered.js',
    }
  },
  {
    plugins,
    input: './src/worker_buffered.js',
    output: {
      esModule: true,
      file: './dist/worker_buffered.js',
    }
  },
  {
    plugins,
    input: './src/flatted/index.js',
    output: {
      esModule: true,
      file: './dist/flatted.js',
    }
  },
  {
    plugins,
    input: './src/flatted/encoder.js',
    output: {
      esModule: true,
      file: './dist/flatted_encoder.js',
    }
  },
  {
    plugins,
    input: './src/flatted/decoder.js',
    output: {
      esModule: true,
      file: './dist/flatted_decoder.js',
    }
  },
  {
    plugins,
    input: './src/main_flatted.js',
    output: {
      esModule: true,
      file: './dist/main_flatted.js',
    }
  },
  {
    plugins,
    input: './src/worker_flatted.js',
    output: {
      esModule: true,
      file: './dist/worker_flatted.js',
    }
  },
  {
    plugins,
    input: './src/main_json.js',
    output: {
      esModule: true,
      file: './dist/main_json.js',
    }
  },
  {
    plugins,
    input: './src/worker_json.js',
    output: {
      esModule: true,
      file: './dist/worker_json.js',
    }
  },
  {
    plugins,
    input: './src/main_structured.js',
    output: {
      esModule: true,
      file: './dist/main_structured.js',
    }
  },
  {
    plugins,
    input: './src/worker_structured.js',
    output: {
      esModule: true,
      file: './dist/worker_structured.js',
    }
  },
  {
    plugins,
    input: './src/structured/index.js',
    output: {
      esModule: true,
      file: './dist/structured.js',
    }
  },
  {
    plugins,
    input: './src/structured/encoder.js',
    output: {
      esModule: true,
      file: './dist/structured_encoder.js',
    }
  },
  {
    plugins,
    input: './src/structured/decoder.js',
    output: {
      esModule: true,
      file: './dist/structured_decoder.js',
    }
  },
  {
    plugins,
    input: './src/buffered/index.js',
    output: {
      esModule: true,
      file: './dist/buffered.js',
    }
  },
  {
    plugins,
    input: './src/buffered/encoder.js',
    output: {
      esModule: true,
      file: './dist/buffered_encoder.js',
    }
  },
  {
    plugins,
    input: './src/buffered/decoder.js',
    output: {
      esModule: true,
      file: './dist/buffered_decoder.js',
    }
  },
];
