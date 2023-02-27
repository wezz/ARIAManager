//https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/


import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ariamanager',
      fileName: 'ariamanager',
    },
  },
  plugins: [dts()],
});