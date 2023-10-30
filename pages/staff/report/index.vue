<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">イベント設営</h3>
    <v-form @submit.prevent="onSubmit">
      <SelectBox
        name="案件を教えてください"
        :items="listProject"
        :value="form.project_id"
        :is-horizontal="false"
        :loading="isLoadingProjects"
        @update:model-value="(e) => handleSelectProject(e, form.project_id)"
      />
      <SelectBox
        name="起床時間"
        :items="listDayOfProject"
        :value="dateID"
        :is-horizontal="false"
        :loading="isLoadingDateId"
        @update:model-value="(e) => handleSelectDate(e, dateID)"
      />
      <div>起床・出発時間を教えてください</div>
      <TimePicker
        :model-value="form.wake_up_time"
        title="起床時間"
        @update:model-value="form.wake_up_time = $event"
      >
      </TimePicker>
      <TimePicker
        :model-value="form.departure_time"
        title="出発時間"
        @update:model-value="form.departure_time = $event"
      >
      </TimePicker>

      <v-checkbox v-model="agreeToTerms">
        <template #label>
          <div>上記の内容を確認しました</div>
        </template>
      </v-checkbox>

      <v-btn
        color="blue"
        type="submit"
        variant="elevated"
        :disabled="!agreeToTerms || isDisableSubmit"
        class="mb-6 mt-2 text-light"
      >
        登録
      </v-btn>

      <div v-if="agreeToTerms">
        <hr class="mt-6 mb-6" />
        <div>勤怠時間を教えてください</div>

        <TimePicker
          :model-value="form.work_time"
          title="作業開始時間"
          @update:model-value="form.work_time = $event"
        >
        </TimePicker>

        <TimePicker
          :model-value="form.end_work_time"
          title="作業終了時間"
          @update:model-value="form.end_work_time = $event"
        >
        </TimePicker>
        <TimePicker
          :model-value="form.breaks_time"
          title="休憩時間"
          type="custom"
          @update:model-value="form.breaks_time = $event"
        >
        </TimePicker>

        <SelectBox
          name="支払い方法"
          :items="listPaymentType"
          :value="form.payment_type"
          :is-horizontal="false"
          @update:model-value="form.payment_type = $event"
        />

        <InputField
          name="交通費"
          class="mt-4 mb-4"
          :model-value="form.travel_expenses"
          @update:model-value="form.travel_expenses = $event"
        />

        <InputField
          name="備考"
          class="mt-4 mb-4"
          :model-value="form.notes"
          @update:model-value="form.notes = $event"
        />

        <v-btn
          type="submit"
          class="text-light mt-6 mb-4"
          color="blue"
          :disabled="isDisableSubmit"
        >
          作業完了報告
        </v-btn>
      </div>
    </v-form>
    <DialogLoader
      :loading="dialogLoader.loading.value"
      :dialog="dialogLoader.showDialog.value"
      :is-successful="dialogLoader.isSuccessful.value"
      :message="dialogLoader.message.value"
    />
  </ClientLayout>
</template>

<script setup lang="ts">
import * as validationUtil from "~/utils/validations/fields";
import { useReportStore } from "~/stores/report.module";

const validation = validationUtil.field;
const store = useReportStore();

const form = ref({
  wake_up_time: "00:00:00",
  departure_time: "00:00:00",
  work_time: "00:00:00",
  end_work_time: "00:00:00",
  breaks_time: "00:00:00",
  payment_type: "1",
  travel_expenses: 0,
  notes: "",
  project_id: "",
});

const dialogLoader = useLoadingDialog();

const agreeToTerms = ref(false);
const dateID = ref();
const isLoadingDateId = ref(false);
const isLoadingProjects = ref(false);
const listProject: Ref<any[]> = ref([]);

const isDisableSubmit = computed(() => {
  return !dateID.value;
});

const listDayOfProject: Ref<any[]> = ref([]);

const listPaymentType = [
  { title: "Day", value: "1" },
  { title: "Week", value: "2" },
  { title: "Month", value: "3" },
];

async function getData() {
  isLoadingProjects.value = true;
  const res = await store.getListProject();
  isLoadingProjects.value = false;
  if (res.success) {
    res.data.forEach((item: any) => {
      listProject.value.push({
        value: item.id.toString(),
        title: item.project_name,
      });
    });
  }
}

const handleSelectProject = async (value: any, oldVal: any) => {
  if (value && parseInt(value) !== parseInt(oldVal)) {
    form.value.project_id = value;
    isLoadingDateId.value = true;
    const res = await store.getDateOfProject(parseInt(form.value.project_id));
    isLoadingDateId.value = false;
    if (res.success) {
      res.data.data.forEach((item: any) => {
        listDayOfProject.value.push({
          value: item.id.toString(),
          title: item.date,
        });
      });
    }
  }
};

const handleSelectDate = async (value: any, oldVal: any) => {
  if (value && value !== oldVal) {
    dateID.value = value;
    const rpDetail = await store.getStaffReportDetail(parseInt(dateID.value));
    if (rpDetail.success) {
      const projectId = form.value.project_id;
      form.value = rpDetail.data;
      if (!rpDetail.data.departure_time) {
        form.value.departure_time = "";
      }
      if (!rpDetail.data.breaks_time) {
        form.value.breaks_time = "";
      }
      if (!rpDetail.data.end_work_time) {
        form.value.end_work_time = "";
      }
      if (!rpDetail.data.wake_up_time) {
        form.value.wake_up_time = "";
      }
      if (!rpDetail.data.work_time) {
        form.value.work_time = "";
      }
      if (!rpDetail.data.payment_type) {
        form.value.payment_type = "1";
      }
      form.value.project_id = projectId;
    }
  }
};

const onSubmit = async () => {
  if (!dateID.value) {
    return;
  }
  const payload = {
    breaks_time: convertToDateTime(form.value.breaks_time),
    departure_time: convertToDateTime(form.value.departure_time),
    end_work_time: convertToDateTime(form.value.end_work_time),
    wake_up_time: convertToDateTime(form.value.wake_up_time),
    work_time: convertToDateTime(form.value.work_time),
    payment_type: form.value.payment_type,
    travel_expenses: form.value.travel_expenses,
    notes: form.value.notes,
  };

  dialogLoader.startLoadingDialog();
  const res = await store.updateDetailStaff(parseInt(dateID.value), payload);
  dialogLoader.endLoadingDialog();
  if (res && res.success) {
    dialogLoader.setSuccessDialog(true, "登録が完了しました。");
    return;
  }
  dialogLoader.setSuccessDialog(false, res.message || "登録が失敗しました。");
};

function convertToDateTime(value: any) {
  if (value) {
    return `${value}`;
  }
  return "";
}
onMounted(() => {
  getData();
});
</script>

<style lang="sass" scoped></style>
