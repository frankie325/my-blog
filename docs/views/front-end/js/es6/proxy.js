let proxy = new Proxy(
    {},
    {
        // receiver的值是调用时的对象,set方法的receiver参数同理
        get(target, key, receiver) {
            console.log(this); //this指向包含get的对象，而不是proxy实例
            // 返回receiver参数
            return receiver;
        },
        set(target, key, value, receiver) {
            console.log(this);
        },
    }
);

// 1.返回的receiver参数就是proxy实例
console.log(proxy.name === proxy); //true

proxy.name = "kfg";

let p = new Proxy(
    {},
    {
        get(target, key, receiver) {
            // 返回第三个参数
            return receiver;
        },
    }
);

// 如果创建一个对象，原型指向proxy实例
let d = Object.create(proxy);
// 访问a属性，因为是空对象，所以去原型也就是proxy实例访问，触发拦截
// 2.返回的receiver参数是d
console.log(d.a === d); //true
