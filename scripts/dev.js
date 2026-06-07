// this file will help us to build the modules under the packages,and export js files

// "node dev.js ( {the name which would be builded} -f {the format of build} )=== argv.slice(2) 
import minimist from "minimist";
import {resolve,dirname} from 'path'
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { platform } from "os";
import esbuild from "esbuild";
// node 中的命令函数参数通过process 来获取process.argv
const args=minimist(process.argv.slice(2));

const __filename=fileURLToPath(import.meta.url);// 获取文件的绝对路径 file:->user
// node中esm 模块没有 __dirname，所以需要通过次方法获取
const __dirname=dirname(__filename); // 获取相对路径文件夹
const require=createRequire(import.meta.url); // 这样可使用require语法去引入依赖

const target=args._[0] || "reactivity"; // 要打包的项目
const format=args.f || "iife";// 打包后的模块化规范
console.log(target,format);

// console.log(__filename,__dirname,require)

// 入口文件，根据命令行提供的路径解析
const entry=resolve(__dirname,`../packages/${target}/src/index.ts`);
const pkg=require(`../packages/${target}/package.json`); // 读取对应模块的package.json文件
// 根据需要进行打包
esbuild.context({
    entryPoints:[entry],// 打包入口
    outfile:resolve(__dirname,`../packages/${target}/dist/${target}.js`), //打包产物的位置
    platform:"browser", // 打包平台，打包后给浏览器使用
    format, // 打包后的模块化规范，支持iife、cjs、esm等
    bundle:true, // 是否将所有依赖打包到一起
    sourcemap:true, // 是否生成 source map 文件，方便调试
    globalName:pkg.buildOptions?.name, // 打包后的全局变量名，只有在 format 为 iife 时才需要
})
.then(context=>{
    console.log("start dev,watching...") // 打包完成后输出提示信息
    return context.watch() // 开启监听模式，自动重新打包
})