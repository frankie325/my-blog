---
title: 栈
date: "2022-6-12"
sidebar: "auto"
categories:
    - 计算机
tags:
    - 数据结构
---

## 栈结构

栈（stack），是一种受限的线性表，后进先出（先进后出）

比如平常所说的函数调用栈函数之间的相互调用，A 调用 B，B 又调用 C，C 又调用 D。过程为，A 最先入栈，因为调用了 B，所以 B 又入栈，接着 C 入栈，然后 C 执行完，出栈，再到 B 执行完，出栈，最终 A 出栈。

栈结构的实现

```js
function Stack() {
    this.items = [];
}

// 栈的一些常用操作
// 1.将元素推入栈
Stack.prototype.push = function (element) {
    this.items.push(element);
};

// 2.剔除栈顶元素
Stack.prototype.pop = function () {
    return this.items.pop();
};

// 3.查看栈顶元素
Stack.prototype.peek = function () {
    return this.items[this.items.length - 1];
};

// 4.判断栈是否为空
Stack.prototype.isEmpty = function () {
    return this.items.length === 0;
};

// 5.获取栈中元素的个数
Stack.prototype.size = function () {
    return this.items.length;
};

// 6.toString方法
Stack.prototype.toString = function () {
    return this.items.join(",");
};

let s = new Stack();

s.push(10);
s.push(20);
s.push(30);
s.push(40);
console.log(s.peek());
```

示例：十进制转二进制

```js
function dec2bin(number) {
    let s = new Stack();
    while (number > 0) {
        s.push(number % 2); //将除2得到的余数推入栈中
    }
    number = parseInt(number / 2);

    let str = "";
    while (s.isEmpty()) {
        str += s.pop(); //再依次取出栈顶元素，进行凭借，得到的就是二进制
    }
    return str;
}

console.log(dec2bin(1000));
```
