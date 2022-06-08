---
title: vben数据请求
date: "2022-5-20"
sidebar: "auto"
categories:
    - 前端
tags:
    - vben
---

## 跨域代理

先简单说一下开发服务器的代理功能

在开发的时候，当浏览器向服务器发出请求后，如果后端没有解决跨域，我们可以在开发服务器时配置代理规则以解决跨域问题

当发送请求 `axios.get('/api/user')` ，符合匹配规则时，会被开发服务器拦截，由开发服务器代理转发到真实后台地址`http://localhost:3000/api/user`，因为服务器与服务器之间不存在跨域问题，所以能够正常发送请求

```js
module.exports = {
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                // 如果后台真实的请求接口是`/user`，则可以把/api/user进行裁剪，然后与后台地址进行拼接 http://localhost:3000/user
                rewrite: (path) => {
                    return path.replace(/^\/api/, "");
                },
            },
        },
    },
};
```

## vben 实现数据请求

-   在开发环境中 ，进行了如下代理

`.env.development`开发环境变量文件

```
VITE_PROXY = [["/basic-api","http://localhost:3300"],["/upload","http://localhost:3400/upload"]]

VITE_GLOB_API_URL=/basic-api
```

```js
module.exports = {
    server: {
        proxy: {
            "/basic-api": {
                target: "http://localhost:3300", //服务器真实地址，这里是假的地址
                rewrite: (path) => {
                    return path.replace(/^\/basic-api/, "");
                },
            },
            "/upload": {
                target: "http://localhost:3400/upload",
                rewrite: (path) => {
                    return path.replace(/^\/upload/, "");
                },
            },
        },
    },
};
```

vben 对 axios 请求做了如下配置，在请求发送之前会在前面拼接上 VITE_GLOB_API_URL 全局变量

比如：

```js
axios({
    method: "get",
    url: "/system/user", //后台请求地址，正常写即可
});
```

实际发送为 `/basic-api/system/user`，然后由开发服务器进行拦截进行转发到`http://localhost:3300/system/user`

如果不想在开发环境中进行代理可以将 VITE_PROXY 设置为空数组，VITE_GLOB_API_URL 设置为真实后台地址

```
VITE_PROXY = []

VITE_GLOB_API_URL = http://localhost:3300
```

-   在生产环境中，则没有代理

axios 同样会在请求发送之前拼接上 VITE_GLOB_API_URL 全局变量，所以直接设置为真实后台地址即可

`.env.production` 开发环境变量文件

```
VITE_GLOB_API_URL = http://localhost:3300
```

## 模拟数据请求

vben 模拟数据请求使用的是 vite-plugin-mock，用法可以查看官网

:point_right: [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock/blob/main/README.zh_CN.md)

