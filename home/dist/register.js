import "core-js/modules/es6.object.keys.js";
import "core-js/modules/es6.function.name.js";
import "core-js/modules/es6.array.find.js";
Vue.use(antd);
var ImgBase = "http://mec.hml-media.net/";
var vm = new Vue({
  el: '#app',
  data: function data() {
    var self = this;
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, {
        name: 'coordinated',
        onFieldsChange: self.handleValuesChange
      }),
      sendTime: 0,
      roleList: [],
      agentList: [],
      isDealers: false,
      isAgent: false
    };
  },
  methods: {
    handleValuesChange: function handleValuesChange(value, props) {
      if (Object.keys(props)[0] === 'userTypeId') {
        var changeTypeId = props[Object.keys(props)[0]].value;
        var name = this.roleList.find(function (item) {
          return item.id === changeTypeId;
        }).name;

        if (name === "经销商") {
          this.isAgent = false;
          this.isDealers = true;
        } else if (name === '代理商') {
          this.isAgent = true;
          this.isDealers = false;
        } else {
          this.isAgent = false;
          this.isDealers = false;
        }
      }
    },
    sendCode: function sendCode() {
      var _this = this;

      var self = this;
      var phone = this.form.getFieldValue('phone');

      if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
        self.$message.error('请输入正确的手机号!');
        return;
      }

      axios({
        method: 'get',
        url: "http://8.131.234.186:8200/res/index/send-sms?phone=".concat(phone)
      }).then(function (res) {
        console.log(res);

        if (res.data.code === 1200) {
          _this.$message.success("正在发送验证码，请稍候");
        }

        self.sendTime = 60;
        var setTimeOut = setInterval(function () {
          self.sendTime = --self.sendTime;

          if (self.sendTime === 0) {
            clearInterval(setTimeOut);
          }
        }, 1000);
      });
    },
    handleSubmit: function handleSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      this.form.validateFields(function (err, values) {
        if (!err) {
          console.log('Received values of form: ', values);
          axios({
            method: 'post',
            url: "http://8.131.234.186:8200/res/index/register?".concat(Qs.stringify(values))
          }).then(function (res) {
            console.log("Res", res);

            if (res.data.code === 1200) {
              _this2.$message.success('注册成功，即将跳转到登陆页...');

              location.href = 'http://mec-peugeot.haiminglan.cn/';
            } else {
              _this2.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    handleRegister: function handleRegister(e) {
      console.log("handleRegister");
      this.$message.warning("该功能暂未开放");
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    axios({
      url: "http://8.131.234.186:8200/res/index/role-list",
      methods: 'GET'
    }).then(function (res) {
      var t = res.data.t;
      _this3.roleList = t;
    });
    axios({
      url: "http://8.131.234.186:8200/res/index/company",
      methods: 'GET'
    }).then(function (res) {
      var t = res.data.t;
      console.log("Get", t);
      _this3.agentList = t;
    });
  }
});