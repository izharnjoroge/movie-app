//vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['app/**/*.tsx', 'app/**/*.ts'],
      exclude: ['node_modules/'],
    },
  },
  resolve: {
    alias: {
      '~': r('./app'),
      react: r('./node_modules/react'),
      'react-dom': r('./node_modules/react-dom'),
    },
  },
})
