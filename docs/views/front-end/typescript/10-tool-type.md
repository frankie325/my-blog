---
title: 工具类型
date: "2022-6-12"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 前置内容

### typeof

typeof 操作符可以用来获取一个变量声明或对象的类型

```ts
interface Per {
    name: string;
    age: number;
}

const per: Per = { name: "name", age: 22 };
type copyPer = typeof per; // 就是Per类型
const copyper: copyPer = { name: "copyName", age: 22 };
```

也可以得到函数的类型

```ts
function toArray(x: number): Array<number> {
    return [x];
}
// 也可以得到函数的类型
type Func = typeof toArray; // -> (x: number) => number[]
```

### keyof

该操作符可以用于获取某种类型的所有键，其返回类型是联合类型

```ts
interface Per1 {
    name: string;
    age: number;
}
type K1 = keyof Per1; // "name" | "age"
let p1: K1 = "name";
// let p1: K1 = "haha"; //error
```

keyof 数组类型

```ts
type K2 = keyof []; // "length" | "toString" | "pop" | "push" | "concat" | "join"  //数组也是个对象，数组的方法
let p2: K2 = "length";
// let p2: K2 = "splice";
```

> keyof 索引签名时，键为 string 类型会得到 string | number

```ts
type K3 = keyof { [x: string]: Per1 }; // string | number
let p3: K3 = 1;
```

### in

in 用来遍历类型

```ts
type Keys = "a" | "b" | "c";
type Obj = {
    [p in Keys]: any;
};
let objIn: Obj = {
    a: 1,
    b: 2,
    c: 3,
    // d: 2, //error
};
```

### extends

当我们使用泛型的时候不想太过灵活的情况下可以使用 extends

```ts
interface Lengthwise {
    length: number;
}

// 可以将其理解为对T的约束，T如果能够赋值给Lengthwise，则条件成立
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity<Lengthwise>({ length: 1 });
```

接口 Another 受到了 Lengthwise 的约束，则相同的属性必须是相同的类型或者子类型

```ts
interface Another extends Lengthwise {
    length: number; // 可以诶number或者 1 | 2 数字字面量类型
    age: string; //可以新增属性
}
```

### infer

infer 是推断的意思，其实就相当于是一个占位的符号，用 infer R 去给他占位，推断这里的是什么类型，则 R 就是什么类型

```ts
type Params<T> = T extends (...args: infer R) => any ? R : any;

type T0 = Params<() => string>; //因为没有传递参数，所以推断的类型就是[]，即T0的类型

type T1 = Params<(s: string) => string>; //推断得到类型为[string]
let t1: T1 = ["1"];
// let t1: T1 = ["1", "2"]; // error

type T2 = Params<(...args: number[]) => string>; //得到类型为number[]
let t2: T2 = [1, 2];
```

使用 infer 得到联合类型

```ts
type T3 = { name: string };
type T4 = { age: number };

type GetUnionT<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type UnionT = GetUnionT<{ a: (x: T3) => void; b: (x: T4) => void }>; //得到的类型为 T3 & T4 的联合类型
```

TypeScript 系统内置的类型 ReturnType，就是使用 infer 得到的

```ts
type ReturnTypeCopy<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
let rt: ReturnTypeCopy<() => string> = "111";
```

## 内置类型工具

### Partial

Partial 将类型的属性变成可选

**定义**

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

首先通过 keyof T 拿到 T 的所有属性名，然后使用 in 进行遍历，将值赋给 P
最后通过 T[P] 取得相应的属性值的类型

```ts
interface UserInfo {
    id: number;
    name: string;
}

type newUserInfo = Partial<UserInfo>;
/*
相当于变成
type newUserInfo = {
    id?: number;
    name?: string;
}
*/
let newUser1: newUserInfo = { id: 1 };
```

## Required

Required 将类型的属性变成必选
**定义**

> -?代表移除?这个标识符

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

```ts
interface Desc {
    id: number;
    desc?: string;
}

type NewDesc = Required<Desc>;

let desc: NewDesc = {
    id: 1,
    desc: "xxx",
};
```

## Readonly

Readonly 的作用是将某个类型所有属性变为只读属性

**定义**

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

## Pick

`Pick<T, K>`表示从 T 类型中挑出一些属性出来

**定义**

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

```ts
interface Todo {
    title: string;
    desc: string;
    completed: boolean;
}

type pTodo = Pick<Todo, "title" | "completed">;

let todo: pTodo = {
    title: "math",
    completed: true,
};
```

## Record

`Record<K, T>` 的作用是将 K 中所有类型作为键，T 作为值的类型。

**定义**

> keyof any 为 string | number | symbol，刚好就是对象的索引的类型所支持的三种类型

传入的 K 被约束为只能是这几种类型，K 只能是这三种类型或者这三种类型的联合类型

```ts
type Record<K extends keyof any> = {
    [P in K]: T;
};
```

```ts
interface PageInfo {
    title: string;
}

type Page = "home" | "about" | "contact";

let page: Record<Page, PageInfo> = {
    home: { title: "home" },
    about: { title: "home" },
    contact: { title: "home" },
    // a: {}, //error
};
```

## ReturnType

ReturnType 用来得到一个函数的返回值类型

**定义**

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
```

```ts
type Funct = (v: number) => string;
let foo: ReturnType<Funct> = "1"; //ReturnType得到的类型为string
```

## Exclude

`Exclude<T, U>` 的作用是将 T 和 U 相同的类型从 T 中移除掉。

**定义**

```ts
type Exclude<T, U> = T extends U ? never : T;
```

```ts
type E1 = Exclude<"a" | "b", "b" | "c">;
```

条件类型作用于泛型内，入参为联合类型（a|b）时。即 T 的类型，它们就会变成分布式的，相当于

```ts
type E1 = Exclude<"a", "b" | "c"> | Exclude<"b", "b" | "c">;
type E1 = "a" | never;
type E1 = "a";

let e1: E1 = "a";
// let e1: E1 = "b"; //error
```

## Extract

`Extract<T, U>` 的作用是从 T 中提取出和 U 相同的类型。

**定义**

```ts
type Extract<T, U> = T extends U ? T : never;
```

```ts
type E2 = Extract<"a" | "b", "b" | "c">;
```

相当于：

```ts
type E1 = Extract<"a", "b" | "c"> | Extract<"b", "b" | "c">;
type E1 = never | "b";
type E1 = "b";

// let e2: E2 = "a"; //error
let e2: E2 = "b";
```

## Omit

`Omit<T, K>` 的作用是从 T 类型中删除包含了 K 类型的属性。与 Pick 的作用相反

**定义**

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

```ts
interface ToDo1 {
    title: string;
    desc: string;
    completed: boolean;
}

type NewToDo1 = Omit<ToDo1, "desc">;

let todo1: NewToDo1 = {
    title: "todo1",
    completed: true,
};
```

## NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 null 及 undefined 类型。

**定义**

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

```ts
let none1: NonNullable<string | undefined | null> = "11";
// let none1: NonNullable<string | undefined | null> = null; // error
```

## Parameters

`Parameters<T>` 的作用是用于获得函数的参数类型组成的元组类型

**定义**

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

```ts
type FunA = Parameters<() => any>; // 为[]类型
type FunB = Parameters<(v: string) => any>; // 为[string]元祖类型
type FunC = Parameters<(...args: number[]) => any>; // 为number[]数组类型
```
