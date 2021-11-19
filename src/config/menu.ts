import {
  HomeOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  HddOutlined,
  SettingOutlined, 
  UsergroupDeleteOutlined,
  SnippetsOutlined
} from '@ant-design/icons'

const menus = [
  {
    path: '/home',
    name: '广场中心',
    key: 'home',
    icon: HomeOutlined, 
  },
  {
    path: '/testupload',
    name: '测试文件上传',
    key: 'testupload',
    icon: HomeOutlined, 
  },
  {
    path: '/supermarket',
    name: '文件超市',
    key: 'supermarket', 
    icon: SnippetsOutlined,  
  }, 
  {
    path: '/personalheaven',
    name: '个人天地',
    key: 'personalheaven',
    type: 'subMenu',
    icon: UserOutlined, 
    routes: [
      {
        path: '/personalheaven/material',
        name: '我的素材',
        key: 'personalheaven:material'
      },
      {
        path: '/personalheaven/record',
        name: '下载记录',
        key: 'personalheaven:record'
      },
      {
        path: '/personalheaven/collection',
        name: '收藏夹',
        key: 'personalheaven:collection'
      }
    ]
  }, 
  // {
  //   path: '/recyclebin',
  //   name: '回收站',
  //   key: 'recyclebin', 
  //   icon: DeleteOutlined,  
  // }, 
  {
    path: '/lionsmailbox',
    name: '小狮信箱',
    key: 'lionsmailbox',
    type: 'subMenu',
    icon: MailOutlined, 
    routes: [
      {
        path: '/lionsmailbox/send',
        name: '发件箱',
        key: 'lionsmailbox:send'
      },
      {
        path: '/lionsmailbox/receive',
        name: '收件箱',
        key: 'lionsmailbox:receive'
      }
    ]
  }, 
  // {
  //   path: '/announcementboard',
  //   name: '公告看板',
  //   key: 'announcementboard',
  //   icon: NotificationOutlined,
  //   routes: []
  // },
  {
    path: '/account',
    name: '账户管理',
    key: 'account',
    type: 'subMenu',
    icon: UsergroupDeleteOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/account/list',
        name: '用户管理',
        key: 'account:list'
      },
      {
        path: '/account/type',
        name: '账户类型',
        key: 'account:type'
      }
    ]
  }, 
  {
    path: '/permissions',
    name: '权限管理',
    key: 'permissions', 
    icon: HddOutlined,
    type: 'subMenu',
    routes: [
      {
        path: '/permissions/admin',
        name: '管理员管理',
        key: 'permissions:admin'
      },
      {
        path: '/permissions/role',
        name: '角色分配',
        key: 'permissions:role'
      },
      {
        path: '/permissions/auth',
        name: '权限分配',
        key: 'permissions:auth'
      }
    ]
  },
  {
    path: '/common',
    name: '常规管理',
    key: 'common', 
    type: 'subMenu',
    icon: SettingOutlined,
    routes: [
      {
        path: '/common/system',
        name: '系统设置',
        key: 'common:system'
      },
      {
        path: '/common/shuffling',
        name: '轮播广告',
        key: 'common:shuffling'
      },
      {
        path: '/common/resources',
        name: '资源分类',
        key: 'common:resources'
      },
      {
        path: '/common/tag',
        name: '标签管理',
        key: 'common:tag'
      },
      {
        path: '/common/tag',
        name: '标签管理',
        key: 'common:tag'
      },
      {
        path: '/common/dealercode',
        name: '经销商编码',
        key: 'common:dealercode'
      },
      {
        path: '/common/attachment',
        name: '附件管理',
        key: 'common:attachment'
      },
      {
        path: '/common/operationlog',
        name: '操作日志',
        key: 'common:operationlog'
      },
      {
        path: '/common/messagelist',
        name: '短信列表',
        key: 'common:messagelist'
      }
    ]
  }, 
]

export default menus
