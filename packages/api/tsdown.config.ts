import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/context.ts', 'src/routers/index.ts', 'src/routers/events.ts'],
  format: 'esm',
  outExtensions: () => ({ js: '.js' }),
  dts: true,
  clean: true,
})
