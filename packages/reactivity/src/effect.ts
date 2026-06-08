
export let activeEffect=null;
class ReactiveEffect{
    active=true;// 这个effect是否激活，默认为true
    _trackId=0;
    deps=[];
    _depsLength=0;    
    // fn是用户传入的函数，
    // scheduler是fn中依赖的数据发生变化时，用户自定义的调度函数
    constructor(public fn,public scheduler?){}

    run(){
        if(!this.active){
            return this.fn();// 如果这个effect不激活了，就直接执行fn，不收集依赖
        }
        let lastEffect=activeEffect; // 用于记录嵌套effect，
        try{
     
            activeEffect=this;
            // console.log("activeEffect:",activeEffect)
            // 这里的this指向ReactiveEffect实例，调用run方法时会执行fn函数，
            // fn函数中会读取响应式对象中的数据，这样就会触发get方法，在get方法中会收集依赖    
            return this.fn();// 执行传入的函数以触发依赖收集
        }finally{
            activeEffect=lastEffect;
        }
        //让fn执行，fn中会读取响应式对象中的数据，这样就会触发get方法，在get方法中会收集依赖
        
    }
    stop(){
        this.active=false;
    }
}

export function effect(fn,options={}) {
    // 创建一个响应式effect实例，fn是用户传入的回调函数，options中可能包含scheduler

    const _effect=new ReactiveEffect(fn,()=>{
        //scheduler是用户自定义的调度函数，当响应式对象中的数据发生变化时，会调用这个调度函数
        _effect.run();
    });
    _effect.run();
    // console.log("_effect run ")
    return _effect;
}

/**
 * trackEffect 是建立双向记录的核心函数：
 * 既让属性知道自己影响了哪些 effect，
 * 也让 effect 记住自己订阅了哪些属性
 * @param effect 
 * @param dep 
 */
export function trackEffect(effect,dep){
    // 在targetMap=>target=>key=>map中记录这个依赖，
    // 以正在触发effect的effect为key，其effect的id为值
    // 这样完成了跟踪依赖
    dep.set(effect,effect._trackId);
    
    // 
    effect.deps[effect._depsLength++]=dep;
}

export function triggerEffects(dep){
    for(const effect of dep){ // 遍历执行每个依赖的scheduler
        if(effect.scheduler){ // 如果依赖的effect有scheduler
            effect.scheduler(); // 执行
        }
    }
}