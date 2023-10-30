<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">マイページ</h3>
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div
        v-for="item in navItems"
        :key="item.label"
        class="p-2 bg-light w-100 mb-2 rounded"
      >
        <nuxt-link :to="item.link" class="text-dark">
          {{ item.label }}
        </nuxt-link>
      </div>
    </div>
  </ClientLayout>
</template>

<script setup lang="ts">
const navItems = [
  {
    label: "お仕事を探す",
    link: "list-project",
  },
  {
    label: "エントリー中のお仕事",
    link: "entry-project",
  },
  {
    label: "完了したお仕事",
    link: "entry-project?status=5",
  },
  {
    label: "お給料の一覧",
    link: "entry-project?status=waiting_salary_done",
  },
  {
    label: "プロフィールの修正",
    link: "edit-profile",
  },
  {
    label: "年末調整出力",
    link: "my-page",
  },
  {
    label: "ログアウト",
    link: "login",
  },
];
</script>

<style lang="scss" scoped></style>
