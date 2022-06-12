---
title: 集合
date: "2022-6-12"
sidebar: "auto"
categories:
    - 计算机
tags:
    - 数据结构
---

## 集合

集合通常是由一组无序的，不能重复的元素构成，ES6 封装的 Set 类，就是集合

集合的实现

```js
function _Set() {
    this.items = {};
}

// 1.往集合添加元素
_Set.prototype.add = function (value) {
    if (this.has(value)) {
        return false;
    }
    this.items[value] = value;
    return true;
};

// 2.判断集合是否有这个元素
_Set.prototype.has = function (value) {
    return this.items.hasOwnProperty(value);
};

// 3.删除集合中的元素
_Set.prototype.remove = function (value) {
    if (!this.has(value)) {
        return null;
    }

    delete this.items[value];
    return true;
};

// 4.清空集合中的元素
_Set.prototype.clear = function () {
    this.items = {};
};

// 5.集合中的元素的个数
_Set.prototype.size = function () {
    return Object.keys(this.items).length;
};

// 6.集合中的元素的个数
_Set.prototype.values = function () {
    return Object.values(this.items);
};

/*
集合间的操作：
并集：返回一个包含两个集合中所有元素的新集合
交集：返回一个包含两个集合中共有元素的新集合
差集：返回存在于第一个集合且不存在于第二个集合的元素的新集合
子集：验证一个给定集合是否是另一个集合的子集
*/

// 并集操作
_Set.prototype.union = function (otherSet) {
    let newSet = new _Set();

    // 遍历A集合，添加到新集合
    let values = this.values();
    for (let i = 0; i < values.length; i++) {
        newSet.add(values[i]);
    }

    // 遍历B集合，添加到新集合
    values = otherSet.values();
    for (let i = 0; i < values.length; i++) {
        newSet.add(values[i]);
    }

    return newSet;
};

// 交集操作
_Set.prototype.intersection = function (otherSet) {
    let newSet = new _Set();

    // 遍历A集合
    let values = this.values();
    for (let i = 0; i < values.length; i++) {
        // 如果存在于B集合，则添加到新集合
        if (otherSet.has(values[i])) {
            newSet.add(values[i]);
        }
    }
    return newSet;
};

// 差集操作
_Set.prototype.difference = function (otherSet) {
    let newSet = new _Set();

    // 遍历A集合
    let values = this.values();
    for (let i = 0; i < values.length; i++) {
        // 如果不存在于B集合，则添加到新集合
        if (!otherSet.has(values[i])) {
            newSet.add(values[i]);
        }
    }
    return newSet;
};

// 子集操作，是不是传入的集合的子集
_Set.prototype.subset = function (otherSet) {
    // 遍历A集合
    let values = this.values();
    for (let i = 0; i < values.length; i++) {
        // 如果不存在于B集合，直接返回false
        if (!otherSet.has(values[i])) {
            return false;
        }
    }
    // 遍历完了，说明都存在于B集合
    return true;
};

let set = new _Set();
set.add("a");
set.add("b");
set.add("c");
console.log(set);
console.log(set.has("a"));
console.log(set.has("d"));
set.remove("c");
console.log(set);
console.log(set.size());

let set1 = new _Set();
set1.add("b");
set1.add("c");
let set2 = new _Set();
set2.add("a");
set2.add("b");
set2.add("c");
console.log("set", set);
console.log("set1", set1);
console.log("并集", set.union(set1));
console.log("交集", set.intersection(set1));
console.log("差集", set.difference(set1));
console.log("子集", set.subset(set1));
console.log("子集", set.subset(set2));
```
