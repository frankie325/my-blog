---
title: Promise/A+实现
date: "2022-4-19"
sidebar: "auto"
categories:
    - 前端
tags:
    - JavaScript
---

:point_right: [Promise/A+规范](https://www.ituring.com.cn/article/66566)

## 实现同步执行

1. 首先实现最简单的效果：只有同步执行

```js
class MyPromise {
    constructor(executor) {
        this.state = "pending";
        this.value = undefined;
        this.reason = undefined;

        // 当多次执行resolve或者执行reject时，只有第一次会生效
        if (this.state === "pending") {
            let resolve = (value) => {
                // 用户调用resolve时改变状态为fullFilled
                this.state = "fullFilled";
                this.value = value;
            };
        }

        // 用户调用reject时改变状态为rejected
        if (this.state === "pending") {
            let reject = (reason) => {
                this.state = "rejected";
                this.reason = reason;
            };
        }

        executor(resolve, reject);
    }

    then(onFullFilled, onRejected) {
        // 当调用then方法时，因为是同步，所以状态已经改变
        if (this.state === "fullFilled") {
            onFullFilled(this.value); // 执行then传入的回调，并将结果传入回调
        }

        if (this.state === "rejected") {
            onRejected(this.reason);
        }
    }
}
```

执行同步

```js
let p1 = new MyPromise((resolve, reject) => {
    resolve(1);
});

p1.then((res) => {
    console.log(res);
});
```

## 异步的处理

2. 再加入异步的处理

当处理异步时，then 方法内传入的回调不能立即执行，所以先暂时将回调存起来，等到异步任务完成之后，再进行调用

```js
class MyPromise {
    constructor(executor) {
        this.state = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onFullFilledCallback = [];
        this.onRejectedCallback = [];

        if (this.state === "pending") {
            let resolve = (value) => {
                this.state = "fullFilled";
                this.value = value;
                this.onFullFilledCallback.forEach((fn) => fn());
            };
        }

        if (this.state === "pending") {
            let reject = (reason) => {
                this.state = "rejected";
                this.reason = reason;
                this.onRejectedCallback.forEach((fn) => fn());
            };
        }

        executor(resolve, reject);
    }

    then(onFullFilled, onRejected) {
        if (this.state === "fullFilled") {
            onFullFilled(this.value);
        }

        if (this.state === "rejected") {
            onRejected(this.reason);
        }

        // 有异步处理时，当调用then时，state还是pending，先将then传入的回调暂存在数组中（存到数组是因为同一个Promise实例可能会多次调用then）
        if (this.state === "pending") {
            this.onFullFilledCallback.push(() => {
                //包装一下回调
                onFullFilled(this.value);
            });

            this.onRejectedCallback.push(() => {
                onRejected(this.reason);
            });
        }
    }
}
```

当同一个 Promise 实例多次调用 then 时，需要将回调存到数组中

```js
p1.then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log(err);
    }
);

p1.then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log(err);
    }
);
```

## then 链式调用

3. 因为执行 then 方法后可以进行链式调用，说明 then 返回的是一个新的 Promise

then 返回一个新的 Promise，而这个新的 Promise 状态取决于 then 处理的 Promise 传递的状态

```js
class MyPromise {
    constructor(executor) {
        this.state = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onFullFilledCallback = [];
        this.onRejectedCallback = [];

        if (this.state === "pending") {
            let resolve = (value) => {
                this.state = "fullFilled";
                this.value = value;
                this.onFullFilledCallback.forEach((fn) => fn());
            };
        }

        if (this.state === "pending") {
            let reject = (reason) => {
                this.state = "rejected";
                this.reason = reason;
                this.onRejectedCallback.forEach((fn) => fn());
            };
        }
        executor(resolve, reject);
    }

    then(onFullFilled, onRejected) {
        let x;

        let p = new MyPromise((resolve, reject) => {
            // then继续返回一个Promise，则之前的代码，挪到新创建的Promise里

            // ******同步执行的代码******
            if (this.state === "fullFilled") {
                x = onFullFilled(this.value); //上一个Promise返回的结果
                resolve(x); //再执行then内返回Promise的resolve方法
            }

            if (this.state === "rejected") {
                x = onRejected(this.reason);
                reject(x);
            }

            if (this.state === "pending") {
                this.onFullFilledCallback.push(() => {
                    x = onFullFilled(this.value); //当上一个Promise异步执行完后，拿到then回调返回的值
                    resolve(x); //传递给then返回的Promise
                });

                this.onRejectedCallback.push(() => {
                    x = onRejected(this.reason);
                    reject(x);
                });
            }
            // ******同步执行的代码******
        });

        return p;
    }
}
```

链式调用

```js
let p2 = p1.then(
    (res) => {
        console.log("p1", res);
        return res;
    },
    (err) => {
        console.log("p1", err);
        return err;
    }
);

p2.then(
    (res) => {
        console.log("p2", res);
    },
    (err) => {
        console.log("p2", err);
    }
);
```

## then 回调里返回 Promise

如果 then 回调里返回的是 Promise，那么 then 方法返回的 Promise 状态将取决于 then 回调返回的 Promise 所传递的状态

```js
class MyPromise {
    constructor(executor) {
        this.state = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onFullFilledCallback = [];
        this.onRejectedCallback = [];

        let resolve = (value) => {
            // 如果resolve传递的是Promise
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }

            if (this.state === "pending") {
                //当多次执行resolve或者执行reject时，只有第一次会生效
                this.state = "fullFilled";
                this.value = value;
                this.onFullFilledCallback.forEach((fn) => fn());
            }
        };
        let reject = (reason) => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }

            if (this.state === "pending") {
                this.state = "rejected";
                this.reason = reason;
                this.onRejectedCallback.forEach((fn) => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFullFilled, onRejected) {
        // 当没有传递回调的时候，给一个默认回调
        onFullFilled = typeof onFullFilled === "function" ? onFullFilled : (value) => value;
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (reason) => {
                      throw reason;
                  };

        let x;
        let p = new MyPromise((resolve, reject) => {
            // then继续返回一个Promise，则之前的代码，挪到新创建的Promise

            // ******同步执行的代码******
            if (this.state === "fullFilled") {
                // x = onFullFilled(this.value); //上一个Promise返回的结果
                // resolve(x); //再执行then内返回Promise的resolve方法

                // 因为then里面也可以返回Promise，所以我们是不知道返回的x是什么状态的，交给resolvePromise处理

                // 因为p此时还没创建完成，所以先放到异步队列，这里用setTimeout模拟，实际Promise用的是微任务
                setTimeout(() => {
                    // 捕获异常
                    try {
                        x = onFullFilled(this.value);
                        resolvePromise(p, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (this.state === "rejected") {
                // x = onRejected(this.reason);
                // reject(x);

                setTimeout(() => {
                    // 捕获异常
                    try {
                        x = onRejected(this.reason);
                        resolvePromise(p, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }

            if (this.state === "pending") {
                //如果是异步，状态还是pending，则将then传入的回调暂存在数组中
                this.onFullFilledCallback.push(() => {
                    // x = onFullFilled(this.value); //拿到then回调返回的值
                    // resolve(x); //传递给then内返回Promise

                    setTimeout(() => {
                        // 捕获异常
                        try {
                            x = onFullFilled(this.value);
                            resolvePromise(p, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });

                this.onRejectedCallback.push(() => {
                    // x = onRejected(this.reason);
                    // reject(x);

                    setTimeout(() => {
                        // 捕获异常
                        try {
                            x = onRejected(this.reason);
                            resolvePromise(p, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }
            // ******同步执行的代码******
        });

        return p;
    }

    catch(errCallback) {
        return this.then(null, errCallback);
    }
}

function resolvePromise(p, x, resolve, reject) {
    // console.log(p);
    // console.log(x);
    // Promise/A+规范，then回调里返回的Promise，不能和then返回的Promise对象是同一个Promise
    if (p === x) {
        return reject(new TypeError("Chaining cycle detected for promise"));
    }

    let called = false;
    // 如果是对象
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
        // 取then可能会失败，捕获
        try {
            let then = x.then;
            if (typeof then === "function") {
                // if(x.state === "fullFilled"){

                // }
                // 处理then回调返回的Promise
                then.call(
                    x,
                    (res) => {
                        // 加锁可以防止对象中的then方法多次执行resolve
                        if (called) return;
                        called = true;
                        // console.log(called);
                        // resolve(res);
                        // 返回的Promise的resolve里又返回了一个Promise，则继续递归处理
                        resolvePromise(x, res, resolve, reject);
                    },
                    (err) => {
                        if (called) return;
                        called = true;
                        // console.log(called);
                        reject(err);

                        // resolvePromise(x, err, resolve, reject);
                    }
                );

                // console.log("promise");
            } else {
                // 普通对象，直接resolve
                resolve(x);
            }
        } catch (error) {
            if (called) return;
            called = true;
            reject(error);
        }
    } else {
        // 如果x是个普通值，则直接调用resolve
        resolve(x);
    }
    // resolve(a);
}
```

```js
let p1 = new MyPromise((resolve, reject) => {
    // resolve(1);
    // resolve(2);
    // reject("err"); //重复调用只有第一次生效

    // setTimeout(() => {
    resolve(1);
    // resolve(a);
    // reject("err");
    // }, 1000);
});

// 返回了一个对象，对象里面有then方法
// let p2 = p1.then(
//     (res) => {
//         return {
//             then(resolve, reject) {
//                 resolve("success");
//             },
//         };
//     },
//     (err) => {
//         console.log("p1", err);
//         return err;
//     }
// );

// 如果then里面返回了Promise;
let p2 = p1.then(
    (res) => {
        // return new MyPromise((resolve, reject) => {
        //     // 如果多次调用
        //     resolve(1);
        //     reject("err");
        // });
        // 返回的Promise的resolve里又返回了一个Promise
        // return new MyPromise((resolve, reject) => {
        //     resolve(
        //         new MyPromise((resolve, reject) => {
        //             resolve(
        //                 new MyPromise((resolve, reject) => {
        //                     // resolve(10);
        //                     reject("err");
        //                 })
        //             );
        //         })
        //     );
        // });
        // return res;
    },
    (err) => {
        console.log("p1", err);
        return err;
    }
);

p2.then().then(
    (res) => {
        // return new MyPromise((resolve, reject) => {
        //     resolve(1);
        // });
        console.log("p2", res);
    },
    (err) => {
        console.log("p2", err);
    }
);
```

## 其余接口实现

### Promise.resolve

`promise.resolve()` 将传入的一个值转为 promise 对象：

-   如果这个值是一个 promise，那么返回这个 promise
-   如果这个值是一个 thenable(比如带有 then 方法的对象)，返回的 promise 会将 resolve 和 reject 作为参数传递给 then 方法
-   否则返回一个 Promise

```js
MyPromise.resolve = function (value) {
    if (value instanceof MyPromise) {
        return value;
    } else if (value instanceof Object && "then" in value && typeof value.then === "function") {
        return new MyPromise((resolve, reject) => {
            value.then(resolve, reject);
        });
    }

    return new MyPromise((resolve, reject) => {
        resolve(value);
    });
};
```

### Promise.reject
### Promise.catch

catch 就是对 then 的调用

```js
MyPromise.prototype.catch = function (errCallback) {
    return this.then(null, errCallback);
};
```

### Promise.finally

finally 的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况

```js
MyPromise.prototype.finally = function (callback) {
    /*
        finally处理的是成功的Promise1：
        如果finally的回调没有返回或者返回普通值，那么finally返回的Promise将会承接成功的Promise1状态
        如果finally的回调返回一个成功的Promise2，那么finally返回的Promise将会承接成功的Promise1状态
        如果finally的回调返回一个失败的Promise，那么finally返回的Promise将会承接失败的Promise
        */
    const onFullFilled = function (value) {
        return MyPromise.resolve(callback()).then(() => value);
    };

    /*
        finally处理的是失败的Promise1：
        如果finally的回调没有返回或者返回普通值，那么finally返回的Promise将会承接失败的Promise1
        如果finally的回调返回一个成功的Promise，那么finally返回的Promise将会承接还是失败的Promise1
        如果finally的回调返回一个失败的Promise2，那么finally返回的Promise将会承接失败的Promise2
        */
    const onRejected = function (reason) {
        return MyPromise.resolve(callback()).then(() => {
            throw reason;
        });
    };

    return this.then(onFullFilled, onRejected);
};
```

finally 处理的是成功的 Promise1：

-   如果 finally 的回调没有返回或者返回普通值，那么 finally 返回的 Promise 将会承接成功的 Promise1 状态
-   如果 finally 的回调返回一个成功的 Promise2，那么 finally 返回的 Promise 将会承接成功的 Promise1 状态
-   如果 finally 的回调返回一个失败的 Promise，那么 finally 返回的 Promise 将会承接失败的 Promise

```js
MyPromise.resolve(1)
    .finally((res) => {
        // finally的回调函数中不接收任何参数
        console.log("finally", res);

        // return "finally" // 返回普通值，then成功的回调接收的参数为1
        return MyPromise.resolve("success"); //返回成功的Promise，虽然这里传递了值，但是then成功的回调接收的参数还是1
        // return MyPromise.reject("fail"); // 返回失败的Promise，触发then失败的回调
    })
    .then(
        (res) => {
            console.log("res", res);
        },
        (err) => {
            console.log("err", err);
        }
    );
```

finally 处理的是失败的 Promise1：

-   如果 finally 的回调没有返回或者返回普通值，那么 finally 返回的 Promise 将会承接失败的 Promise1
-   如果 finally 的回调返回一个成功的 Promise，那么 finally 返回的 Promise 将会承接还是失败的 Promise1
-   如果 finally 的回调返回一个失败的 Promise2，那么 finally 返回的 Promise 将会承接失败的 Promise2

```js
MyPromise.reject(1)
    .finally((res) => {
        // return "finally";
        return MyPromise.resolve("success");
        // return MyPromise.reject("fail");
    })
    .then(
        (res) => {
            console.log("res", res);
        },
        (err) => {
            console.log("err", err);
        }
    );
```

### Promise.all

`Promise.all()` 方法接收一个 promise 的 iterable 类型，并且只返回一个 Promise

-   Promise.all 等待所有都完成（或第一个失败）
-   如果传入的参数是一个空的可迭代对象，则返回一个已完成状态的 Promise
-   如果参数中包含非 promise 值，这些值将被忽略，但仍然会被放在返回数组中，如果 promise 完成的话
-   在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值
-   如果传入的 promise 中有一个失败（rejected），Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成

```js
MyPromise.all = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            let result = []; //存储结果
            let count = 0; //计数器

            // 如果传入一个空的可迭代对象，则返回一个已完成状态的promise
            if (promises.length === 0) {
                return resolve(promises);
            }

            promises.forEach((item, index) => {
                MyPromise.resolve(item).then(
                    (value) => {
                        count++;
                        result[index] = value; //将每个promise的结果存在result中

                        count === promises.length && resolve(result); // 等所有完成时，才执行resolve
                    },
                    (reason) => {
                        // 如果传入的promise中只要有一个失败，则将失败的结果进行reject
                        reject(reason);
                    }
                );
            });
        } else {
            reject(new TypeError("Argument is not iterable"));
        }
    });
};
```

```js
let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
        // reject("err");
    }, 1000);
});
// 使用thenable对象也行，因为经过了Promise.resolve的转换
let p2 = {
    then(resolve, reject) {
        resolve(2);
    },
};

MyPromise.all([p1, p2])
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
```

### Promise.allSettled

`Promise.allSettled()` 方法返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果

-   对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason
-   如果传入的参数不是 Promise，转换为 Promise 并当做成功

```js
MyPromise.allSettled = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            let result = []; //存储结果
            let count = 0; //计数器

            // 如果传入一个空的可迭代对象，则返回一个已完成状态的Promise
            if (promises.length === 0) {
                return resolve(promises);
            }

            promises.forEach((item, index) => {
                // 非Promise的值，也会经过Promise.resolve转为Promise
                MyPromise.resolve(item).then(
                    (value) => {
                        count++;
                        // 每个结果对象，都有一个status字符串，如果置为rejected，则存在一个value
                        result[index] = {
                            status: "fullFilled",
                            value,
                        }; //将每个Promise的结果存在result中

                        count === promises.length && resolve(result); // 等给定的promise都已经fulfilled或rejected后，返回这个promise
                    },
                    (reason) => {
                        count++;
                        // 每个结果对象，都有一个status字符串，如果置为rejected，则存在一个reason
                        result[index] = {
                            status: "rejected",
                            reason,
                        };

                        count === promises.length && resolve(result); // 等给定的promise都已经fulfilled或rejected后，返回这个promise
                    }
                );
            });
        } else {
            reject(new TypeError("Argument is not iterable"));
        }
    });
};
```

```js
let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        // resolve(1);
        reject("err");
    }, 1000);
});

MyPromise.allSettled([p1, 2]).then((res) => {
    console.log(res);
});
```

返回的数组结果为

```js
[
    { status: "rejected", reason: "err" },
    { status: "fullFilled", value: 2 },
];
```

### Promise.any

`Promise.any()` 方法与 `Promise.all()`是相反的，`Promise.any()` 接收一个 Promise 可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。

-   如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 promise
-   如果传入的参数不是 Promise，转换为 promise 并当做成功
-   只要传入的迭代对象中的任何一个 promise 变成成功状态，则直接返回已成功的 promise
-   如果所有的 promise 都失败，则返回失败的 promise

:::warning 注意
Promise.any() 方法依然是实验性的，尚未被所有的浏览器完全支持
:::

```js
MyPromise.any = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            let errors = []; //存储结果
            let count = 0; //计数器

            // 如果传入一个空的可迭代对象，则返回一个已失败状态的promise
            if (promises.length === 0) {
                return reject(new AggregateError("All promises were rejected"));
            }

            promises.forEach((item, index) => {
                // 非Promise的值，也会经过Promise.resolve转为promise
                MyPromise.resolve(item).then(
                    (value) => {
                        // 只要其中的一个promise成功，将成功结果进行resolve
                        resolve(value);
                    },
                    (reason) => {
                        count++;
                        errors.push(reason);
                        //如果可迭代对象中没有一个promise成功，就返回一个失败的promise和AggregateError类型的实例
                        // AggregateError是 Error 的一个子类，用于把单一的错误集合在一起
                        count === promises.length && reject(new AggregateError(errors));
                    }
                );
            });
        } else {
            reject(new TypeError("Argument is not iterable"));
        }
    });
};
```

```js
let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        // resolve(1);
        reject("err1");
    }, 1000);
});

let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        // resolve(1);
        reject("err2");
    }, 1000);
});

MyPromise.any([p1, p2]).then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log(err);
    }
);
```

### Promise.race

`Promise.race(iterable)` 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝

-   如果传的迭代是空的，则返回的 promise 将永远等待。
-   如果迭代中包含一个或多个非承诺值和/或已解决/拒绝的 promise，则 Promise.race 将解析为迭代中找到的第一个值

```js
MyPromise.race = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            // 如果传入的迭代promises是空的，则返回的promise将永远等待
            if (promises.length > 0) {
                promises.forEach((item) => {
                    // 旦迭代器中的某个promise解决或拒绝，则在返回的 promise就会解决或拒绝
                    MyPromise.resolve(item).then(resolve, reject);
                });
            }
        } else {
            reject(new TypeError("Argument is not iterable"));
        }
    });
};
```

```js
let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        // resolve(1);
        reject("err1");
    }, 1000);
});

let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
        // reject("err2");
    }, 2000);
});

MyPromise.race([p1, p2]).then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log(err);
    }
);
```

## 测试

安装 promises-aplus-tests 插件，对 Promise 进行测试

```
npm i promises-aplus-tests -g
promises-aplus-tests promise.js  //执行命令进行测试
```

要使用 promises-aplus-tests 这个工具测试，我们要给自己手写的 MyPromise 上实现一个静态方法 deferred()，该方法要返回一个包含 `{ promise, resolve, reject }` 的对象：

```js
MyPromise.deferred = function () {
    let result = {};
    result.promise = new MyPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
};

module.exports = MyPromise;
```
