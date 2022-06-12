---
title: TypeScript中的类型
date: "2022-6-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 基本类型

### Boolean 类型

Boolean 类型，只能赋值为 true 和 false

```ts
let isBl: boolean = false;
```

### Number 类型

Number 类型，只能赋值为数字

```ts
let isNumber: number = 1;
```

### String 类型

String 类型，只能赋值为字符

```ts
let isString: string = "i am string";
```

### BigInt 类型

BigInt 类型，ES2020 才支持

> tsconfig 文件中 target 需要进行设置

```ts
let isBI: bigint = 100n;
```

### null 和 undefined 类型

严格模式下是不允许将 null 和 undefined 赋值给其他类型变量

可以设置 tsconfig 文件中 strictNullChecks 为 false，就可以赋值给其他类型变量了，所以非严格模式下 null 和 undefined 可以赋值给任意类型

```ts
let n: null = null;
let u: undefined = undefined;

// strictNullChecks:false，则可以赋值给任意类型
let a: string = null;
```

### Any 类型

any 类型为系统顶级类型，任何类型都可以进行赋值

```ts
let unsure: any = 666;
unsure = "str";
// 变量如果在声明的时候，未指定其类型，那么它会被自动识别为any类型：
let something;
// any类型的变量也可以赋值给其他类型变量
let str: string = unsure;
let num: number = unsure;
```

### UnKnown 类型

unknown 类型也为系统的另一种顶级类型，任何类型都可以进行赋值

```ts
let unk: unknown = "i am unknown";
let unArr: unknown = [1, 2, 3];
// 不能调用属性和方法
// unArr.length;  //error
// unArr.slice(1)  //error
```

但是 unknown 类型只能赋值给 any 类型或者是自己，它只可以被赋值，不能将自己赋值给其他类型

```ts
let val1: any = unk;
let val2: unknown = unk;
```

### Void 类型

void 表示没有任何类型，和其他类型是平等关系，不能直接赋值（undefined 除外）

```ts
let vo: void;
vo = undefined;
// vo = 1; //error
```

一般在当函数没有返回值时，定义成 void 类型，表示函数正确执行完毕

```ts
function fun(): void {}
```

### Never 类型

never 类型表示的是那些永不存在的值的类型，[TypeScript 中的 never 类型具体有什么用](https://www.zhihu.com/question/354601204)

-   函数抛出了异常，那么这个函数永远不存在返回值

> 当然也可以不写 never，但是我们希望能够获得编译器完整性检查

```ts
function err(msg: string): never {
    throw new Error(msg);
}
```

-   函数中执行死循环代码

```ts
function loopfun(): never {
    while (true) {}
}
```

never 不接受任何类型的赋值

> tsconfig 中需要 strictNullChecks 设置为 false，本身类型才可以赋值

```ts
// let nev: never = 111; //error
let nev1: never;
let nev2: never;
//tsconfig 中需要 strictNullChecks 设置为 false，本身类型才可以赋值
// nev1 = nev2; // error
```

strictNullChecks 设置为 false 时，never 类型可以是所有类型的子类型，可以赋值给任何类型的值

```ts
let num1: number = nev1;
let str1: string = nev1;
```

### Array 类型

设置数组的类型

```ts
let arr1: string[] = ["1", "2"];
// 或者
let arr2: Array<number> = [1, 2]; // Array<number>泛型语法
```

### Tuple 类型

当数组中由不同类型的值组成时，可以使用元组类型

```ts
let tup: [string, boolean] = ["str", true];
```

### 小 object 类型

表示为不接受原始类型，即引用类型都可以

```ts
// let obj1: object = 1; //error
let obj2: object = {};
let obj3: object = [];
let obj4: object = new String("111");
// let obj5: object = null;  //error
// let obj6: object = undefined; //error
// obj2.prop = "11"; //error
```

### 大 Object 类型

表示所有 Object 类实例的类型，所以所有原始类型、非原始类型都可以赋给

```ts
let bigObj1: Object = 1;
let bigObj2: Object = "1";
let bigObj3: Object = [1, 2];
let bigObj4: Object = () => {};
// let bigObj5: Object = null; //error
// let bigObj6: Object = undefined; //error
let bigObj7: Object = {};
// bigObj7.prop = "111"; //error
```

### {}类型

{}空对象类型和大 Object 一样，也是表示原始类型和非原始类型的集合

```ts
let eptObj1: {} = {
    name: "kfg",
};
// eptObj1.name;
```

仍然可以访问在 Object 类型上定义的所有属性和方法，这些属性和方法可通过 JavaScript 的原型链隐式地使用

```ts
let eptObj4: {} = 1;
eptObj4.toString;
eptObj4.toString();
```

> {}、大 Object 是比小 object 更宽泛的类型（least specific），
> {} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和非原始类型；
> 而小 object 则表示非原始类型。

## 枚举类型

### 数字枚举

Up 使用初始化为 1，默认为 0。 其余的成员会从 1 开始自动增长。 换句话说， Direction.Up 的值为 1， Down 为 2， Left 为 3， Right 为 4。

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
let dirName = Direction.Up;
let dirValue = Direction[1];
```

从编译结果可以看出，数字枚举除了支持从名称到值映射外，还支持值到名称的反向映射

```js
var Direction;
(function (Direction) {
    Direction[(Direction["Up"] = 1)] = "Up";
    Direction[(Direction["Down"] = 2)] = "Down";
    Direction[(Direction["Left"] = 3)] = "Left";
    Direction[(Direction["Right"] = 4)] = "Right";
})(Direction || (Direction = {}));
```

### 常量枚举

常量枚举，使用 const 关键字声明

区别就在于经过编译并不会生成 javascript 代码，且不能够双向映射

```ts
const enum Directions {
    Up = 2,
    Down = Up * 2,
    Left = 4,
    Right,
}

Directions[Up];
// Directions[2] // error
```

### 字符串枚举

不支持双向映射

```ts
enum Direction2 {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
}
```

### 联合枚举

数字与字符串混合

```ts
enum Joint {
    A,
    B = "b",
    c = 3,
}

let j = [Joint.A];
```

从编译结果可以看出，联合类型的数字才支持双向映射

```js
var Joint;
(function (Joint) {
    Joint[(Joint["A"] = 0)] = "A";
    Joint["B"] = "b";
    Joint[(Joint["c"] = 3)] = "c";
})(Joint || (Joint = {}));
var j = [Joint.A];
```

## 字面量类型

### 字符串字面量类型

可以使用一个字符串字面量作为变量的类型

```ts
let hello: "hello" = "hello";
// hello = "hi"; //error
```

字符串字面量类型是 string 类型的子类，字符串字面量类型可以赋值给 string 类型，但是反过来就不行了。数字，布尔同理

```ts
let _str: string;
_str = hello;
// hello = _str; //error
```

实际上，定义单个的字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型

```ts
type Dir = "up" | "down";
function move(dir: Dir) {}

move("up");
// move("right"); //error
```

### 数字字面量类型

```ts
let helloNum: 1 | 2;
helloNum = 1;
helloNum = 2;
// helloNum = 3; //error
```

### 布尔字面量类型

```ts
let helloBool: true | false; //与直接使用:boolean没有区别
helloBool = true;
helloBool = false;
```

### 对象字面量

```ts
const point: { x: number; y: number } = { x: 0, y: 0 };
```

## 联合类型

联合类型表示取值可以是多种类型中的一种，使用 `|` 分隔每个类型

```ts
let myfavor: string | number;
myfavor = "six";
myfavor = 6;
```

也可以是联合字面量类型

```ts
let myNum: 1 | "str" = 1;
```

## 类型别名

使用 `type SomeName = ..` 来创建别名

```ts
type StrOrNum = string | number;

let sample: StrOrNum;
sample = 1;
sample = "2";
// sample = true; //error
```

## 交叉类型

交叉类型时将多个类型合并为一个类型，通过 `&` 符连接

```ts
// Point 类型为 X 类型和 Y 类型的联合
type X = { x: number };
type Y = { y: number };
type Point = X & Y;
let point: Point = { x: 1, y: 2 };
```

:::warning 注意
如果把原始类型，字面量类型等原子类型，进行联合是没有意义的
:::

```ts
// 比如string和number，没有既是字符又是数字的值，因此类型会被转化为never
type useless = string & number;
// let unUse: useless = 1; //error
```

1. 同名属性时，基础类型的合并

```ts
interface A {
    a: number;
    c: string;
}

interface B {
    b: number;
    c: number;
}

type AB = A & B;
let ab: AB;
```

上面的接口 A 和接口 B 中，包含一个相同的属性 c，此时 AB 类型中是否的 c 是不是既可以是 string 类型也可以是 number 类型呢？

c 的类型合并后变成 string & number，所以其实 c 的类型是 never

```ts
ab = {
    a: 1,
    b: 1,
    c: 1, //error
};
```

2. 同名属性时，非基础类型的合并

```ts
interface D {
    d: boolean;
}
interface E {
    e: string;
}
interface F {
    f: number;
}

interface H {
    x: D;
}
interface I {
    x: E;
}
interface J {
    x: F;
}
```

属性 x 联合时，为非基础类型，就可以合并

```ts
type HIJ = H & I & J;
let hij = {
    x: {
        d: true,
        e: "e",
        f: 1,
    },
};
```

3. 同名属性时，基础类型和字面量类型的合并

如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，并后就是两者中的子类型，即数字字面量类型

```ts
type Mix = { id: number } & { id: 1 };
let myId: Mix = { id: 1 };
```
