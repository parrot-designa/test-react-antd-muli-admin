import React, { useState, useEffect, FC, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Layout, message } from 'antd'

import MyIconFont from '@/components/common/myIconfont'
import { getKeyName } from '@/assets/js/publicFunc'
import logo from '@/assets/img/newlogo.png'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import styles from './Menu.module.less'
import roleApi from '@/api/role'
import {
  HomeOutlined,
  MacCommandOutlined,
  UsergroupDeleteOutlined,
  DeleteOutlined,
  MailOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  SettingOutlined
} from '@ant-design/icons'

const mapIcon = {
  '文件超市': MacCommandOutlined,
  '广场中心': HomeOutlined,
  '个人天地': UsergroupDeleteOutlined,
  '回收站': DeleteOutlined,
  '小狮信箱': MailOutlined,
  '公告看板': DashboardOutlined,
  '账户管理': TeamOutlined,
  '权限管理': SafetyCertificateOutlined,
  '常规管理': SettingOutlined
}

const { SubMenu } = Menu

interface Props extends ReduxProps { }

type MenuType = CommonObjectType<string>

const MenuView: FC<Props> = ({ storeData: { theme, userInfo, collapsed } }) => {
  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)

  useEffect(() => {
    const { tabKey } = getKeyName(pathname)
    setCurrent(tabKey)
  }, [pathname])

  // 菜单点击事件
  const handleClick = ({ key }): void => {
    setCurrent(key)
  }

  // 子菜单的标题
  const subMenuTitle = (data: MenuType): JSX.Element => {
    const { icon: MenuIcon, iconfont } = data
    return (
      <span>
        {iconfont ? (
          <MyIconFont type={iconfont} style={{ fontSize: '14px' }} />
        ) : (
          !!MenuIcon && <MenuIcon />
        )}
        <span className={styles.noselect}>{data.name}</span>
      </span>
    )
  }

  // 创建可跳转的多级子菜单
  const createMenuItem = (data: MenuType): JSX.Element => {
    return (
      <Menu.Item className={styles.noselect} key={data.key} title={data.name}>
        <Link to={data.path}>{subMenuTitle(data)}</Link>
      </Menu.Item>
    )
  }

  // 创建可展开的第一级子菜单
  const creatSubMenu = (data: CommonObjectType): JSX.Element => {
    const menuItemList = []
    data.routes.map((item: MenuType) => {
      menuItemList.push(renderMenu(item))
      return []
    })

    return menuItemList.length > 0 ? (
      <SubMenu key={data.key} title={subMenuTitle(data)}>
        {menuItemList}
      </SubMenu>
    ) : null
  }

  // 创建菜单树
  const renderMenuMap = (list: CommonObjectType): JSX.Element[] =>{ 
    return list.map((item) => renderMenu(item))
  }

  // 判断是否有子菜单，渲染不同组件
  function renderMenu(item: MenuType) {
    return item.type === 'subMenu' ? creatSubMenu(item) : createMenuItem(item)
  }


  const transformMenu = () => { 
    const localMenu = JSON.parse(sessionStorage.getItem("MENU"));
    const newMenu = localMenu?.map(item => {
      return ({
        path: item.page,
        name: item.name,
        icon: mapIcon[item.name],
        key: item.page?.substr(1) || Math.random(),
        type: item.children && item.children.length ? 'subMenu' : undefined,
        routes: item.children && item.children.length ? item.children.map(cMenu => ({
          path: cMenu.page,
          name: cMenu.name,
          key: cMenu.page?.substr(1) || Math.random(),
        })) : []
      })
    })
    return newMenu || [];
  }



  return (
    <Layout.Sider
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        userSelect: 'none'
      }}
      width={240}
    >
      <div className="logo">
        <Link to={{ pathname: '/' }}>
          <img alt="logo" src={logo} />
          {!collapsed && <div style={{ color: 'black' }}>东风标致MEC素材广场</div>}
        </Link>
      </div>
      <Menu
        mode="inline"
        onClick={handleClick}
        selectedKeys={[current]}
        theme={theme === 'default' ? 'light' : 'dark'}
      >
        {renderMenuMap(transformMenu())}
      </Menu>
    </Layout.Sider>
  )
}

export default connect(
  (state) => state,
  actions
)(MenuView)
