
export let activeEffect=null;
class ReactiveEffect{
    active=true;// 这个effect是否激活，默认为true
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
