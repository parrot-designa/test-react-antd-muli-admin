//@ts-nocheck
import React, { useState, useEffect, FC, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '@/assets/img/newlogo.png'
import { Menu, Layout } from 'antd'
import * as actions from '@/store/actions'
import { connect } from 'react-redux'
import styles from './index.module.less'

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
    '文件超市': <MacCommandOutlined />,
    '广场中心': <HomeOutlined />,
    '个人天地': <UsergroupDeleteOutlined />,
    '回收站': <DeleteOutlined />,
    '小狮信箱': <MailOutlined />,
    '公告看板': <DashboardOutlined />,
    '账户管理': <TeamOutlined />,
    '权限管理': <SafetyCertificateOutlined />,
    '常规管理': <SettingOutlined />
}

const { SubMenu } = Menu

const MenuCustom: any = (props:any) => {

    const { pathname } = useLocation()
 
    const [current, setCurrent] = useState(); 

    const transformMenu = () => {
        const localMenu = JSON.parse(sessionStorage.getItem("MENU"));
        const newMenu = localMenu?.map(item => {
            return ({
                path: item.page,
                name: item.name,
                icon: mapIcon[item.name],
                key: item.page?.substr(1) || Math.random(),
                // type: item.children && item.children.length ? 'subMenu' : undefined,
                routes: item.children && item.children.length ? item.children.map(cMenu => ({
                    path: cMenu.page,
                    name: cMenu.name,
                    key: cMenu.page?.substr(1) || Math.random(),
                })) : []
            })
        })
        return newMenu || [];
    }

    // 菜单点击事件
    const handleClick = ({ key }): void => {
        setCurrent(key)
    }

    const rootSubmenuKeys = transformMenu().filter(item=>item.routes && item.routes.length).map(item=>item.key);
  

    const [openKeys, setOpenKeys] = React.useState([]);

    const onOpenChange = keys => { 

        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    useEffect(() => {
        if (pathname === '/') {
            setCurrent('home')
        } else {
            setCurrent(pathname.replace("/", "")) 
        }
    }, [pathname]);

    useEffect(() => {

        let pathnameKey=pathname.split('/')[1];

        setOpenKeys([pathnameKey])
           
    }, [pathname]);
  
    const collapsed=sessionStorage.getItem('COLLAPSED')=='TRUE'; 
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
          
            className={styles.sider}
        >
            <div className="logo">
                <Link to={{ pathname: '/' }}>
                    <img alt="logo" src={logo} />
                    {!collapsed && <div className={styles.text}>东风标致MEC素材广场</div>}
                </Link>
            </div>
            <Menu
                mode="inline"
                onClick={handleClick}
                selectedKeys={[current]}
                theme={'dark'} 
                onOpenChange={onOpenChange}
                openKeys={openKeys}
            >
                {
                    transformMenu().map(menuOne => {
                        if (menuOne.routes && menuOne.routes.length) {
                            return <SubMenu key={menuOne.key} title={menuOne.name} icon={mapIcon[menuOne.name]}>
                                {
                                    menuOne.routes.map(menuTwo => {
                                        return <Menu.Item key={menuTwo.key} >
                                            <Link to={menuTwo.path}>{menuTwo.name}</Link>
                                        </Menu.Item>
                                    })
                                }

                            </SubMenu>
                        } else {
                            return <Menu.Item key={menuOne.key} icon={mapIcon[menuOne.name]}>
                                <Link to={menuOne.path}>{menuOne.name}</Link>
                            </Menu.Item>
                        }
                    })
                }
            </Menu>
        </Layout.Sider>
    )
}

export default connect(
    (state) => state,
    actions
)(MenuCustom)