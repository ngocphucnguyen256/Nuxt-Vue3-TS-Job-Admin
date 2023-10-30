<template>
  <v-app class="drawer-overlay-admin">
    <div class="">
      <v-theme-provider theme="lightTheme">
        <div class="l-register">
          <h2 class="mb-4 mt-2 font-weight-bold">登録する</h2>
          <v-form ref="form" v-model="valid" lazy-validation>
            <InputField
              name="氏名："
              :model-value="formData.name"
              :rules="validation.requiredWithName('氏名', formData.name)"
              class="mb-2"
              @update:model-value="formData.name = $event"
            />
            <InputField
              name="ふりがな:"
              class="mb-2"
              :model-value="formData.furigana"
              :rules="[
                ...validation.requiredWithName('ふりがな', formData.furigana),
                ...validation.jpTextOnly,
              ]"
              @update:model-value="formData.furigana = $event"
            />
            <DatePicker
              class="mb-2"
              title="生年月日："
              :model-value="birthday"
              :rules="
                validation.requiredWithName('生年月日', formData.birthday)
              "
              @update:model-value="birthday = $event"
            />
            <InputField
              class="mb-2"
              name="住所："
              :model-value="formData.address"
              :rules="validation.requiredWithName('住所', formData.address)"
              @update:model-value="formData.address = $event"
            />

            <GroupRadio
              class="mb-2"
              :items="genderList"
              :value="formData.gender"
              :rules="validation.selectWithName('性别', formData.gender)"
              name="性别："
              @update:model-value="formData.gender = $event"
            />

            <InputField
              class="mb-2"
              name="電話番号："
              :model-value="formData.tel"
              :rules="[
                ...validation.requiredWithName('電話番号', formData.tel),
                ...validation.phoneNumber(formData.tel),
              ]"
              @update:model-value="formData.tel = $event"
            />
            <InputField
              class="mb-2"
              name="口座情報："
              :model-value="formData.bank_info"
              :rules="
                validation.requiredWithName('口座情報', formData.bank_info)
              "
              @update:model-value="formData.bank_info = $event"
            />
            <InputField
              class="mb-2"
              name="銀行支店："
              :model-value="formData.bank_branch"
              :rules="
                validation.requiredWithName('銀行支店', formData.bank_branch)
              "
              @update:model-value="formData.bank_branch = $event"
            />
            <InputField
              class="mb-2"
              name="銀行番号："
              :model-value="formData.bank_number"
              :rules="[
                ...validation.requiredWithName(
                  '銀行番号',
                  formData.bank_number,
                ),
                ...validation.number,
              ]"
              @update:model-value="formData.bank_number = $event"
            />
            <InputField
              class="mb-2"
              name="LINE: "
              :model-value="formData.line"
              @update:model-value="formData.line = $event"
            />
            <InputField
              class="mb-2"
              name="Mail: "
              :model-value="formData.email"
              :rules="validation.email"
              @update:model-value="formData.email = $event"
            />
            <GroupRadio
              class="mb-2"
              :items="mainContactItems"
              :value="formData.contact"
              :rules="validation.selectWithName('性别', formData.contact)"
              name="性别："
              @update:model-value="formData.contact = $event"
            />
            <InputField
              class="mb-2"
              name="パスワード"
              :model-value="formData.password"
              :type-password="true"
              :rules="validation.password"
              @update:model-value="formData.password = $event"
            />
            <InputField
              class="mb-2"
              name="パスワードの確認"
              :model-value="formData.password_confirmation"
              :type-password="true"
              :rules="[
                ...validation.password,
                ...validation.confirmPassword(
                  formData.password,
                  formData.password_confirmation,
                ),
              ]"
              @update:model-value="formData.password_confirmation = $event"
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
              style="width: 100%"
              @click="onSubmit"
            >
              反登绿
            </v-btn>
            <div class="mb-3 d-flex align-center l-login__line">
              <div></div>
              <p class="ml-1 mr-1">Or</p>
              <div></div>
            </div>
            <v-btn
              style="width: 100%"
              theme="lightTheme"
              variant="outlined"
              @click="toLogin"
            >
              Login Now
            </v-btn>
          </v-form>
          <DialogLoader
            :loading="loading"
            :dialog="showDialog"
            :is-successful="isSuccessful"
            :message="message"
          />
        </div>
      </v-theme-provider>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import * as validationUtil from "~/utils/validations/fields";
import { StaffType } from "~/types/payload-type";
import { useAuthStore } from "~/stores/auth.module";
import { convertDateToString } from "~/utils/helpers/helper";
import { genderList, mainContactItems } from "~/utils/consts/const";

const validation = validationUtil.field;
const agreeToTerms = ref(false);
const store = useAuthStore();
const valid = ref(false);
const router = useRouter();
const formData = ref({} as StaffType);

const disabledSubmit = computed(() => {
  return agreeToTerms.value !== true || !valid.value;
});

const showDialog = ref(false);
const loading = ref(false);
const isSuccessful = ref(false);
const message = ref("");

const birthday = ref(new Date());

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

const postData = async () => {
  startLoadingDialog();
  formData.value.birthday = convertDateToString(birthday.value);
  const res = await store.registerStaffAccount(formData.value);
  endLoadingDialog();
  if (res && res.success) {
    setSuccessDialog(true, "登録が完了しました。");
    return;
  }
  setSuccessDialog(false, "登録が失敗しました。" + res.message);
};

const onSubmit = () => {
  if (disabledSubmit.value) {
    return;
  }
  postData();
};

const toLogin = () => {
  router.push("/staff/login");
};
</script>

<style lang="scss" scoped>
.l-login {
  &__line {
    > div {
      width: 100%;
      height: 1px;
      background-color: rgba(229, 229, 229, 1);
      margin: 20px 0;
    }
    p {
      color: rgba(163, 163, 163, 1);
      font-family: Poppins;
      font-size: 12px;
      font-weight: 300;
      line-height: 18px;
      letter-spacing: 0em;
      text-align: left;
    }
  }
}
</style>
