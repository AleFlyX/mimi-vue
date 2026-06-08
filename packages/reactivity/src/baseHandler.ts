import { activeEffect } from "./effect";
import { track } from "./reactiveEffect";
/**
 * 代理对象的标记枚举
 * 通过在代理对象上设置一个特殊的属性来标记它已经被代理过了，这样在后续的操作中就可以通过这个属性来判断对象是否已经被代理过了，避免重复代理。
 * 例如，在 get 方法中，如果访问到这个特殊的属性，就直接返回 true，表示这个对象已经被代理过了。
 * 这样在 reactive 函数中就可以先检查一下对象是否已经被代理过了，如果是的话就直接返回原对象，避免重复创建代理对象。
 * 这种方式可以提高性能，避免不必要的代理对象创建，同时也可以避免一些潜在的错误，比如重复代理导致的无限递归等问题。
 */
export enum ReactiveFlags{
    IS_REACTIVE='__v_isReactive' // 是否被代理过的标记
}

/**
 * mutableHandlers 是一个包含 get 和 set 方法的对象，这些方法定义了当访问或修改代理对象的属性时应该执行的操作。
 * 在 get 方法中，如果访问到 ReactiveFlags.IS_REACTIVE 属性，就直接返回 true，表示这个对象已经被代理过了。
 * 否则，使用 Reflect.get 来获取目标对象的属性值。
 * 在 set 方法中，首先使用 Reflect.get 来获取目标对象当前的属性值，如果新值和旧值相同，就直接返回 true，表示设置成功。
 * 否则，使用 Reflect.set 来设置目标对象的属性值，并返回设置结果。
 */
export const mutableHandlers:ProxyHandler<any>={
    get(target,key,receiver){ //receiver是代理对象本身
        if(key===ReactiveFlags.IS_REACTIVE) return true;//检查是否为已经被代理过的
        // 当取值的时候，应该触发依赖收集，应该将这个属性和当前的effect函数关联起来
        track(target,key)
        // console.log('副作用函数',activeEffect,key)
        return Reflect.get(target,key,receiver);
    },
    set(target,key,value,receiver){
       
       // 当设置值的时候，应该触发依赖更新，应该将这个属性对应的effect函数重新执行
        if(Reflect.get(target,key,receiver)===value)
       {
            return true;
       }
        return Reflect.set(target,key,value,receiver);
    }
}
