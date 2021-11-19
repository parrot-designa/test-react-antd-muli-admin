import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  Component
} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Tabs, Alert, Dropdown, Menu } from 'antd'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import { SyncOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import style from './TabPanes.module.less'
import Home from '@/pages/home'


import {
  HomeOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs

const initPane = [
  {
    title: '广场中心',
    key: 'home',
    content: Home,
    closable: false,
    path: '/home',
    icon: HomeOutlined
  }
]


// 多页签组件
const TabPanes = (props) => {
  const [activeKey, setActiveKey] = useState<string>('')
  const [panes, setPanes] = useState<CommonObjectType[]>(initPane)
  const [selectedPanel, setSelectedPanel] = useState<CommonObjectType>({})
  const pathRef: RefType = useRef<string>('')

  const {
    tabActiveKey,
    panesItem,
  } = props

  const history = useHistory()

  const { pathname, search } = useLocation()

  // 记录当前打开的tab
  const storeTabs = useCallback(
    (ps): void => { 
      const pathArr = ps.reduce(
        (prev: CommonObjectType[], next: CommonObjectType) => [
          ...prev,
          next.path
        ],
        []
      )  
      sessionStorage.setItem('CURTAB', JSON.stringify(pathArr))
    },
    []
  )

  // 从本地存储中恢复已打开的tab列表
  const resetTabs = useCallback((): void => {

    const curTab = JSON.parse(sessionStorage.getItem('CURTAB')||"[]");
 
    const initPanes = curTab.filter(item => item !== 'home').reduce(
      (prev: CommonObjectType[], next: string) => {
        const { title, tabKey, component: Content, icon } = getKeyName(next.includes('fileDetail')?'fileDetail':next)
 
        return [
          ...prev,
          {
            title:title==='文件详情'?next?.match(/fileName=([a-zA-Z0-9\-\.\u4e00-\u9fa5\_]*)/)?.[1]:title,
            key: title==='文件详情'?next:tabKey,
            content: Content,
            closable: tabKey !== 'home',
            path: next,
            icon
          }
        ]
      },
      []
    ) 
    const { tabKey } = getKeyName(pathname)
    setPanes([...initPanes])
    setActiveKey(tabKey==='fileDetail'?pathname:tabKey)
 
  }, [sessionStorage.getItem('CURTAB'), pathname])

  // 初始化页面
  useEffect(() => {
    resetTabs()
  }, [])

  useEffect(() => { 

    const newPath = pathname+decodeURIComponent(search)
 
    // 当前的路由和上一次的一样，return
    if (!panesItem.path || panesItem.path === pathRef.current) return

    // 保存这次的路由地址
    pathRef.current = newPath

    const index = panes.findIndex(
      (_: CommonObjectType) => _.key === panesItem.key
    )
 
    // 新tab已存在，重新覆盖掉（解决带参数地址数据错乱问题）
    if (index > -1) {
      panes[index].path = newPath
      setPanes(panes)
      setActiveKey(tabActiveKey)
      return
    } 
    // 添加新tab并保存起来
    panes.push(panesItem)
    setPanes([...panes])
    setActiveKey(tabActiveKey) 
    storeTabs(panes)
 
  }, [panesItem, pathname, search, storeTabs, tabActiveKey]);

 // tab点击
 const onTabClick = (targetKey: string): void => {
  const { path } = panes.filter(
    (item: CommonObjectType) => item.key === targetKey
  )[0]
  history.push({ pathname: path })
}

  // tab切换
  const onChange = (tabKey: string): void => {
    setActiveKey(tabKey)
  }


    // 移除tab
    const remove = (targetKey: string): void => {
      const curTab = JSON.parse(sessionStorage.getItem('CURTAB')||"[]");
      
      const delIndex = panes.findIndex(
        (item: CommonObjectType) => item.key === targetKey
      )
      panes.splice(delIndex, 1)
    
  
      // // 删除非当前tab
      // if (targetKey !== activeKey) {
      //   const nextKey = activeKey
      //   setPanes(panes)
      //   setActiveKey(nextKey)
      //   storeTabs(panes)
      //   return
      // }
  
      // 删除当前tab，地址往前推
      const nextPath = curTab[delIndex - 1]
      const { tabKey } = getKeyName(nextPath)
 
      history.push(nextPath)
   
      setPanes([...panes]) 
      storeTabs(panes)
    }
  

  // 阻止右键默认事件
  const preventDefault = (e: CommonObjectType, panel: object) => {
    e.preventDefault()
    setSelectedPanel(panel)
  }
  // tab新增删除操作
  const onEdit = (targetKey: string | any, action: string) =>
  action === 'remove' && remove(targetKey)
 
 

  return (
    <Tabs
      activeKey={activeKey}
      className={style.tabs}
      hideAdd
      onChange={onChange}
      onEdit={onEdit}
      onTabClick={onTabClick}
      type="editable-card"
    >
      {panes.map((pane: CommonObjectType) => (
        <TabPane
          closable={pane.closable}
          key={pane.key}
          tab={
            <div>
              <span onContextMenu={(e) => preventDefault(e, pane)}>
                {pane.icon ? <pane.icon style={{ fontSize: 18 }} /> : pane.title}
              </span>
            </div>
          }
        >
          <pane.content path={pane.path} />
        </TabPane>
      ))}
    </Tabs>
  )
}

export default connect(
  (state) => state,
  actions
)(TabPanes)
