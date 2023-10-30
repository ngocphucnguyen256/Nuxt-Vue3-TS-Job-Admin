<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">案件リスト</h3>
    <v-btn
      class="mb-2 text-light"
      color="blue"
      @click="toggleIsShowFilterDetail"
    >
      詳細な検素条件を追加
    </v-btn>
    <div v-if="isShowFilterDetail" class="font-weight-bold">
      <v-row>
        <v-col cols="6" md="6">
          <DatePicker
            title="開始日"
            :model-value="filterFields.start_day"
            @update:model-value="filterFields.start_day = $event"
          />
        </v-col>
        <v-col cols="6" md="6">
          <DatePicker
            title="終了日"
            :model-value="filterFields.end_day"
            :min="min"
            class="mb-2"
            @update:model-value="filterFields.end_day = $event"
          />
        </v-col>
      </v-row>
      <SelectBox
        name="ジャンル"
        :items="projectTypeList"
        :value="filterFields.type"
        :is-horizontal="false"
        class="mb-2"
        @update:model-value="filterFields.type = $event"
      />
      <GroupRadio
        name="給与区分："
        :items="salaryTypeItems"
        :value="filterFields.salary_type"
        class="-ml-8"
        font-bold
        @update:model-value="filterFields.salary_type = $event"
      />
      <div class="d-flex align-center justify-space-between">
        <div class="w-100">
          <InputField
            name="時給"
            :model-value="filterFields.salary_from"
            type="number"
            class="font-weight-bold"
            :rules="[
              ...validations.smallerThan(
                filterFields.salary_to,
                filterFields.salary_from,
              ),
              ...validations.number,
            ]"
            hide-details
            @update:model-value="filterFields.salary_from = $event"
          />
        </div>
        <div class="mx-2">
          <div class="bg-white px-4 py-2 mt-6">~</div>
        </div>
        <div class="w-100">
          <InputField
            name="時給"
            hide-details
            :model-value="filterFields.salary_to"
            :rules="[
              ...validations.largerThan(
                filterFields.salary_from,
                filterFields.salary_to,
              ),
              ...validations.number,
            ]"
            type="number"
            class="font-weight-bold"
            @update:model-value="filterFields.salary_to = $event"
          />
        </div>
      </div>
    </div>
    <div>
      <LoaderComponent :loading="loading" />
      <ErrorLine
        :message="errorLine.message.value"
        :success="errorLine.isSuccess.value"
      />
      <div
        v-for="(project, index) in projects"
        :id="`project-${index}`"
        :key="project.project_name"
        class="bg-light px-6 py-6 mb-4 mt-4 md:w-25 border rounded-lg elevation-1"
      >
        <ProjectComponent :project="project" />
        <v-btn
          color="blue"
          variant="elevated"
          block
          class="text-light mb-2"
          @click="handleToDetail(project.id)"
        >
          詳細を見る
        </v-btn>
      </div>
      <LoaderComponent :loading="loadingBottom" />
    </div>
  </ClientLayout>
</template>

<script setup lang="ts">
import { isInViewport, convertDateToParams } from "~/utils/helpers/helper";
import { useProjectStore } from "~/stores/project.module";
import { projectDetailType } from "~/types/payload-type";
import {
  salaryTypeItems,
  DEFAULT_ITEM_PER_PAGE,
  projectTypeList,
} from "~/utils/consts/const";
import * as validationUtil from "~/utils/validations/fields";
import { useDebounce } from "~/composables/useDebounce";

const router = useRouter();
const store = useProjectStore();
const validations = validationUtil.field;
const errorLine = useErrorLine();

const debounce = useDebounce(500);

const isShowFilterDetail = ref(false);
const filterFields: Ref<{
  start_day: string | Date;
  end_day: string | Date;
  type: string | undefined;
  salary_from: number | undefined;
  salary_to: number | undefined;
  salary_type: number | undefined;
  flag: number;
}> = ref({
  start_day: "",
  end_day: "",
  type: "",
  salary_from: undefined,
  salary_to: undefined,
  salary_type: undefined,
  flag: 1,
});

const meta = ref({
  count: 0,
  last_page: 0,
  links: {
    next: "",
    prev: "",
  },
  total: 0,
  current_page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
});

const min = computed(() => {
  if (typeof filterFields.value.start_day !== "string") {
    return filterFields.value.start_day.getTime();
  }
  return undefined;
});

const toggleIsShowFilterDetail = () => {
  isShowFilterDetail.value = !isShowFilterDetail.value;
};

const projects: Ref<projectDetailType[]> = ref([]);

const handleToDetail = (id: any) => {
  router.push("/staff/list-project/detail" + "?id=" + id);
};

const loading = ref(false);
const loadingBottom = ref(false);

const getData = async (append = false) => {
  errorLine.setDataErrorLine("", true);
  if (append) {
    meta.value.current_page += 1;
  }
  const params = {
    start_day: convertDateToParams(filterFields.value.start_day),
    end_day: convertDateToParams(filterFields.value.end_day),
    type: filterFields.value.type,
    salary_type: filterFields.value.salary_type,
    salary_from: filterFields.value.salary_type
      ? filterFields.value.salary_from
      : undefined,
    salary_to: filterFields.value.salary_type
      ? filterFields.value.salary_to
      : undefined,
    flag: filterFields.value.flag,
    page: meta.value.current_page,
    per_page: meta.value.per_page,
  };

  append ? (loadingBottom.value = true) : (loading.value = true);
  const res = await store.getAll(params);
  append ? (loadingBottom.value = false) : (loading.value = false);
  if (res && res.success) {
    meta.value = res.body.meta || {};
    if (append) {
      projects.value = projects.value.concat(res.body.data ?? []);
      return;
    }
    projects.value = res.body.data;
    if (res.body.data.length === 0) {
      errorLine.setDataErrorLine("データがありません", true);
    }
    return;
  }
  errorLine.setDataErrorLine(res?.message ?? "", false);
};

watch(
  filterFields.value,
  () => {
    const bothDateHaveValue = !!(
      filterFields.value.start_day && filterFields.value.end_day
    );
    const bothDateNotHaveValue =
      !filterFields.value.start_day && !filterFields.value.end_day;
    const isDateValid = bothDateHaveValue || bothDateNotHaveValue;
    if (!isDateValid) {
      return;
    }
    const bothUndefined =
      !filterFields.value.salary_from && !filterFields.value.salary_to;
    const bothHaveValueAndValid = !!(
      filterFields.value.salary_type &&
      filterFields.value.salary_from &&
      filterFields.value.salary_to &&
      filterFields.value.salary_from < filterFields.value.salary_to
    );
    const isSalaryValid = bothUndefined || bothHaveValueAndValid;
    if (!isSalaryValid) {
      return;
    }
    debounce(() => getData());
  },

  { deep: true },
);

onMounted(() => {
  getData();
  document.addEventListener("scroll", () => {
    const element = document.getElementById(
      `project-${projects.value.length - 1}`,
    );
    if (isInViewport(element)) {
      if (
        meta.value.current_page < meta.value.last_page &&
        !loadingBottom.value
      ) {
        loadingBottom.value = true;
        debounce(() => {
          getData(true);
        });
      }
    }
  });
});
</script>

<style lang="scss" scoped></style>
