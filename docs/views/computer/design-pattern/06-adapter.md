---
title: 适配器模式
date: "2022-4-24"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 适配器模式

在现实生活中，经常出现两个对象因接口不兼容而不能在一起工作的实例，这时需要第三者进行适配。例如，讲中文的人同讲英文的人对话时需要一个翻译，用直流电的笔记本电脑接交流电源时需要一个电源适配器，用计算机访问照相机的 SD 内存卡时需要一个读卡器等

适配器模式的目的是为了解决对象之间的接口不兼容的问题，通过适配器模式可以不更改源代码的情况下，让两个原本不兼容的对象在调用时正常工作。

**优点：**

-   用户通过适配器可以透明地调用目标接口
-   复用了现存的类，程序员不需要修改原有代码而重用现有的适配者类
-   将目标类和适配者类解耦，解决了目标类和适配者类接口不一致的问题

**缺点：**

-   过多的使用适配器模式，会让系统变得零乱，不易整体把控。建议在无法重构的情况下使用适配器

**示例**

```js
// 电源
class Power {
    charge() {
        return "220V";
    }
}

// 适配器
class Adapter {
    constructor(power) {
        this.power = new Power();
    }
    // 对电源做转换，将电源220V 转为 12V进行适配
    charge() {
        let v = this.power.charge();
        return `${v} => 12V`;
    }
}

class Client {
    constructor() {
        this.adapter = new Adapter();
    }

    // 使用适配器
    use() {
        console.log(this.adapter.charge());
    }
}

let c = new Client();
c.use();
```

## 应用场景

1. 比如说：项目中用的请求方法时 jquery 的 ajax，但是现在需求是要改成使用 fetch 去请求数据
   如果我们全部替换源码需要花很多精力，可以进行适配，原来方法还是不用修改，新增一个适配的方法能很大程度的节省时间

```js
// 进行适配，实际上请求是通过fetch方法实现
window.$ = {
    ajax(options) {
        return fetch(options.url, {
            method: options.type || "GET",
            body: JSON.stringify(options.data || {}),
        });
    },
};

// 还是按照jquery的方式来使用
$.ajax({
    url,
    type: "POST",
    datatype: "json",
    data: { id: "xxx" },
}).then((data) => {
    console.log(data);
});
```

2. Vue 的计算属性就相当于是适配
