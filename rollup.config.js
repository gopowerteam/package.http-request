// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default [
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
  plugins: [
    typescript(),
    commonjs({
      dynamicRequireTargets: [
        "node_modules/qs/*.js",
      ],
    })
  ],
}));
