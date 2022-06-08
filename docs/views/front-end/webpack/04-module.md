---
title: webpack模块化原理
date: '2022-1-14'
sidebar: 'auto'
categories:
 - 前端
tags:
 - webpack5
 - 模块化原理
---

先在webpack.config.js中添加如下属性，方便我们查看打包后的源码
```js
module.exports = {
    mode: "development",
    devtool: "source-map",
};
```

## CommonJs原理

入口文件：```commonJs_index```
```js
let { count, increase } = require("./js/count-CommonJS");

console.log(count);
increase();
console.log(count);

```

```js/count-CommonJS.js```文件
```js
let count = 1;

function increase() {
    count++;
}

exports.count = count;
module.exports.increase = increase;
// module.exports = {
//     count,
//     increase,
// };
```
打包后的源代码：
```js
(function () {
    /*
    定义了一个对象
    以模块路径为key
    以包裹模块内容的函数为value
    */
    var __webpack_modules__ = {
        "./src/js/count-CommonJS.js": function (module, exports) {
            let count = 1;

            function increase() {
                count++;
            }

            // 将我们导出的变量，放入到module对象中的exports 
            module.exports = {
                increase,
            };
            exports.count = count;
            // module.exports = {
            //     count,
            //     increase,
            // };
        },
    };

    // 定义一个对象，作为加载模块的缓存
    var __webpack_module_cache__ = {};

    // 是一个函数，当我们加载模块时，都会通过这个函数来加载
    function __webpack_require__(moduleId) {

        // 1.判断缓存是否已经加载过，如果加载过直接取缓存
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }

        // 2.给module变量和__webpack_module_cache__[moduleId]赋值了同一个对象
        var module = (__webpack_module_cache__[moduleId] = {
            exports: {},
        });

        // 3.加载执行模块，传入module对象 {  exports: {} }
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

        // 4.导出module.exports， {  exports: { dateFormat } }
        return module.exports;
    }

    var __webpack_exports__ = {};
    !function () {
        // 调用__webpack_require__，加载模块
        let { count, increase } = __webpack_require__(/*! ./js/count-CommonJS */ "./src/js/count-CommonJS.js");

        console.log(count);
        increase();
        console.log(count);
    }();
})();
//# sourceMappingURL=index.js.map

```

最外层是一个立即执行函数，定义了一个```__webpack_modules__```对象，以模块路径为key，以包裹模块内容的函数为value。
:::tip 提示
```!function(){}()```也是立即执行函数
:::
先看最后一部分，也就是入口文件的内容
```js
!function () {
        // 调用__webpack_require__，加载模块
        let { count, increase } = __webpack_require__(/*! ./js/count-CommonJS */ "./src/js/count-CommonJS.js");

        console.log(count);
        increase();
        console.log(count);
    }();
```
调用```__webpack_require__```方法，加载模块
```js
    // 定义一个对象，作为加载模块的缓存
    var __webpack_module_cache__ = {};

    // 是一个函数，当我们加载模块时，都会通过这个函数来加载
    function __webpack_require__(moduleId) {

        // 1.判断缓存是否已经加载过，如果加载过直接取缓存
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }

        // 2.给module变量和__webpack_module_cache__[moduleId]赋值了同一个对象
        var module = (__webpack_module_cache__[moduleId] = {
            exports: {},
        });

        // 3.加载执行模块，传入module对象 {  exports: {} }
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

        // 4.导出module.exports， {  exports: { dateFormat } }
        return module.exports;
    }
```
```__webpack_require__```方法的作用：
- 对模块导出的内容进行缓存
- 创建module对象 ```{  exports: {} }```，并调用模块在```__webpack_modules__```变量中对应的包裹函数，并传递```module```和```module.exports```作为参数

然后在执行的模块包裹函数中，将我们导出的变量，放入到```module.exports```，最后再返回```module.exports```，就是模块加载的结果。

<font color="red">**CommonJs模块导出的结果就是对导出的变量进行简单的拷贝**</font>，所以导出的```count```是不会随着```increase```的调用而增加的，模块内部值的改变不会影响```require```导出的值变化

```js
var __webpack_modules__ = {
        "./src/js/count-CommonJS.js": function (module, exports) {
            let count = 1;

            function increase() {
                count++;
            }

            // 将我们导出的变量，放入到module对象中的exports 
            module.exports = {
                increase,
            };
            exports.count = count;
            // module.exports = {
            //     count,
            //     increase,
            // };
        },
    };
```
:::warning 注意：
module.exports和exports是同一个对象，下面使用这种方式是不行的，对```module.exports```进行赋值，直接覆盖了之前的对象
:::

```js
        exports.count = count;
        module.exports = {
           increase,
        };
```

## esModule原理

入口文件：```esModule_index```
```js
import getDefault, { count, increase } from "./js/count-esModule";

getDefault();
console.log(count);
increase();
console.log(count);
```

```js/count-esModule.js```文件
```js
export default function getDefault() {
    return "default";
}

export let count = 1;

export function increase() {
    count++;
}
```
打包后的源代码：
```js
(function () {
    "use strict";
    /*
    定义了一个对象
    以模块路径为key
    以包裹模块内容的函数为value
    */
    var __webpack_modules__ = {
        "./src/js/count-esModule.js": function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            //调用r的目的是记录是一个esModule
            __webpack_require__.r(__webpack_exports__);
            // 调用d给exports对象做一层代理
            __webpack_require__.d(__webpack_exports__, {
                default: function () {
                    return /* binding */ getDefault;
                },
                count: function () {
                    return /* binding */ count;
                },
                increase: function () {
                    return /* binding */ increase;
                },
            });

            function getDefault() {
                return "default";
            }
            
            let count = 1;

            function increase() {
                count++;
            }
        },
    };

    // 定义一个对象，作为加载模块的缓存
    var __webpack_module_cache__ = {};

    // 是一个函数，当我们加载模块时，都会通过这个函数来加载
    function __webpack_require__(moduleId) {
        // 1.判断缓存是否已经加载过，如果加载过直接取缓存
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        // 2.给module变量和__webpack_module_cache__[moduleId]赋值了同一个对象
        var module = (__webpack_module_cache__[moduleId] = {
            exports: {},
        });

        // 3.加载执行模块，传入module对象 {  exports: {} }
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

        // 4.导出module.exports， {  exports: { sum, mul } }
        return module.exports;
    }

    !function () {
        // __webpack_require__函数对象上添加一个属性：d -> 值function
        __webpack_require__.d = function (exports, definition) {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    // exports对象上做了一层代理，严格模式下无法对export中的属性进行赋值操作
                    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                }
            }
        };
    }();

    !function () {
        // __webpack_require__函数对象上添加一个属属性：o -> 值function
        // 判断对象是否有指定的属性
        __webpack_require__.o = function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };
    }();

    !function () {
        // __webpack_require__函数对象上添加一个属性：r -> 值function
        // 作用是为exports添加属性，说明是一个esModule
        __webpack_require__.r = function (exports) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
            }
            Object.defineProperty(exports, "__esModule", { value: true });
        };
    }();

    var __webpack_exports__ = {};

    !function () {
        // 调用__webpack_require__，加载模块
        __webpack_require__.r(__webpack_exports__);
        var _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/count-esModule */ "./src/js/count-esModule.js");

        (0, _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__["default"])();
        console.log(_js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.count);
        (0, _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.increase)();
        console.log(_js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.count);
    }();
})();
//# sourceMappingURL=index.js.map

```
整体部分与```CommonJs```是差不多的，区别就在于模块包裹函数内的具体实现不同了，通过调用``` __webpack_require__.d```对```exports```对象进行了一层代理，<font color="red">**因为使用了严格模式，所以导出的exports对象变成了一个只读对象，等到脚本真正执行时，再根据这个只读引用到模块中进行取值。换句话说，就是模块中的原始值变了，```import```导入的值也会跟着变**</font>。
```js
    !function () {
            // __webpack_require__函数对象上添加一个属性：d -> 值function
            __webpack_require__.d = function (exports, definition) {
                for (var key in definition) {
                    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        // exports对象上做了一层代理，严格模式下无法对export中的属性进行赋值操作
                        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    }
                }
            };
    }();
```
可以将上述代码简化成下面的形式
```js
function example(){
    "use strict";
    let count = 1;

    function increase(){
        count++;
    }
    let exports = {}
    Object.defineProperty(exports, "count", { enumerable: true, get: ()=> count});
    Object.defineProperty(exports, "increase", { enumerable: true, get: ()=> increase});
    return exports
}

let obj = example()
console.log(obj.count)  // 输出1
obj.increase()
console.log(obj.count)  // 输出2

const { count, increase } = example()
console.log(count)      // 输出1
increase()
console.log(count)      // 输出1
```
可能有的同学会问，为什么解构之后```count```数值没有变化？  
因为解构之后```count```已经不是指向模块内的```count```了，相当于重新赋值```const count = example().count```，自然不会随着increase的调用而变化。  
这也是为什么我们在```import```导入时使用了解构，但编译后的源码中并没有使用解构，而是使用```_js_count_esModule__WEBPACK_IMPORTED_MODULE_0__```变量进行取值调用。
```js
    !function () {
        // 调用__webpack_require__，加载模块
        __webpack_require__.r(__webpack_exports__);
        var _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/count-esModule */ "./src/js/count-esModule.js");

        (0, _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__["default"])();
        console.log(_js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.count);
        (0, _js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.increase)();
        console.log(_js_count_esModule__WEBPACK_IMPORTED_MODULE_0__.count);
    }();
```