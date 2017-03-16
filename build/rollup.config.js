const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

export default {
  entry: 'src/index.js',
  dest: 'dist/talqsInteraction.js',
  format: 'umd',
  moduleName: 'TalqsInteraction',
  plugins: [
      replace({ __VERSION__: version }),
      buble()
  ],
  banner: 
`/**
 * talqsInteraction v${version}
 * (c) ${new Date().getFullYear()} JinJun He
 * @license MIT
 */`
};
