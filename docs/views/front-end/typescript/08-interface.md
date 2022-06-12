---
title: 接口
date: "2022-6-12"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 接口

在面向对象语言中，接口（Interfaces）是一个很重要的概念，
它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念
除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

定义一个接口 Person，首字母一般大写

```ts
interface Person {
    name: string;
    age: number;
}
```

属性不能多也不能少，可见赋值的时候，变量的形状必须和接口的形状保持一致。

```ts
let tom: Person = {
    name: "Tom",
    age: 22,
};
```

### 只读属性|可选属性

```ts
interface Person1 {
    readonly name: string; //只读属性，不能修改
    age?: number; //可选属性，可以定义也可以不定义
}

let sam: Person1 = {
    name: "Sam",
};
// sam.name = "Tom";  //error

// TypeScript 还提供ReadonlyArray，确保数组创建后再也不能被修改
let readArr: ReadonlyArray<number> = [1, 2, 3];
// readArr[0] = 4; //error
```

### 任意属性

```ts
interface Person3 {
    name: string;
    age?: number;
    [propName: number]: any; //使用 索引签名 的形式
}
```

:::tip 提示
一旦定义了任意属性，那么确定属性和可选属性的值类型都必须是它的类型的子集
:::

```ts
interface Person3 {
    name: string;
    age: number; //error 必须是string或者string的子类型
    [propName: string]: string;
}
```

索引签名的 key 只支持字符串、数字、symbol 类型

```ts
interface Person3 {
    name: string;
    age: number;
    // [propName: boolean]: string; //error
}
```

## 接口约束

### 对数组的约束

```ts
interface myArray {
    [index: number]: string;
}

let myarr: myArray = ["1", "2", "3"];
// let myarr: myArray = [1, 2, 3]; //error
```

### 对方法的约束

```ts
interface myFun1 {
    (str: string): string;
}

let myfun1: myFun1 = (str: string) => {
    return str;
};
myfun1("1");
// myfun1(1); //error
```

### 对对象的约束

```ts
interface myObject {
    name: string;
    age: number;
}

let myobj: myObject = {
    name: "kfg",
    age: 12,
    // sex: "男", //error
};
```

### 对类进行约束

```ts
interface Animal1 {
    name: string;
    eat(str: string): number;
}

// 使用implements关键字
class Bird implements Animal1 {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    eat() {
        return 1;
        // return "str"; //error 需要保持和接口中的类型一样
    }
    run() {} // 可以声明接口中的不存在的属性和方法
}
```

## 接口的继承

接口也可以进行继承

```ts
interface Animal2 {
    eat(): void;
}

interface Animal3 extends Animal2 {
    run(): void;
}

// 必须同时实现两个接口中的方法
class Bird3 implements Animal3 {
    constructor() {}
    eat() {}
    run() {}
}
```

## 接口与类型别名的区别

-   都可以用来描述对象的形状或者函数的类型，但语法不同

```ts
interface Person4 {
    name: number;
}

type Person5 = {
    name: number;
};

interface Person6 {
    (name: string): void;
}
type Person7 = (name: string) => void;
```

-   类型别名还可以用于其他类型。如基本类型，联合类型等，但接口不是

```ts
type uni = string | number | null;
type tup = [number, string];
```

-   接口可以定义多次，会被自动合并为单个接口

```ts
interface Point1 {
    x: number;
}

interface Point1 {
    y: number;
}

let point1 = { x: 1, y: 1 };
```
