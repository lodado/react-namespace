import { DEFAULT_EXTENSIONS } from "@babel/core";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import url from "@rollup/plugin-url";
import { readFileSync } from "fs";
import path, { join } from "path";
import postcssImport from "postcss-import";
import { nodeExternals } from "rollup-plugin-node-externals";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import preserveDirectives from "rollup-plugin-preserve-directives";
import typescript from "rollup-plugin-typescript2";
import { visualizer } from "rollup-plugin-visualizer";

const dirname = "."; // fileURLToPath(new URL('.', import.meta.url))
// const filename = fileURLToPath(import.meta.url)

const packagePath = join(dirname, "package.json");
const packageJSON = JSON.parse(readFileSync(packagePath, "utf8"));

if (!packageJSON.source) {
  throw new Error("source must be specified in package.json");
}

if (!packageJSON.exports) {
  console.warn(
    "\x1b[31m%s",
    "WARNING: exports must be specified in package.json"
  );
}

if (!packageJSON.publishConfig) {
  console.warn(
    "\x1b[31m%s",
    "WARNING: publishConfig must be specified in package.json"
  );
}

const BUILD_OUTPUT_LOCATION = `${dirname}/dist`;

const ENTRY_POINT = `${dirname}/${packageJSON.source}`;

const inputSrc = [
  { input: ENTRY_POINT, format: "es", additionalFolderDirectiory: "client" },
  { input: ENTRY_POINT, format: "cjs", additionalFolderDirectiory: "client" },
];

const extensions = [...DEFAULT_EXTENSIONS, ".ts", ".tsx"];
/**
 * Generates an array of Rollup configuration objects based on the provided array of configuration parameters.
 * Each configuration parameter object includes options for input, format, and optionally an additional directory path.
 *
 * @param {Object[]} config - An array of configuration objects. Each object must have an `input` and `format` property.
 *                            `additionalFolderDirectiory` is optional and defaults to an empty string.
 * @returns {Object[]} An array of Rollup configuration objects tailored to the specifications provided in the `config` parameter.
 *
 * @example
 * rollupConfigFunc([
 *   { input: 'src/index.js', format: 'es', additionalFolderDirectiory: 'dist' },
 *   { input: 'src/api.js', format: 'cjs' }
 * ]);
 */
// eslint-disable-next-line import/no-mutable-exports
const rollupConfigFunc = (config) =>
  config.map(({ input, format, additionalFolderDirectiory = "" }) => {
    const isESMFormat = format === "es";
    const entryFormat = isESMFormat ? "mjs" : "cjs";
    const entryFileNames = `[name].${entryFormat}`;

    const dir = `${BUILD_OUTPUT_LOCATION}/${format}/${
      additionalFolderDirectiory ? `${additionalFolderDirectiory}/` : ""
    }`;

    return {
      input,
      output: {
        dir,
        format,

        entryFileNames,
        ...(isESMFormat
          ? { preserveModulesRoot: `.`, preserveModules: isESMFormat }
          : {}),
      },

      external: [/@babel\/runtime/, /@babel\/runtime/],

      plugins: [
        /**
         * **IMPORTANT**: Order matters!
         * If you're also using @rollup/plugin-node-resolve, make sure this plugin comes before it in the plugins array
         * @see https://github.com/Septh/rollup-plugin-node-externals#3-order-matters
         */
        nodeExternals({
          deps: true,
          peerDeps: true,
          packagePath: join(dirname, "package.json"),
        }),

        /**
         * modulesOnly 옵션이 있어야 turbo repo에서 타입에러나지 않고 번들링됨
         */
        nodeResolve({ extensions, modulesOnly: true }),

        typescript({
          tsconfig: "./tsconfig.json",
          tsconfigOverride: {},
          useTsconfigDeclarationDir: true,
        }),
        peerDepsExternal(),

        /**
         * **IMPORTANT**: Order matters!
         * When using @rollup/plugin-babel with @rollup/plugin-commonjs in the same Rollup configuration,
         * it's important to note that @rollup/plugin-commonjs must be placed before this plugin in the plugins array for the two to work together properly.
         * @see https://github.com/rollup/plugins/tree/master/packages/babel#using-with-rollupplugin-commonjs
         */
        commonjs({}),

        babel({
          babelHelpers: "bundled",
          exclude: "node_modules/**",
          extensions,
        }),

        /*
        babel({
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',

          extensions,

          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: isESMFormat,
              },
            ],
          ],
        }),
        */

        postcss({
          plugins: [postcssImport()],

          watch: {
            include: "src/**",
            clearScreen: false,
          },

          extract: true,
          inject: true, // CSS를 JS 파일에 인라인으로 포함
          minimize: true, // CSS 최소화
          sourceMap: true, // 소스맵 생성
        }),

        visualizer({ filename: "stats.html" }),

        url(),

        terser(),

        preserveDirectives({ exclude: ["**/*.scss", "**/*.css"] }),
      ],
    };
  });

const defaultConfig = (additionalConfig = []) => {
  return rollupConfigFunc([...inputSrc, ...additionalConfig]);
};

export { defaultConfig, rollupConfigFunc };
