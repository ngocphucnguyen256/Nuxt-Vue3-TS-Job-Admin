<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h4 class="h4-title pl-10 mb-4">取引先の情報を登録します。</h4>
      <v-form ref="formRef" v-model="valid" lazy-validation class="px-10">
        <GroupRadio
          :items="clientTypeList"
          :value="dataForm.type"
          :rules="validation.radioButtons"
          name="管轄"
          @update:model-value="dataForm.type = $event"
        />
        <v-row>
          <v-col cols="6">
            <InputField
              name="取引先名"
              :model-value="dataForm.name"
              :rules="validation.required"
              @update:model-value="dataForm.name = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="お客様コード"
              :model-value="dataForm.code"
              :rules="validation.required"
              @update:model-value="dataForm.code = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <InputField
              name="郵便番号"
              :model-value="dataForm.zip_code"
              :rules="validation.required"
              @update:model-value="dataForm.zip_code = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="市"
              :model-value="dataForm.city"
              :rules="validation.required"
              @update:model-value="dataForm.city = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <InputField
              name="地区"
              :model-value="dataForm.district"
              :rules="validation.required"
              @update:model-value="dataForm.district = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="道の名前"
              :model-value="dataForm.street_name"
              :rules="validation.required"
              @update:model-value="dataForm.street_name = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <InputField
              name="電話番号"
              :model-value="dataForm.tel"
              :rules="[
                ...validation.required,
                ...validation.phoneNumber(dataForm.tel),
              ]"
              @update:model-value="dataForm.tel = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="メールアドレス"
              :model-value="dataForm.email"
              :rules="validation.email"
              hide-required
              @update:model-value="dataForm.email = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <InputField
              name="担当者"
              :model-value="dataForm.pic_name"
              :rules="validation.requiredWithName('担当者', dataForm.pic_name)"
              @update:model-value="dataForm.pic_name = $event"
            />
          </v-col>
          <v-col cols="6">
            <SelectBox
              name="ステータス"
              :items="clientStatusList"
              :value="dataForm.status"
              :is-horizontal="false"
              :rules="validation.selectWithName('ステータス', dataForm.status)"
              @update:model-value="dataForm.status = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <TextareaField
              name="備考"
              :model-value="dataForm.note"
              @update:model-value="dataForm.note = $event"
            />
          </v-col>
        </v-row>

        <DialogLoader
          :loading="loading"
          :dialog="showDialog"
          :is-successful="isSuccessful"
          :message="message"
        />

        <div class="d-flex mt-6">
          <v-btn
            :disabled="!valid"
            class="lighten-1 mr-2"
            dark
            width="109.5px"
            color="btn"
            @click="submit"
          >
            登録
          </v-btn>

          <v-btn color="blue-grey" dark @click="() => router.back()">
            キャンセル
          </v-btn>
        </div>
      </v-form>
      <!-- /.form-->
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import * as validationUtil from "~/utils/validations/fields";
import { useClientStore } from "~/stores/client.module";
import { clientTypeList, clientStatusList } from "~/utils/consts/const";
import { clientDetailType } from "~/types/payload-type";

const validation = ref(validationUtil.field);
const store = useClientStore();
const router = useRouter();

const formRef = ref();
const valid = ref(true);
const showDialog = ref(false);
const loading = ref(false);
const isSuccessful = ref(false);
const message = ref("");

const dataForm: Ref<clientDetailType> = ref({
  code: "",
  name: "",
  type: "",
  zip_code: "",
  city: "",
  district: "",
  street_name: "",
  tel: "",
  email: "",
  pic_name: "",
  status: "",
  note: "",
});

watch(
  () => dataForm.value.status,
  (value) => {
    if (typeof value === "string") {
      dataForm.value.status = clientStatusList.find(
        (item: { title: string; value: number }) => {
          return item.title === value || item.value === parseInt(value);
        },
      )?.value;
    }
  },
);

onMounted(() => {
  getData();
});

const getData = async () => {
  loading.value = true;
  const id = parseInt(router.currentRoute.value.query.id as string);
  const res = await store.getDetail(id);
  if (res && res.success) {
    dataForm.value = res.data;
    clientTypeList.forEach((item: { title: string; value: string }) => {
      if (item.value === res.data.type || item.title === res.data.type) {
        dataForm.value.type = item.value;
      }
    });
  }
  loading.value = false;
};

const submit = () => {
  if (formRef.value && valid.value) {
    postData();
  }
};

const postData = async () => {
  showDialog.value = true;
  loading.value = true;
  const id = parseInt(router.currentRoute.value.query.id as string);
  const res = await store.update(id, dataForm.value);
  loading.value = false;
  setTimeout(() => {
    showDialog.value = false;
  }, 1000);
  if (res && res.success) {
    isSuccessful.value = true;
    message.value = "登録が完了しました。";
    return;
  }
  isSuccessful.value = false;
  message.value = res.message || "Unknown error";
};
</script>
