Vue.use(antd);
var ImgBase = "http://mec.hml-media.net/";
var vm = new Vue({
  el: '#app',
  beforeCreate: function beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: 'normal_login'
    });
  },
  data: function data() {
    return {
      advertList: [],
      noticeList: [],
      userName: ['userName', {
        rules: [{
          required: true,
          message: '手机号必填！'
        }]
      }]
    };
  },
  methods: {
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      var self = this;
      this.form.validateFields(function (err, values) {
        if (!err) {
          console.log('Received values of form: ', values);
          axios({
            method: 'post',
            url: "http://8.131.234.186:8200/res/login?username=".concat(values.userName, "&password=").concat(values.password)
          }).then(function (res) {
            console.log(res);
            var code = res.data.code;
            var t = res.data.t;
            var msg = res.data.msg;

            if (code !== 1200) {
              self.$message.error(msg);
            } else {
              self.$message.success("您的账号已验证成功，即将登陆");
              sessionStorage.setItem('USERNAME', t.username);
              sessionStorage.setItem('TOKEN', t.token);
              axios({
                url: "http://8.131.234.186:8200/res/role/user",
                headers: {
                  'Token': sessionStorage.getItem('TOKEN')
                },
                methods: 'GET'
              }).then(function (resA) {
                var code = resA.data.code;
                var t = resA.data.t;
                var msg = resA.data.msg;
                sessionStorage.setItem('MENU', JSON.stringify(t));
                axios({
                  url: "http://8.131.234.186:8200/res/role/user/functions",
                  headers: {
                    'Token': sessionStorage.getItem('TOKEN')
                  },
                  methods: 'GET'
                }).then(function (resB) {
                  console.log("res", resB);
                  var code = resB.data.code;
                  var t = resB.data.t;
                  var msg = resB.data.msg;
                  sessionStorage.setItem('Functions', JSON.stringify(t));

                  if (code !== 1200) {
                    self.$message.error(msg);
                  } else {
                    location.href = "http://mec-peugeot.haiminglan.cn/reso/"; //location.href="http://localhost:10001/#/"
                  }
                }).catch(function (e) {
                  self.$message.error("获取信息失败");
                });
              });
            }
          });
        }
      });
    },
    handleRegister: function handleRegister(e) {
      console.log("handleRegister"); // this.$message.warning("该功能暂未开放")

      location.href = "http://mec-peugeot.haiminglan.cn/register.html";
    }
  },
  mounted: function mounted() {
    var self = this;
    axios({
      url: "http://8.131.234.186:8200/res/index/info",
      methods: 'GET'
    }).then(function (res) {
      var t = res.data.t;
      console.log("Get", t);
      self.advertList = t.advertList;
      self.noticeList = t.noticeList;
    });
  }
});