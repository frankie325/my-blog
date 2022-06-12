---
title: 断言
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 类型断言

语法：

-   <类型>值
-   值 as 类型

因为 TypesScript 只在编译阶段起作用，无法判断运行时才执行的代码的类型，
而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法

```ts
function getLength(something: string | number): number {
    if (something.length) {
        //error 因为不能确定时string还是number类型，无法获取length
    } else {
        return something.toString().length; //error
    }
}
```

此时可以使用类型断言

```ts
function getLength(something: string | number): number {
    // 注意：类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的
    // <boolean>something;//error
    if ((<string>something).length) {
        return (something as string).length;
    } else {
        return something.toString().length;
    }
}
```

## 非空断言

当使用联合类型，无法断定类型时，在变量后添加!可以断言操作变量是非 null 和非 undefined 类型

```ts
let uns: null | undefined | string;
// uns.toString(); //error
uns!.length;
```

## 确定赋值断言

```ts
let x: number;
initialize();
console.log(x * 2); //error 错误是因为TypeScript认为变量 x 在赋值前被使用了，x还没有值
function initialize() {
    x = 10;
}
```

可以在变量后添加!，TypeScript 编译器就会知道该属性会被明确地赋值

```ts
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
    x = 10;
}
```
