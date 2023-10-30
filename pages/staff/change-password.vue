<template>
  <v-app class="drawer-overlay-admin">
    <div class="l-login">
      <v-theme-provider theme="lightTheme">
        <div class="l-login__detail">
          <div class="l-login__logo sm-hidden">
            <img src="~/public/login.png" alt="logo" />
          </div>
          <div class="l-login__inner">
            <h2 class="mb-10">パスワードを変更する</h2>
            <ErrorLine
              :message="errorLine.message"
              :success="errorLine.success"
            />
            <v-form ref="formRef" v-model="valid" lazy-validation>
              <InputField
                name="以前のパスワード"
                :model-value="form.old_password"
                :type-password="true"
                class="mb-2"
                :rules="validation.password"
                @update:model-value="form.old_password = $event"
              />
              <InputField
                name="新しいパスワード"
                :model-value="form.new_password"
                class="mb-2"
                :type-password="true"
                :rules="validation.password"
                @update:model-value="form.new_password = $event"
              />
              <InputField
                name="新しいパスワードの確認"
                :model-value="form.new_password_confirmation"
                class="mb-2"
                :type-password="true"
                :rules="[
                  ...validation.password,
                  ...validation.confirmPassword(
                    form.new_password,
                    form.new_password_confirmation,
                  ),
                ]"
                @update:model-value="form.new_password_confirmation = $event"
              />
              <LoaderComponent v-if="loading" :loading="loading" />
              <v-btn
                class="mt-6 mb-6"
                style="width: 100%"
                theme="lightTheme"
                color="blue-accent-4"
                @click="handleChangePassword"
              >
                パスワードを変更する
              </v-btn>
              <v-btn
                style="width: 100%"
                theme="lightTheme"
                color="blue-accent-4"
                @click="handleGoBack"
              >
                戻る
              </v-btn>
            </v-form>
            <!-- /.form-->
          </div>
        </div>
      </v-theme-provider>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as validationUtil from "~/utils/validations/fields";
import { useAuthStore } from "~/stores/auth.module";

const formRef = ref();

const form = ref({
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const valid = ref(true);
const loading = ref(false);
const validation = ref(validationUtil.field);
const store = useAuthStore();
const router = useRouter();

const errorLine = ref({
  message: "",
  success: false,
});

const handleGoBack = () => {
  router.back();
};

const handleChangePassword = async () => {
  if (form.value.new_password !== form.value.new_password_confirmation) {
    return;
  }
  if (formRef.value && valid.value) {
    loading.value = true;
    const res = await store.changePassword(form.value);
    loading.value = false;
    if (res && res.success) {
      errorLine.value = {
        message: "パスワードを変更しました。",
        success: true,
      };
      return;
    }
    errorLine.value = {
      message: "パスワードを変更できませんでした。",
      success: false,
    };
  }
};
</script>

<style scoped lang="scss">
.drawer-overlay-admin {
  .l-login {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 100px auto;

    .logo-login {
      text-align: center;
      display: block;

      img {
        width: 120px;
        height: auto;
        object-fit: cover;
      }
    }

    &__detail {
      display: flex;
      width: 900px;
      height: 564px;
      border-radius: 10px;
    }
    &__logo {
      width: 450px;
      height: 564px;
    }
    &__inner {
      padding: 40px;
      width: 100%;
    }
    &__forgot {
      display: flex;
      flex-direction: row-reverse;
    }
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
}

@media screen and (max-width: 768px) {
  .l-login {
    margin: 0 !important;
    &__detail {
      width: 100% !important;
    }
  }
}
</style>
