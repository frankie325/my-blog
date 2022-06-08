module.exports = {
    base: "/",
    title: " ",
    description: " ",
    theme: "reco",
    // 移动端优化
    head: [["meta", { name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=no" }]],
    markdown: {
        lineNumbers: true, //显示代码块的行数
    },
    themeConfig: {
        type: "blog",
        logo: "/avatar.jpg",
        author: "__frank",
        authorAvatar: "/avatar.jpg",
        /**
         * support for
         * 'default'
         * 'funky'
         * 'okaidia'
         * 'solarizedlight'
         * 'tomorrow'
         */
        codeTheme: "tomorrow", // default 'tomorrow' //代码块主题配色
        subSidebar: "auto",
        search: true,
        searchMaxSuggestions: 10, // 显示最大的搜索数
        lastUpdated: "Last Updated",
        // 导航栏
        nav: [
            { text: "主页", link: "/", icon: "reco-home" },
            { text: "时间轴", link: "/timeline/", icon: "reco-date" },
        ],
        // 博客配置
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                link: "/category/",
                text: "分类", // 默认文案 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                link: "/tags/",
                text: "标签", // 默认文案 “标签”
            },
            socialLinks: [
                // 信息栏展示社交信息
                { icon: "reco-github", link: "https://github.com/kfg1234" },
                { icon: "reco-npm", link: "https://www.npmjs.com/~reco_luan" },
            ],
        },
        friendLink: [
            {
                title: "午后南杂",
                desc: "Enjoy when you can, and endure when you must.",
                logo: "https://photo.smallsunnyfox.com/images/blog/friendlink/reco.png",
                link: "https://www.recoluan.com",
            },
            {
                title: "vuepress-theme-reco",
                desc: "A simple and beautiful vuepress Blog & Doc theme.",
                logo: "https://photo.smallsunnyfox.com/images/blog/friendlink/theme_reco.png",
                link: "https://vuepress-theme-reco.recoluan.com",
            },
        ],
    },
    // 插件
    plugins: [
        // [
        //     "sakura",
        //     {
        //         num: 20, // 默认数量
        //         show: true, //  是否显示
        //         zIndex: -1, // 层级
        //         img: {
        //             replace: false, // false 默认图 true 换图 需要填写httpUrl地址
        //             httpUrl: "...", // 绝对路径
        //         },
        //     },
        // ],
        // [
        //     "cursor-effects",
        //     {
        //         size: 2, // size of the particle, default: 2
        //         shape: ["star" | "circle"], // shape of the particle, default: 'star'
        //         zIndex: 999999999, // z-index property of the canvas, default: 999999999
        //     },
        // ],
        [
            "@vuepress/medium-zoom",
            {
                selector: "img",
                // medium-zoom options here
                // // See: https://github.com/francoischalifour/medium-zoom#options
                // options: {
                //     margin: 16,
                // },
            },
        ],
        [
            "vuepress-plugin-auto-sidebar",
            {
                sidebarDepth: 2,
                title: {
                    // mode: "titlecase",
                    map: {
                        "/views/front-end/webpack/": "🎉 Webpack5笔记 🎉",
                    },
                },
                collapse: {
                    open: true,
                },
            },
        ],
        [
            "ribbon-animation",
            {
                size: 90, // 默认数据
                opacity: 0.3, //  透明度
                zIndex: -1, //  层级
                opt: {
                    // 色带HSL饱和度
                    colorSaturation: "80%",
                    // 色带HSL亮度量
                    colorBrightness: "60%",
                    // 带状颜色不透明度
                    colorAlpha: 0.65,
                    // 在HSL颜色空间中循环显示颜色的速度有多快
                    colorCycleSpeed: 6,
                    // 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
                    verticalPosition: "center",
                    // 到达屏幕另一侧的速度有多快
                    horizontalSpeed: 200,
                    // 在任何给定时间，屏幕上会保留多少条带
                    ribbonCount: 2,
                    // 添加笔划以及色带填充颜色
                    strokeSize: 0,
                    // 通过页面滚动上的因子垂直移动色带
                    parallaxAmount: -0.5,
                    // 随着时间的推移，为每个功能区添加动画效果
                    animateSections: true,
                },
                ribbonShow: false, //  点击彩带  true显示  false为不显示
                ribbonAnimationShow: true, // 滑动彩带
            },
        ],
        [
            "dynamic-title",
            {
                showIcon: "https://www.zpzpup.com/assets/image/favicon.ico",
                showText: "欢迎回来 O(∩_∩)O~",
                hideIcon: "https://www.zpzpup.com/assets/image/favicon.ico",
                hideText: "失联中。。。快回来~",
                recoverTime: 2000,
            },
        ],
    ],
};
