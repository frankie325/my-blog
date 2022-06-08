---
title: 声明文件
date: "2022-4-25"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

**为什么需要声明文件？**

假设我们用 ts 开发了一个 npm 库，经过编译打包之后发布到了 npm 上，其他用户下载了这个库都是 js 文件
我们使用 import 导入这个库的时候是无法获得代码提示的，ts 文件就会报错
