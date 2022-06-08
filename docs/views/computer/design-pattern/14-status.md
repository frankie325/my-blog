---
title: 状态模式
date: "2022-5-01"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 状态模式

当一个对象内部状态发生改变时，会导致其行为的改变，不同的状态执行不同的行为

状态模式的定义：对有状态的对象，把复杂的“判断逻辑”提取到不同的状态对象中，允许状态对象在其内部状态发生改变时改变其行为

**优点：**

-   结构清晰，状态模式将与特定状态相关的行为局部化到一个状态中，并且将不同状态的行为分割开来，满足单一职责原则
-   将不同的状态引入独立的对象中会使得状态转换变得更加明确，且减少对象间的相互依赖
-   状态类职责明确，有利于程序的扩展

**缺点：**

-   状态模式的使用必然会增加系统的类与对象的个数。
-   状态模式的结构与实现都较为复杂，如果使用不当会导致程序结构和代码的混乱。
-   状态模式对开闭原则的支持并不太好，对于可以切换状态的状态模式，增加新的状态类需要修改那些负责状态转换的源码，否则无法切换到新增状态，而且修改某个状态类的行为也需要修改对应类的源码。

示例：电池不同的电量显示不同的颜色

```js
class SuccessState {
    show() {
        console.log("绿色");
    }
}

class WarningState {
    show() {
        console.log("黄色");
    }
}

class ErrorState {
    show() {
        console.log("红色");
    }
}

class Battery {
    constructor() {
        this.amount = "high";
        this.state = new SuccessState();
    }
    show() {
        // 把显示的逻辑交给状态对象
        this.state.show();

        // 内部只需要维护状态的变化，不同的行为则交给不同的状态对象去实现
        if (this.amount === "high") {
            this.amount = "middle";
            this.state = new WarningState();
        } else if (this.amount === "middle") {
            this.amount = "low";
            this.state = new ErrorState();
        }
    }
}

let b = new Battery();
b.show();
b.show();
b.show();
```

## 应用场景

1. Promise 的状态变化

2. :point_right:[JavaScript 状态机](https://github.com/jakesgordon/javascript-state-machine)

```js
var fsm = new StateMachine({
    init: "solid",
    transitions: [
        { name: "melt", from: "solid", to: "liquid" }, // 融化：固态 => 液态
        { name: "freeze", from: "liquid", to: "solid" }, //凝固： 液态 => 固态
        { name: "vaporize", from: "liquid", to: "gas" }, //蒸发： 液态 => 气态
        { name: "condense", from: "gas", to: "liquid" }, //凝结： 气态 => 液态
    ],
    methods: {
        onMelt: function () {
            console.log("I melted");
        },
        onFreeze: function () {
            console.log("I froze");
        },
        onVaporize: function () {
            console.log("I vaporized");
        },
        onCondense: function () {
            console.log("I condensed");
        },
    },
});

fsm.melt(); // 当调用融化时，触发onMelt方法，此时状态变化成liquid
```

状态机的简单实现
```js
class StateMachine {
    constructor(options) {
        let { init = "", transitions = [], methods = {} } = options;
        this.state = init;

        transitions.forEach((transition) => {
            let { from, to, name } = transition;
            // 将状态的修改封装到方法中，也就没这么多if else语句了
            this[name] = function () {
                if (this.state === from) {
                    // 修改状态
                    this.state = to;
                    let onMethod = "on" + name.splice(0, 1).toUpperCase() + name.splice(1);
                    // 触发对应方法，也就是将不同的行为分离到方法中了
                    methods[onMethod] && methods[onMethod]();
                }
            };
        });
    }
}
```

## 应用场景

1. 表单的校验，每个表单组件可以设置自己的校验规则，有不同的校验方法