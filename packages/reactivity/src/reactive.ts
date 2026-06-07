import { isObject } from "@vue/shared";
import {ReactiveFlags,mutableHandlers} from './baseHandler'

// 记录所有以及创建的代理对象，可复用
// 避免重复创建相同的变量导致内存浪费
const reactiveMap=new WeakMap();// 使用weakMap避免内存泄漏

function creaeteReactiveObject(target:Object){
    if(!isObject(target)){
        return target;
    }
    // 对同值对象进行重复包裹的优化：直接将首次包裹这个值的proxy对象返回
    const existProxy=reactiveMap.get(target);
    if(existProxy) return existProxy; //复用已经存在的proxy

    // 对另一个响应式对象包裹的优化:直接返回这个响应式对象
    // 读取target[ReactiveFlags.IS_REACTIVE]，若target对象为proxy,
    // 则会触发其内部get函数，若这个enum key的值为true，则说明是proxy,无需包装直接返回
    if(target[ReactiveFlags.IS_REACTIVE]) return target;

    let proxy=new Proxy(target,mutableHandlers);
    reactiveMap.set(target,proxy) // 将已经创建的对象插入weakMap
    return proxy;
}

export function reactive(target:Object) {
    return creaeteReactiveObject(target)
}