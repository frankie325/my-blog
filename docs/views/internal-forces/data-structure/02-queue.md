---
title: 队列
date: "2022-6-12"
sidebar: "auto"
categories:
    - 计算机
tags:
    - 数据结构
---

## 队列

跟栈类似，也是一种受限的线性表，先进先出（后进后出）

队列的实现

```js
function Queue() {
    this.items = [];
}

// 队列的一些常用操作
// 1.将元素推入队列
Queue.prototype.equeue = function (element) {
    this.items.push(element);
};

// 2.从队列中删除前端元素
Queue.prototype.dqueue = function () {
    return this.items.shift();
};

// 3.查看前端元素
Queue.prototype.front = function () {
    return this.items[0];
};

// 4.判断队列是否为空
Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
};

// 5.获取队列中元素的个数
Queue.prototype.size = function () {
    return this.items.length;
};

// 6.toString方法
Queue.prototype.toString = function () {
    return this.items.join(",");
};

let q = new Queue();
q.equeue("a");
q.equeue("b");
q.equeue("c");
q.equeue("d");

console.log(q.front()); //"a"

q.dqueue();
console.log(q.front()); //"b"
```

1. 示例：

击鼓传花游戏:
几个朋友一起玩一个游戏，围成一圈，开始数数，
数到某个数字的人自动淘汰，然后剩下的人继续玩，直到剩下最后一个人
请问最后剩下的那个人是原来哪个位置上的人

```ts
function passGame(nameList, num) {
    let q = new Queue();
    for (let i = 0; i < nameList.length; i++) {
        // 将所有人依次入队
        q.equeue(nameList[i]);
    }

    while (q.size() > 1) {
        // 人数大于1继续循环
        for (let i = 1; i < num; i++) {
            // 数到这个数前面的都不会淘汰
            // 出队再入队
            q.equeue(q.dqueue());
        }
        // 数到num的这个人则淘汰
        q.dqueue();
    }

    // 拿到这个人
    let person = q.front();

    return nameList.indexOf(person); //返回这个人的位置
}

console.log(passGame(["Tom", "Sam", "Jack", "Rose", "Amy"], 3)); //3
```

## 优先级队列

在插入一个元素到队列时，需要考虑数据的优先级，插入时和其他数据的优先级进行比较
，比较完成后，插入正确的位置

优先级队列的实现

```js
function PriorityQueue() {
    this.items = [];
}

// 1.将元素推入队列
PriorityQueue.prototype.equeue = function (element, priority) {
    let ele = new QueueElement(element, priority);

    // 1.队列长度为0的时候，不用考虑优先级，直接插入队列
    if (this.items.length === 0) {
        this.items.push(ele);
    } else {
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            // 2.遍历队列中的元素，找到优先级的值比它大的，插入到其前面的位置并跳出循环
            if (ele.priority < this.items[i].priority) {
                this.items.splice(i, 0, ele);
                added = true;
                break;
            }
        }

        // 3.如果还没插入队列，说明它的优先级最低
        if (!added) {
            this.items.push(ele);
        }
    }
};

// 2.从队列中删除前端元素
PriorityQueue.prototype.dqueue = function () {
    return this.items.shift();
};

// 3.查看前端元素
PriorityQueue.prototype.front = function () {
    return this.items[0];
};

// 4.判断队列是否为空
PriorityQueue.prototype.isEmpty = function () {
    return this.items.length === 0;
};

// 5.获取队列中元素的个数
PriorityQueue.prototype.size = function () {
    return this.items.length;
};

// 6.toString方法
PriorityQueue.prototype.toString = function () {
    let str = "";
    for (let i = 0; i < this.items.length; i++) {
        str += this.items[i].element + "-" + this.items[i].priority + " ";
    }
    return str;
};

let pq = new PriorityQueue();
pq.equeue("kfg", 10);
pq.equeue("Tom", 20);
pq.equeue("Jack", 15);
pq.equeue("Sam", 40);
console.log(pq.toString());
```
