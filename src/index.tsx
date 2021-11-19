import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux' 
import { store, persistor } from '@/store' 
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './App'
import "react-app-polyfill/ie11";
import '@/assets/css/public.less'
import '@/utils'
import '@babel/polyfill'

moment.locale('zh-cn')

ReactDOM.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  document.getElementById('root')
)
