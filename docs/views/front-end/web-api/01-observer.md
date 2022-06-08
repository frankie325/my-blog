---
title: 观察者Observer
date: "2022-5-27"
sidebar: "auto"
categories:
    - 前端
tags:
    - Web Api
---

## Web Api

记录一些平常用的比较少的Api，不然总是看了就忘

## ResizeObserver

window.resize 事件能帮我们监听窗口大小的变化，但是 resize 事件会在一秒内触发将近 60 次，所以很容易在改变窗口大小时导致性能问题

ResizeObserver API 就可以帮助我们：监听一个 DOM 节点的变化，ResizeObserver 避免了在自身回调中调整大小，从而触发的无限回调

使用方法：

1. 创建 resizeObserver 实例，当元素发生变化时触发回调

```js
const resizeObserver = new ResizeObserver((entries) => {
    // entries为一个数组，存储所有观察元素的信息
    for (let entry of entries) {
        console.log(entry);
    }
});
```

2. 调用实例的 observe 方法，开始监听DOM元素

```js
let wrap1 = document.querySelector(".wrap1");
let wrap2 = document.querySelector(".wrap2");
resizeObserver.observe(wrap1, {
    box: "content-box", // 以哪种盒子模型来观察变动
});
resizeObserver.observe(wrap2, {
    box: "content-box", // 以哪种盒子模型来观察变动
});
```

3. 调用实例的unobserve方法取消指定DOM元素的观察

```js
resizeObserver.unobserve(wrap1);
```

4. 调用实例的udisconnect方法取消所有DOM元素的观察
```js
resizeObserver.disconnect();
```
