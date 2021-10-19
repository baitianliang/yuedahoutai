import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login/Login'
import EventManagementList from '@/view/EventManagement/EventManagementList'
import EventManagementAdd from '@/view/EventManagement/EventManagementAdd'
import EventManagementModify from '@/view/EventManagement/EventManagementModify'
import EventManagementTeam from '@/view/EventManagement/EventManagementTeam'
import OrderManagementList from '@/view/OrderManagement/OrderManagementList'
import RegistrationManagementList from '@/view/RegistrationManagement/RegistrationManagementList'
import RegistrationCheck from '@/view/RegistrationManagement/RegistrationCheck'
import WorkReviewList from '@/view/WorkReview/WorkReviewList'
import WorkManagementList from '@/view/WorkManagement/WorkManagementList'
import AllWorkList from '@/view/WorkManagement/AllWorkList'
import DistributionWork from '@/view/WorkManagement/DistributionWork'
import Userinfo from '@/view/Userinfo/UserinfoList'
import ExpertList from '@/view/Expert/ExpertList'
import TeacherList from '@/view/Expert/TeacherList'
import SendMessage from '@/view/SendMessage/SendMessage'
import JinzhongApply from '@/view/Jinzhong/JinzhongApply'
import JinzhongJudge from '@/view/Jinzhong/JinzhongJudge'
import JinzhongReview from '@/view/Jinzhong/JinzhongReview'
import ExportData from '@/view/Export/ExportData'
import Index from '@/view/Index/Index'
// import WorkManagementForm from '@/view/WorkManagement/WorkManagementForm'

import Home from '@/view/Home'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base:'admin',
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },  {
      path: '/',
      redirect: '/EventManagementList'
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        path: '/EventManagementList',
        name: 'EventManagementList',
        component: EventManagementList
      }, {
        path: '/Add',
        name: 'EventManagementAdd',
        component: EventManagementAdd
      }, {
        path: '/EventManagementModify',
        name: 'EventManagementModify',
        component: EventManagementModify
      }, {
        path: '/EventManagementTeam',
        name: 'EventManagementTeam',
        component: EventManagementTeam
      }, {
        path: '/OrderManagementList',
        name: 'OrderManagementList',
        component: OrderManagementList
      }, {
        path: '/RegistrationManagementList',
        name: 'RegistrationManagementList',
        component: RegistrationManagementList
      }, {
        path: '/RegistrationCheck',
        name: 'RegistrationCheck',
        component: RegistrationCheck
      }, {
        path: '/AllWorkList',
        name: 'AllWorkList',
        component: AllWorkList
      }, {
        path: '/DistributionWork',
        name: 'DistributionWork',
        component: DistributionWork
      }, {
        path: '/WorkManagementList',
        name: 'WorkManagementList',
        component: WorkManagementList
      }, {
        path: '/WorkReviewList',
        name: 'WorkReviewList',
        component: WorkReviewList
      }, {
        path: '/ExpertList',
        name: 'ExpertList',
        component: ExpertList
      }, {
        path: '/TeacherList',
        name: 'TeacherList',
        component: TeacherList
      }, {
        path: '/Userinfo',
        name: 'Userinfo',
        component: Userinfo
      }, {
        path: '/Index',
        name: 'Index',
        component: Index
      }, {
        path: '/SendMessage',
        name: 'SendMessage',
        component: SendMessage
      }, {
        path: '/JinzhongApply',
        name: 'JinzhongApply',
        component: JinzhongApply
      }, {
        path: '/JinzhongJudge',
        name: 'JinzhongJudge',
        component: JinzhongJudge
      }, {
        path: '/JinzhongReview',
        name: 'JinzhongReview',
        component: JinzhongReview
      },
      {
        path: '/ExportData',
        name: 'ExportData',
        component: ExportData
      },
      ]
    },]
})
