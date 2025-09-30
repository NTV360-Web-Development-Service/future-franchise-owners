import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
  {
    ignores: ['.next/', 'src/payload-types.ts'],
  },
]

export default eslintConfig
