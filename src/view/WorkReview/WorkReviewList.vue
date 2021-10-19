<template>
    <div class="work-review">
        <!-- <p class="title">评审作品</p> -->
        <div class="tabs" :style="`height: ${height}px`" >
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane name="inactive" label="待评审">
                    <WorkReviewReview v-if="activeName === 'inactive'" :scoreStatus="'inactive'"></WorkReviewReview>
                </el-tab-pane>
                <el-tab-pane v-if="roleId === '2'" name="saved" label="额外分">
                    <!-- <WorkReviewReview v-if="activeName === 'active'" :scoreStatus="'active'"></WorkReviewReview> -->
                    <AdminWorkReview></AdminWorkReview>
                </el-tab-pane>
                <el-tab-pane name="active" label="已评审">
                    <WorkReviewReview v-if="activeName === 'active'" :scoreStatus="'active'"></WorkReviewReview>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
const Qs = require('qs');
import height from '@/mixins/heightMixin.js'
export default {
    mixins: [height],
    data() {
        return {
            activeName: "inactive",
            roleId: ''
        }
    },
    mounted() {
        this.roleId = localStorage.roleId
    },
    methods: {
    }
}
</script>

<style lang="scss">

.work-review {
    // margin-left: 0.5%;
    height: 100%;
    width: 100%;
    // padding: 0px 20px;
    background-color: white;
    .tabs {
        width: auto;
        padding: 0px 20px;
        .el-tabs {
            width: 100%;
            height: 100%;
            .el-tabs__content {
                width: 100%;
                padding: 1% 2%;
                height: 90%;
                overflow: auto;
                .el-tab-pane {
                    width: 100%;
                    height: 90%;
                    .el-pagination {
                        margin: 10px 20px!important;
                    }
                }
            }
        }
    }
}
</style>
