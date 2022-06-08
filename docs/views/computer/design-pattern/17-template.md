---
title: 模板模式
date: "2022-5-03"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 模板模式

定义一个操作中的算法骨架，而将算法的一些步骤延迟到子类中，使得子类可以不改变该算法结构的情况下重定义该算法的某些特定步骤

**优点：**

-   把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展
-   在父类中提取了公共的部分代码，便于代码复用

**缺点：**

-   对每个不同的实现都需要定义一个子类，这会导致类的个数增加
-   由于继承关系自身的缺点，如果父类添加新的抽象方法，则所有子类都要改一遍

示例：我们吃饭，都有一个流程就是买东西，做饭，吃饭，有一个固定的流程，但是具体买什么，吃什么每一天都是变化的

```js
class Person {
    // 父类定义好算法的骨架
    dinner() {
        this.buy();
        this.cook();
        this.eat();
    }

    buy() {
        throw new Error("必须由子类实现");
    }
    cook() {
        throw new Error("必须由子类实现");
    }
    eat() {
        throw new Error("必须由子类实现");
    }
}

// 由子类去实现具体算法
class Jiang extends Person {
    // 具体实现由子类实现，买什么自己决定
    buy() {
        console.log("买菜");
    }
    cook() {
        console.log("做饭");
    }
    eat() {
        console.log("吃饭");
    }
}

let j = new Jiang();
j.dinner();
```
