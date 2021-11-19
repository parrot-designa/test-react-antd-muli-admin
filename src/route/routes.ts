import Home from '@/pages/home' 

import ErrorPage from '@/pages/public/errorPage'

import SuperMarket from '@/pages/supermark'

import PermissionsAdmin from '@/pages/permissions/admin'
import PermissionsRole from '@/pages/permissions/role'

import FileDownload from '@/pages/file/download'
import FileFavorite from '@/pages/file/favorite'
import FileMy from '@/pages/file/my'

import Recycle from '@/pages/recycle'

import SystemSet from '@/pages/system/set'
import SystemAdvert from '@/pages/system/advert'
import SystemRtype from '@/pages/system/rtype'
import SystemLog from '@/pages/system/log'
import SystemCode from '@/pages/system/code'
import SystemLabel from '@/pages/system/label'

import UserManager from '@/pages/user/manager'
import UserUtype from '@/pages/user/utype'

import EmailSend from '@/pages/email/send'
import EmailReceive from '@/pages/email/receive'

import FileDetail from '@/pages/fileDetail/index'

import Notice from '@/pages/notice'
import Upload from '@/pages/upload'

import {
  HomeOutlined
} from '@ant-design/icons';
/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */
const menus = [
  {
    path: '/home',
    name: '广场中心',
    exact: true,
    key: 'home',
    component: Home,
    icon:HomeOutlined 
  },
  {
    path: '/testupload',
    name: '测试文件上传',
    key: 'testupload',
    exact: true,
    component: SuperMarket
  },
  {
    path: '/supermark',
    name: '文件超市',
    key: 'supermark', 
    exact: true, 
    component: SuperMarket
  }, 
  {
    path: '/notice',
    name: '公告看板',
    key: 'notice', 
    exact: true, 
    component: Notice
  }, 
  {
    path: '/permissions',
    name: '权限管理',
    key: 'permissions',   
    children: [
      {
        path: '/permissions/admin',
        name: '管理员管理',
        key: 'permissions/admin',
        component:PermissionsAdmin
      },
      {
        path: '/permissions/role',
        name: '角色分配',
        key: 'permissions/role',
        component:PermissionsRole
      },
      {
        path: '/permissions/auth',
        name: '权限分配',
        key: 'permissions/auth'
      }
    ]
  }, 
  {
    path: '/email',
    name: '小狮信箱',
    key: 'email',   
    children: [
      {
        path: '/email/send',
        name: '发件箱',
        key: 'email/send',
        component:EmailSend
      },
      {
        path: '/email/receive',
        name: '收件箱',
        key: 'email/receive',
        component:EmailReceive
      },
    ]
  }, 
  {
    path: '/recycle',
    key: 'recycle',   
    name: '回收站',
    exact: true, 
    component: Recycle
  },
  {
    path: '/file',
    name: '个人天地',
    key: 'file',   
    children: [
      {
        path: '/file/download',
        name: '下载记录',
        key: 'file/download',
        component:FileDownload
      },
      {
        path: '/file/favorite',
        name: '收藏夹',
        key: 'file/favorite',
        component:FileFavorite
      },
      {
        path: '/file/my',
        name: '我的素材',
        key: 'file/my',
        component:FileMy
      },
    ]
  }, 
  {
    path: '/user',
    name: '用户管理',
    key: 'user',   
    children: [
      {
        path: '/user/manager',
        name: '用户管理',
        key: 'user/manager',
        component:UserManager
      },
      {
        path: '/user/utype',
        name: '账户类型',
        key: 'user/utype',
        component:UserUtype
      }  
    ]
  }, 
  {
    path: '/system',
    name: '常规管理',
    key: 'system',   
    children: [
      {
        path: '/system/set',
        name: '系统设置',
        key: 'system/set',
        component:SystemSet
      },
      {
        path: '/system/advert',
        name: '轮播广告',
        key: 'system/advert',
        component:SystemAdvert
      },
      {
        path: '/system/rtype',
        name: '资源分类',
        key: 'system/rtype',
        component:SystemRtype
      },
      {
        path: '/system/log',
        name: '操作日志',
        key: 'system/log',
        component:SystemLog
      },
      {
        path: '/system/code',
        name: '经销商编码',
        key: 'system/code',
        component:SystemCode
      },
      {
        path: '/system/label',
        name: '标签管理',
        key: 'system/label',
        component:SystemLabel
      }
    ]
  }, 
  {
    path: '/fileDetail',
    name: '文件详情',
    exact: true, 
    key:'fileDetail',
    component: FileDetail
  },
  {
    path: '/403',
    name: '暂无权限',
    exact: true,
    key: '/403',
    component: ErrorPage
  }
]

export default menus
