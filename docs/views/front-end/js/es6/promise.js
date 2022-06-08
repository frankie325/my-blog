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

    // catch就是对then的调用
    catch(errCallback) {
        return this.then(null, errCallback);
    }

    // finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况
    finally(callback) {
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

// 如果resolve内返回的又是一个Promise
let p2 = new MyPromise((resolve, reject) => {
    resolve(p1);
});

p2.then((res) => {
    console.log(res);
});

// 当同一个Promise实例多次调用then时，需要将回调存到数组中
// p1.then(
//     (res) => {
//         console.log(res);
//     },
//     (err) => {
//         console.log(err);
//     }
// );

// p1.then(
//     (res) => {
//         console.log(res);
//     },
//     (err) => {
//         console.log(err);
//     }
// )

// 如果是链式操作，需要让then返回一个Promise
// let p2 = p1.then(
//     (res) => {
//         console.log("p1", res);
//         return res;
//     },
//     (err) => {
//         console.log("p1", err);
//         return err;
//     }
// );

// p2.then(
//     (res) => {
//         console.log("p2", res);
//     },
//     (err) => {
//         console.log("p2", err);
//     }
// );

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
// let p2 = p1.then(
//     (res) => {
//         // return new MyPromise((resolve, reject) => {
//         //     // 如果多次调用
//         //     resolve(1);
//         //     reject("err");
//         // });
//         // return new MyPromise((resolve, reject) => {
//         //     setTimeout(() => {
//         //         reject("err");
//         //         resolve(10);
//         //     }, 0);
//         // });
//         // 返回的Promise的resolve里又返回了一个Promise
//         return new MyPromise((resolve, reject) => {
//             resolve(
//                 new MyPromise((resolve, reject) => {
//                     resolve(
//                         new MyPromise((resolve, reject) => {
//                             // resolve(10);
//                             reject("err");
//                         })
//                     );
//                 })
//             );
//         });
//         // return res;
//     },
//     (err) => {
//         console.log("p1", err);
//         return err;
//     }
// );

// p2.then().then(
//     (res) => {
//         // return new MyPromise((resolve, reject) => {
//         //     resolve(1);
//         // });
//         console.log("p2", res);
//     },
//     (err) => {
//         console.log("p2", err);
//     }
// );

/*
安装promises-aplus-tests插件，对Promise进行测试
npm i promises-aplus-tests -g

执行命令进行测试
promises-aplus-tests promise.js
*/

// 要使用 promises-aplus-tests 这个工具测试，我们要给自己手写的MyPromise上实现一个静态方法deferred()，该方法要返回一个包含{ promise, resolve, reject }的对象：
MyPromise.deferred = function () {
    let result = {};
    result.promise = new MyPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
};

module.exports = MyPromise;
