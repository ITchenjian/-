import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/page/login.vue'
import Main from '@/page/main.vue'

import Home from '../page/home.vue'

import UserList from '../page/user/userlist.vue'

import RouteTemp from '../page/commons/routeTemp.vue'

import Sentemp from '../page/sensor/sentemp.vue'
import HisdataTemp from '../page/sensor/hisdataTemp.vue'

import Scenario from '../page/scen/scenario.vue'
import Scentemp from '../page/scen/scentemp.vue'

import Halltemp from '../page/hall/halltemp.vue'
import Addmagcard from '../page/hall/addmagcard.vue'

import Datanalysis from '../page/hall/datanalysis.vue'
import Table from '../page/hall/table.vue'

import Set from '../page/equip/set.vue'
import Readcard from '../page/equip/readcard.vue'
import AllType from '../page/equip/alltype.vue'

import WarnLog from '../page/log/warnlog.vue'
import Message from '../page/log/message.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
    	path: '/main',
    	name:'首页',
    	component:Main,
    	children:[{
            path: '/',
            name:'',
            component:Home
        },{
            path: '/main/hisdataTemp',
            name:'历史记录',
            component:HisdataTemp
        },{
            path: '/main/hall',
            name:'轨迹',
            component:RouteTemp,
            children:[{
                path: '/',
                name:'',
                component:Halltemp
            },{
                path: '/main/hall/addmagcard',
                name:'磁卡',
                component:Addmagcard
            },{
                path: '/main/hall/datanalysis',
                name:'分析',
                component:RouteTemp,
                children:[{
                    path: '/',
                    name:'',
                    component:Datanalysis
                },{
                    path: '/main/hall/datanalysis/table',
                    name:'表',
                    component:Table
                }]
            }]
        },{
            path: '/main/scen/scenario',
            name:'场景',
            component:RouteTemp,
            children:[{
                path: '/',
                name:'',
                component:Scenario
            },{
                path: '/main/scen/scentemp',
                name:'查看',
                component:RouteTemp,
                children:[{
                    path: '/',
                    name:'',
                    component:Scentemp
                },{
                    path: '/main/scen/hisdataTemp',
                    name:'历史数据',
                    component:HisdataTemp
                }]
            }]
        },{
            path: '/main/user/userlist',
            name:'用户信息',
            component:UserList
        },{
            path: '/main/sensor/sentemp',
            name:'传感器',
            component:RouteTemp,
            children:[{
                path: '/',
                name:'',
                component:Sentemp
            },{
                path: '/main/sensor/hisdataTemp',
                name:'历史数据',
                component:HisdataTemp
            }]
        },{
            path: '/main/equip/readcard',
            name:'读卡器',
            component:Readcard
        },{
            path: '/main/equip/alltype',
            name:'类型设置',
            component:AllType
        },{
            path: '/main/equip/set',
            name:'设备',
            component:Set
        },{
            path: '/main/log/warnlog',
            name:'告警',
            component:WarnLog
        },{
            path: '/main/log/message',
            name:'消息',
            component:Message
        }]
    }
  ]
})
