const { createProxyMiddleware }  = require("http-proxy-middleware");

module.exports = function(app) {
    // app.use(
    //     createProxyMiddleware("/base/", {
    //         target: "http://45.32.15.21:8090/",
    //         changeOrigin: true
    //     })
    // );
    // app.use(
    //     createProxyMiddleware("/api", {
    //         target: "http://8.131.234.186:8200/res",
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '/api': ''
    //         }
    //     })
    // );
};