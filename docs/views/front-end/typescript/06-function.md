---
title: 函数
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 参数类型

```ts
function create1(name: string, age: number) {}
```

## 返回类型

:::warning 注意
如果函数返回的是字面量，那返回类型则为字面量类型
:::

```ts
function getSum(a: number, b: number): number {
    // 像这种情况也可以不需要添加返回类型
    // 因为会有编译器自动推断
    return a + b;
    // return "1"; //error 注意：如果函数返回的是字面量，那返回类型则为字面量类型
}
```

## 可选参数

:::warning 注意
可选参数后面不允许再出现必需参数
:::

```ts
function buildName(firstName: string, lastName?: string) {}

buildName("Tom");
buildName("Tom", "Cat");
```

## 函数声明

先利用 type 声明一个函数，两种方式

```ts
type myFun = (a: string) => string;
// 或者
type myFun = {
    (a: number): number;
};
```

再根据声明去实现这个函数，此时函数的参数和返回值可以不需要写类型声明了

```ts
let fun1: myFun = (name) => {
    // name.toFixed(1); //error
    return "my" + name;
};
```

## 函数重载

函数重载就是同一个函数，根据传递的参数不同，会有不同的表现形式

根据入参的类型，返回不同类型的值，如果类型声明很多，全都写在一起，会造成函数阅读体验不好，扩展性差，比如：

```ts
let obj = {
    num: 1,
    str: "1",
};

type pType = "image" | "audio";
function getMyData(params: number | pType): number | string {
    if (typeof params === "number") {
        return obj.num;
    } else {
        return obj.str;
    }
}
```

此时就可以使用函数重载

```ts
function getMyData(a: number): number; //入参是number类型则返回number类型的值
function getMyData(b: pType): string; //入参是pType类型则返回string类型的值
// let obj; //error
// 注意：中间不能有其余代码
function getMyData(params: number | pType) {
    if (typeof params === "number") {
        return obj.num;
    } else {
        return obj.str;
    }
}
```
