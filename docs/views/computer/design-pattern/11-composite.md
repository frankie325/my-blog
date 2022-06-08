---
title: 组合模式
date: "2022-5-03"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 组合模式

它是一种将对象组合成树状的层次结构的模式，用来表示“整体-部分”的关系，使用户对单个对象和组合对象具有一致的访问性

**优点：**

-   组合模式使得用户可以一致地处理单个对象和组合对象，无须关心自己处理的是单个对象，还是组合对象，这简化了用户
-   更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码

**缺点：**

-   设计较复杂，用户需要花更多时间理清类之间的层次关系；

示例：文件系统中的文件夹与文件，非常适合用组合模式来描述，文件夹可以包括子文件夹和文件，文件不能包括任何文件，这种关系让最终会形成一棵树

```js
class Folder {
    constructor(name) {
        this.name = name;
        this.children = [];
        this.parent = null;
    }

    // 新增文件构成树形结构
    add(child) {
        child.parent = this;
        this.children.push(child);
    }

    // 一层层递归调用，展示文件
    show() {
        console.log("文件夹" + this.name);
        this.children.forEach((c) => {
            c.show();
        });
    }
}

class File {
    constructor(name) {
        this.name = name;
    }

    add() {
        throw new Error("文件下面不能创建文件");
    }

    show() {
        console.log("文件" + this.name);
    }
}

let frame = new Folder("frame");
let vue = new Folder("vue");
let react = new Folder("react");
frame.add(vue);
frame.add(react);
let observer = new File("observer");
vue.add(observer);
frame.show();
```

## 应用场景

1. Vue 的虚拟 DOM 结构
