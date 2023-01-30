import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default {
  input: './src/main.ts',
  output: {
    file: './dist/gmero-comment.js',
    format: 'iife',
    name: 'gcomment',
    sourcemap: false,
    globals: { 'tippy.js': 'tippy' },
  },
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: true,
      mainFields: ['browser', 'jsnext', 'module', 'main'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    postcss({
      modules: true,
      plugins: [autoprefixer(), cssnano()],
      extract: 'css/index.css',
    }),
    terser(),
  ],
  external: ['tippy.js'],
}
