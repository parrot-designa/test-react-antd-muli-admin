//@ts-nocheck
import React, { FC, useState, useEffect, useRef, Component } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import MenuView from '@/components/common/menu'
import MenuCustom from '@/components/Menu'
import classNames from 'classnames'
import { Layout, BackTop } from 'antd'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import Header from '@/components/common/header'
import TabPanes from '@/components/common/tabPanes'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import styles from './Home.module.less'

const noNewTab = ['/login'] // 不需要新建 tab的页面 
 

interface Props extends ReduxProps {}

interface PanesItemProps {
  title: string;
  content: Component;
  key: string;
  closable: boolean;
  path: string;
}

const Home: FC<Props> = (props) => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('home')
  const [panesItem, setPanesItem] = useState<PanesItemProps>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const pathRef: RefType = useRef<string>('')

  const history = useHistory()
  const { pathname, search } = useLocation() 
 

  useEffect(() => { 
 

    let startIndex=window.location.href.indexOf('fileDetail')
    let string=window.location.href.substr(startIndex)
     // 未登录
     if (!sessionStorage.getItem('TOKEN') && pathname !== '/login' && pathname.includes('fileDetail')) { 
      window.location.href=`https://mec.peugeot.com.cn/?${string}`
      //window.location.href=`http://127.0.0.1:5500/home/login.html?${string}`
      return
    }
 
    // 未登录
    if (!sessionStorage.getItem('TOKEN') && pathname !== '/login') { 
      history.replace({ pathname: '/login' })
      return
    }

    if (sessionStorage.getItem('TOKEN') && pathname === '/print') {
      history.push({ pathname: '/print' })
      return
    }

    const { tabKey, title, component: Content } = getKeyName(pathname)
    // 新tab已存在或不需要新建tab，return
    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(tabKey)
      return
    }

   

    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + decodeURIComponent(search) : pathname
    pathRef.current = newPath
 

    setPanesItem({
      title:title==='文件详情'?pathRef?.current?.match(/fileName=([a-zA-Z0-9\-\.\u4e00-\u9fa5\_]*)/)?.[1]:title,
      content: Content,
      key: title==='文件详情'?pathRef?.current:tabKey,
      closable: tabKey !== 'home',
      path: newPath
    })

    setTabActiveKey(title==='文件详情'?pathRef?.current:tabKey)

  }, [history, pathname, search])
 
  const collapsed=sessionStorage.getItem('COLLAPSED')=='TRUE';

  const [data,forceUpdate]=useState([]);

  const forceUpdateFunc=()=>{
    forceUpdate([])
  } 

  return (
    <Layout
      className={styles.container} 
      style={{ display: (pathname.includes('/login') || pathname.includes('/print')) ? 'none' : 'flex' }}
    >
      <MenuCustom data={data}/>
      <Layout
        className={classNames(styles.content, {
          [styles.collapsed]: collapsed
        })}
        style={collapsed?{width:`calc(100% - 80px)`}:{width:`calc(100% - 240px)`}}
      >
        <Header forceUpdate={forceUpdateFunc}/>
        <Layout.Content >
          <TabPanes
            defaultActiveKey="home"
            panesItem={panesItem}
            tabActiveKey={tabActiveKey}
          />
        </Layout.Content>
      </Layout>
      <BackTop visibilityHeight={1080} />
    </Layout>
  )
}

export default connect(
  (state) => state,
  actions
)(Home)
