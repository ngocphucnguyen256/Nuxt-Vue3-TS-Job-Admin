<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h4 class="h4-title mb-4 font-weight-regular">
        案件の情報を登録します。
      </h4>
      <v-form ref="formRef" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="4">
            <SelectBox
              name="契約会社"
              :items="clientSelectList"
              :value="dataForm.m_client_id"
              :is-horizontal="false"
              :loading="loadingClients"
              :rules="validation.required"
              @update:model-value="dataForm.m_client_id = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="お客様コード"
              :model-value="dataForm.m_client_code"
              :disabled="true"
              :rules="validation.required"
              :loading="loadingClientDetail"
              @update:model-value="dataForm.m_client_code = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="担当者"
              :rules="validation.required"
              :model-value="dataForm.m_client_name"
              :disabled="true"
              @update:model-value="dataForm.m_client_name = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <InputField
              :rules="validation.required"
              name="案件名"
              :model-value="dataForm.project_name"
              @update:model-value="dataForm.project_name = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <InputField
              name="案件コード"
              :model-value="dataForm.project_code"
              hide-details
              @update:model-value="dataForm.project_code = $event"
            />
          </v-col>
          <v-col cols="4">
            <DatePicker
              title="開始日"
              hide-details
              :model-value="startDayInput"
              @update:model-value="startDayInput = $event"
            />
          </v-col>
          <v-col cols="4">
            <DatePicker
              title="終了日"
              hide-details
              :model-value="endDayInput"
              @update:model-value="endDayInput = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputField
              name="場所"
              :model-value="dataForm.city"
              :rules="validation.required"
              @update:model-value="dataForm.city = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="地区"
              :rules="validation.required"
              :model-value="dataForm.province"
              @update:model-value="dataForm.province = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="住所"
              :rules="validation.required"
              :model-value="dataForm.street_name"
              @update:model-value="dataForm.street_name = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <ComboBox
              name="時給"
              :value="salaryHourInput"
              hide-details
              :rules="validation.arrayNumber"
              @update:model-value="salaryHourInput = $event"
            />
          </v-col>
          <v-col cols="4">
            <ComboBox
              name="日給"
              :value="salaryDayInput"
              :rules="validation.arrayNumber"
              hide-details
              @update:model-value="salaryDayInput = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputField
              name="人数"
              :model-value="dataForm.amount_of_people"
              @update:model-value="dataForm.amount_of_people = $event"
            />
          </v-col>
          <v-col cols="4">
            <SelectBox
              name="ジャンル"
              :items="projectTypeList"
              :value="dataForm.type"
              :is-horizontal="false"
              @update:model-value="dataForm.type = $event"
            />
          </v-col>
          <v-col cols="4">
            <SelectBox
              name="ステータス"
              :items="statusItems"
              :rules="validation.required"
              :value="dataForm.status"
              :is-horizontal="false"
              @update:model-value="dataForm.status = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <TextareaField
              name="備考"
              :model-value="dataForm.notes"
              @update:model-value="dataForm.notes = $event"
            />
          </v-col>
        </v-row>

        <div class="d-flex mt-6">
          <div class="d-flex mt-6">
            <v-btn
              class="lighten-1 mr-2"
              color="btn"
              width="109.5px"
              :disabled="!valid"
              @click="handleSubmitRegisterProject"
            >
              登録
            </v-btn>
            <v-btn color="blue-grey" dark @click="() => router.back()">
              キャンセル
            </v-btn>
          </div>
        </div>
      </v-form>
      <!-- /.form-->
      <DialogLoader
        :loading="loading"
        :dialog="showDialog"
        :is-successful="isSuccessful"
        :message="message"
      />
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import * as validationUtil from "~/utils/validations/fields";
import { useProjectStore } from "~/stores/project.module";
import { useClientStore } from "~/stores/client.module";
import {
  clientDetailType,
  SalaryType,
  projectDetailType,
} from "~/types/payload-type";
import {
  projectStatusListArray,
  SALARY_TYPE,
  projectTypeList,
} from "~/utils/consts/const";
import { convertDateToString } from "~/utils/helpers/helper";

const router = useRouter();
const clientStore = useClientStore();
const projectStore = useProjectStore();

const formRef = ref();
const valid = ref(true);
const validation = validationUtil.field;

const showDialog = ref(false);
const loading = ref(false);
const isSuccessful = ref(false);
const message = ref("");
const statusItems = projectStatusListArray.map((item) => {
  return {
    title: item.jp,
    value: item.value,
  };
});
const loadingClients = ref(false);
const loadingClientDetail = ref(false);

// random project code
const randomProjectCode = () => {
  const randomCode = Math.floor(Math.random() * 1000000);
  return randomCode.toString().padStart(6, "0");
};

const salaryHourInput: Ref<(string | number)[]> = ref([]);
const salaryDayInput: Ref<(string | number)[]> = ref([]);

const startDayInput = ref();
const endDayInput = ref();

const dataForm = ref({
  m_client_id: "",
  m_client_code: "",
  m_client_name: "",
  project_name: "",
  project_code: randomProjectCode(),
  start_day: "",
  end_day: "",
  amount_of_people: 1,
  salary: [] as SalaryType[],
  sales: 0,
  type: "",
  status: "",
  notes: "",
  city: "",
  province: "",
  street_name: "",
});

dataForm.value.salary = [] as SalaryType[];
const clientList: Ref<clientDetailType[]> = ref([]);

const clientSelectList = computed(() => {
  return clientList.value.map((item: clientDetailType) => {
    return {
      title: item.name,
      value: item.id || 0,
    };
  });
});

const currentClient = ref<clientDetailType>();

watch(
  () => dataForm.value.m_client_id,
  (value) => {
    getCLientDetail(parseInt(value));
  },
);

watch(
  () => startDayInput.value,
  (value) => {
    dataForm.value.start_day = convertDateToString(value);
  },
);

watch(
  () => endDayInput.value,
  (value) => {
    dataForm.value.end_day = convertDateToString(value);
  },
);

watch(
  () => salaryHourInput.value,
  (value) => {
    dataForm.value.salary = dataForm.value.salary.filter((item) => {
      if (typeof item.type === "string") {
        return parseInt(item.type) !== SALARY_TYPE.HOUR.value;
      }
      return item.type !== SALARY_TYPE.HOUR.value;
    });
    salaryHourInput.value.forEach((item: string | number) => {
      dataForm.value.salary.push({
        wage: item,
        type: SALARY_TYPE.HOUR.value,
      });
    });
  },
);

watch(
  () => salaryDayInput.value,
  (value) => {
    // remove all old salary type day in data form
    dataForm.value.salary = dataForm.value.salary.filter((item) => {
      if (typeof item.type === "string") {
        return parseInt(item.type) !== SALARY_TYPE.DAY.value;
      }
      return item.type !== SALARY_TYPE.DAY.value;
    });
    // add new salary type day to data form
    salaryDayInput.value.forEach((item: string | number) => {
      dataForm.value.salary.push({
        wage: item,
        type: SALARY_TYPE.DAY.value,
      });
    });
  },
);

const startLoadingDialog = () => {
  showDialog.value = true;
  loading.value = true;
};

const endLoadingDialog = () => {
  loading.value = false;
  setTimeout(() => {
    showDialog.value = false;
  }, 1000);
};

const setSuccessDialog = (value: boolean, text: string) => {
  isSuccessful.value = value;
  message.value = text;
};

const getClients = async () => {
  loadingClients.value = true;
  const params = {
    q: "",
    status: "",
  };
  const res = await clientStore.getAll(params);
  if (res && res.success) {
    clientList.value = res.body.data;
  }
  loadingClients.value = false;
};

const getCLientDetail = async (id: number) => {
  loadingClientDetail.value = true;
  const res = await clientStore.getDetail(id);
  loadingClientDetail.value = false;
  if (res && res.success) {
    currentClient.value = res.data;
    dataForm.value.m_client_code = currentClient.value?.code || "";
    dataForm.value.m_client_name = currentClient.value?.name || "";
  }
};

const handleSubmitRegisterProject = async () => {
  if (!dataForm.value || !valid.value) {
    return;
  }
  const payload = dataForm.value;
  startLoadingDialog();
  const res = await projectStore.create(payload);
  endLoadingDialog();
  if (res && res.success) {
    setSuccessDialog(true, "登録が完了しました。");
    setTimeout(() => {
      router.push("/admin/project");
    }, 1000);
    return;
  }
  setSuccessDialog(false, "登録が失敗しました。" + res.message);
};

onMounted(() => {
  getClients();
  dataForm.value.project_code = randomProjectCode();
});
</script>
