---
title: 外观模式
date: "2022-4-30"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 外观模式

外观（Facade）模式又叫作门面模式，是一种通过为多个复杂的子系统提供一个一致的接口，而使这些子系统更加容易被访问的模式。该模式对外有一个统一接口，外部应用程序不用关心内部子系统的具体细节，这样会大大降低应用程序的复杂度，提高了程序的可维护性

在平常开发中，我们都在有意无意的大量使用外观模式，外观模式本质就是封装交互，隐藏系统的复杂性，提供一个可以访问的接口

**优点：**

-   降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类
-   对客户屏蔽了子系统组件，减少了客户处理的对象数目
-   代理模式能将客户端与目标对象分离，在一定程度上降低了系统的耦合度，增加了程序的可扩展性

**缺点：**

-   增加新的子系统可能需要修改外观类或客户端的源代码，违背了“开闭原则”

1. 外观模式经常被用于处理高级游览器的和低版本游览器的一些接口的兼容处理

```js
function addEvent(el, type, fn) {
    if (el.addEventlistener) {
        // 高级游览器添加事件DOM API
        el.addEventlistener(type, fn, false);
    } else if (el.attachEvent) {
        // 低版本游览器的添加事件API
        el.attachEvent(`on${type}`, fn);
    } else {
        //其他
        el[type] = fn;
    }
}
```

2. 电脑的启动给我们封装成一个按钮就能够开机了

```js
class Cpu {
    start() {
        console.log("启动cpu");
    }
}
class Memory {
    start() {
        console.log("启动内存");
    }
}
class HardDisk {
    start() {
        console.log("启动硬盘");
    }
}

class Cpu {
    start() {
        console.log("启动cpu");
    }
}

class Computer {
    constructor() {
        this.cpu = new Cpu();
        this.memory = new Memory();
        this.hardDisk = new HardDisk();
    }

    // 将子系统封装起来，提供精简的接口，让高层模块可以更加容易地间接调用这些子系统的功能
    start() {
        this.cpu.start();
        this.memory.start();
        this.hardDisk.start();
    }
}
```
