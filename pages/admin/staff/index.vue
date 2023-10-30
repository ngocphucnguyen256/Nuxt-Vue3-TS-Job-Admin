<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->

      <v-row align="center" justify="start" class="mt-4 mb-2">
        <v-col xl="9" cols="12">
          <v-row>
            <v-col cols="3" :md="4">
              <InputField
                name="キーワード"
                :model-value="searchParams.q"
                hide-details
                @update:model-value="searchParams.q = $event"
              />
            </v-col>
            <v-col cols="4" :sm="5">
              <RangePicker
                name="生年月日"
                :start-date="searchParams.start_day"
                :end-date="searchParams.end_day"
                width-full
                @update:model-value-start-date="searchParams.start_day = $event"
                @update:model-value-end-date="searchParams.end_day = $event"
              />
            </v-col>
            <v-col cols="3">
              <SelectBox
                name="ステータス"
                :items="staffStatusList"
                :value="searchParams.status"
                hide-details
                @update:model-value="searchParams.status = $event"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- /.frame sub handle -->

      <div class="d-flex my-2">
        <v-btn
          color="btn"
          class="lighten-1"
          dark
          @click="handleGetCheckedEmail"
        >
          メールアドレス取得
        </v-btn>
      </div>

      <v-data-table
        v-model="selected"
        :headers="columns"
        :items="data"
        :loading="loading"
        show-select
        hide-default-footer
        item-key="no"
        class="custom-table"
      >
        <template #loading>
          <LoaderComponent :loading="loading" />
        </template>
        <template #[`item.gender`]="{ item }">
          <span>{{ handleConvertGender(item.raw.gender) }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn color="btn" class="lighten-1" @click="handleToDetail(item)">
            詳細
          </v-btn>
        </template>
        <template #bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="searchParams.current_page"
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
import { useStaffStore } from "~/stores/staff.module";
import {
  handleConvertGender,
  convertDateToParams,
} from "~/utils/helpers/helper";
import {
  staffStatusList,
  DEFAULT_ITEM_PER_PAGE,
  MAX_PAGE_VISIBLE,
} from "~/utils/consts/const";
import { StaffType } from "~/types/payload-type";

const store = useStaffStore();
const router = useRouter();

const columns: DataTableHeader[] = [
  { title: "氏名", value: "name", key: "name" },
  { title: "ふりがな", value: "furigana", key: "furigana" },
  { title: "生年月日", value: "birthday", key: "birthday" },
  { title: "住所", value: "address", key: "address" },
  { title: "性別", value: "gender", key: "gender" },
  { title: "電話番号", value: "tel", key: "tel" },
  { title: "ステータス", value: "status", key: "status" },
  { title: "最終更新", value: "last_update", key: "last_update" },
  { title: "操作", value: "actions", sortable: false, key: "actions" },
];

const data: Ref<StaffType[]> = ref([]);

const handleToDetail = (item: any) => {
  router.push("/admin/staff/detail" + "?id=" + item.raw.id);
};

const titleH2 = "スタッフー覧";
const selected = ref([]);

const meta = ref({
  count: 0,
  last_page: 1,
  links: {
    next: "",
    prev: "",
  },
  total: 0,
});

const searchParams: Ref<{
  q: string;
  status: string;
  start_day: string | Date;
  end_day: string | Date;
  current_page: number;
  per_page: number;
}> = ref({
  q: "",
  status: "",
  start_day: "",
  end_day: "",
  current_page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
});

const handleGetCheckedEmail = () => {};

const loading = ref(false);

const getData = async () => {
  const params = {
    q: searchParams.value.q,
    status: searchParams.value.status,
    start_day: convertDateToParams(searchParams.value.start_day),
    end_day: convertDateToParams(searchParams.value.end_day),
    page: searchParams.value.current_page,
    per_page: searchParams.value.per_page,
  };
  loading.value = true;
  const res = await store.getAll(params);
  loading.value = false;
  if (!res && !res.success) {
    data.value = [];
    return;
  }
  data.value = res.body.data || [];
  const resMeta = res.body.meta || {};
  if (resMeta.current_page > resMeta.last_page) {
    searchParams.value.current_page = resMeta.last_page || 1;
  }
  meta.value = resMeta;
};

onMounted(() => {
  getData();
});

const debounce = useDebounce(500);

watch(
  searchParams,
  () => {
    debounce(() => getData());
  },
  { deep: true },
);
</script>
