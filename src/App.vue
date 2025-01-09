<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo">
        <img src="./assets/vue.svg" alt="" />
      </div>
      <p>本地测试</p>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <a-menu v-model:selectedKeys="selectedKeys" @click="clickMenu" theme="dark" mode="inline">
          <template v-for="item in menuList">
            <template v-if="!item.children.length">
              <a-menu-item :key="item.path">
                <router-link :to="item.path">
                  <PieChartOutlined />
                  <span> {{ item.meta.title }}</span>
                </router-link>
              </a-menu-item>
            </template>

            <template v-else>
              <a-sub-menu v-for="val in item.children" :key="item.path" :menu-info="item">
                <PieChartOutlined />
                <span> {{ val.meta.title }}</span>
              </a-sub-menu>
            </template>

          </template>

        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0px 24px 24px;">
        <a-breadcrumb style="margin: 10px 0">
          <a-breadcrumb-item>{{ current }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{
          background: '#fff',
          padding: '5px',
          margin: 0,
          minHeight: '280px',
        }">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { useRouter } from 'vue-router'
  import {
    UserOutlined,
    PieChartOutlined,
    DesktopOutlined,
    TeamOutlined,
    FileOutlined,
  } from "@ant-design/icons-vue";
  // 获取所有路由信息
  let menuList = reactive([])
  const router = useRouter()

  menuList = router.getRoutes()
  const selectedKeys = ref([menuList[0].path]);
  let current = ref(menuList[0].path)
  const collapsed = ref(false);

  function clickMenu(item) {
    current.value = item.key
  }

</script>
<style lang="scss" scoped>
  @import "@/style/style.scss";
  @import "@/style/utils.scss";

  .ant-layout {
    .header {
      display: flex;
      align-items: center;
      background-color: #0a1936;
    }

    .logo {
      width: 50px;
      height: 50px;
      color: #fff;

      img {
        width: 100%;
      }
    }

    p {
      font-size: 18px;
      font-weight: bolder;
      color: #fff;
      margin-left: 10px;
    }

    .ant-layout-content {
      height: 88vh;
    }
  }
</style>