---
title: 命名空间
date: "2022-4-25"
sidebar: "auto"
categories:
    - 前端
tags:
    - TypeScript
---

## 命名空间

随着边量或者接口类型的增多，为了避免都在全局命名空间产生命名冲突，我们可以将部分相关功能放在一个命名空间中，使用 namespace 关键字进行声明

:::tip 提示
ts 不建议再用 namespace 来解决命名冲突的问题，而是推荐使用 ES6 的模块化解决
:::

1. 使用命名空间

当变量重复时，我们可以使用命名空间

```ts
namespace One {
    // function sum(a: number, b: number): number {
    //     return a + b;
    // }
    console.log(sum(1, 1));
}

namespace Two {
    function sum(a: number, b: number): number {
        return a + b;
    }

    console.log(sum(2, 2));
}
```

2. 导出内部变量，可以在外部使用

```ts
namespace One {
    // function sum(a: number, b: number): number {
    //     return a + b;
    // }
    // 如果想要在命名空间外部使用，则需要进行导出
    export function sum(a: number, b: number): number {
        return a + b;
    }
}
console.log(One.sum(4, 4));
```

3. 嵌套使用命名空间，并且也可以进行命名空间的导出

```ts
namespace One {
    // 也可以嵌套使用命名空间
    export namespace Three {
        export function sum(a: number, b: number): number {
            return a + b;
        }
    }
    console.log(Three.sum(3, 3));
}

console.log(One.Three.sum(4, 4));
```

4. 不同文件命名空间的导出

```ts
// a.ts
export namespace utils {
    export function add(a: number, b: number) {
        return a + b;
    }
}
```

```ts
// b.ts
import { utils } from "./a.ts";
console.log(utils.add(100, 100));
```

如果使用默认导出要分开写

```ts
namespace utils {
    export function add(a: number, b: number) {
        return a + b;
    }
}

export default utils;
```

5. 命名空间不仅可以用在逻辑代码中, 也可以用在类型, 用来给类型分组:

```ts
namespace Five {
    export interface Axis {
        x: number;
        y: number;
    }
}

let axis: Five.Axis;
axis = {
    x: 1,
    y: 2,
};
```

6. 将拆分到不同文件夹的命名空间，进行合并

```ts
// a.ts
namespace Food {
    export interface Fruits {
        taste: string;
        hardness: number;
    }
}
```

使用三斜线指令引入

```ts
/// <reference path="./a.ts" />
// b.ts
namespace Food {
    export interface Vegetables {
        title: string;
        heat: number;
    }
}

let f: Food.Fruits = {
    taste: "甜",
    hardness: 20,
};
```
