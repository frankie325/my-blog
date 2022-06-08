---
title: 动态修改环境变量
date: "2022-6-5"
sidebar: "auto"
categories:
    - 前端
tags:
    - vben
---

## 动态修改环境变量

```
# 项目标题
VITE_GLOB_APP_TITLE = Vue Admin

# 接口请求地址
VITE_GLOB_API_URL=/basic-api

# 文件上传地址
VITE_GLOB_UPLOAD_URL=/upload
```

我们在项目中使用了上面的一些环境变量，如果打包之后想要修改怎么办？

vben 的解决方案是：

项目中引用环境变量时区分开发环境和生产环境，开发环境下正常使用即可，生产环境下使用挂载在 window 环境下的变量

项目中对环境变量的引用如下所示：

```js
/**
 * @description: 获取项目全局环境变量
 */
export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  // 在生产环境下环境变量挂载在window下，实现打包后也能动态修改全局变量
  const ENV = import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME as any] as unknown as GlobEnvConfig);

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = ENV;

  // VITE_GLOB_APP_SHORT_NAME只能由数字字母下划线组成
  if (!/^[a-zA-z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      'VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.',
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  };
}
```

既然在生产环境使用的是 window 上的环境变量，那 vben 是什么时候注册的呢？

1. 打包之后生成一个`app.config.js`，文件内容就是将环境变量挂载到 window 上
2. 然后只需要在 html 文件中引入
3. 想要修改环境变量时，只需要修改`app.config.js`即可

我们来看下打包命令

```json
{
    "script": {
        "build": "cross-env NODE_ENV=production vite build && esno ./build/script/postBuild.ts"
    }
}
```

这里使用了两个工具包

-   cross-env：可以处理 windows 和其他 unix 系统在设置环境变量的写法上不一致的问题
-   esno：因为 node 只能执行 js 文件，使用该工具可以执行 ts 文件

`app.config.js`文件的生成就是在`./build/script/postBuild.ts`文件执行之后创建的

### 生成 app.config.js 文件

```ts
// ./build/script/postBuild.ts
import colors from "picocolors";

import pkg from "../../package.json";
import { runBuildConfig } from "./buildConf";

export const runBuild = async () => {
    try {
        const argvList = process.argv.splice(2);

        if (!argvList.includes("disabled-config")) {
            runBuildConfig();
        }
        // 打包结束
        console.log(`✨ ${colors.cyan(`[${pkg.name}]`)}` + " - build successfully!");
    } catch (error) {
        // 错误了则退出进程
        console.log(colors.red("vite build error:\n" + error));
        process.exit(1);
    }
};
runBuild();
```

将挂载环境变量的 js 语句输出到 `app.config.js` 文件中，`app.config.js`会根据 outputDir 输出到打包文件目录下

```ts
// ./build/script/buildConf.ts
import fs, { writeFileSync } from "fs-extra";
import colors from "picocolors";

import pkg from "../../package.json";
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from "../constant";
import { getEnvConfig, getRootPath } from "../utils";
import { getConfigFileName } from "../getConfigFileName";

interface CreateConfigParams {
    configName: string;
    config: any;
    configFileName?: string;
}

function createConfig(params: CreateConfigParams) {
    const { configName, config, configFileName } = params;

    try {
        // 将环境变量挂载到window的变量上
        const windowConf = `window.${configName}`;
        // 确保该变量不可修改
        const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, "");
        // 创建打包目录，因为vite打包时已经创建了，这里是确保打包目录的存在
        fs.mkdirp(getRootPath(OUTPUT_DIR));
        // 将内容输出到app.config.js文件中
        writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

        console.log(colors.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
        console.log(colors.gray(OUTPUT_DIR + "/" + colors.green(configFileName)) + "\n");
    } catch (error) {
        console.log(colors.red("configuration file configuration file failed to package:\n" + error));
    }
}

export function runBuildConfig() {
    const config = getEnvConfig(); // 获取以VITE_GLOB_开头的环境变量
    const configFileName = getConfigFileName(config);
    createConfig({ config, configName: configFileName, configFileName: GLOB_CONFIG_FILE_NAME });
}
```

:::warning 注意
只有以 VITE*GLOB* 开头的环境变量才会挂载到 window 上
:::

其中使用了 `dotenv` 工具包：dotenv 能够将环境变量从.env 文件加载到 process.env，这里我们只是使用 dotenv 将.env 文件中的环境变量解析成对象

```ts
// ./build/utils.ts
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

/**
 * @description 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
    const script = process.env.npm_lifecycle_script;
    const reg = new RegExp("--mode ([a-z_\\d]+)");
    const result = reg.exec(script as string) as any;
    if (result) {
        const mode = result[1] as string;
        return [".env", `.env.${mode}`];
    }
    return [".env", ".env.production"];
}

/**
 * @description: 获取以VITE_GLOB_开头的环境变量
 */
export function getEnvConfig(match = "VITE_GLOB_", confFiles = getConfFiles()) {
    let envConfig = {};
    confFiles.forEach((item) => {
        try {
            // 使用dotenv解析.env文件，得到包含环境变量的对象
            const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
            envConfig = { ...envConfig, ...env };
        } catch (e) {
            console.error(`Error in parsing ${item}`, e);
        }
    });

    // 将VITE_GLOB_开头的环境变量筛选出来
    const reg = new RegExp(`^(${match})`);
    Object.keys(envConfig).forEach((key) => {
        if (!reg.test(key)) {
            Reflect.deleteProperty(envConfig, key);
        }
    });

    return envConfig;
}

/**
 * @description: 获取项目根目录下文件的绝对路径
 */
export function getRootPath(...dir: string[]) {
    return path.resolve(process.cwd(), ...dir);
}
```

### 在 html 中引入 app.config.js 文件

借助 `vite-plugin-html` 插件，生成 script 标签引入 `app.config.js` 即可

```ts
import type { PluginOption } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import pkg from "../../../package.json";
import { GLOB_CONFIG_FILE_NAME } from "../../constant";

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
    const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;
    const path = VITE_PUBLIC_PATH.endsWith("/") ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

    const getAppConfigSrc = () => {
        return `${path || "/"}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
    };

    const htmlPlugin: PluginOption[] = createHtmlPlugin({
        minify: isBuild, //是否压缩
        inject: {
            // 注入ejs模板的数据，使用ejs语法引用
            data: {
                title: VITE_GLOB_APP_TITLE,
            },
            // 生成script标签，引入app.config.js
            tags: isBuild
                ? [
                      {
                          tag: "script",
                          attrs: {
                              src: getAppConfigSrc(),
                          },
                      },
                  ]
                : [],
        },
    });

    return htmlPlugin;
}
```
