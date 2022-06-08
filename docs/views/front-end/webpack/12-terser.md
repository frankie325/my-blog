---
title: terser的使用
date: "2022-4-02"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
---

## terser工具的使用
`terser` 是一款JavaScript代码压缩工具，是独立于 `webpack` 的.

安装`terser`，这里采用在项目局部安装
```
npm i terser -D
```
在项目根目录新建一个示例文件 `example.js`
```js
// example.js
var x = {
    baz_: 0,
    foo_: 1,
    calc: function() {
        return this.foo_ + this.baz_;
    }
};
x.bar_ = 2;
x["baz_"] = 3;
console.log(x.calc());
```
输入命令将文件压缩到 `terser.js`
```
npx terser example.js -o terser.js
```
这是不带任何选项的默认压缩
```js
// terser.js
var x={baz_:0,foo_:1,calc:function(){return this.foo_+this.baz_}};x.bar_=2;x["baz_"]=3;console.log(x.calc());
```

terser还提供了一系列压缩选项，可以达到更加精细化的控制

- `-c`
  - `arrows`：设为true，则会将类或对象内的函数转为箭头函数
  - `dead_code`：无需赋值，添加上则为true，删除掉 `dead code`（`if(false){}`像这种无效的代码）
- `-m`
  - `keep_classnames`：设为 `true`，则不会对类名进行压缩
  - `toplevel`：设为 `true`，则对顶级作用域声明的变量名称进行压缩
- `-f`：控制 `terser` 输出代码的格式
  - `beautify`：是否美化输出
  - `braces`：设为ture，则始终在if、for、do、while或with语句中插入大括号

命令选项组合使用：
```
npx terser example.js -o terser.js -m keep_classnames=true,toplevel=true -c dead_code 
```
更多配置可以查看官网 :point_right: [terser官网](https://github.com/terser/terser)

## terser在webpack中的配置

`webpack` 中使用 `terser` 是通过 `terser-webpack-plugin` 实现的，`webpack5` 自带最新版本的 `terser-webpack-plugin`，无需安装，如果是 `webpack4` 则需要手动安装。

 `webpack.prod.js`中进行配置，一般情况我们是不需要配置的，生产环境下默认开启了压缩插件
```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    optimization: {
        minimize: true, //告知 webpack 使用 TerserPlugin或其它在 optimization.minimizer定义的压缩插件
        minimizer: [
            new TerserPlugin({
                // test: ""  //匹配需要压缩的文件
                // include: "" //匹配参与压缩的文件
                // exclude: "" //匹配不需要压缩的文件
                // parallel: true //使用多进程并发运行以提高构建速度，默认开启

                // 提供给terser插件的选项
                terserOptions: {
                    ecma: undefined,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    // Deprecated
                    output: null,
                    format: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                },
                extractComments: true, //是否将注释抽离到单独的文件
            }),
        ],
    },
};

```

## css的压缩
之前在代码分离我们已经将 `css` 提取到了单独的文件，但是还没有进行压缩，对css的压缩需要使用 `css-minimizer-webpack-plugin` 插件

css压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等

安装 `css-minimizer-webpack-plugin`
```
npm i css-minimizer-webpack-plugin -D
```
使用非常简单，直接使用即可
```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
    mode: "production",
    plugins: [
        new CssMinimizerPlugin(),
    ],
};
```

## 补充

### Scope Hoisting

什么是 `Scope Hoisting`？
`Scope Hoisting`是 `webpack3` 开始增加的一个功能，功能是对作用域提升，让打包后的代码更小、运行更快

默认情况下webpack打包会有很多函数作用域，从模块化原理那章打包出来的代码就可以看出来，会导致：
- 大量作用域包裹，导致代码体积增大
- 运行代码时创建的函数作用域变多，内存开销变大

`Scope Hoisting` 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余


**使用 `Scope Hoisting`**：
- 在生产环境下，默认就会开启`Scope Hoisting`
- 在开发环境下，我们需要自己来打开该模块

开发环境下直接配置即可
```js
const webpack = require("webpack");
module.exports = {
    mode: "development",
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
};
```
