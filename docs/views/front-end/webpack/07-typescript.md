---
title: webpack使用TypeScript和ESlint
date: "2022-1-17"
sidebar: "auto"
categories:
    - 前端
tags:
    - webpack5
---


## 安装`typescript`

### 方式一 `ts-loader`

- 如果全局安装了`typescript`
```
npm link typescript
```
- 或者直接在项目上安装
```
npm install typescript -D
```


安装 `ts-loader`
```
npm install ts-loader -D
```

在项目根目录创建`tsconfig.json`，输入命令自动创建
```
tsc --init
```
在`webpack.config.js`配置`ts-loader`
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
        ],
    },
};
```

### 方式二 `@babel/preset-typescript`
直接使用`ts-loader`，无法进行`polyfill`，我们可以使用`babel`的预设`@babel/preset-typescript`。

安装 `@babel/preset-typescript`
``` 
npm install @babel/preset-typescript -D
```

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                // 本质上依赖于typescript，还需在项目上安装typescript
                // 方式一：
                // use:["ts-loader"],
                // 直接使用ts-loader，无法进行polyfill，使用babel的预设@babel/preset-typescript
                // 方式二：
                use: ["babel-loader"],
            },
        ],
    },
}
```
在`babel.config.js`设置`@babel/preset-typescript`
```js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                // useBuiltIns: false,//不使用Polyfill
                // useBuiltIns: "entry",//使用Polyfill，需要在入口文件中引入core-js/regenerator-runtime
                useBuiltIns: "usage", //使用Polyfill，代码中需要那些polyfill，就引用相关api
                corejs: 3, //Polyfill默认使用corejs的版本为2，但是安装的是3的版本，会报错，所以指定为使用3的版本
            },
        ],
        ["@babel/preset-typescript"],
    ],
};
```

### 选择 `ts-loader` 还是 `@babel/preset-typescript`
使用`ts-loader`：
- 无法进行 `polyfill`
- 打包时能够进行ts语法进行校验

使用`@babel/preset-typescript`：
- 可以实现 `polyfill`
- 但是在打包过程中，不会对错误进行检测

官网推荐使用 `@babel/preset-typescript`，想要在开发时实现ts错误校验，可以在```package.json```中进行设置监听项目中ts文件。  
在命令行输入`npm run type-check-watch`开启监听
- ```--noEmit```：不会自动生成转译后的js文件
- ```--watch```：开启监听
```js
{
    "scripts": {
        "type-check-watch": "tsc --noEmit --watch"
    },
}
```

## 认识ESLint

什么是`ESLint`?
- `ESLint`是一个静态代码分析工具，可以帮助我们在项目中建立统一的代码规范，保持正确、统一的代码风格，提高代码的可读性、维护性。
- 并且`ESLint`的规则是可配置的，可以定义属于自己的规则。

### 安装 `ESLint`
```
npm install eslint -D
```

执行初始化命令，创建`.eslintrc.js`文件，进行配置。
```
npx eslint --init
```
执行完命令后，会跳出许多提问关于需要`ESLint`的哪些功能，根据你回答的答案，会自动在`.eslintrc.js`文件生成不同的配置信息。
```
√ How would you like to use ESLint? · style
√ What type of modules does your project use? · none
√ Which framework does your project use? · vue
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
√ How would you like to define a style for your project? · guide
√ Which style guide do you want to follow? · airbnb
√ What format do you want your config file to be in? · JavaScript
```
得到的`.eslintrc.js`文件配置信息
```js
module.exports = {
    "env": {
        "browser": true, // 监测代码运行在什么环境下
        "es2021": true   //支持ES2021的语法
    },
    // 继承这些插件的规则
    "extends": [
        "plugin:vue/essential",
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaVersion": "latest", 
        // "parser": "@typescript-eslint/parser" // 默认使用espree编译器对js解析，选择了支持ts的话，为解析ts的编译器
    },
    // 插件
    "plugins": [
        "vue",
        // "@typescript-eslint"
    ],
    // 自定义js相关规则
    "rules": {
    }
}
```
执行```npx eslint ./src/index.js```命令，选择校验的js文件，如果不符合配置规则，就会在命令行界面报错。

自定义规则配置，更多配置信息，请查看官网:point_right:[eslint配置规则](https://eslint.org/docs/rules/)
```js
{
     // 自定义js相关规则
    rules: {
        // 严重程度
        // 0 => off    关闭警告
        // 1 => warn   显示黄色警告
        // 2 => error  显示红色警告
        "no-unused-vars": 0, //关闭变量声明但未使用的报错
        quotes: [
            "error", //严重程度
            "double", //使用双引号包裹字符
        ],
        "linebreak-style": ["error", "windows"], //使用widows的行结束符\r\n
    },
}
```

### webpack中使用 `ESLint`
安装`eslint-loader`
```
npm install eslint-loader -D
```
在`webpack.config.js`配置
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/, //第三方库中可能使用了polyfill，和babel可能会产生冲突，进行排除
                use: ["babel-loader", "eslint-loader"], //注意顺序
            },
        ],
    },
}
```

## VSCode安装ESlint插件

使用`eslint-loader`只能在打包过程中或者启动本地服务时才能报错，如果想要在开发代码时，有错误提示，需要在编辑器安装`ESlint`插件。

### `ESlint`
去插件市场安装`ESlint`，安装好后，该插件会自动根据项目中的`.eslintrc.js`文件配置，对文件内容进行校验，不符合配置规则的地方，会添加上红色波浪线显示错误。

### `Prettier - Code formatter`
另一款插件是`Prettier - Code formatter`，也是一款代码美化工具，可以结合`ESlint`使用。
在项目根目录创建`.prettierrc.js`文件，并写入配置规则，在文件中使用快捷键`shift + alt + f`即可格式化代码。
```js
// prettier.config.js or .prettierrc.js
module.exports = {
  trailingComma: "es5",  //尾随逗号，其中在ES5（对象，数组等）中有效
  tabWidth: 4, //指定代码缩进时的空格数
  semi: false, //是否显示句尾的分号
  singleQuote: false, //是否使用单引号
};
```