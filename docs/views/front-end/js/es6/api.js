const MyPromise = require("./promise");

/*

1.实现promise.resolve() 

promise.resolve() 将传入的一个值转为Promise对象

如果这个值是一个Promise，那么返回这个Promise
如果这个值是一个thenable(比如带有then方法的对象)，返回的promise会将resolve和reject作为参数传递给then方法
否则返回一个Promise
*/
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

// let p1 = MyPromise.resolve(1);
// p1.then((res) => {
//     console.log(res);
// });

// let obj = {
//     then(resolve, reject) {
//         resolve(1);
//     },
// };

// let p1 = MyPromise.resolve(obj);

// p1.then((res) => {
//     console.log(res);
// });

/*
2.实现Promise.reject()
实现Promise.reject()方法返回一个带有拒绝原因的Promise对象
*/

MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => {
        return reject(reason);
    });
};

// let p1 = MyPromise.reject(new Error("fail"));

// p1.then(
//     () => {},
//     (err) => {
//         console.log(err);
//     }
// );

/*
finally处理的是成功的Promise1：
如果finally的回调没有返回或者返回普通值，那么finally返回的Promise将会承接成功的Promise1
如果finally的回调返回一个成功的Promise2，那么finally返回的Promise将会承接成功的Promise1
如果finally的回调返回一个失败的Promise，那么finally返回的Promise将会承接失败的Promise
*/

// MyPromise.resolve(1)
//     .finally((res) => {
//         // finally的回调函数中不接收任何参数
//         console.log("finally", res);

//         // return "finally" // 返回普通值，then成功的回调接收的参数为1
//         return MyPromise.resolve("success"); //返回成功的Promise，虽然这里传递了值，但是then成功的回调接收的参数还是1
//         // return MyPromise.reject("fail"); // 返回失败的Promise，触发then失败的回调
//     })
//     .then(
//         (res) => {
//             console.log("res", res);
//         },
//         (err) => {
//             console.log("err", err);
//         }
//     );

/*
finally处理的是失败的Promise1：
如果finally的回调没有返回或者返回普通值，那么finally返回的Promise将会承接失败的Promise1
如果finally的回调返回一个成功的Promise，那么finally返回的Promise将会承接还是失败的Promise1
如果finally的回调返回一个失败的Promise2，那么finally返回的Promise将会承接失败的Promise2
*/

// MyPromise.reject(1)
//     .finally((res) => {
//         // return "finally";
//         return MyPromise.resolve("success");
//         // return MyPromise.reject("fail");
//     })
//     .then(
//         (res) => {
//             console.log("res", res);
//         },
//         (err) => {
//             console.log("err", err);
//         }
//     );

MyPromise.all = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            let result = []; //存储结果
            let count = 0; //计数器

            // 如果传入一个空的可迭代对象，则返回一个已完成状态的Promise
            if (promises.length === 0) {
                return resolve(promises);
            }

            promises.forEach((item, index) => {
                MyPromise.resolve(item).then(
                    (value) => {
                        count++;
                        result[index] = value; //将每个Promise的结果存在result中

                        count === promises.length && resolve(result); // 等所有完成时，才执行resolve
                    },
                    (reason) => {
                        // 如果传入的Promise中只要有一个失败，则将失败的结果进行reject
                        reject(reason);
                    }
                );
            });
        } else {
            reject(new TypeError("Argument is not iterable"));
        }
    });
};

// let p1 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1);
//         // reject("err");
//     }, 1000);
// });
// // 使用thenable对象也行，因为经过了Promise.resolve的转换
// let p2 = {
//     then(resolve, reject) {
//         resolve(2);
//     },
// };

// MyPromise.all([p1, p2])
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

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

// let p1 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve(1);
//         reject("err");
//     }, 1000);
// });

// MyPromise.allSettled([p1, 2]).then((res) => {
//     console.log(res);
// });

/*
[
  { status: 'rejected', reason: 'err' },
  { status: 'fullFilled', value: 2 }
]
*/

MyPromise.any = function (promises) {
    return new MyPromise((resolve, reject) => {
        if (Array.isArray(promises)) {
            let errors = []; //存储结果
            let count = 0; //计数器

            // 如果传入一个空的可迭代对象，则返回一个已失败状态的Promise
            if (promises.length === 0) {
                return reject(new AggregateError("All promises were rejected"));
            }

            promises.forEach((item, index) => {
                // 非Promise的值，也会经过Promise.resolve转为Promise
                MyPromise.resolve(item).then(
                    (value) => {
                        // 只要其中的一个Promise成功，将成功结果进行resolve
                        resolve(value);
                    },
                    (reason) => {
                        count++;
                        errors.push(reason);
                        //如果可迭代对象中没有一个promise成功，就返回一个失败的Promise和AggregateError类型的实例
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

// let p1 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve(1);
//         reject("err1");
//     }, 1000);
// });

// let p2 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1);
//         // reject("err2");
//     }, 1000);
// });

// MyPromise.any([p1, p2]).then(
//     (res) => {
//         console.log(res);
//     },
//     (err) => {
//         console.log(err);
//     }
// );

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
