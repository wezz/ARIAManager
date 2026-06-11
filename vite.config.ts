//https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/

import { writeFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ARIAManager",
      fileName: "index",
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      // Emit a CommonJS declaration file (index.d.cts) for the "require"
      // condition. The UMD output uses `module.exports = ARIAManager`, so the
      // CJS types must use `export = ` rather than `export default` to avoid
      // attw's FalseExportDefault / Masquerading-as-ESM problems.
      afterBuild: (emittedFiles: Map<string, string>) => {
        for (const [filePath, content] of emittedFiles) {
          if (!/index\.d\.[cm]?ts$/.test(filePath)) continue;
          const dir = filePath.replace(/index\.d\.[cm]?ts$/, "");
          // ESM declarations: keep `export default` for the import condition.
          writeFileSync(`${dir}index.d.ts`, content);
          // CJS declarations: the UMD output is `module.exports = ARIAManager`,
          // so the require condition needs `export = ` (not `export default`).
          const cts = content
            .replace(/export default (\w+);/, "export = $1;")
            .replace(/^export \{\s*\};?\s*$/m, "");
          writeFileSync(`${dir}index.d.cts`, cts);
        }
      },
    }),
  ],
});
