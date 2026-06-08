import { activeEffect,trackEffect,triggerEffects} from "./effect";

const targetMap=new WeakMap();//存放依赖收集的关系

/**
 * 给每个属性的map对象提价清除函数，方便清理依赖收集
 * @param cleanupFn 
 * @param key 
 * @returns 
 */
export function createDep(cleanupFn,key){
    const dep:any=new Map();// 创建map收集器
    dep.name=key; // 自定义标识，标记这个映射表是为了什么属性服务
    dep.cleanup=cleanupFn;
    return dep;
}

/**
 * track管理的数据结构
 * Map({
 *   obj:{
 *    props:Map(effect1,effect2)
 *   }
 * })
 * 
 * {
 *     {name:'niubi',age:21}:{
 *        name:{ 
 *           effect1
 *        },
 *        age:{efffect2,effect3}
 *     }
 * }
 * 以对象引用为key,然后其每个属性的依赖函数记录下来
 */

export function track(target,key){
    // debugger;
    if(activeEffect){ //处理effect之内的依赖收集
        console.log("通过effect触发依赖收集：",target,key)

        // 查看是否在依赖map中已经记录
        let depsMap=targetMap.get(target);
        if(!depsMap){// 如果没记录就新建
            targetMap.set(target,(depsMap=new Map()));
            // 此时depsMap存储的引用是这个target的对应的map
            // 即：depsMap=targetMap=>target=>map
        }
        // console.log(depsMap)
        let dep=depsMap.get(key);
        if(!dep){//如果属性还没有被记录过，就新建
            depsMap.set(
                key,
                (dep=createDep(()=>depsMap.delete(key),key))
            );
        }

        console.log(targetMap)
        //将当前的effect放入到dep(映射表)中
        //后续可以根据值的变化触发此dep中存放的effect
        trackEffect(activeEffect,dep)
    }

}

export function trigger(target,key,newValue,oldVelue){
    const depsMap=targetMap.get(target);
    if(!depsMap){
        return;
    }
    let dep=depsMap.get(key);
    if(dep){
        // 触发依赖表里的所有effects
        triggerEffects(dep);
    }
}