import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import shebang from 'rollup-plugin-add-shebang'
import { swc } from 'rollup-plugin-swc3'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  input: './src/index.ts',

  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: true,
  },

  plugins: [
    commonjs(),
    resolve({
      exportConditions: ['node'],
    }),
    swc({
      sourceMaps: true,
      tsconfig: './tsconfig.json',
    }),
    shebang({
      include: './dist/index.js',
    }),
  ],
})
