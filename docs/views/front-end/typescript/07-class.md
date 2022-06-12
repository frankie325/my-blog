---
title: 类的使用
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 类的使用

### 类里面的修饰符

-   public：在类里面、子类、累外面都可以访问
-   protected：：在类里面、子类里面可以访问，在类外部不可以访问
-   private：在类里面可以访问，子类、类外部不可以访问

:::tip 提示
属性如果不加修饰符，默认是 public
:::

```ts
class People {
    public name: string;
    protected sex: string;
    private age: number;
    constructor(name: string, sex: string, age: number) {
        this.name = name;
        this.sex = sex;
        this.age = age;
    }
    getAge(): number {
        return this.age; //私有属性，类里面可以访问
    }
}

let p = new People("kfg", "男", 22);
console.log(p.name);
// console.log(p.sex);     //error   受保护属性不能在类外部访问
// console.log(p.age);     //error   私有属性不能在类外部访问
```

```ts
class Man extends People {
    constructor(name: string, sex: string, age: number) {
        super(name, sex, age); //super作为函数，代表调用父类构造函数，必须写，不然报错
        // 因此super()在这里相当于People.prototype.constructor.call(this)。
    }
    getName() {
        return this.name;
    }
    getSex() {
        return this.sex;
    }
    getAge(): number {
        // return this.age;  //error   私有属性，不能在子类里面访问
        // 可以通过super调用父类的方法，在父类中可以对它的私有属性进行访问
        // 注意：在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例
        return super.getAge();
        // 从编译结果可以看出super就是People.prototype
    }

    // 静态属性和静态方法
    static id = "11";
    static sit() {}
}

let m = new Man("kfg", "男", 22);
// m.name;
// m.sex; //error   受保护属性不能在类外部访问
// m.age; //error   私有属性不能在类外部访问
m.getAge();
```

## 多态

多态就是一个基类（base class）可以有不同的派生类（derived class），不同的派生类有各自不同的行为

> 继承，接口，抽象类都是多态的多种表现形式

比如定义一个动物类，动物都有吃这个行为，但是不同种类喜欢吃的东西都不一样

```ts
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    eat() {}
}

class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }
    eat() {
        console.log("喜欢吃肉");
    }
}

class Sheep extends Animal {
    constructor(name: string) {
        super(name);
    }
    eat() {
        console.log("喜欢吃草");
    }
}
```

## 抽象类

抽象类并不会生成真正的类，它用来定义标准，所有继承它的类，都必须按照它的标准去实现

```ts
abstract class Human {
    // abstract skinColor: string;
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    // 抽象方法只能放在抽象类中
    // 抽象方法不包含具体实现，但在派生类中必须实现
    abstract work(): string;
}

class YellowPeople extends Human {
    // skinColor: string;
    constructor(name: string) {
        super(name);
    }
    work(): string {
        return "I am programmer";
    }
}
```
