---
title: webpack执行流程
date: "2022-5-08"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
    - webpack5源码
---

## 初始阶段

1. 根据上节的入口文件，webpack 导出了一个函数，webpack 函数的主要作用就是创建 compiler 实例，如果传入了回调，则执行 `compile.run` 方法，否则需要从外部手动调用 `compile.run` 方法，compiler 实例是在 createCompiler 方法中创建的

```js
const webpack = function (options, callback) {
    /*...*/

    // 创建compiler实例
    function create() {
        let compiler = createCompiler(webpackOptions);
        return compiler;
    }

    // 如果传了回调函数，执行compiler.run方法，在手动调用回调函数
    if (callback) {
        const { compiler } = create();
        compiler.run((err, stats) => {
            callback(err || err2, stats);
        });
        return compiler;
    } else {
        // 没有传回调，则直接返回compiler实例
        const { compiler, watch } = create();
        return compiler;
    }
};
```

2. createCompiler 方法创建了 Compiler 实例，除此之外还做了一个很重要的工作，就是注册配置项里的插件，以及将配置文件里的其余选项都转交给插件去处理，通过调用插件的 apply 方法，并传入 compiler 实例，进行注册。<font color="red">所以插件是在 webpack 刚开始构建时就已经注册好了</font>

```js
// 创建Compiler
const createCompiler = (rawOptions) => {
    // 1.创建Compiler实例
    const compiler = new Compiler(options.context, options);

    // 2.注册配置文件插件选项中的插件
    if (Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            // 如果plugin是一个函数，改变this，指向compiler，并将compiler作为第一个参数传递
            if (typeof plugin === "function") {
                plugin.call(compiler, compiler);
            } else {
                // 否则，执行对象里的apply方法
                plugin.apply(compiler);
            }
        }
    }

    // 3. 调用webpack的生命周期钩子environment和afterEnvironment
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();

    // 4. 将配置文件的其他选项都转交给插件去处理
    new WebpackOptionsApply().process(options, compiler);
    compiler.hooks.initialize.call();
    return compiler;
};
```

WebpackOptionsApply.process 方法的作用就是将配置文件的其他选项都转交给插件去处理，在 webpack 内部所有的配置其实都是以插件的形式进行体现的

```js
class WebpackOptionsApply {
    process(options, compiler) {
        if (options.externals) {
            new ExternalsPlugin(options.externalsType, options.externals).apply(compiler);
        }
        /*...*/

        if (options.output.clean) {
            new CleanPlugin(options.output.clean === true ? {} : options.output.clean).apply(compiler);
        }
        /*...*/
        // 入口处理的插件
        new EntryOptionPlugin().apply(compiler);
        /*...*/
    }
}
```

:::warning 注意
这里只是注册了插件，并没有执行插件的功能，插件的执行贯穿了 webpack 的整个生命周期，在各个生命周期钩子中都会使用
:::

以 EntryOptionPlugin 为例，在 apply 方法中通过 hooks 实例注册钩子到 webpack 的生命周期，相当于是事件监听。基本上所有的插件都会有该方法，用来在 webpack 生命周期上注册钩子，这也是我们实现自定义插件必须要实现的方法

```js
class EntryOptionPlugin {
    apply(compiler) {
        compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
            EntryOptionPlugin.applyEntryOption(compiler, context, entry);
            return true;
        });
    }
}
```

## 编译之前

3. new Compile 做了什么？
   在构造函数中主要注册了一系列的 Hook 实例，用来注册回调函数，在 webpack 各个生命周期中执行

    Compile 的 run 方法内部会执行 compile 方法，开始正式进入编译阶段

```js
class Compile {
    constructor(content, options) {
        // 在this.hooks上初始了一系列的Hook实例，用来注册回调函数，在webpack各个生命周期中执行
        this.hooks = Object.freeze({
            initialize: new SyncHook([]),
            shouldEmit: new SyncBailHook(["compilation"]),
            /*...*/
            entryOption: new SyncBailHook(["context", "entry"]),
        });
        this.options = options;
        this.context = context;
        /*...*/
    }

    run() {
        // 最终如果发生错误时的回调
        const finalCallback = (err, stats) => {
            /*...*/
        };

        // 在编译完成之后调用
        const onCompiled = (err, compilation) => {
            if (err) return finalCallback(err);
            /*...*/
        };

        const run = () => {
            // 触发注册在beforeRun实例上的钩子
            this.hooks.beforeRun.callAsync(this, (err) => {
                if (err) return finalCallback(err);

                this.hooks.run.callAsync(this, (err) => {
                    if (err) return finalCallback(err);

                    this.readRecords((err) => {
                        if (err) return finalCallback(err);

                        // 开始准备编译
                        this.compile(onCompiled);
                    });
                });
            });
        };

        // 最终都会执行run方法
        if (this.idle) {
            // 如果是空闲状态
            /*...*/
            run();
        } else {
            run();
        }
    }

    compile() {}
}
```

compile 方法里面就开始进入了 webpack 的打包流程，触发注册在 hook 钩子实例上的方法

-   beforeCompile：编译之前
    在这之间创建了 compilation 实例
-   make：开始编译
-   finishMake：完成编译
-   afterCompile：完成编译后

Compiler 和 Compilation 的区别？

-   Compiler: Compiler 对象负责文件监听和启动编译。Compiler 实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例
-   Compilation: Compilation 对象用来编译生成资源，每当监测到文件变化时，会创建一个新的 Compilation

```js
class Compile {
    // 开始进行编译，里面包含的就是webpack的打包流程
    compile(callback) {
        // beforeCompile编译之前：触发注册在beforeCompile实例上的方法
        this.hooks.beforeCompile.callAsync(params, (err) => {
            if (err) return callback(err);

            this.hooks.compile.call(params);

            // 在编译之前创建了compilation实例
            const compilation = this.newCompilation(params);

            const logger = compilation.getLogger("webpack.Compiler");

            logger.time("make hook");
            // make正式打包的阶段：触发注册在make实例上的方法，难点就是找到注册的方法
            this.hooks.make.callAsync(compilation, (err) => {
                logger.timeEnd("make hook");
                if (err) return callback(err);

                logger.time("finish make hook");
                // finishMake完成打包：触发注册在finishMake上的方法
                this.hooks.finishMake.callAsync(compilation, (err) => {
                    logger.timeEnd("finish make hook");
                    if (err) return callback(err);

                    process.nextTick(() => {
                        logger.time("finish compilation");
                        compilation.finish((err) => {
                            logger.timeEnd("finish compilation");
                            if (err) return callback(err);

                            logger.time("seal compilation");
                            // 将处理好的内容输出到磁盘
                            compilation.seal((err) => {
                                logger.timeEnd("seal compilation");
                                if (err) return callback(err);

                                logger.time("afterCompile hook");
                                this.hooks.afterCompile.callAsync(compilation, (err) => {
                                    logger.timeEnd("afterCompile hook");
                                    if (err) return callback(err);

                                    return callback(null, compilation);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}
```

## 编译阶段

关键点就在于需要找到在 make 实例上注册的回调方法，该回调也就是开始编译的入口方法
