<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">案件リスト</h3>
    <ErrorLine :message="message" :success="success" />
    <div
      class="bg-light px-6 py-6 mb-4 mt-4 md:w-50 border rounded-lg elevation-1"
    >
      <LoaderComponent :loading="loading" />
      <ProjectComponent :project="project" />
      <v-btn
        color="blue"
        variant="elevated"
        block
        class="text-light mb-2"
        @click="subscribeProject()"
      >
        エントリー
      </v-btn>
      <v-btn
        color="blue"
        variant="elevated"
        block
        class="text-light mb-2"
        @click="router.push('/staff/list-project/')"
      >
        戻る
      </v-btn>
    </div>
  </ClientLayout>
</template>

<script lang="ts" setup>
import { projectDetailType } from "types/payload-type";
import { useProjectStore } from "~/stores/project.module";
import { useStaffStore } from "~/stores/staff.module";

const projectStore = useProjectStore();
const staffStore = useStaffStore();

const router = useRouter();

const project = ref({} as projectDetailType);

const loading = ref(false);
const success = ref(false);
const message = ref("");

const subscribeProject = async () => {
  const id = parseInt(router.currentRoute.value.query.id as string);
  loading.value = true;
  const res = await staffStore.staffEntryToProject(id);
  loading.value = false;
  if (res && res.success) {
    success.value = true;
    message.value = "プロジェクト成功への入り口";
    return;
  }
  message.value = res?.message ?? "";
};

const getProjectData = async () => {
  const id = parseInt(router.currentRoute.value.query.id as string);
  loading.value = true;
  const res = await projectStore.getDetail(id);
  loading.value = false;
  if (res && res.success) {
    project.value = res.data;
    return;
  }
  message.value = res?.message ?? "";
};

onMounted(() => {
  getProjectData();
});
</script>

<style lang="scss" scoped></style>
