---
title: 二叉树
date: '2022-6-12'
sidebar: 'auto'
categories:
  - 计算机
tags:
  - 数据结构
---

```js
function Node(key) {
  this.key = key;
  this.left = null; //左子节点
  this.right = null; //右子节点
}

function BinarySearchTree() {
  this.root = null; //二叉树根节点
}
```

```js
// 往二叉树插入新节点
BinarySearchTree.prototype.insert = function (key) {
  let newNode = new Node(key);

  // 首先判断根节点是否存在，不存在直接赋值给根节点
  if (this.root == null) {
    this.root = newNode;
  } else {
    // 根节点存在的情况

    let current = this.root;
    let parent = null;
    let isLeftChild = null;
    // 根节点开始遍历
    while (current) {
      parent = current;
      // 如果新节点的key比current.key还小，则向左查找
      if (newNode.key < current.key) {
        current = current.left;
        isLeftChild = true;
        // 如果新节点的key比current.key还大，则向右查找
      } else if (newNode.key > current.key) {
        current = current.right;
        isLeftChild = false;
        // 如果新节点的key与current.key相等，则报错，终止执行
      } else {
        throw new Error('key必须唯一');
      }
    }

    // 当遍历到current为null时，就是新节点要插入的位置
    if (isLeftChild) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }
};
```

```js
// 先序遍历（根左右）
BinarySearchTree.prototype.preOrderTraversal = function (handler) {
  let node = this.root;
  preOrderTraversalNode(node, handler);
};

function preOrderTraversalNode(node, handler) {
  // 当遍历到空时结束递归
  if (node != null) {
    // 触发回调
    handler(node);
    // 递归调用处理左节点
    preOrderTraversalNode(node.left, handler);
    // 递归调用处理右节点
    preOrderTraversalNode(node.right, handler);
  }
}
```

```js
// 中序遍历（左根右）
BinarySearchTree.prototype.midOrderTraversal = function (handler) {
  let node = this.root;
  midOrderTraversalNode(node, handler);
};

function midOrderTraversalNode(node, handler) {
  // 当遍历到空时结束递归
  if (node != null) {
    // 递归调用处理左节点
    midOrderTraversalNode(node.left, handler);
    // 触发回调
    handler(node);
    // 递归调用处理右节点
    midOrderTraversalNode(node.right, handler);
  }
}
```

```js
// 后序遍历（左右根）
BinarySearchTree.prototype.lastOrderTraversal = function (handler) {
  let node = this.root;
  lastOrderTraversalNode(node, handler);
};

function lastOrderTraversalNode(node, handler) {
  // 当遍历到空时结束递归
  if (node != null) {
    // 递归调用处理左节点
    lastOrderTraversalNode(node.left, handler);
    // 递归调用处理右节点
    lastOrderTraversalNode(node.right, handler);
    // 触发回调
    handler(node);
  }
}
```

```js
// 找到key值最大的节点
BinarySearchTree.prototype.max = function () {
  // 根节点是空，直接返回
  if (this.root == null) return null;
  let current = this.root;
  let max;
  // 向右查找到最后一个节点，就是最大的节点
  while (current) {
    max = current;
    current = current.right;
  }
  return max;
};
```

```js
// 找到key值最小的节点
BinarySearchTree.prototype.min = function () {
  // 根节点是空，直接返回
  if (this.root == null) return null;
  let current = this.root;
  let min;
  // 向左查找到最后一个节点，就是最大的节点
  while (current) {
    min = current;
    current = current.left;
  }
  return min;
};
```

```js
// 根据key寻找节点
BinarySearchTree.prototype.search = function (key) {
  if (!key) {
    throw new Error('请输入要查询的key值');
  }
  // 根节点是空，直接返回
  if (this.root == null) return false;
  let current = this.root;
  while (current) {
    if (key < current.key) {
      // key小于current.key，则向左查找
      current = current.left;
    } else if (key > current.key) {
      // key大于current.key，则向右查找
      current = current.right;
    } else {
      //相等时，直接返回该节点
      return current;
    }
  }

  // 还没找到则返回false
  return false;
};
```

```js
// 删除节点
BinarySearchTree.prototype.deleteNode = function (key) {
  let parent = null; //删除节点的父节点
  let isLeftChild = true;
  let current = this.root;
  // 1.先寻找到对应的节点保存在current中
  // 当key与current.key相等时，跳出循环
  while (current.key !== key) {
    parent = current;
    if (key < current.key) {
      // key小于current.key，则向左查找
      current = current.left;
      isLeftChild = true;
    } else if (key > current.key) {
      // key大于current.key，则向右查找
      current = current.right;
      isLeftChild = false;
    }

    // current为null，则还没找到
    if (current == null) return false;
  }

  // 2.根据对应的情况删除节点

  // 2.1 删除的节点是叶子节点
  if (current.left === null && current.right === null) {
    // 当根节点是叶子节点时
    if (current === this.root) {
      this.root = null;
    } else {
      // 否则就是普通的叶子节点
      if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }
  }

  // 2.2删除的节点有一个子节点
  // 删除的节点有左子节点
  else if (current.right === null) {
    // 当current是根节点时
    if (current === this.root) {
      this.root = current.left;
    } else if (isLeftChild) {
      parent.left = current.left; //更新父节点的左节点
    } else {
      parent.right = current.left;
    }
  }
  // 删除的节点有右子节点
  else if (current.left === null) {
    // 当current是根节点时
    if (current === this.root) {
      this.root = current.right;
    } else if (isLeftChild) {
      parent.left = current.right; //更新父节点的左节点
    } else {
      parent.right = current.right;
    }
  }

  // 2.3删除的节点有两个子节点

  /*
        如果要删除的节点有两个子节点，甚至子节点还有子节点，
        这种情况下需要从要删除节点下面的子节点中找到一个合适的节点，来替换当前的节点

        前驱：删除节点的左子树中，比删除节点稍微小一点点的节点，即左子树中的最大值
        后继：删除节点的右子树中，比删除节点稍微大一点点的节点，即右子树中的最小值
        
        下面以后继进行示例，前驱同理
    */
  else {
    let successor = getSuccessor(current);

    // 当删除的节点是根节点时
    if (current === this.root) {
      this.root = successor;
    } else if (isLeftChild) {
      parent.left = successor;
    } else {
      parent.right = successor;
    }

    // 后继节点的左节点改为被删除的左节点
    successor.left = current.left;
  }
};

// 找到后继节点
function getSuccessor(delNode) {
  let successor = delNode;
  let current = delNode.right;
  let successorParent = null; //后继节点的父节点

  // 从右子树找到最小的节点
  while (current !== null) {
    successorParent = successor;
    successor = current;
    current = current.left;
  }

  // 判断寻找到的后续节点是否直接就是要删除节点的 right
  if (successor !== delNode.right) {
    successorParent.left = successor.right; // 还有一种情况，就是后继节点还有右节点（没有左节点，因为找到的后继节点不可能还有左节点，但是可以有右节点）
    successor.right = delNode.right;
  }

  // console.log("successorParent", successorParent);
  // console.log(successor);
  // console.log(current);
  return successor;
}
```
