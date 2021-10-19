<template>
  <div class="nav">
    <div class="logo">
      <img src="@/assets/img/ledalogo.png">
      <p><b>乐答系统管理平台</b></p>
    </div>
    <el-row class="tac">
      <el-col :span="12">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened router>
          <template v-for="item in items">
            <template v-if="item.subs">
              <el-submenu :index="item.index" :key="item.index">
                <template slot="title">
                  <span slot="title">{{ item.title }}</span>
                </template>
                <template v-for="subItem in item.subs">
                  <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                    <template slot="title">{{ subItem.title }}</template>
                    <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                      {{ threeItem.title }}
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                    <template slot="title">
                      <span slot="title">{{ subItem.title }}</span>
                    </template>
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.index" :key="item.index"
                            v-if="item.roleId == $store.state.roleId">
                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Nav',
    props: {
      index: {
        type: String,
        default: ''
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path;
      }
    },
    mounted() {
      this.roleId = localStorage.roleId
      this.items = this.roleId === '2' ? [{
          // icon: 'el-icon-lx-home',
          index: '/Index',
          title: '控制台',
        }, {
          // icon: 'el-icon-lx-home',
          index: '/EventManagementList',
          title: '赛事管理',
        }, {
          index: '/OrderManagementList',
          title: '订单管理',
        }, {
          index: '/Userinfo',
          title: '用户管理',
        }, {
          index: '/RegistrationManagementList',
          title: '报名管理',
          subs: [{
            index: '/RegistrationManagementList',
            title: '报名列表',
          }, {
            index: '/RegistrationCheck',
            title: '报名审核',
          }]
        }, {
          index: '/WorkManagementList',
          title: '作品管理',
          subs: [{
            index: '/WorkManagementList',
            title: '参赛作品',
          }, {
            index: '/AllWorkList',
            title: '作品列表',
          }, 
          {
            index: '/DistributionWork',
            title: '作品分配',
          }
          ]
        }, {
            index: '/WorkReviewList',
            title: '评审作品',
        }, {
          index: '/ExpertList',
          title: '专家管理',
        }, {
          index: '/TeacherList',
          title: '教师管理',
        }, {
          index: '/SendMessage',
          title: '发送消息',
        }, {
          index: '/',
          title: '金钟奖',
          subs: [{
            index: '/JinzhongJudge',
            title: '评委列表',
          }, {
            index: '/JinzhongApply',
            title: '报名列表',
          }, {
            index: '/JinzhongReview',
            title: '评审列表',
          }]
        }, 
        {
          index: '/ExportData',
          title: '导出数据',
        }
        ] : [{
            index: '/WorkReviewList',
            title: '评审作品',
        }, {
          index: '/',
          title: '金钟奖',
          subs: [{
            index: '/JinzhongReview',
            title: '评审列表',
          }]
        }]
    },
    data() {
      return {
        items: []
      }
    },
  }
</script>

<style lang="scss">
// .tac {
//     width: 200px;
//     .el-col {
//         width: 200px;
//     }
// }
.nav {
  width: 100%;
  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 170px;
    background-color: #ffffff;
    // border-bottom: 1px solid #F2F0EE;
  }
  .tac {
    width: 100%;
    .el-col {
      width: 100%;
      text-align: center;
      .el-menu {
        width: 100%;
        border: 0px;
        .el-menu-item {
          width: 100%;
          padding : 0px!important;
          // text-align: center;
        }
        .el-submenu{
          .el-menu {
            .el-menu-item {
              span {
                margin-left: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
