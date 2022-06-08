---
title: 单例模式
date: "2022-4-24"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 单例模式

为了节省内存资源、保证数据内容的一致性，对某些类要求只能创建一个实例，这就是所谓的单例模式，单例模式是设计模式中最简单的模式之一

**优点：**

-   单例模式可以保证内存里只有一个实例，减少了内存的开销

**缺点：**

-   单例模式一般没有接口，扩展困难。如果要扩展，则除了修改原来的代码，没有第二种途径，违背开闭原则
-   单例模式的功能代码通常写在一个类中，如果功能设计不合理，则很容易违背单一职责原则

**最简单的单例模式：懒汉式单例**

类加载时没有生成单例，只有当第一次调用 getInstance 方法时才去创建这个单例

```js
function Window(name) {
    this.name = name;
}

// 使用闭包创建一个实例，每次调用都会返回该实例
Window.getInstance = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new Window();
        }
        return instance;
    };
})();

let w1 = Window.getInstance();
let w2 = Window.getInstance();

console.log(w1 === w2); //true
```

缺点：

-   用户使用这个类时必须知道这是一个单例的类，必须主动调用 getInstance 方法
-   创建的只能是一个类，如果想要创建一个新的类，还需修改源码，无法实现复用
-   并不能阻止用户直接 new Window

**改进之后：**

```js
function Window(name) {
    this.name = name;
}

Window.prototype.getName = function () {
    console.log(this.name);
};

function Client(name) {
    this.name = name;
}

// 将构造函数作为参数传递
CreateSingle = function (Constructor) {
    let instance;
    return function () {
        if (!instance) {
            instance = new Constructor(...arguments);
        }
        return instance;
    };
};

function Client(name) {
    this.name = name;
}

let Win = CreateSingle(Window);
let w1 = new Win("w1");
let w2 = new Win("w2");
console.log(w1 === w2); //true
let Cli = CreateSingle(Client);
let c1 = new Cli("c1");
let c2 = new Cli("c2");
console.log(c1 === c2); //true
```

## 应用场景

1. LRU缓存算法