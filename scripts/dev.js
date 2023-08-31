const { resolve } = require("path");
const esbuild = require("esbuild");

const target = "reactivity";

(async function build() {
  const context = await esbuild.context({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true, // 打包成一个文件
    sourcemap: true, // 生成sourcemap文件
    format: "esm", // 打包成esm规范的文件 es6 module
    platform: "browser", // 打包成浏览器可识别的文件
  });
  console.log("watching~~");
  await context.watch();
  await context.serve();
})();
