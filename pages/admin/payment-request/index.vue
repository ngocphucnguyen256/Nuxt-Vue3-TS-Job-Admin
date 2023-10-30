<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->

      <v-row align="center" class="mt-4 mb-2">
        <v-col cols="3">
          <InputField
            name="案件名"
            hide-details
            :model-value="projectName"
            @update:model-value="projectName = $event"
          />
        </v-col>
        <v-col cols="3">
          <InputField
            name="取引先"
            hide-details
            :model-value="clientName"
            @update:model-value="clientName = $event"
          />
        </v-col>
        <v-col cols="3">
          <SelectBox
            name="ステータス"
            hide-details
            :items="items"
            :value="status"
            @update:model-value="status = $event"
          />
        </v-col>
      </v-row>
      <!-- /.frame sub handle -->

      <div class="d-flex my-2">
        <v-btn class="lighten-1" dark color="btn"> 請求書発行 </v-btn>
        <v-btn class="lighten-1 ml-2" dark color="btn"> 請求金額確定 </v-btn>
        <v-btn class="lighten-1 ml-2" dark color="btn"> 請求済み </v-btn>
        <v-btn class="lighten-1 ml-2" dark color="btn"> 入金確認済み </v-btn>
      </div>

      <v-data-table
        v-model="selected"
        :headers="columns"
        :items="data"
        show-select
        hide-default-footer
        item-key="id"
        class="custom-table"
      >
        <template #[`item.actions`]="{}">
          <v-btn
            class="lighten-1"
            dark
            color="btn"
            @click="() => router.push('/admin/project/detail')"
          >
            案件詳細
          </v-btn>
        </template>
        <template #bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="searchParams.page"
              :length="meta.last_page"
              prev-icon="mdi-chevron-double-left"
              next-icon="mdi-chevron-double-right"
              variant="outlined"
              :total-visible="MAX_PAGE_VISIBLE"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
      <!-- /.table -->
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { DataTableHeader } from "~/types/component";
import {
  clientStatusList,
  DEFAULT_ITEM_PER_PAGE,
  MAX_PAGE_VISIBLE,
} from "~/utils/consts/const";

const columns: DataTableHeader[] = [
  { title: "案件名", value: "project_name", key: "project_name" },
  { title: "取引先", value: "client_name", key: "client_name" },
  { title: "入金額", value: "billing", key: "billing" },
  { title: "ステータス", value: "status", key: "status" },
  { title: "最終更新", value: "last_update", key: "last_update" },
  { title: "", value: "actions", sortable: false, key: "actions" },
];

const router = useRouter();

const data = [
  {
    id: 1,
    project_name: "イベント設営",
    client_name: "猿澧企面",
    billing: 100000,
    status: "未完了",
    last_update: "2023/04/23 10:30",
  },
  {
    id: 2,
    project_name: "テレビ番組出演",
    client_name: "株式会社テレビ東京",
    billing: 60000,
    status: "終了済み",
    last_update: "2023/04/20 14:00",
  },
  {
    id: 3,
    project_name: "スマホアプリ開発",
    client_name: "株式会社デジタルアーツ",
    billing: 300000,
    status: "支払い済み",
    last_update: "2023/04/18 09:30",
  },
  {
    id: 4,
    project_name: "結婚式準備",
    client_name: "山本花子さん",
    billing: 200000,
    status: "支払い済み",
    last_update: "2023/04/12 17:00",
  },
  {
    id: 5,
    project_name: "テレビ番組出演",
    client_name: "株式会社テレビ東京",
    billing: 60000,
    status: "終了済み",
    last_update: "2023/04/20 14:00",
  },
  {
    id: 6,
    project_name: "イベント設営",
    client_name: "猿澧企面",
    billing: 100000,
    status: "未完了",
    last_update: "2023/04/23 10:30",
  },
];

const titleH2 = "請求書管理";

const items = [
  { title: "Status_1", value: "Status_1" },
  { title: "Status_2", value: "Status_2" },
  { title: "Status_3", value: "Status_3" },
];
const selected = ref([]);
const projectName = ref("");
const clientName = ref("");
const status = ref("");

const meta = ref({
  count: 0,
  last_page: 1,
  links: {
    next: "",
    prev: "",
  },
  total: 0,
});

const searchParams = ref({
  name: "",
  email: "",
  status: "",
  page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
});
</script>
