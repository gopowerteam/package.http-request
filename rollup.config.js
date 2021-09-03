// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default [
  ...[
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "bundle",
      sourcemap: true,
    },
    {
      file: "dist/index.es.js",
      format: "es",
      name: "bundle",
      sourcemap: true,
    },
  ].map((output) => ({
    input: "src/index.ts",
    output,
    external: ["qs", "axios", "rxjs", "class-transformer"],
    plugins: [typescript()],
  })),
  {
    input: "src/plugins/vite.plugin.ts",
    output: {
      file: "dist/plugins/vite.plugin.js",
      format: "cjs",
      name: "bundle",
      sourcemap: true,
      external: ["vite", "path", "fs"],
    },
    plugins: [typescript()],
  },
];
