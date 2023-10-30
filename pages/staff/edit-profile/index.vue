<template>
  <ClientLayout>
    <h3 class="mb-6 mt-2 font-weight-bold">プロファイル編集</h3>
    <v-form ref="form" v-model="valid" lazy-validation>
      <InputField
        name="氏名："
        :model-value="formData.name"
        :rules="validation.required"
        class="mb-2"
        @update:model-value="formData.name = $event"
      />
      <InputField
        name="ふりがな:"
        :model-value="formData.furigana"
        class="mb-2"
        :rules="validation.required"
        @update:model-value="formData.furigana = $event"
      />
      <DatePicker
        title="生年月日："
        :model-value="birthday"
        class="mb-2"
        :rules="validation.required"
        @update:model-value="birthday = $event"
      />
      <InputField
        name="住所："
        :model-value="formData.address"
        class="mb-2"
        :rules="validation.required"
        @update:model-value="formData.address = $event"
      />

      <GroupRadio
        :items="genderList"
        :value="formData.gender"
        :rules="validation.radioButtons"
        name="性别："
        class="mb-2"
        @update:model-value="formData.gender = $event"
      />

      <InputField
        name="電話番号："
        :model-value="formData.tel"
        class="mb-2"
        :rules="[
          ...validation.required,
          ...validation.phoneNumber(formData.tel),
        ]"
        @update:model-value="formData.tel = $event"
      />
      <InputField
        name="口座情報："
        :model-value="formData.bank_info"
        class="mb-2"
        :rules="validation.required"
        @update:model-value="formData.bank_info = $event"
      />
      <InputField
        name="銀行支店："
        :model-value="formData.bank_branch"
        :rules="validation.requiredWithName('銀行支店', formData.bank_branch)"
        @update:model-value="formData.bank_branch = $event"
      />
      <InputField
        name="銀行番号："
        :model-value="formData.bank_number"
        :rules="[
          ...validation.requiredWithName('銀行番号', formData.bank_number),
          ...validation.number,
        ]"
        @update:model-value="formData.bank_number = $event"
      />
      <InputField
        name="LINE: "
        class="mb-2"
        :model-value="formData.line"
        @update:model-value="formData.line = $event"
      />
      <InputField
        name="Mail: "
        class="mb-2"
        :model-value="formData.email"
        @update:model-value="formData.email = $event"
      />
      <GroupRadio
        :items="mainContactItems"
        :value="formData.contact"
        :rules="validation.radioButtons"
        name="性别："
        @update:model-value="formData.contact = $event"
      />

      <v-checkbox v-model="agreeToTerms">
        <template #label>
          <div>利用規約に同意する</div>
        </template>
      </v-checkbox>

      <v-btn
        color="blue"
        :disabled="disabledSubmit"
        variant="elevated"
        class="text-light"
        @click="onSubmit"
      >
        反登绿
      </v-btn>
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
import { StaffType } from "~/types/payload-type";
import { useStaffStore } from "~/stores/staff.module";
import {
  convertDateToString,
  convertPhoneStringToNumber,
} from "~/utils/helpers/helper";
import { genderList, mainContactItems } from "~/utils/consts/const";

const validation = validationUtil.field;
const agreeToTerms = ref(false);
const staffStore = useStaffStore();
const valid = ref(false);

const formData = ref({} as StaffType);

const disabledSubmit = computed(() => {
  return agreeToTerms.value !== true || !valid.value;
});

const dialogLoader = useLoadingDialog();
const birthday = ref(new Date());

const getStaffData = async () => {
  const res = await staffStore.getDetailMe();
  if (res && res.success) {
    formData.value = res.body.data;
    birthday.value = new Date(res.body.data.birthday);
  }
};

watch(
  () => formData.value.contact,
  (value) => {
    if (typeof value === "string") {
      formData.value.contact = mainContactItems.find(
        (item: { title: string; value: number }) => {
          return item.title === value || item.value === parseInt(value);
        },
      )?.value;
    }
  },
);

const postData = async () => {
  const thisStaffId = formData.value.id;
  if (!thisStaffId) {
    return;
  }
  dialogLoader.startLoadingDialog();
  formData.value.birthday = convertDateToString(birthday.value);
  formData.value.tel = convertPhoneStringToNumber(formData.value.tel);
  const res = await staffStore.update(thisStaffId, formData.value);
  dialogLoader.endLoadingDialog();
  if (res && res.success) {
    dialogLoader.setSuccessDialog(true, "登録が完了しました。");
    return;
  }
  dialogLoader.setSuccessDialog(false, res.message || "登録が失敗しました。");
};

const onSubmit = () => {
  if (disabledSubmit.value) {
    return;
  }
  postData();
};

onMounted(() => {
  getStaffData();
});
</script>

<style lang="scss" scoped></style>
