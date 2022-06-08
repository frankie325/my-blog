---
title: 桥接模式
date: "2022-5-02"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 桥接模式

桥接模式是指将抽象部分与它的实现部分分离，使它们各自独立的变化，通过使用组合关系代替继承关系，降低抽象和实现两个可变维度的耦合度

**优点：**

-   抽象与实现分离，扩展能力强
-   实现细节对客户透明

**缺点：**

-   桥接模式的引入会增加系统的理解与设计难度，由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计与编程

示例：
画图：可以画正方形、长方形、圆形，可以对形状上色，有三种颜色白色、灰色、黑色
可以自由组合：白色长方形，灰色正方形，黑色圆形，....

1. 方案一：为每个形状提供各种颜色的版本，问题是如果我们每增加一种形状或者颜色，就需要继续叠加，这种情况无疑是很不理想的

```js
class WhiteCircle {
    draw() {
        console.log("白色的圆");
    }
}

class grayCircle {
    draw() {
        console.log("灰色的圆");
    }
}

class WhiteSquare {
    draw() {
        console.log("白色的正方形");
    }
}

class graySquare {
    draw() {
        console.log("灰色的正方形");
    }
}
```

2. 方案二： 根据实际需要对颜色和形状进行组合

```ts
abstract class Shape {
    public color: Color;
    // 这里相当于一个连接作用，将颜色与形状进行连接起来，形状和颜色一一组合
    constructor(color: Color) {
        this.color = color;
    }
    abstract draw(): void;
}

// 形状的具体实现
class Circle extends Shape {
    constructor(color: Color) {
        super(color);
    }
    draw(): void {
        this.color.paint("圆形");
    }
}

class Square extends Shape {
    constructor(color: Color) {
        super(color);
    }
    draw(): void {
        this.color.paint("正方形");
    }
}

interface Color {
    paint(shape: string): void;
}

// 颜色的具体实现
class White implements Color {
    paint(shape: string): void {
        console.log("白色的" + shape);
    }
}

class Gray implements Color {
    paint(shape: string): void {
        console.log("灰色的" + shape);
    }
}

let c = new Circle(new White());
c.draw();
let s = new Square(new White());
s.draw();
```
