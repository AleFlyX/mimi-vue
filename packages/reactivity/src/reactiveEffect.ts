import { activeEffect } from "./effect";

export function track(target,key){
    if(activeEffect){ //处理effect之内的依赖收集
        console.log("通过effect触发依赖收集：",target,key)
    }
    
}
/**
 * track管理的数据结构
 * {
 *     {name:'niubi',age:21}:{
 *        name:{
 *          effect1
 *        },
 *        age:{efffect2,effect3}
 *     }
 * }
 * 以对象引用为key,然后其每个属性的依赖函数记录下来
 */