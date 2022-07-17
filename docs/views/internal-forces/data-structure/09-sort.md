---
title: 排序算法
date: '2022-6-12'
sidebar: 'auto'
categories:
  - 计算机
tags:
  - 数据结构
---

## 简单排序

### 冒泡排序

外层循环控制比较的轮数，全部排玩需要 length - 1
内层循环控制比较的次数，比较的次数依次减少，第一轮为 length - 1 ， 第二轮为 length - 2 ，即外层循环变量 i 的大小

```js
let arr = [8, 4, 15, 2, 3, 10, 9, 20];

for (let length = arr.length, i = 0; i < length - 1; i++) {
  for (let j = 0; j < length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}

console.log(arr);
```

- 比较次数
  以长度为 7 的数组的比较次数为例  
  第一轮循环 6 次比较  
  第二轮循环 5 次比较  
  ...  
  第六轮循环 1 次比较
  总共：6 + 5 + 4 + 3 + 2 + 1

对于 n 个长度的数组，`(n - 1) + (n - 2) + ... + 1 = n(n-1) / 2 = n^2/2 - n/2`
冒泡排序比较次数的大 O 表示法为 O(n^2)

- 交换次数：
  为 n(n-1) / 4，因为交换是可能要交换，也可能不交换，为比较次数的 1/2
  所以冒泡排序交换次数的大 O 表示法也是 O(n^2)

### 选择排序

遍历数组，找到最小值的索引，然后将其放在数组的第一个位置。
从索引为 2 开始遍历数组，然后将其放在数组的第 2 个位置
从索引为 3 开始遍历数组，然后将其放在数组的第 3 个位置
直到所有元素均排序完毕

外层循环控制比较的轮数，全部排玩需要 length - 1 轮
内层循环控制与 min 进行比较

```js
let arr = [8, 4, 15, 2, 3, 10, 9, 20];

for (let i = 0, length = arr.length; i < length; i++) {
  let min = i;
  for (let j = i; j < length - 1; j++) {
    if (arr[j] < arr[min]) {
      min = j;
    }
  }

  let temp = arr[i];
  arr[i] = arr[min];
  arr[min] = temp;
}

console.log(arr);
```

- 比较次数  
  对于 n 个长度的数组
  第一轮循环 n - 1 次比较  
  第一轮循环 n - 2 次比较  
  选择排序比较次数的大 O 表示法为 O(n^2)，与冒泡排序一样

- 交换次数为 n - 1 次
  因为每轮只交换一次，选择排序交换次数的大 O 表示法为 O(n)，所以选择排序通常认为在执行效率是高于冒泡排序的

### 插入排序

刚开始从索引为 2 开始，跟数组左边已经排好的数据从后往前进行比较，如果小于左边的数，则交换位置
从索引为 3 开始进行比较
从索引为 4 开始进行比较
直到所有元素均排序完毕

```js
let arr = [8, 4, 15, 2, 3, 10, 9, 20];

for (let i = 1, length = arr.length; i < length; i++) {
  for (let j = i; j >= 0; j--) {
    if (arr[j] < arr[j - 1]) {
      let temp = arr[j - 1];
      arr[j - 1] = arr[j];
      arr[j] = temp;
    }
  }
}

console.log(arr);
```

- 比较次数  
  第一轮，最多 1 次  
  第二轮，最多 2 次  
  ...  
  第 n - 1 轮，最多 n - 1 次  
  实际次数：`n^2/4 - n/4`，插入排序比较次数的大 O 表示法也为 O(n^2)，但实际比较次数是冒泡排序的一半

- 交换次数
  和比较次数一样`n^2/4 - n/4`，大 O 表示法也为 O(n^2)

所以在简单排序中，**相对于冒泡、选择排序，插入排序的效率最高**

## 复杂排序

### 希尔排序

插入排序的升级版按照间隔对数组进行插入排序，并逐渐减小间隔，继续插入排序

选择合适的增量：

- 希尔排序的原稿中：选择的初始间距为 `N / 2`， 也就是说，对于 N=100 的数组，增量间隔序列为 50、25、12、6、3、1
- Hibbard 增量序列：增量的算法为 `2^k - 1`，也就是 1、3、5 、7...

这里选择使用希尔排序原稿

```js
let arr = [8, 4, 15, 2, 3, 10, 9, 20, 16, 40, 21, 33, 36, 24, 25];
// 按照间隔对数组进行插入排序，并逐渐减小间隔，继续插入排序
// 比如上面的数组，取间隔4，对8，3排序，对4，10排序，对15，9排序，对4，10排序
let length = arr.length;
// 初始化增量
let gap = Math.floor(length / 2);

while (gap >= 1) {
  for (let i = gap; i < length; i++) {
    for (let j = i; j >= 0; j -= gap) {
      if (arr[j] < arr[j - gap]) {
        let temp = arr[j - gap];
        arr[j - gap] = arr[j];
        arr[j] = temp;
      }
    }
  }
  gap = Math.floor(gap / 2);
}

console.log(arr);
```

### 归并排序

自上而下递归将数组分成两半，将分成两半的数组进行排序

```js
function mergeSort(arr) {
  let length = arr.length;
  if (length === 1) return arr;

  let mid = Math.floor(arr.length / 2);

  // 将数组分成左半部分和右半部分，分而治之
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  //递归处理
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const l_len = left.length;
  const r_len = right.length;
  let l_pos = 0;
  let r_pos = 0;
  let res = [];

  // 合并左半边的数组和右半边的数组
  while (l_pos < l_len && r_pos < r_len) {
    if (left[l_pos] <= right[r_pos]) {
      res.push(left[l_pos++]);
    } else {
      res.push(right[r_pos++]);
    }
  }

  // 如果左半边的数组还有剩余，则将剩余的元素添加到res
  while (l_pos < l_len) {
    res.push(left[l_pos++]);
  }

  // 如果右半边的数组还有剩余，则将剩余的元素添加到res
  while (r_pos < r_len) {
    res.push(right[r_pos++]);
  }
  return res;
}

console.log(mergeSort([5, 7, 2, 17, 6, 1, 47, 89, 52, 5, 4, 12, 4]));
```

### 快速排序

快速排序是最快的排序算法：选择一个枢纽，将小于枢纽的数放在左边，大于枢纽的数放在右边，继续按照这个方式递归处理左右两边的数据，直到排序完毕为止

1. 方式一：如何选择枢纽？

选择中间的值

方式一为非原地排序，性能没有方式二高

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  // 取中间的数作为枢纽
  const mid = Math.floor(arr.length / 2);

  let left = [];
  let right = [];
  // 将枢纽从数组中删除
  const pivot = arr.splice(mid, 1);
  // 将剩余的数和枢纽比较，小于的放左边，大于的放右边
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 递归处理
  return quickSort(left).concat(pivot, ...quickSort(right));
}

console.log(quickSort([20, 4, 15, 2, 3, 10, 9, 8, 16, 40, 21, 33, 36, 24, 25]));
```

2. 方式二：如何选择枢纽？

取头、中、尾数值的中位数

```js
function quickSort(arr) {
  const swap = (left, right) => {
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
  };

  // 寻找枢纽
  const findPivot = (left, right) => {
    let center = Math.floor((left + right) / 2);

    // 找到头、中、尾的数值，先将这三个数排好序
    if (arr[left] > arr[center]) {
      swap(left, center);
    }

    if (arr[center] > arr[right]) {
      swap(center, right);
    }

    if (arr[left] > arr[center]) {
      swap(left, center);
    }

    // 将中位数放到倒数第二个位置
    swap(center, right - 1);
    // 返回枢纽，跟枢纽进行比较
    return arr[right - 1];
  };

  const length = arr.length;
  const left = 0;
  const right = length - 1;

  function sort(left, right) {
    if (left >= right) return;
    // if (right - left >= 0) return;
    const pivot = findPivot(left, right);

    let i = left; //从左往右的指针
    let j = right - 1; //从右往左的指针
    while (i < j) {
      // 从左往右找，小于枢纽则不动，直到找到比枢纽大的值
      while (arr[++i] < pivot) {}
      // 从右往左找，大于枢纽则不动，直到找到比枢纽小的值
      while (arr[--j] > pivot) {}

      // 交换位置
      if (i < j) {
        swap(i, j);
      }
    }
    // 将枢纽位置交换，此时，左边的值都比枢纽小，右边的值都比枢纽大
    swap(i, right - 1);

    sort(left, i - 1);
    sort(i + 1, right);
  }

  sort(left, right);

  return arr;
}

console.log(quickSort([20, 4, 15, 2, 3, 10, 9, 8, 16, 40, 21, 33, 36, 24, 25]));
```

当数据为 100000 条时，方式二明显比方式一快上许多，因为方式二为原地排序

方式一：1.141s

方式二：24.504ms

```js
let arr = [];
for (let i = 0; i <= 100000; i++) {
  arr[i] = Math.floor(1000 * Math.random(0, 1));
}

console.time();
console.log(quickSort(arr));
console.timeEnd();
```
