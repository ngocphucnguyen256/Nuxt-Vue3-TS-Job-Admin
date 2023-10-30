<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h4 class="h4-title pl-10 mb-4">取引先の情報を登録します。</h4>
      <v-form ref="formRef" v-model="valid" lazy-validation class="px-10">
        <GroupRadio
          :items="clientTypeList"
          :value="dataForm.type"
          :rules="validation.selectWithName('管轄', dataForm.type)"
          name="管轄"
          @update:model-value="dataForm.type = $event"
        />
        <v-row>
          <v-col cols="6">
            <InputField
              name="取引先名"
              :model-value="dataForm.name"
              :rules="validation.requiredWithName('取引先名', dataForm.name)"
              @update:model-value="dataForm.name = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="お客様コード"
              :model-value="dataForm.code"
              :rules="
                validation.requiredWithName('お客様コード', dataForm.code)
              "
              @update:model-value="dataForm.code = $event"
          /></v-col>
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
            color="btn"
            width="109.5px"
            @click="submit"
          >
            登録
          </v-btn>

          <v-btn color="blue-grey" dark @click="() => router.back()">
            キャンセル
          </v-btn>
        </div>
      </v-form>
    </div>
    <!-- /.form-->
  </AdminLayout>
</template>

<script lang="ts" setup>
import * as validationUtil from "~/utils/validations/fields";
import { useClientStore } from "~/stores/client.module";
import { clientTypeList, clientStatusList } from "~/utils/consts/const";
import { clientDetailType } from "~/types/payload-type";

const router = useRouter();

const showDialog = ref(false);
const loading = ref(false);
const isSuccessful = ref(false);
const message = ref("");

const formRef = ref();
const valid = ref(true);
const validation = ref(validationUtil.field);

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
const store = useClientStore();

const submit = () => {
  if (formRef.value && valid.value) {
    postData();
  }
};

const postData = async () => {
  showDialog.value = true;
  loading.value = true;
  const res = await store.create(dataForm.value);
  loading.value = false;
  setTimeout(() => {
    showDialog.value = false;
  }, 1000);
  if (res && res.success) {
    isSuccessful.value = true;
    message.value = "登録が完了しました。";
    setTimeout(() => {
      router.push("/admin/client/" + "?sort=id");
    }, 2000);
    return;
  }
  isSuccessful.value = false;
  message.value = "登録が失敗しました。" + res.message;
};
</script>
