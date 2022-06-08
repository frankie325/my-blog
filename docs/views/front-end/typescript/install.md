---
title: 安装typescript
date: "2022-1-17"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 安装 TypeScript

```
npm install typescript -g
```

## 验证 TypeScript

```
tsc -v
```

## 编译 TypeScript 文件

```
tsc helloworld.ts
```

如果是在项目中使用 TypeScript，需要创建`tsconfig.json`文件，输入命令自动创建

```
tsc --init
```

`tsconfig.json`的作用：

-   用于标识 TypeScript 项目的根路径。
-   用于配置 TypeScript 编译器。
-   用于指定编译的文件。
    等等

如果想要监听 ts 文件，可以在`tsconfig.json`文件所在目录执行监听命令，将会自动对 ts 文件进行编译

```
tsc --watch
```
