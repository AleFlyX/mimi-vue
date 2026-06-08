const person = {
    a: 1,
    get b(){
        return this.a + 1;
    } 
};
// const proxy = new Proxy(person, {
//   get(target, key, receiver) {
//     console.log('get key:',key);
//     return target[key];
//   }
// });
// console.log(proxy.b); // 输出 get key: b 2
const proxy = new Proxy(person, {
  get(target, key, receiver) {
    console.log('get key:',key);
    return Reflect.get(target,key,receiver);
  }
});
console.log(proxy.b); // 输出 get key: b ,get key: a, 2 