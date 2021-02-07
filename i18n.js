import NextI18Next from 'next-i18next'
import path from 'path'
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

export default new NextI18Next({
  otherLanguages: ['en', 'fr', 'es'],
  localeSubpaths,
  localePath: path.resolve('./public/static/locales'),
  debug: true
})
