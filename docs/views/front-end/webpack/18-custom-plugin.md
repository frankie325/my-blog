---
title: 自定义plugin
date: "2022-4-07"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
---

我们知道 `webpack` 有两个非常重要的类：`Compiler` 和 `Compilation`，它们通过注入插件的方式来监听webpack的所有生命周期，插件的注入离不开各种各样的Hook，各种Hook实例都是由 `Tapable` 库来创建的。

所以想要学习自定义插件，需要先了解 `Tapable` 库，`Tapable`是由官方编写和维护的一个库

## Tapable的使用

安装 `Tapable`
```
npm i tapable -s
```
基本使用：
1. 创建Hook实例
2. 通过Hook实例的tap方法绑定事件函数
3. 通过Hook实例的call方法触发绑定的所有事件函数

```js
const { SyncHook } = require("tapable");

class LearnTapable {
    constructor() {
        this.hooks = {
            syncHook: new SyncHook(["name", "age"]), //传递字符数组作为Hook构造函数的参数，将作为绑定事件函数的形参
        };

        // 调用tap方法，往Hook实例上绑定事件函数
        this.hooks.syncHook.tap("event1", (name, age) => {
            console.log("event1", name, age);
            return false;
        });
    }
    emitSync() {
        // 执行call方法，触发同步Hook实例上绑定的事件
        this.hooks.syncHook.call("kfg", 22); //传递参数
    }
}
```
Hook的类型总共有下面这些
```js
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```
- 同步Hook类型：
  - `Bail`：在某一个绑定的事件函数中，如果有返回值，那么后续监听的事件就不会执行了
  - `Loop`：在某一个绑定的事件函数中，如果返回值为真，就会反复执行该事件函数
  - `Waterfall`：当事件函数的返回值不为 `undefined` 时，那么它的的返回值会传递到下一个函数的第一个参数位置
- 异步Hook类型：（异步Hook中可以与同步类型组合使用）
  - `Series`：在一个Hook中，监听的多次事件函数是串行执行的（等到上一个事件函数执行完，才会执行下一个）
  - `Parallel`：在一个Hook中，监听的多次事件函数是并行执行的
```js
const { SyncHook, SyncBailHook, SyncLoopHook, SyncWaterfallHook } = require("tapable");
const { AsyncSeriesHook, AsyncParallelHook } = require("tapable");
class LearnTapable {
    constructor() {
        this.hooks = {
            /*
                同步Hook：
                Bail：在某一个绑定的事件函数中，如果有返回值，那么后续监听的事件就不会执行了
                Loop：在某一个绑定的事件函数中，如果返回值为真，就会反复执行该事件函数
                Waterfall：当事件函数的返回值不为undefined时，那么它的的返回值会传递到下一个函数的第一个参数位置
            */
            // syncHook: new SyncHook(["name", "age"]), //传递字符数组作为Hook构造函数的参数，将作为绑定事件函数的形参
            // syncHook: new SyncBailHook(["name", "age"]),
            // syncHook: new SyncLoopHook(["name", "age"]),
            // syncHook: new SyncWaterfallHook(["name", "age"]),
            /*
                异步Hook：
                Series：在一个Hook中，监听的多次事件函数是串行执行的（等到上一个事件函数执行完，才会执行下一个）
                Parallel：在一个Hook中，监听的多次事件函数是并行执行的
            */
            // asyncHook: new AsyncSeriesHook(["name", "age"]),
            asyncHook: new AsyncParallelHook(["name", "age"]),
        };

        // 调用tap方法，往Hook实例上绑定事件函数
        // this.hooks.syncHook.tap("event1", (name, age) => {
        //     console.log("event1", name, age);
        //     return false;
        // });

        // this.hooks.syncHook.tap("event2", (name, age) => {
        //     console.log("event2", name, age);
        // });

        // this.hooks.asyncHook.tapAsync("event1", (name, age, callback) => {
        //     setTimeout(() => {
        //         console.log("event1", name, age);
        //         callback(); //执行回调，说明异步任务完成
        //     }, 1000);
        // });

        // this.hooks.asyncHook.tapAsync("event2", (name, age, callback) => {
        //     setTimeout(() => {
        //         console.log("event1", name, age);
        //         callback();
        //     }, 1000);
        // });

        // 使用Promise方式绑定事件函数
        this.hooks.asyncHook.tapPromise("event1", (name, age) => {
            // 返回一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("event1", name, age);
                    resolve();
                }, 1000);
            });
        });

        this.hooks.asyncHook.tapPromise("event2", (name, age, callback) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("event2", name, age);
                    resolve();
                }, 1000);
            });
        });
    }
    emitSync() {
        // 执行call方法，触发同步Hook实例上绑定的事件
        this.hooks.syncHook.call("kfg", 22); //传递参数
    }

    emitAsync() {
        // 执行callAsync方法，触发异步Hook实例上绑定的事件
        // this.hooks.asyncHook.callAsync("kfg", 22, () => {
        //     console.log("异步事件执行完成");
        // });

        this.hooks.asyncHook.promise("kfg", 22).then(() => {
            console.log("异步事件执行完成");
        });
    }
}

const lt = new LearnTapable();
// lt.emitSync();
lt.emitAsync();
```

## 自定义plugin

目前大部分插件都可以在社区中找到，推荐尽量使用在维护的，并且经过社区验证的插件

`Plugin`是如何注册到`webpack`的生命周期中的呢？
1. 在`webpack`函数的`createCompiler`方法中注册了所有插件
2. 在注册插件时，会调用插件函数或者插件对象的`apply`方法
3. `apply`方法会接收`compiler`对象，我们可以通过`compiler`对象来注册`Hook`的事件
4. 某些插件也会传入一个`compilation`对象，我们也可以监听`compilation`的`Hook`事件


我们自定义一个将打包文件自动上传到服务器指定目录的插件为例：

需要提供一个服务器，可以用虚拟机 :point_right:[创建虚拟机](../../computer/linux/install.html#安装vmware虚拟机)  

还需要安装 `node-ssh` 来连接创建的服务器
```
npm i node-ssh -D
```
```js
const { NodeSSH } = require("node-ssh");

class AutoUploadPlugin {
    constructor(options) {
        this.ssh = new NodeSSH();
        this.options = options;
    }

    apply(compiler) {
        // afterEmit钩子事件在资源输出到打包目录之后执行
        compiler.hooks.afterEmit.tapAsync("AutoUploadPlugin", async (compilation, callback) => {
            console.log("内容上传到服务器了");
            // 1. 获取输出的文件夹

            const outputPath = compilation.outputOptions.path;

            // 2. 连接服务器（ssh连接）
            await this.connectServer();

            // 3. 删除原来目录的内容
            const serverDir = this.options.serverDir;
            await this.ssh.execCommand(`rm -rf ${serverDir}/*`); //删除/root/test目录下的所有文件

            // 4. 上传文件到服务器
            console.log(outputPath);
            await this.uploadFiles(outputPath, serverDir);

            // 5. 关闭ssh
            this.ssh.dispose();
            callback();
        });
    }

    async connectServer() {
        await this.ssh.connect({
            host: this.options.host,
            username: this.options.username,
            password: this.options.password,
        });
    }

    /**
     * @description: 上传文件
     * @param {*} localPath 要上传的文件的本地目录
     * @param {*} remotePath 上传到服务器的目标目录
     */
    async uploadFiles(localPath, remotePath) {
        const status = await this.ssh.putDirectory(localPath, remotePath, {
            recursive: true, //递归上传所有文件
            concurrency: 10, //并发数
        });
        console.log("传送到服务器：", status ? "成功" : "失败");
    }
}

module.exports = AutoUploadPlugin;
```

在配置文件中导入插件，并传入参数
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AutoUploadPlugin = require("./plugins/AutoUploadPlugin");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new AutoUploadPlugin({
            host: "192.168.8.128",
            username: "root",
            password: "123456",
            serverDir: "/root/test",
        }),
    ],
};
```