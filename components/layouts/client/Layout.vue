<script lang="ts" setup>
import BaseLayout from "../BaseLayout.vue";

const items = [
  {
    title: "マイページ",
    to: "/staff/my-page",
  },
  {
    title: "案件リスト",
    to: "/staff/list-project",
  },
  {
    title: "エントリーしたお仕事",
    to: "/staff/entry-project",
  },
  {
    title: "イベント設営",
    to: "/staff/report",
  },
  {
    title: "プロフィールの修正",
    to: "/staff/edit-profile",
  },
  {
    title: "ログアウト",
    to: "/staff/login",
  },
];
</script>

<template>
  <BaseLayout is-client :items="items" :drawer="false">
    <slot />
  </BaseLayout>
</template>

<style scoped lang="scss"></style>
