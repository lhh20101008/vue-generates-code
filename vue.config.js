const config = {
    devServer: {
        port: 8019
    },
    chainWebpack: config => {
        config.plugin('html')
            .tap(args => {
                args[0].title = 'Vue代码自动生成工具'
                return args
            })
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
        }
    }
}

module.exports = config;
