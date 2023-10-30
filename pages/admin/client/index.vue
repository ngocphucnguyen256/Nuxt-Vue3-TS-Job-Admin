<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>取引先一覧</h3>
      <!-- /.title head-->
      <v-row justify="start" align="center" class="mt-4 mb-2">
        <v-col cols="9">
          <v-row>
            <v-col cols="3">
              <InputField
                name="取引先名"
                :model-value="searchParams.name"
                hide-details
                @update:model-value="searchParams.name = $event"
              />
            </v-col>
            <v-col cols="3">
              <InputField
                name="Eメール"
                :model-value="searchParams.email"
                hide-details
                @update:model-value="searchParams.email = $event"
              />
            </v-col>
            <v-col xl="3" lg="3">
              <SelectBox
                name="ステータス"
                :items="clientStatusList"
                hide-details
                :value="searchParams.status"
                @update:model-value="searchParams.status = $event"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" offset="1">
          <v-btn
            class="lighten-1 mt-5"
            color="btn"
            dark
            @click="() => router.push('/admin/client/regist')"
          >
            取引先新規登録
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
        item-key="no"
        :item-value="(item) => `${item.id}`"
        :sort-by="[sortItem]"
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
        <template #item.address="{ item }">
          <span>{{ convertAddressToString(item.raw) }}</span>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-start flex-nowrap">
            <v-btn
              class="lighten-1 mr-2"
              color="btn"
              dark
              @click="handleToDetail(item)"
            >
              編集
            </v-btn>
            <v-btn
              class="lighten-1"
              color="btn"
              dark
              @click="() => toProjectWithClientId(item)"
            >
              案件
            </v-btn>
          </div>
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
import { useClientStore } from "~/stores/client.module";
import { DataTableHeader, SortItem } from "~/types/component";
import {
  clientStatusList,
  DEFAULT_ITEM_PER_PAGE,
  MAX_PAGE_VISIBLE,
} from "~/utils/consts/const";
import { clientDetailType } from "~/types/payload-type";
import { convertAddressToString } from "~/utils/helpers/helper";

const router = useRouter();
const store = useClientStore();
const debounce = useDebounce(500);

const columns: DataTableHeader[] = [
  {
    title: "No",
    align: "start",
    value: "id",
    key: "id",
    width: "20%",
  },
  { title: "管轄", value: "type", key: "type" },
  { title: "取引先名", value: "name", key: "name", width: "200px" },
  { title: "住所", value: "address", key: "address", width: "200px" },
  { title: "電話番号", value: "tel", key: "tel" },
  { title: "メールアドレス", value: "email", key: "email" },
  { title: "担当者", value: "pic_name", key: "pic_name" },
  { title: "ステータス", value: "status", key: "status" },
  { title: "最終更新", value: "updated_at", key: "updated_at" },
  { title: "操作", value: "actions", sortable: false, key: "actions" },
];

const data: Ref<clientDetailType[]> = ref([]);

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

const sortItem: Ref<SortItem> = ref({
  key: "",
  order: "desc",
});

const loading = ref(false);

watch(
  () => searchParams.value,
  (val) => {
    debounce(() => getData());
  },
  { deep: true },
);

onMounted(() => {
  const sort = router.currentRoute.value.query.sort?.toString();
  if (sort) {
    sortItem.value = {
      key: sort,
      order: "desc",
    };
  }
  getData();
});

const handleToDetail = (item: any) => {
  router.push("/admin/client/detail" + "?id=" + item.raw.id);
};

const toProjectWithClientId = (item: any) => {
  router.push("/admin/project" + "?client_id=" + item.raw.id);
};

const getData = async () => {
  loading.value = true;
  const res = await store.getAll(searchParams.value);
  loading.value = false;
  if (!res && !res.success) {
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
