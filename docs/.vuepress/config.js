const vuepressPlugin = require("./config/plugin");

module.exports = {
    base: "/my-blog/",
    title: "__frank",
    description: "我的博客",
    theme: "reco",
    // 移动端优化
    head: [
        ["link", { rel: "ico", href: "/favicon.ico" }],
        ["meta", { name: "keywords", content: "Vuepress博客  __frank" }],
        ["meta", { name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=no" }],
        ["script", { src: "/js/bodyClick.js" }],
    ],
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
        vssueConfig: {
            platform: "github-v4",
            owner: "kfg1234",
            repo: "my-blog",
            clientId: "dac6aac3cb0f58ce480d",
            clientSecret: "8bda2b69e219b59a9869d749124e151f525401d4",
        },
    },
    // 插件
    plugins: vuepressPlugin(),
};
