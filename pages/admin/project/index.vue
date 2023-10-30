<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->

      <v-row justify="start" align="center" class="mt-4 mb-2">
        <v-col cols="9">
          <v-row>
            <v-col cols="3">
              <InputField
                name="案件名"
                :model-value="searchParams.name"
                hide-details
                @update:model-value="searchParams.name = $event"
              />
            </v-col>
            <v-col cols="3">
              <InputField
                name="キーワード"
                hide-details
                :model-value="searchParams.q"
                @update:model-value="searchParams.q = $event"
              />
            </v-col>
            <v-col xl="3" lg="3">
              <SelectBox
                name="ステータス"
                hide-details
                :items="projectStatusItems"
                :value="searchParams.status"
                @update:model-value="searchParams.status = $event"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" offset="1">
          <v-btn
            color="btn"
            class="lighten-1 mt-5"
            dark
            @click="() => router.push('/admin/project/regist')"
          >
            案件新規登録
          </v-btn>
        </v-col>
      </v-row>
      <!-- /.frame sub handle -->

      <v-data-table
        :headers="columns"
        :items="data"
        hide-default-footer
        class="custom-table"
        :loading="loading"
      >
        <template #loading>
          <LoaderComponent :loading="loading" />
        </template>
        <template #item.updated_at="{ item }">
          <span>{{
            item.columns.updated_at
              ? new Date(item.columns.updated_at).toLocaleString()
              : "N/A"
          }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-btn class="lighten-1" color="btn" @click="handleToDetail(item)">
            編集
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
import { DataTableHeader } from "~/types/component";
import { useProjectStore } from "~/stores/project.module";
import {
  projectStatusItems,
  DEFAULT_ITEM_PER_PAGE,
  MAX_PAGE_VISIBLE,
} from "~/utils/consts/const";

const router = useRouter();
const store = useProjectStore();
const debounce = useDebounce(500);

const titleH2 = "案件一覧";
const columns: DataTableHeader[] = [
  {
    title: "No",
    align: "start",
    value: "id",
    key: "id",
  },
  { title: "案件名", value: "project_name", key: "project_name" },
  { title: "取引先", value: "client_name", key: "client_name" },
  { title: "人数", value: "amount_of_people", key: "amount_of_people" },
  { title: "売上金額", value: "sales", key: "sales" },
  { title: "ステータス", value: "status", key: "status" },
  { title: "最終更新", value: "updated_at", key: "updated_at" },
  { title: "", value: "actions", sortable: false, key: "actions" },
];

const data = ref([]);
const loading = ref(false);

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
  q: "",
  status: "",
  flag: 0,
  client: "",
  page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
});

watch(
  () => searchParams,
  (val) => {
    debounce(() => getData());
  },
  { deep: true },
);

onMounted(() => {
  searchParams.value.client =
    router.currentRoute.value.query.client_id?.toString() || "";
  getData();
});

const handleToDetail = (item: any) => {
  router.push("/admin/project/detail" + "?id=" + item.raw.id);
};

const getData = async () => {
  loading.value = true;
  const res = await store.getAll(searchParams.value);
  loading.value = false;
  if (!res || !res.success) {
    data.value = [];
    return;
  }
  data.value = res.body.data || [];
  const resMeta = res.body.meta || {};
  if (resMeta.current_page > resMeta.last_page) {
    searchParams.value.page = resMeta.last_page || 1;
  }
  meta.value = resMeta;
};
</script>
