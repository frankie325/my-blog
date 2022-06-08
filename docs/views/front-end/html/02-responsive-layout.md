---
title: 响应式布局方案
date: "2022-5-15"
sidebar: "auto"
categories:
    - 前端
tags:
    - html
---

## 媒体查询

使用 css 媒体查询 @media 分别为不同屏幕尺寸的移动设备编写不同尺寸的 css 样式，不适用，每种屏幕都得写一套样式

## rem

rem 是指相对于根元素(root element html) 的字体大小的单位 ，根元素默认的字体大小为 16px，所以 1rem = 16px

假设现在我们根元素的字体大小为 100px，以 1rem = 100px ，750px 宽的屏幕为基准去画的页面

现在页面需要跑到 1400px 宽的屏幕上，此时屏幕宽变成了两遍，但是如果我们还是用 1rem = 100px 为基准，那么页面中的宽度、字体等大小并没有等比放大，还是原来的大小，所以我们需要动态修改根元素的字体大小

其实就是一个很简单的比例关系：`浏览器宽度 / 750 = x / 100`

-   750：设计稿宽度，怎么设置取决于项目的设计稿宽度
-   100：可以是其他数值，取 100 是方便计算，比如 12px 就可以设置为 0.12rem
-   x：根元素字体大小，随着浏览器宽度变化而变化

下面为简单实现：

```js
let html = document.documentElement;
window.addEventListener("resize", (e) => {
    let innerWidth = window.innerWidth; //浏览器可视区域宽度
    html.style.fontSize = (innerWidth / 750) * 100 + "px"; //就是上面公式里的x值
});
```

## viewport

viewport 视口：浏览设备的屏幕的显示部分，对于浏览器来说相对于浏览器的可视区域大部分浏览器已经支持

在 css 中直接使用 vw、vh 作为单位，大部分浏览器和手机都支持

-   vw：相对于视口的宽度，视口宽度是 100vw
-   vh：相对于视口的高度，视口宽度是 100vh
-   vmin：vw 和 vh 中较小的值
-   vmin：vw 和 vh 中较大的值

使用视口还需要在head标签中添加如下代码

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**content取值：**

|  Name   | Value  | 	Description   
|  ----  | ----  | ----  |
| width  | 	正整数或device-width | 定义视口的宽度，单位为像素  | 
| initial-scale  | 	[0.0-10.0] | 定义初始缩放值 | 
| minimum-scale  | 	[0.0-10.0] | 	定义缩小最小比例，它必须小于或等于maximum-scale设置 | 
| maximum-scale  | 	[0.0-10.0] | 	定义放大最大比例，它必须大于或等于minimum-scale设置 | 
| user-scalable  | 	yes/no | 定义是否允许用户手动缩放页面，默认值yes | 
