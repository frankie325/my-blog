---
title: 类型推断
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 变量自动推断

```ts
let anyVal; //推断为any类型
```

如果指定了初始值，且没有指定类型，则推断为初始值字面量类型拓宽后的类型

```ts
let str1 = "i am str1"; // 等价于 let str1 : string = "i am str";
str1 = "hello";
```

用 const 声明的变量，类型没有拓宽

```ts
const str2 = "i am str2"; // 等价于 const str2 : "i am str2" = "i am str2"， 类型为字面量类型
```

> 如果将 str2 赋值给 str3，那 str3 的类型拓宽为 string

```ts
let str3 = str2;
```

> 而如果显示的添加了类型，str5 的类型是不会拓宽为 string 的

```ts
const str4: "i am str4" = "i am str4";
let str5 = str4;
// str5 = "111"; //error
```

## 函数自动推断

返回类型能被 return 语句推断，如下：

```ts
function add(a: number, b: number) {
    return a + b;
}
let total = add(1, 2); //total推断为number类型
```

函数参数有默认值，也能进行推断

```ts
// 推断参数 b 的类型是number | undefined，返回值的类型也是数字
function add2(a: number, b = 1) {
    return a + b;
}
```

## 结构化

这些简单的规则也适用于结构化的存在（对象字面量）

```ts
const objectFoo = {
    a: 123,
};
// string类型不能赋值给number
// objectFoo.a = "123"; //error

// 数组同理
const arrFoo = [1, 2, 3];
// arrFoo[0] = "1";
```

## 解构

同样适用于解构

```ts
const objBar = {
    bar: "i am bar",
};
let { bar } = objBar;
// bar = 1; //error Type 'number' is not assignable to type 'string'.
```

示例:

```ts
type Vector3 = {
    x: number;
    y: number;
    z: number;
};

function getVec(vector: Vector3, axis: "x" | "y" | "z") {
    return vector[axis];
}

// let axis = "x"; //该变量拓宽为string类型，但是getVec的第二个形参接受的是字面量类型
const axis = "x"; //改成用const声明变量则成立
let vector = {
    x: 1,
    y: 2,
    z: 3,
};

getVec(vector, axis);
```
