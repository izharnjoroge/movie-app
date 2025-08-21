//vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
  resolve: {
    alias: {
      '~': r('./app'),
      react: r('./node_modules/react'),
      'react-dom': r('./node_modules/react-dom'),
    },
  },
})
