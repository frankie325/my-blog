---
title: 原型模式
date: "2022-5-02"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 原型模式

用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。通俗来说，就是克隆原型，来实现方法的复用，如果是前端开发，相信已经很熟悉这种模式了

**优点：**

-   不再依赖构造函数或者类创建对象，可以将这个对象作为一个模板生成更多的新对象。

**缺点：**

-   对于包含引用类型值的属性来说，所有实例在默认的情况下都会取得相同的属性值。

```js
function Foo() {}

let f = new Foo();

// 实例的__proto__指向构造函数的prototype
f.__proto__ === Foo.prototype;

//构造函数的prototype也是个对象，所以构造函数的prototype的__proto__指向Object.prototype
Foo.prototype.__proto__ === Object.prototype;

// Object.prototype的__proto__指向null
Object.prototype.__proto__ === null;

// 构造函数本身也是由new Function()创建出来的实例，所以：
Foo.__proto__ === Function.prototype;

// Function.prototype也是个对象，所以Function.prototype.__proto__指向Object.prototype
Function.prototype.__proto__ === Object.prototype;

// Function也是由new Function()创建出来的实例，所以Function.__proto__指向自己Function.prototype
Function.__proto__ === Function.prototype;

// Object也是由new Function()创建出来的实例，所以Object.__proto__指向Function.prototype
Object.__proto__ === Function.prototype;
```
