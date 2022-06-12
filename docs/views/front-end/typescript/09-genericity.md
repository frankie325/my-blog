---
title: 泛型
date: "2022-6-12"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 泛型

泛型是允许同一个函数接受不同类型参数的一种模板。
相比于使用 any 类型，使用泛型来创建可复用的组件要更好，因为泛型会保留参数类型

示例：假如实现一个函数 identity，函数的参数可以是任何值，返回值就是将参数原样返回，并且其只能接受一个参数

可以使用 any 实现，但是这样就丧失了类型检查的效果

```ts
function identity(arg: any): any {
    return arg;
}
```

使用泛型就没有这个问题

```ts
function identity<T>(value: T): T {
    return value;
}

// 这个 T 是一个抽象类型，只有在调用的时候才确定它的值
identity<number>(1.1111).toFixed(2);
identity(2.1111).toFixed(2); //也可以不显示指定，编译器足够聪明，能够知道我们的参数类型
```

## 泛型接口

1. 方式一

```ts
interface configFun1 {
    <T>(value: T): T;
}

let getData1: configFun1 = function (value) {
    return value;
};
// 调用的时候指定泛型类型
getData1<number>(1);
```

2. 方式二

```ts
interface configFun2<T> {
    (value: T): T;
}

function getData2<T>(value: T): T {
    return value;
}
// 赋值的时候指定泛型类型
let getData: configFun2<string> = getData2;
getData("11");
// getData(11); //error
```

## 泛型参数默认类型

```ts
interface Name<T = string> {
    name: T;
}

let myName1: Name = {
    name: "kfg",
    // name: 111,  //没有指定泛型类型时，默认是string
};

let myName2: Name<number> = {
    name: 666,
};
```

## 泛型条件类型

泛型条件类型一般与泛型工具 extends 关键字一起使用

下面代码的意思是：传入的类型如果是 any 的子类型，则返回该类型，否则返回 any 类型，当然这样写没有意义，只是介绍用法

```ts
type GetType<T> = T extends any ? T : any;

let getT1: GetType<string> = "1";
// let getT2: GetType<string> = 1; //error
```

## 泛型类

-   比如有个最小堆算法，需要同时支持返回数字和字符串两种类型。通过泛型类实现

```ts
class minClass<T> {
    list: T[] = [];
    add(v: T): void {
        this.list.push(v);
    }

    min(): T {
        let minNum = this.list[0];
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i] < minNum) {
                minNum = this.list[i];
            }
        }
        return minNum;
    }
}

let m1 = new minClass<number>(); //实例化类，并且指定了T代表的类型是number
m1.add(2);
m1.add(1);
m1.add(3);
console.log(m1.min());

let m2 = new minClass<string>();
m2.add("a");
m2.add("b");
m2.add("c");
console.log(m2.min());
```

-   把类作为参数约束数据传入的类型

示例： 定义一个 User 类，作用是映射数据库字段，然后定义一个 MysqlDb 类，用来操作数据库，然后把 User 类作为参数传到 MysqlDb 中

```ts
class User {
    username: string | undefined;
    password: string | undefined;
}

class MysqlDb {
    add(user: User): boolean {
        console.log(user);
        return true;
    }
}

let user1 = new User();
user1.username = "张三";
user1.password = "123456";

let db1 = new MysqlDb();
db1.add(user1);
```

操作数据库的泛型类，使用泛型，操作不同结构的数据对象

```ts
class MysqlDb<T> {
    add(user: T): boolean {
        console.log(user);
        return true;
    }
}

class User {
    username: string | undefined;
    password: string | undefined;
}

let user1 = new User();
user1.username = "张三";
user1.password = "123456";

let db1 = new MysqlDb<User>();
db1.add(user1);

class Article {
    title: string;
    desc: string;
    status: number;
    constructor(title: string, desc: string, status: number) {
        this.title = title;
        this.desc = desc;
        this.status = status;
    }
}

let art = new Article("分类", "111", 1);
let db2 = new MysqlDb<Article>();
db2.add(art);
```
