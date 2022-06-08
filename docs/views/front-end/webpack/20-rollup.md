---
title: Rollup的使用
date: "2022-4-09"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
    - rollup
---

## Rollup 简介

**什么是 Rollup？**

Rollup 还一个 JavaScript 模块化都打包工具，可以帮助我们变异晓得代码到一个大的、复杂的代码中，比如一个库或者一个应用程序。

**Rollup 与 Webpack 的区别？**

-   Rollup 也是模块化打包工具，但是主要是针对 ESModule 进行打包的
-   Rollup 的配置理念相对于 webpack 来说更加的简洁容易理解
-   在早期 webpack 不支持 Tree Shaking 时，Rollup 具备更强的优势（自带 Tree Shaking）

**Rollup 与 Webpack 的应用场景？**

-   一般在对库文件进行打包时，我们通常使用 Rollup（比如：vue、react、dayjs 都是基于 rollup 打包的）
-   在实际项目开发中，我们都会使用 webpack

## Rollup 的使用

```
npm install rollup -g
或者
npm install rollup -D
```

### 命令行的使用

命令参数：

-   `-i,--input`：要打包的文件（必须）
-   `-o, --file`：输出的文件 (如果没有这个参数，则直接输出到控制台)
-   `-f, --format`：输出的文件类型
    -   `amd`：异步模块定义，用于像 RequireJS 这样的模块加载器
    -   `cjs`：CommonJS 规范
    -   `iife`：将软件包保存为 ES 模块文件，在现代浏览器中可以通过 `<script type=module>` 标签引入
    -   `umd` ：通用模块定义
-   `-n, --name`：生成 UMD 模块的名字
-   `c, --config`：使用配置文件进行打包，默认是 `rollup.config.js`

```
npx rollup -i src/main.js -o dist/index.js -f cjs
npx rollup -i src/main.js -o dist/index.js -f umd -n myUtils //输出位umd必须设置模块名字
```

更多参数选项可查看官网 :point_right: [Rollup 命令详情](https://rollupjs.org/guide/en/#command-line-flags)

### 使用配置文件

在项目根目录新建 `rollup.config.js`

```js
export default {
    input: "./src/main.js",
    // output: {
    //     format: "umd", // 输出的文件类型
    //     name: "myUtils",
    //     file: "./dist/index.umd.js", //输出目录
    // },
    // 可以为数组，打包成多个文件，适配不同的环境
    output: [
        {
            format: "umd",
            name: "myUtils",
            file: "./dist/index.umd.js",
        },
        {
            format: "amd",
            file: "./dist/index.amd.js",
        },
        {
            format: "cjs",
            file: "./dist/index.cjs.js",
        },
        {
            format: "esm",
            file: "./dist/index.esm.js",
        },
        {
            format: "iife",
            file: "./dist/index.iife.js",
        },
    ],
};
```

在 `package.json` 中进行配置打包命令

```json
{
    "scripts": {
        "build": "rollup -c"
    }
}
```

## 插件的使用

Rollup 官方也提供了一些日常使用至关重要的插件 :point_right: [rollup 插件](https://github.com/rollup/awesome)，比如 babel、eslint、等等。如果在官方没有找到，可以去社区进行查找

### 使用 Commonjs 模块

需要安装插件

```
npm install @rollup/plugin-commonjs -D
```

在配置文件中使用

```js
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "./src/main.js",
    output: {
        format: "umd", // 输出的文件类型
        name: "myUtils",
        file: "./dist/index.umd.js", //输出目录
    },
    plugins: [
        commonjs(), //支持commonJs
    ],
};
```

:::warning 注意
使用 CommonJs 导出模块时，导入时需要用 `import` 导入，而不是 `require()`
:::

### 引入为 Commonjs 模块的三方包时

当我们引入的第三方包是 CommonJs 规范时，需要使用 `@rollup/plugin-node-resolve` 插件

```
npm i @rollup/plugin-node-resolve -D
```

在配置文件中使用

```js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./src/main.js",
    output: {
        format: "umd", // 输出的文件类型
        name: "myUtils",
        file: "./dist/index.umd.js", //输出目录
    },
    plugins: [
        commonjs(), //支持commonJs
        resolve(),
    ],
};
```

### 使用 babel

安装 babel 插件

```
npm i @rollup/plugin-babel -D
npm i @babel/core -D
npm i @babel/preset-env -D
```

```js
import babel from "@rollup/plugin-babel";

export default {
    plugins: [
        babel({
            babelHelpers: "bundled", //babel解析时，辅助函数只会生成一个，建议显示设置该值
        }),
    ],
};
```

### 使用 terser 压缩

安装 terser 插件

```
npm i rollup-plugin-terser -D
```

```js
import { terser } from "rollup-plugin-terser";

export default {
    plugins: [terser()],
};
```

### 处理 css 文件

安装 postcss 插件

```
npm i postcss -D
npm i rollup-plugin-postcss -D
npm i postcss-preset-env -D
```

```js
import postcss from "rollup-plugin-postcss";

export default {
    plugins: [postcss(
         extract: "css/style.css", //提取css文件
         minimize: true, //开启压缩
         plugins:[
             postcssPresetEvn() //使用预设插件
         ]
    )],
};
```

### 处理 vue 文件

安装插件

```
npm i vue@2.6.14 -s
npm i vue-template-compiler -D
npm i rollup-plugin-vue@4.6.1 -D //默认是支持vue3版本，这里降低版本兼容vue2
```

```js
import vue from "rollup-plugin-vue";

export default {
    plugins: [vue()],
};
```

因为 vue 中使用了 `process.env.NODE_ENV`，但是 rollup 中没有注册该环境变量，所以会报错。可以安装 `@rollup/plugin-replace`，注入环境变量

```
npm install @rollup/plugin-replace -D
```

```js
import replace from "@rollup/plugin-replace";
import vue from "rollup-plugin-vue";

export default {
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify("production"), //注入环境变量
        }),
        vue(),
    ],
};
```

## 开启本地服务

安装插件

```
npm install rollup-plugin-serve -D
```

进行配置即可开启本地服务

```js
import serve from "rollup-plugin-serve";

export default {
    plugins: [
        serve({
            open: true, //是否自动打开浏览器
            port: 8081,
            contentBase: ".", //服务哪个文件夹（取决于index.html所在的位置，推荐放在根目录，需手动引入打包资源）
            // contentBase: "./dist",
        }),
    ],
};
```

只开启本地服务，当源文件变化时，无法实时更新，还需要配 `-watch` 选项和 `rollup-plugin-livereload`插件的使用

在 `package.json` 中配置命令 `-w`：监听 src 目录下的源文件是否有改动，如果有改动，重新打包

```json
{
    "scripts": {
        "serve": "rollup -c -w ./src"
    }
}
```

安装 `rollup-plugin-livereload` 插件，当打包文件改变时重新启动开发服务器

```
npm i rollup-plugin-livereload -D
```

```js
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

export default {
    plugins: [
        serve({
            open: true, //是否自动打开浏览器
            port: 8081,
            contentBase: ".", //服务哪个文件夹（取决于index.html所在的位置，推荐放在根目录，需手动引入打包资源）
            // contentBase: "./dist",
        }),
        livereload({
            watch: "dist", //监听dist目录的变化
        }),
    ],
};
```

## 区分生产环境和开发环境

在 `package.json` 中配置 --environment 设置变量传递给 `process.env`

```json
{
    "scripts": {
        "serve": "rollup -c -w ./src --environment NODE_ENV:development",
        "build": "rollup -c --environment NODE_ENV:production"
    }
}
```

在 `rollup.config.js` 中便可以进行使用来进行环境的区分

```js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import postcssPresetEvn from "postcss-preset-env"; //使用postcss预设插件
import vue from "rollup-plugin-vue";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const plugins = [
    commonjs(), //支持commonJs
    resolve(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), //注入环境变量
    }),
    babel({
        babelHelpers: "bundled", //babel解析时，辅助函数只会生成一个，建议显示设置该值
    }),
    postcss({
        // extract: true,
        extract: "css/style.css", //提取css文件
        minimize: true, //开启压缩
        plugins: [
            postcssPresetEvn(), //使用预设插件
        ],
    }),
    vue(),
];

// 生产环境才进行压缩
if (isProduction) {
    plugins.push(terser());
}

// 开发环境才开启本地服务
if (isDevelopment) {
    plugins.push(
        serve({
            open: true, //是否自动打开浏览器
            port: 8081,
            contentBase: ".", //服务哪个文件夹（取决于index.html所在的位置取决于index.html所在的位置，推荐放在根目录，需手动引入打包资源）
            // contentBase: "./dist",
        }),
        livereload({
            watch: "dist", //监听dist目录的变化
        })
    );
}

export default {
    input: "./src/main.js",
    output: {
        format: "umd", // 输出的文件类型
        name: "myUtils",
        file: "./dist/index.umd.js", //输出目录
    },
    external: ["lodash"],
    plugins,
};
```
