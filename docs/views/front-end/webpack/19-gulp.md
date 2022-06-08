---
title: Gulp的使用
date: "2022-4-08"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
    - gulp
---

## Gulp 简介

**什么是 Gulp？**

Gulp 是一个工具包，可以帮你自动化和增加你的工作流。

**Gulp 与 Webpack 的区别？**

-   Gulp 的核心理念是 `task runner`：可以定义自己的一系列任务，等待任务被执行，基于文件 Stream 的构建流，我们可以使用 Gulp 的插件体系来完成某些任务。
-   Webpack 的核心理念是 `module bundler`：webpack 是一个模块化打包工具，可以使用各种各样的 loader 来加载不同模块，可以使用各种插件在 webpack 打包的生命周期完成其他任务

**Gulp 相对于 Webpack 的优缺点？**

-   Gulp 相对于 Webpack 思想更加简单，易用，更适合编写一些自动化的任务
-   但是对于大型项目（Vue、React、Angular）并不会使用 gulp 来构建的，比如默认 gulp 是不支持模块化的

## Gulp 的使用

安装 Gulp

```
npm i gulp -D
```

### 执行单个任务

在文件根目录创建 `gulpfile.js`，写入任务

每个 gulp 任务都是一个异步的 JavaScript 函数：此函数接收一个 callback 作为参数，调用 callback 函数那么任务会结束，或者是一个返回 stream、promise、event emitter、child process、observable 类型的函数

```js
const foo = (cb) => {
    console.log("foo");

    cb();
};

module.exports = {
    foo,
};

// 默认任务
module.exports.default = (cb) => {
    console.log("default task");
    cb();
};
```

输入命令执行任务

```
npx gulp //执行默认导出的任务
npx gulp foo //执行导出的foo任务
```

### 执行多个任务

处理一次执行单个任务，还可以一次执行多个任务，在 `gulpfile.js` 中写入

```js
const { series, parallel } = require("gulp");

const task1 = (cb) => {
    setTimeout(() => {
        console.log("task1");
        cb();
    }, 1000);
};

const task2 = (cb) => {
    setTimeout(() => {
        console.log("task2");
        cb();
    }, 1000);
};

const task3 = (cb) => {
    setTimeout(() => {
        console.log("task3");
        cb();
    }, 1000);
};

// 任务串行执行，一个接一个的执行
const seriesTask = series(task1, task2, task3);
// 任务并行执行，任务同时一起执行
const parallelTask = parallel(task1, task2, task3);

// 可以组合使用：先执行并行任务，接着再执行串行任务
const composeTask = series(parallelTask, seriesTask);

module.exports = {
    seriesTask,
    parallelTask,
    composeTask,
};
```

-   `series`方法：任务串行执行，一个接一个的执行
-   `parallel`方法：任务并行执行，任务同时一起执行

输入执行命令，即可观察到任务的执行顺序

```
npx gulp seriesTask
npx gulp parallelTask
npx gulp composeTask
```

## 读取和写入文件

Gulp 暴露了 `src` 和 `dest` 方法用于处理计算机上存放的文件

-   `src`方法：接收参数，并从文件系统中读取文件然后生成一个 Node 流（Steam），它将所有匹配的文件读取到内存中并通过流进行处理，由 `src`方法产生的流，应该从任务函数中返回，说明该任务已经完成
-   `dest`方法：接收一个输出目录作为参数，并且还会产生一个 Node 流（Steam），通过该流将内容输出到文件中

在 `gulpfile.js` 中写入，输入命令即可生成 `build` 文件夹

```js
const { src, dest } = require("gulp");

const jsTask = () => {
    return src("./src/main.js").pipe(dest("./build"));
};

module.exports = {
    jsTask,
};
```

生成的 build 文件只是按照原样拷贝过去，我们可以使用流（Stream）的主要 api，管道函数 `pipe` 对流进行转换

在 pipe 管道中，我们可以使用插件进行各种转换，比如 babel 语法转化、代码压缩等，可以去官网查看支持的各种插件 :point_right: [gulp 插件](https://gulpjs.com/plugins)

-   安装 `gulp-babel`，进行语法转换

```
npm i gulp-babel -D
npm i @babel/core -D
npm i @babel/preset-env -D
```

-   安装 `gulp-uglify` 或者 `gulp-terser` 进行语法压缩， `gulp-uglify`很久没有维护了，推荐使用 `gulp-terser`

```
npm i gulp-uglify -D
npm i gulp-terser -D
```

```js
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
// const uglify = require("gulp-uglify");
const terser = require("gulp-terser");

const jsTask = () => {
    return (
        src("./src/main.js")
            .pipe(
                // 使用babel做转换
                babel({
                    presets: ["@babel/preset-env"],
                })
            )
            // .pipe(uglify())
            .pipe(
                // 使用terser进行压缩
                terser({
                    mangle: {
                        toplevel: true,
                    },
                })
            )
            .pipe(dest("./build"))
    );
};

module.exports = {
    jsTask,
};
```

## glob 文件匹配规则

`src()` 方法接受一个 glob 字符或由多个 glob 字符串组成的数组作为参数，用于确定哪些文件需要被操作，匹配规则如下

-   一个星号 `*`：在一个字符串中，匹配任意数量的字符，包括 0 个匹配 `*.js`

-   两个星号 `*`：在一个字符串中，匹配任意数量的字符串，通常匹配目录下的文件 `script/**/*.js`

-   取反 `!`：由于 glob 匹配只按照数组中的位置一次进行匹配操作的，所以取反必须跟在一个非取反的后面，比如：`[script/**/*.js, !script/vendor/]`，匹配 script 下的所有 js 文件，但不包含 vendor 文件

## 监听文件变化

每次都要输入命令执行任务，我们可以使用 `watch` 方法进行监听，监听指定目录的变化，一旦目录文件发生变化，则更新监听的任务

在 `gulpfile.js` 写入

```js
const { watch } = require("gulp");

watch("./src/**/*.js", jsTask); //监听src目录下的所有js文件
```
