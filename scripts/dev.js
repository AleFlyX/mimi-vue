// this file will help us to build the modules under the packages,and export js files

// "node dev.js ( {the name which would be builded} -f {the format of build} )=== argv.slice(2) 
import minimist from "minimist";
import {resolve,dirname} from 'path'
import { fileURLToPath } from "url";
import { createRequire } from "module";
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