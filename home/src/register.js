Vue.use(antd)
let ImgBase = "http://mec.hml-media.net/"
var vm = new Vue({
    el: '#app',
    data() {
        const self = this;
        return {
            formLayout: 'horizontal',
            form: this.$form.createForm(this, { name: 'coordinated', onFieldsChange: self.handleValuesChange }),
            sendTime: 0,
            roleList: [],
            agentList:[],
            isDealers: false,
            isAgent: false
        }
    },
    methods: {
        handleValuesChange(value, props) {
            if (Object.keys(props)[0] === 'userTypeId') {
                let changeTypeId = props[Object.keys(props)[0]].value;
                let name = this.roleList.find(item => item.id === changeTypeId).name;

                if(name === "经销商"){
                    this.isAgent=false;
                    this.isDealers=true;
                }else if(name==='代理商'){
                    this.isAgent=true;
                    this.isDealers=false;
                }else{
                    this.isAgent=false;
                    this.isDealers=false;
                }
                 
            }

        },
        sendCode() {
            const self = this;
            let phone = this.form.getFieldValue('phone');
            if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
                self.$message.error('请输入正确的手机号!')
                return;
            }
            axios({
                method: 'get',
                url: `http://8.131.234.186:8200/res/index/send-sms?phone=${phone}`
            }).then(res => {
                console.log(res);
                if (res.data.code === 1200) {
                    this.$message.success("正在发送验证码，请稍候")
                }
                self.sendTime = 60;
                let setTimeOut = setInterval(() => {
                    self.sendTime = --self.sendTime;

                    if (self.sendTime === 0) {
                        clearInterval(setTimeOut)
                    }
                }, 1000)
            })

        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    axios({
                        method: 'post',
                        url: `http://8.131.234.186:8200/res/index/register?${Qs.stringify(values)}`
                    }).then(res => {
                        console.log("Res", res)
                        if (res.data.code === 1200) {
                            this.$message.success('注册成功，即将跳转到登陆页...')
                            location.href = 'http://mec-peugeot.haiminglan.cn/'
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            });
        },
        handleRegister(e) {
            console.log("handleRegister")
            this.$message.warning("该功能暂未开放")
        }
    },
    mounted() {
        axios({
            url: `http://8.131.234.186:8200/res/index/role-list`,
            methods: 'GET'
        }).then(res => { 
            let t=res.data.t;
            this.roleList = t;
        })
        axios({
            url: `http://8.131.234.186:8200/res/index/company`,
            methods: 'GET'
        }).then(res => { 
            let t=res.data.t;
            console.log("Get", t)
            this.agentList = t;
        })
    }
})