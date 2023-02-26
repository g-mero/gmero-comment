import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import dts from 'rollup-plugin-dts'

export default [{
  input: './src/main.ts',
  output: {
    file: './dist/build/gmero-comment.min.js',
    format: 'iife',
    name: 'Gcmt',
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
      modules: {
        // ___[hash:base64:5] [local]
        generateScopedName: "g_[hash:base64:5]",
      },
      plugins: [autoprefixer(), cssnano()],
      extract: 'gmero-comment.min.css',
    }),
    terser(),
  ],
  external: ['tippy.js'],
},{
  input: './src/main.ts',
  output: [{ file: "dist/build/gmero-comment.d.ts", format: "cjs" }],
  plugins: [dts()],
}]
