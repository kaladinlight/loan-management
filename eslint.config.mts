import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const prettierOptions = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...prettier,
    rules: {
      ...prettier.rules,
      'prettier/prettier': ['error', prettierOptions],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'generated/**', 'coverage/**']),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // Code quality
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])

export default eslintConfig
