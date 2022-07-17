---
title: 哈希表
date: '2022-6-12'
sidebar: 'auto'
categories:
  - 计算机
tags:
  - 数据结构
---

## 哈希表

我们知道数组的查询效率是很高的，但是插入和删除的效率不高。

哈希表是根据关键码值(Key value)而直接进行访问的，本质上也是数组。通过哈希函数，把 key 转换成数组的下标，通过下标快速定位元素的位置，而这种方式就叫做哈希函数

```js
// 哈希表的实现，这里使用链地址法实现
function HashTable() {
  this.storage = []; //存储数据
  this.limit = 7; //数组最大的长度，选择为质数
  this.count = 0;

  // 装填因子(已有个数/总个数)
  this.loadFactor = 0.75;
  this.minLoadFactor = 0.25;
}
```

### 哈希化

哈希值的计算：`a(0) + a(1)*x + ... + a(n-1)*x^n-1 + a(n)*x^n`多项式相加，其中 `a(n)`为每个字符的 ASCII 值，x 取值为质数，使得计算出的索引尽量均匀分布

计算时使用霍纳算法：提取公约数 x `a(0) + a(1)*x + ... + a(n-1)*x^n-1 + a(n)*x^n` => `a(0) + x(a(1)+ x(a(2) + x(...) ) )` 减少时间复杂度，从 `O(N^2)` 降到 `O(N)`

```js
/**
 * @description:哈希函数
 * @param {*} str 进行哈希化的key
 * @param {*} size 数组的长度
 * @return {*}
 */
HashTable.prototype.hashFun = function (str, size) {
  // 定义哈希值，初始为0
  let hashCode = 0;

  // 计算哈希值用到的质数（无强制要求，质数即可）
  // 保证计算出的哈希值在数组中是均匀分布的
  const PRIME = 37;

  // 使用霍纳算法（秦九韶算法），减少乘法的运算
  for (let i = 0; i < str.length; i++) {
    hashCode = PRIME * hashCode + str.charCodeAt(i);
  }

  // 除以数组的的长度并取余，保证得到的索引在数组范围内
  let index = hashCode % size;

  return index;
};
```

### 哈希冲突

当使用哈希函数哈希化时，生成的索引可能是会产生冲突的，下面有两种解决方式

- **链地址法：** 值的存储再次开辟一个空间进行存储，可以是链表，可以是数组

- **开放地址法：** 如果索引冲突，就往下寻找空的位置
  - 线性探测：线性查找空白单元，每次步长加一，探测步长为 `x+1、x+2、x+3...`，查找到空白单元即停止，但可能导致聚集问题
  - 二次探测：在线性探测上做了优化，对步长做了优化，探测步长为 `x+1^2、x+2^2、x+3^2...`，依然会导致分散聚集问题，不过可能性比线性探测小
  - 再哈希法：把第一次哈希化得到的索引再做一次哈希，把第二次哈希化的结果作为步长，计算公式为`stepSize = constant - (key - constant)`，constant 为质数

```js
//1.插入和修改操作
// [ [ [key,value], [key,value] ], [ [key,value], [key,value] ] ]
HashTable.prototype.put = function (key, value) {
  // 1.将key哈希化得到索引
  let index = this.hashFun(key, this.limit);

  // 2.根据index取出对应的bucket
  let bucket = this.storage[index];

  // 3.如果bucket为undefined，则创建bucket
  if (bucket == null) {
    bucket = [];
    this.storage[index] = bucket;
  }

  // 4.如果bucket不为空，再对bucket进行线性探测
  for (let i = 0; i < bucket.length; i++) {
    let tuple = bucket[i];
    // 如果找到了相同的key，说明应该为修改操作
    if (tuple[0] === key) {
      tuple[1] = value;
      return;
    }
  }

  // 5.遍历完了，还没找到，就是插入操作
  bucket.push([key, value]);
  this.count++; //长度加一

  // 6.判断哈希表是否要扩容，若装填因子 > 0.75，则扩容
  if (this.count / this.limit > this.loadFactor) {
    this.resize(this.getPrime(this.limit * 2));
  }
};
```

```js
// 2.获取操作
HashTable.prototype.get = function (key) {
  // 1.将key哈希化得到索引
  let index = this.hashFun(key, this.limit);

  // 2.根据index取出对应的bucket
  let bucket = this.storage[index];

  // 3.如果bucket为undefined，则直接返回，没有对应的数据
  if (bucket == null) {
    return null;
  }

  // 4.如果bucket不为空，再对bucket进行线性探测
  for (let i = 0; i < bucket.length; i++) {
    let tuple = bucket[i];
    // 如果找到了相同的key，返回它的值
    if (tuple[0] === key) {
      return tuple[1];
    }
  }

  // 5.依然没找到，返回null
  return null;
};
```

### 哈希表的扩容与压缩

当填入表中的元素个数逐渐接近哈希表的最大长度时，就会造成哈希表效率的降低，这个时候就需要进行扩容，一般在装填因子大于 0.75 的时候进行扩容
`装填因子 = 填入表中的元素个数 / 哈希表的长度`

当删除时，哈希表在元素的个数逐渐变少时，如果不进行压缩，会造成空间浪费，一般在装填因子小于 0.25 的时候进行压缩

```js
// 3.删除操作
HashTable.prototype.remove = function (key) {
  // 1.将key哈希化得到索引
  let index = this.hashFun(key, this.limit);

  // 2.根据index取出对应的bucket
  let bucket = this.storage[index];

  // 3.如果bucket为undefined，则直接返回，没有对应的数据
  if (bucket == null) {
    return null;
  }

  // 4.如果bucket不为空，再对bucket进行线性探测
  for (let i = 0; i < bucket.length; i++) {
    let tuple = bucket[i];
    // 如果找到了相同的key，
    if (tuple[0] === key) {
      bucket.splice(i, 1); //删除
      this.count--;

      // 6.判断哈希表是否要压缩，若装填因子 < 0.25，则压缩
      if (this.count / this.limit < this.minLoadFactor) {
        this.resize(this.getPrime(Math.floor(this.limit / 2)));
      }

      return tuple[1]; //返回被删除的数据
    }
  }
  // 5.依然没找到，返回null
  return null;
};

// 4.判断哈希表是否为空
HashTable.prototype.isEmpty = function () {
  return this.count === 0;
};

// 5.哈希表中元素的个数
HashTable.prototype.size = function () {
  return this.count;
};
```

获取质数

```js
// 2 倍扩容或压缩之后，循环调用isPrime 判断得到的容量是否为质数，不是则加一，直到是为止
HashTable.prototype.getPrime = function (number) {
  while (!this.isPrime(number)) {
    number++;
  }
  return number;
};
```

判断一个数是否为质数：

1. 方法一：
   只能被 1 和 number 整除，即不能被 2 ~ (number-1)整除，遍历 2 ~ (num-1)
   穷举法，性能不高

```js
function isPrime(number) {
  for (let i = 2; i < number; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}
```

2. 方式二：
   对一个数进行因式分解，那么分解得到的两个数一定是，一个小于 number 开根号，一个大于 number 开根号

```js
function isPrime(number) {
  // 获取平方根
  const temp = parseInt(Math.sqrt(number));

  // 循环判断
  for (let i = 2; i <= temp; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}
```

```js
HashTable.prototype.isPrime = function (number) {
  // 获取平方根
  const temp = parseInt(Math.sqrt(number));

  // 循环判断
  for (let i = 2; i <= temp; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
};
```
