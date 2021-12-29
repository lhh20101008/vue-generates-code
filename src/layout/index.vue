<template>
    <el-container class="container_custom">
        <el-header class="color">Vue代码自动生成工具</el-header>
        <el-main>
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </transition>
        </el-main>
    </el-container>
</template>

<script>
    import {Component, Vue} from 'vue-property-decorator'

    @Component({
        components: {}
    })
    export default class LayoutIndex extends Vue {
    }
</script>

<style scoped>
    .container_custom {
        height: 100%;
        background-color: #f3f3f3;
        overflow: hidden;
    }

    .container_custom .el-header {
        padding: 0px;
    }

    .custom_main .el-main {
        padding: 20px 0px;
    }

    .color {
        background-color: #1890ff;
        -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, .13);
        box-shadow: 0 0 8px rgba(0, 0, 0, .13);
        line-height: 60px;
        color: white;
        padding: 0px;
        text-align: center;
        font-size: 22px;
        font-weight: bolder;
    }
</style>
