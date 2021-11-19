Vue.use(antd)
let ImgBase = "http://mec.hml-media.net/"
var vm = new Vue({
    el: '#app',
    beforeCreate:function() {
        this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    data:function() {
        return {
            advertList: [],
            noticeList: [],
            userName:['userName',{ rules: [{ required: true, message: '手机号必填！' }]}]
        }
    },
    methods: {
        handleSubmit:function(e) {
            e.preventDefault();
            const self=this;
            this.form.validateFields(function(err, values){
                if (!err) {
                    console.log('Received values of form: ', values);
                    axios({
                        method: 'post',
                        url: `http://8.131.234.186:8200/res/login?username=${values.userName}&password=${values.password}`
                    }).then(function(res){
                        console.log(res);
                        let code=res.data.code;
                        let t=res.data.t;
                        let msg=res.data.msg; 
                        if (code !== 1200) {
                            self.$message.error(msg)
                        } else {
                            self.$message.success("您的账号已验证成功，即将登陆");

                            sessionStorage.setItem('USERNAME', t.username);
                            sessionStorage.setItem('TOKEN', t.token);

                            axios({
                                url: `http://8.131.234.186:8200/res/role/user`,
                                headers: {
                                    'Token': sessionStorage.getItem('TOKEN'),
                                },
                                methods: 'GET'
                            }).then(function(resA){ 
                                let code=resA.data.code;
                                let t=resA.data.t;
                                let msg=resA.data.msg; 
                                sessionStorage.setItem('MENU', JSON.stringify(t))
                                axios({
                                    url: `http://8.131.234.186:8200/res/role/user/functions`,
                                    headers: {
                                        'Token': sessionStorage.getItem('TOKEN'),
                                    },
                                    methods: 'GET'
                                }).then(function(resB){
                                    console.log("res", resB)

                                    let code=resB.data.code;
                                    let t=resB.data.t;
                                    let msg=resB.data.msg; 
                                    sessionStorage.setItem('Functions', JSON.stringify(t))
                                    if (code !== 1200) {
                                        self.$message.error(msg)
                                    } else {
                                        location.href = "http://mec-peugeot.haiminglan.cn/reso/"
                                        //location.href="http://localhost:10001/#/"
                                    }

                                }).catch(function(e){
                                    self.$message.error("获取信息失败")
                                })
                            })
                        }
                    })
                }
            });
        },
        handleRegister:function(e) {
            console.log("handleRegister")
            // this.$message.warning("该功能暂未开放")
            location.href = "http://mec-peugeot.haiminglan.cn/register.html"
        }
    },
    mounted:function() {
        const self=this;
        axios({
            url: `http://8.131.234.186:8200/res/index/info`,
            methods: 'GET'
        }).then(function(res){ 
            let t=res.data.t;
            console.log("Get", t)
            self.advertList = t.advertList;
            self.noticeList = t.noticeList;
        })
    }
})