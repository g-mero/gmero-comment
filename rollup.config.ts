import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

export default [{
  input: './src/main.ts',
  output: {
    file: './dist/gmero-comment.js',
    format: 'iife',
    name: 'Gcmt',
    sourcemap: true,
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
      modules: {
        generateScopedName: "[local]",
      },
      plugins: [autoprefixer()],
      extract: 'css/index.css',
    }),
    livereload(),
    serve({
      contentBase: ['test', 'dist', 'lib'],
    }),
  ],
  external: ['tippy.js'],
}]
