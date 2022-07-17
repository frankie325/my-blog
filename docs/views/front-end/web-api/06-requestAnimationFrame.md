---
title: requestAnimationFrame
date: '2022-6-20'
sidebar: 'auto'
categories:
  - 前端
tags:
  - Web Api
---

## requestAnimationFrame

`window.requestAnimationFrame()` 告诉浏览器在下次重绘之前调用指定的回调函数更新动画，传入的回调会在浏览器下一次重绘之前执行

`requestAnimationFrame` 会由浏览器根据屏幕刷新率来决定会回调函数的执行时机，比如说屏幕刷新率为 60hz（1 秒钟刷新 60 次），那么每过 1000ms / 60 = 16.666666...ms 触发回调

为什么需要使用 requestAnimationFrame？

相比于使用`setTimeout`去操作 js 动态修改 css 属性实现动画，使用`requestAnimationFrame`能够在合适帧完成动画效果。即使`setTimeout`设置为 16ms，因为异步队列的原因，并不一定会每间隔 16ms 触发一次，从而造成动画卡顿的感觉

## 使用方法

:::warning 注意
如果想要浏览器在下次重绘之前继续触发回调，那么在回调中必须再次调用`window.requestAnimationFrame()`
:::

回调函数接受一个参数，当前回调执行的时间戳（ms）

```js
let myReq;
function step(time) {
  //time为回调执行的时间戳，从0开始，按照刷新时间累加
  //第一帧：16.666ms
  //第二帧：2 * 16.666ms
  //第三帧：3 * 16.666ms
  //...
  console.log(time);
  // 必须再次调用`window.requestAnimationFrame()`，才能在下次重绘之前触发
  myReq = window.requestAnimationFrame(step);
}
requestAnimationFrame(step);

// 取消requestAnimationFrame
window.addEventListener('click', () => {
  window.cancelAnimationFrame(myReq);
});
```
