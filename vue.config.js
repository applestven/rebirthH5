module.exports = {
    publicPath:"./",
    devServer: {
        // port: 3344,
        // open: true,
        // proxy 排前的代理有优先级  如下案例调换顺序 ，则优先http://192.168.0.111:5588/ ，https://openapi.jushuitan.com/则被屏蔽/*  */
        proxy:{
            '/gps_web/open':{
                target:'https://openapi.jushuitan.com/',
                ws:true,
                logLeve: 'debug',
                secure: false,
                changeOrigin: true,
                pathRewrite: {"^/gps_web/open":'/open'}
            },
            '/gps_web/': {
                // target: `http://47.108.106.234:8084/`,
                // target: `http://192.168.0.177:38080/`,
                target: `http://192.168.0.111:5588/`,
                // target: `http://120.24.78.29:8084/`,
                // target: `http://192.168.20.152:8080/`,
                changeOrigin: true,
                logLeve: 'debug',
                pathRewrite: {
                  ['^' + process.env.VUE_APP_BASE_API]: `/`
                }
            }
            
        }
    },
   
    css: {
        loaderOptions: {
            sass: {
                // additionalData: `@import "@/assets/theme.scss";`
            },
            scss: {

            }
        }
    }
}