---
title: 策略模式
date: "2022-5-01"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 状态模式

当实现某一个功能存在多种算法或者策略，我们可以根据环境或者条件的不同选择不同的算法或者策略来完成该功能，如数据排序策略有冒泡排序、选择排序、插入排序、二叉树排序等

**优点：**

-   多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句
-   策略模式可以提供相同行为的不同实现，客户可以根据不同时间或空间要求选择不同的
-   策略模式提供了对开闭原则的完美支持，可以在不修改原代码的情况下，灵活增加新算法

**缺点：**

-   策略模式造成很多的策略类，增加维护难度


示例：支付时根据客服的等级，有不同的支付算法
```js
class Customer {
    constructor(kind) {
        this.kind = kind;
    }

    // 支付时根据客服的等级，有不同的支付算法，这里只需要调用不同等级的类就行
    pay(amount) {
        return this.kind.pay(amount);
    }
}

// 不同等级的算法，交给不同的对象处理
class Normal {
    pay(amount) {
        return amount;
    }
}

class Member {
    pay(amount) {
        return amount * 0.9;
    }
}

class VIP {
    pay(amount) {
        return amount * 0.8;
    }
}

let c = new Customer(new Normal());
console.log(c.pay(100));
c.kind = new Member();
console.log(c.pay(100));
c.kind = new VIP();
console.log(c.pay(100));
```