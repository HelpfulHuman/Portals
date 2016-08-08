import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [ buble() ],
  targets: [
    { dest: 'dist/portals-cjs.js', format: 'cjs' },
    { dest: 'dist/portals-es.js', format: 'es' }
  ]
};
