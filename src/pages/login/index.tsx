import React, { useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import Logo from '@/assets/img/newlogo.png' 
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import loginApi from '@/api/login'
import roleApi from '@/api/role'

interface Props extends ReduxProps {}

const LoginForm: FC<Props> = ({
  storeData: { theme, userInfo = {} },
  setStoreData
}) => {
  const history = useHistory()
  useEffect(() => {
    
    // 重置 tab栏为首页
    setStoreData('SET_CURTAB', ['/'])
  }, [history, setStoreData, userInfo])

  useEffect(()=>{
    setStoreData('SET_THEME','default')
  },[]);

  // 触发登录方法
  const onFinish = (values: CommonObjectType<string>): void => {
    const { userName, password } = values
   
    loginApi.login({
      username:userName,
      password:password
    }).then(res=>{ 
      sessionStorage.setItem('USERNAME',(res as any).username);
      sessionStorage.setItem('TOKEN',(res as any).token);

      //记录是否是admin登陆
      sessionStorage.setItem('IS_ADMIN_LOGIN',"1");

      roleApi.getCurrentFunctionPermission().then(res=>{ 
        // sessionStorage.setItem('MENU',JSON.stringify(res)); 

        // history.push('/') 
        sessionStorage.setItem('Functions',JSON.stringify(res))
      
      }).catch((e)=>{ 
        message.error("获取信息失败")
      })

      roleApi.getCurrentPermission().then(res=>{ 
        sessionStorage.setItem('MENU',JSON.stringify(res)); 

        history.push('/')
      
      }).catch((e)=>{ 
        message.error("获取信息失败")
      })

    }).catch((e)=>{ 
      message.error("登陆账号密码异常")
    }) 
  }

  const FormView = (
    <Form className="login-form" name="login-form" onFinish={onFinish}>
      <Form.Item
        name="userName"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]} 
      >
        <Input.Password
          placeholder="密码"
          prefix={<LockOutlined />}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          className="login-form-button"
          htmlType="submit"
          size="large"
          type="primary"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )

  const floatColor = theme === 'default' ? '24,144,255' : '110,65,255'
  return (
    <div className="login-layout" id="login-layout">
      <ReactCanvasNest
        config={{
          pointColor: floatColor,
          lineColor: floatColor,
          pointOpacity: 0.6
        }}
        style={{ zIndex: 1 }}
      />
      <div className="logo-box">
        <img alt="" className="logo" src={Logo} />
        <span className="logo-name">东风标致MEC素材广场</span>
      </div>
      {FormView}
    </div>
  )
}

export default connect(
  (state) => state,
  actions
)(LoginForm)
