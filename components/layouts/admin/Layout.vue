<script lang="ts" setup>
import BaseLayout from "../BaseLayout.vue";

const items = [
  {
    title: "Dashboard",
    to: "/admin/dashboard",
  },
  {
    title: "Chat app",
    to: "/admin/chat",
  },
  // {
  //   title: "取引先一覧",
  //   to: "/admin/client",
  // },
  // {
  //   title: "案件一覧",
  //   to: "/admin/project",
  // },
  // {
  //   title: "スタッフ一覧",
  //   to: "/admin/staff",
  // },
  // {
  //   title: "給与一覧",
  //   to: "/admin/salary",
  // },
  // {
  //   title: "請求一覧",
  //   to: "/admin/payment-request",
  // },
  {
    title: "Logout",
    to: "/admin/login",
  },
];
</script>

<template>
  <BaseLayout :items="items">
    <slot />
  </BaseLayout>
</template>

<style scoped lang="scss"></style>
