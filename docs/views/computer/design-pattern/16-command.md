---
title: 命令模式
date: "2022-5-03"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 命令模式

将一个请求封装为一个对象，使发出请求的责任和执行请求的责任分割开。这样两者之间通过命令对象进行沟通，这样方便将命令对象进行储存、传递、调用、增加与管理。方法的请求者与方法的实现者实现了解耦。

现实生活中，命令模式的例子也很多：电视机遥控器（命令发送者）通过按钮（具体命令）来遥控电视机（命令接收者）。再比如，我们去餐厅吃饭，客人只需要点菜，谁来制作并不知道，餐厅提供的菜单就相当于把请求和处理进行了解耦

**优点：**

-   通过引入中间件（抽象接口）降低系统的耦合度
-   扩展性良好，增加或删除命令非常方便

**缺点：**

-   命令模式使用过度会导致代码中存在过多的具体命令

```js
// 命令接受方：只需要执行，不关心请求者是谁
class Cooker {
    cook() {
        console.log("做饭");
    }
}

class Cleaner {
    clean() {
        console.log("保洁");
    }
}

// 做饭的命令
class CookCommand {
    // 将干活的人传达给命令
    constructor(receiver) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.cook();
    }
}

// 打扫的命令
class CleanCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.clean();
    }
}

// 命令发送方
class Customer {
    constructor(command) {
        this.setCommand(command);
    }

    setCommand(command) {
        this.command = command;
    }
    // 顾客只需要执行点餐的动作就行，并不关心是谁去实现
    cook() {
        this.command.execute();
    }
    clean() {
        this.command.execute();
    }
}

let cooker = new Cooker();
let cleaner = new Cleaner();
let cookCommand = new CookCommand(cooker);
let cleanCommand = new CleanCommand(cleaner);

// 当要做饭时，传达做饭的命令
let customer = new Customer(cookCommand);
customer.execute();
// 当要打扫时，传达打扫的命令
customer.setCommand(cleanCommand);
customer.execute();
```
