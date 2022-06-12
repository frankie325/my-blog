---
title: 类型守卫
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## typeof

```ts
function doSome(x: number | string) {
    if (typeof x === "string") {
        // 在这个块中，TypeScript知道x的类型一定是string
        console.log(x.slice());
        // console.log(x.toFixed(2)); //error   toFixed方法只存在与数字上
    }
}
```

## instanceof

```ts
class Foo {
    foo = "i am foo";
}
class Bar {
    bar = "i am bar";
}

function doStuff(arg: Foo | Bar) {
    if (arg instanceof Foo) {
        arg.foo;
        // arg.bar; //error
    } else {
        // TypeScript可以知道else块中，剩下的类型
        // arg.foo; //error
        arg.bar;
    }
}
```

## in

操作符可以安全的检查一个对象上是否存在一个属性，它通常也被作为类型保护使用

```ts
type inA = {
    a: number;
    toDoA: () => {};
};
type inB = {
    b: number;
    toDoB: () => {};
};

function doStu(arg: inA | inB) {
    if ("a" in arg) {
        arg.toDoA();
        // arg.toDoB(); //error
    } else {
        // arg.toDoA(); //error
        arg.toDoB();
    }
}
```

## 字面量类型保护

```ts
type Foo1 = {
    kind: "foo"; // 字面量类型
    foo: number;
};

type Bar1 = {
    kind: "bar"; // 字面量类型
    bar: number;
};

function doS(arg: Foo1 | Bar1) {
    // 可以通过使用字面量类型判断
    if (arg.kind === "foo") {
        //那么块里就会判断为Foo1类型
        arg.foo;
        // arg.bar; //error
    } else {
        // arg.foo; //error
        arg.bar;
    }
}
```

## 自定义类型守卫

通过{形参} is {类型}的语法结构，给函数赋予类型守卫的能力

```ts
function isStr(s: any): s is string {
    return typeof s === "string";
}

function toUpperCase(arg: string | number) {
    if (isStr(arg)) {
        // 当isStr返回true的时候，说明ts知道arg肯定就是string类型了，就不会报错了
        arg.toUpperCase();
    } else {
        arg.toString().toUpperCase();
    }
}
```
