---
title: 观察者模式
date: "2022-4-30"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 观察者模式

指多个对象间存在一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新

-   被观察者提供观察的一系列方法
-   观察者提供更新接口
-   观察者把自己注册到观察者里
-   在被观察者发生变化的时候，调用观察者的更新方法

**优点：**

-   观察者和被观察者它们之间是抽象耦合的。并且建立了触发机制
-   观察者和被观察者之间建立了一套触发机制。

**缺点：**

-   当订阅者比较多的时候，同时通知所有的订阅者可能会造成性能问题
-   在订阅者和订阅目标之间如果循环引用执行，会导致崩溃。

以明星和粉丝之间为例，粉丝订阅了明星的动态，一旦明星发生了状态的变化，就会通知所有订阅的粉丝

```js
class Star {
    constructor(name) {
        this.name = name;
        this.state = "";
        this.observers = [];
    }

    getState() {
        return this.state;
    }

    //状态变更，通知更新
    setState(state) {
        this.state = state;
        this.notify();
    }

    // 将观察者注册到被观察者里，也就是粉丝订阅明星
    attach(observer) {
        this.observers.push(observer);
    }

    // 通知所有观察者更新
    notify() {
        if (this.observers.length) {
            this.observers.forEach((observer) => {
                observer.update();
            });
        }
    }
}

class Fan {
    constructor(name, star) {
        this.name = name;
        this.star = star;
        // 将观察者注册到被观察者中
        this.star.attach(this);
    }
    update() {
        console.log("我喜欢的明星动态发生了变化");
    }
}

let star = new Star("John Mayer");

let f1 = new Fan("kfg", star);

star.setState("发布新专辑");
```

## 应用场景

1. DOM 事件绑定就是发布订阅模式：绑定 click 事件，就是订阅 DOM 上的 click 事件，当被点击时就会 DOM 元素就通知更新，也就是触发点击事件

2. Promise 内部也算是发布订阅模式的简单实现，then 方法注册回调，等到用户 resolve 之后，才会调用 then 注册的回调

3. Node.js 的 events 事件触发器

```js
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("event", () => {
    console.log("触发了自定义事件");
});

myEmitter.emit("event");
```

## 发布订阅模式

观察者模式又称作发布订阅模式，其实发布订阅模式和观察者模式是稍有区别的，观察者模式的观察者和被观察者耦合在了一起，发布订阅模式则多了一层中介进行代理，进行了解耦

示例：租客订阅的租房的消息，全部都是从中介那里订阅，房东发布房源的信息，由中介代理进行转发

```js
// 中介，由中介进行统一的订阅和发布
class Agent {
    constructor() {
        this._events = {};
    }

    // 订阅
    subscribe(type, listener) {
        let listeners = this._events[type];
        if (listeners) {
            listeners.push(listener);
        } else {
            this._events[type] = [listener];
        }
    }

    // 发布
    publish(type) {
        let listeners = this._events[type];
        let args = Array.prototype.slice.call(arguments, 1);
        if (listeners) {
            listeners.forEach((listener) => {
                listener(...args);
            });
        }
    }
}

// 房东
class LandLord {
    constructor(name) {
        this.name = name;
    }

    // 房东发布消息，向外租出
    lend(agent, area, money) {
        agent.publish("house", area, money);
    }
}

// 租客
class Tenant {
    constructor(name) {
        this.name = name;
    }

    // 租房，订阅中介的消息
    rent(agent) {
        agent.subscribe("house", (area, money) => {
            console.log(`我看到中介的新房源了 ${area}平方，房租${money}元`);
        });
    }
}

let agent = new Agent();
let t1 = new Tenant("张三");
t1.rent(agent);
let landlord = new LandLord("房东1");
landlord.lend(agent, 60, 2000);
```

## 应用场景

1. Vue2的响应式原理