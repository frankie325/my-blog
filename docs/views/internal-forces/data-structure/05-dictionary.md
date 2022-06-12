---
title: 字典
date: "2022-6-12"
sidebar: "auto"
categories:
    - 计算机
tags:
    - 数据结构
---

字典存储的是键值对，主要特点是一一对应

-   数组形式：`[19，"Tom", 1.65]`，可通过下标值取出信息
-   字典形式：`{"age": 19, "name": "Tom", "height": 165}`，可以通过 key 取出 value。

此外，在字典中 key 是不能重复且无序的，而 Value 可以重复

字典结构的实现

```ts
class Dictionary {
    constructor() {
        this.items = {};
    }

    // has(key) 判断字典中是否存在某个 key
    has(key) {
        return this.items.hasOwnProperty(key);
    }

    // set(key, value) 在字典中添加键值对
    set(key, value) {
        this.items[key] = value;
    }

    // remove(key) 在字典中删除指定的 key
    remove(key) {
        // 如果集合不存在该 key，返回 false
        if (!this.has(key)) return false;
        delete this.items[key];
    }

    // get(key) 获取指定 key 的 value，如果没有，返回 undefined
    get(key) {
        return this.has(key) ? this.items[key] : undefined;
    }

    // 获取所有的 key
    keys() {
        return Object.keys(this.items);
    }

    // 获取所有的 value
    values() {
        return Object.values(this.items);
    }

    // size() 获取字典中的键值对个数
    size() {
        return this.keys().length;
    }

    // clear() 清空字典中所有的键值对
    clear() {
        this.items = {};
    }
}
```
