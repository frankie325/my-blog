---
title: vben实现主题切换
date: "2022-1-11"
sidebar: "auto"
categories:
    - 前端
tags:
    - vben
---

## 主题切换功能

1. 修改 ant-design 的 less 变量
   首先先在 vite 修改 ant-design 的全局变量颜色

```js
module.exports = {
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: generateModifyVars(), // 注册less全局变量
                javascriptEnabled: true, //在js文件能够直接引入less样式文件
            },
        },
    },
};
```

generateModifyVars 方法的作用就是修改 ant-design 的 less 变量，
主要是修改最常用的通用变量，会根据 primaryColor 变量（项目默认的主题颜色），生成一系列主色，覆盖 ant-design 的 primary-color，当然也可以和 ant-design 的保持一致

```js
export function generateModifyVars(dark = false) {
    const palettes = generateAntColors(primaryColor); // 生成主色系列
    const primary = palettes[5];

    const primaryColorObj: Record<string, string> = {};

    for (let index = 0; index < 10; index++) {
        primaryColorObj[`primary-${index + 1}`] = palettes[index];
    }

    // 获取ant design的所有全局变量
    const modifyVars = getThemeVariables({ dark });

    return {
        ...modifyVars,
        ...primaryColorObj,
        // Used for global import to avoid the need to import each style file separately
        // reference:  Avoid repeated references
        hack: `${modifyVars.hack} @import (reference) "${resolve("src/design/config.less")}";`,
        "primary-color": primary,
        "info-color": primary,
        "processing-color": primary,
        "success-color": "#55D187", // 成功色
        "error-color": "#ED6F6F", // 错误色
        "warning-color": "#EFBD47", // 警告色
        "font-size-base": "14px", // 主字号
        "border-radius-base": "2px", // 组件/浮层圆角
        "link-color": primary, // 链接色
        "app-content-background": "#fafafa", //   Link color
    };
}
```

2. 使用 vite-plugin-theme 插件

切换主题原理：在 vite 处理 css 后，解析 css 中和 colorVariables 选项中相匹配的颜色，将这些颜色替换成新的颜色，并生成样式文件，动态插入到指定的位置(默认 body 底部)，以覆盖之前的样式，来达到切换主题的效果

这里的 themeColors 也就是和我们在上面设置的 less 变量的主色保持一致，所以切换主题时，项目中用到的@primary-color 颜色都会替换掉

```js
const themeColors = getThemeColors();

viteThemePlugin({
    colorVariables: [...themeColors],
});
```

切换主题需要调用 vite-plugin-theme 的替换方法，也就是替换 colorVariables 选项，这里说下 colorVariables

比如只设置了一个颜色， `colorVariables: ['#dedede']` ，在项目中使用 `#dedede` 这一颜色，那么你想切换颜色时，重新设置选项中的颜色`colorVariables: ['#ff5616']` ，注意索引位置必须保持一致

```js
import { replaceStyleVariables } from "vite-plugin-theme/es/client";

replaceStyleVariables({
    // colorVariables: [...getThemeColors(color), ...colors],
    colorVariables: [...getThemeColors(color)],
});
```

3. 黑暗模式的切换

antdDarkThemePlugin 的作用，就是给 ant-design 的样式添加属性选择器[data-theme="dark"] .ant-xxx，生成一份 ant-design 的黑暗主题样式，通过设置 html 的 data-theme 属性来实现黑暗模式的切换

```js
  antdDarkThemePlugin({
      // 先加载ant-design的样式，后面用来生成暗色主题的样式
      preloadFiles: [
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        path.resolve(process.cwd(), 'src/design/index.less'),
      ],
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // extractCss: false,
      // 设置暗色主题时，less变量的颜色
      darkModifyVars: {
        ...generateModifyVars(true), // 生成暗色主题时less变量的颜色
        'text-color': '#c9d1d9',
        'primary-1': 'rgb(255 255 255 / 8%)',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        'heading-color': 'rgb(255 255 255 / 65%)',
        // black: '#0e1117',
        // #8b949e
        'text-color-secondary': '#8b949e',
        'border-color-base': '#303030',
        // 'border-color-split': '#30363d',
        'item-active-bg': '#111b26',
        'app-content-background': '#1e1e1e',
        'tree-node-selected-bg': '#11263c',

        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#111b26',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24',
      },
    }),
```

## 头部和菜单背景颜色的切换

在 html 作用域下定义的 css 变量，通过 less 变量去使用

```less
html {
    // header
    --header-bg-color: #394664;
    --header-bg-hover-color: #273352;
    --header-active-menu-bg-color: #273352;

    // sider
    --sider-dark-bg-color: #273352;
    --sider-dark-darken-bg-color: #273352;
    --sider-dark-lighten-bg-color: #273352;

    @header-dark-bg-color: var(--header-bg-color);
    @header-dark-bg-hover-color: var(--header-bg-hover-color);
    @top-menu-active-bg-color: var(--header-active-menu-bg-color);

    @sider-dark-bg-color: var(--sider-dark-bg-color);
    @sider-dark-darken-bg-color: var(--sider-dark-darken-bg-color);
    @sider-dark-lighten-bg-color: var(--sider-dark-lighten-bg-color);
}
```

需要修改头部或者菜单的颜色时，js 动态修改html作用域下的 css 变量的值即可

```js
const docEle = document.documentElement;

/**
 * @description: 设置css变量的值
 */
export function setCssVar(prop: string, val: any, dom = docEle) {
  dom.style.setProperty(prop, val);
}
```