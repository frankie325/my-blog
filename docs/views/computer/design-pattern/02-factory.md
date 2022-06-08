---
title: 工厂模式
date: "2022-4-22"
sidebar: "auto"
categories:
    - 计算机相关
tags:
    - 设计模式
---

## 简单工厂模式

定义一个水果类，创建不同的水果

```ts
class Fruit {
    public name;
    constructor(name: string) {
        this.name = name;
    }
}

class Apple extends Fruit {
    public flavour: string;
    constructor(name: string, flavour: string) {
        super(name);
        this.flavour = flavour;
    }
}

class Orange extends Fruit {
    public flavour: string;
    constructor(name: string, flavour: string) {
        super(name);
        this.flavour = flavour;
    }
}

new Apple("apple", "甜");
new Orange("orange", "酸");
```

直接 new 有什么缺点

1.  耦合：跟客户端代码直接耦合，一旦对类进行修改，将会导致代码出错，违反开放封闭原则
2.  依赖具体实现：用户使用时，还需要知道类是怎么实现的才能够实用，违反依赖导致原则

**使用简单工厂模式**

我们把被创建的对象称为“产品”，把创建产品的对象称为“工厂”。如果要创建的产品不多，只要一个工厂类就可以完成，这种模式叫“简单工厂模式”。

不暴露创建对象的具体逻辑，而是将逻辑进行封装，隐藏实现，只需要调用即可，由工厂决定创建某一个类的实例

```ts
class Factory {
    static create(type: string) {
        switch (type) {
            case "apple":
                return new Apple("apple", "甜");
            case "orange":
                return new Orange("orange", "甜");
            default:
                throw new Error("你要的东西没有");
        }
    }
}

let apple = Factory.create("apple");
let orange = Factory.create("orange");
```

**优点：**

-   调用者创建对象时只要知道其名称即可
-   隐藏产品的具体实现，只关心产品的接口
-   扩展性高，如果要新增一个产品，扩展一个产品类即可

**缺点：**

-   每次新增一个产品时，都需要增加一个具体的产品类

## 工厂方法模式

工厂方法模式是对简单工厂模式的进一步抽象化

```ts
class Fruit {
    public name;
    constructor(name: string) {
        this.name = name;
    }
}

class Apple extends Fruit {
    public flavour: string;
    constructor(name: string, flavour: string) {
        super(name);
        this.flavour = flavour;
    }
}

class Orange extends Fruit {
    public flavour: string;
    constructor(name: string, flavour: string) {
        super(name);
        this.flavour = flavour;
    }
}

// 父级工厂一般是接口，规定子类必须实现的方法
class Factory {
    static create() {}
}

// 将简单工厂进一步抽象化，由工厂的名称就可以得到所要的产品，无须知道产品的具体创建过程
class AppleFactory extends Factory {
    static create() {
        return new Apple("apple", "甜");
    }
}

class OrangeFactory extends Factory {
    static create() {
        return new Orange("orange", "酸");
    }
}

// 只需要调用工厂方法，即可完成产品的创建
let apple = AppleFactory.create();
let orange = OrangeFactory.create();
```

**优点：**

-   用户只需要知道具体工厂的名称就可得到所要的产品，无须知道产品的具体创建过程
-   灵活性增强，对于新产品的创建，只需多写一个相应的工厂类
-   扩展性高，如果要新增一个产品，扩展一个产品类即可

**缺点：**

-   类的个数容易过多，增加复杂度
-   抽象工厂只能生产一种产品，此弊端可使用抽象工厂模式解决

## 抽象工厂模式

工厂方法模式中考虑的是一类产品的生产，如畜牧场只养动物、电视机厂只生产电视机，工厂方法模式只考虑生产同等级的产品，但是在现实生活中许多工厂是综合型的工厂，如农场里既养动物又种植物，电器厂既生产电视机又生产洗衣机或空调。

示例：

农场中除了像畜牧场一样可以养动物，还可以培养植物，如养马、养牛、种菜、种水果等，所以本实例比前面介绍的畜牧场类复杂，必须用抽象工厂模式来实现

```ts
// 抽象产品： 动物类
interface Animal {
    show(str: string): void;
}

// 具体产品: 马类
class Horse implements Animal {
    show() {
        console.log("i am horse");
    }
}

// 具体产品: 牛类
class Cattle implements Animal {
    show() {
        console.log("i am cattle");
    }
}
// 抽象产品：植物类
interface Plant {
    show(str: string): void;
}

// 具体产品: 水果类
class Fruit implements Plant {
    show() {
        console.log("i am apple");
    }
}

// 具体产品: 水果类
class Vegetables implements Plant {
    show() {
        console.log("i am vegetables");
    }
}

// 对工厂进行抽象，抽象工厂模式的结构同工厂方法模式的结构相似，不同的是其产品的种类不止一个
// 抽象工厂：农场类
interface Farm {
    createAnimal(): void;
    createPlant(): void;
}

// 每个工厂可以用来创建多个产品
// 具体工厂：A农场
class AFarm implements Farm {
    createAnimal(): Animal {
        return new Horse();
    }
    createPlant(): Plant {
        return new Fruit();
    }
}

// 具体工厂：B农场
class BFarm implements Farm {
    createAnimal(): Animal {
        return new Cattle();
    }
    createPlant(): Plant {
        return new Vegetables();
    }
}

let a = new AFarm();
a.createAnimal().show();
a.createPlant().show();

let b = new BFarm();
b.createAnimal().show();
b.createPlant().show();
```

**优点：**

-   抽象工厂可以保证用户始终只使用同一个产品的产品组

**缺点：**

-   ：当产品族中需要增加一个新系列的产品时，所有的工厂类都需要进行修改

## 总结

-   简单工厂模式：简单工厂负责返回产品的实例
-   工厂方法模式：多个工厂类，想要创建产品，需要先常见此工厂实例，在通过该工厂创建产品
-   抽象工厂模式：一个工厂可以创建多种产品
