<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">エントリーしたお仕事</h3>
    <SelectBox
      name="ステータス"
      :items="entryStatusItems"
      :value="status"
      :is-horizontal="false"
      @update:model-value="status = $event"
    />
    <LoaderComponent v-if="loading" :loading="loading" />
    <ErrorLine
      :message="errorLine.message.value"
      :success="errorLine.isSuccess.value"
    />
    <div>
      <div
        v-for="project in projects"
        :key="project.project_name"
        class="bg-light px-6 py-6 mb-4 mt-4 md:w-25 border rounded-lg elevation-1"
      >
        <ProjectComponent :project="project" />
        <v-btn
          v-if="!handleDisableButton(project)"
          color="blue"
          variant="elevated"
          class="text-light mb-2"
          @click="toReportProject(project)"
        >
          作業報告
        </v-btn>
      </div>
    </div>
  </ClientLayout>
</template>

<script setup lang="ts">
import { projectDetailType } from "~/types/payload-type";
import { entryStatusItems } from "~/utils/consts/const";
import { useProjectStore } from "~/stores/project.module";
import { useDebounce } from "~/composables/useDebounce";
const router = useRouter();
const store = useProjectStore();
const debounce = useDebounce(300);
const loading = ref(false);
const errorLine = useErrorLine();
const status: Ref<number> = ref(1);

const projects: Ref<projectDetailType[]> = ref([]);

const getData = async () => {
  errorLine.setDataErrorLine("", true);
  const params = {
    status: status.value,
  };
  loading.value = true;
  const res = await store.getEntryProjectsStaff(params);
  loading.value = false;
  if (res && res.success) {
    projects.value = res.body.data;
    if (res.body.data.length === 0) {
      errorLine.setDataErrorLine("データがありません", true);
    }
    return;
  }
  errorLine.setDataErrorLine(res?.message ?? "", false);
};

watch(status, () => {
  debounce(() => {
    getData();
  });
});

const handleDisableButton = (project: projectDetailType) => {
  const date = new Date(project.end_day);
  const dateNow = new Date();
  date.setHours(0, 0, 0, 0);
  dateNow.setHours(0, 0, 0, 0);
  return date < dateNow;
};

const toReportProject = (project: projectDetailType) => {
  router.push({
    path: "/staff/report",
    query: {
      id: project.id,
    },
  });
};

onMounted(() => {
  const statusParams =
    parseInt(router.currentRoute.value.query.status?.toString() || "") ||
    undefined;
  if (!statusParams) {
    getData();
    return;
  }
  status.value = statusParams;
});
</script>

<style lang="scss" scoped></style>
