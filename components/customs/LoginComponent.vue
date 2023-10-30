<template>
  <v-app class="drawer-overlay-admin">
    <div class="l-login">
      <v-theme-provider theme="lightTheme">
        <div class="l-login__detail">
          <div class="l-login__logo sm-hidden">
            <img src="~/public/login.png" alt="logo" />
          </div>
          <div class="l-login__inner">
            <h2 class="mb-10">
              {{ isForgotPasswordUI ? "パスワードをお忘れですか" : "ログイン" }}
            </h2>
            <ErrorLine
              :message="errorLine.message"
              :success="errorLine.success"
            />
            <v-form ref="formRef" v-model="valid" lazy-validation>
              <InputField
                name="メール"
                :model-value="email"
                :rules="[
                  ...validation.requiredWithName('メール', email),
                  ...validation.email,
                ]"
                class="mb-2"
                @update:model-value="email = $event"
              />

              <InputField
                v-if="!isForgotPasswordUI"
                class="mb-2"
                name="パスワード"
                :model-value="password"
                :type-password="true"
                :rules="validation.password"
                @update:model-value="password = $event"
              />
              <div class="l-login__forgot">
                <v-btn
                  variant="flat"
                  class="text-"
                  @click="toggleForgotPasswordUI"
                  >{{ isForgotPasswordUI ? "Login" : "forgot password" }}</v-btn
                >
              </div>
              <LoaderComponent v-if="loading" :loading="loading" />
              <v-btn
                class="mt-6 mb-10"
                style="width: 100%"
                theme="lightTheme"
                color="blue-accent-4"
                @click="submit"
              >
                {{ isForgotPasswordUI ? "Send reset password email" : "Login" }}
              </v-btn>
              <div
                v-if="isClient"
                class="mb-3 d-flex align-center l-login__line"
              >
                <div></div>
                <p class="ml-1 mr-1">Or</p>
                <div></div>
              </div>
              <v-btn
                v-if="isClient"
                style="width: 100%"
                theme="lightTheme"
                variant="outlined"
                @click="register"
              >
                Register Now
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

interface Props {
  isClient?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isClient: false,
});

const isClient = computed(() => props.isClient);

const validation = ref(validationUtil.field);
const store = useAuthStore();
const router = useRouter();

const formRef = ref();
const email = ref("");
const password = ref("");
const valid = ref(true);
const loading = ref(false);
const isForgotPasswordUI = ref(false);
const errorLine = ref({
  message: "",
  success: false,
});

const submit = () => {
  if (isForgotPasswordUI.value) {
    handleForgotPassword();
  } else {
    handleLogin();
  }
};

const handleLogin = async () => {
  if (formRef.value && valid.value) {
    const payload = {
      email: email.value,
      password: password.value,
    };
    loading.value = true;
    const res = await store.login(payload);
    loading.value = false;
    if (res && res.success) {
      router.push(isClient.value ? "/staff/my-page" : "/admin/dashboard");
      return;
    }
    errorLine.value = {
      message: res?.message ?? "Something went wrong",
      success: false,
    };
  }
};

const handleForgotPassword = async () => {
  if (formRef.value && valid.value) {
    const payload = {
      email: email.value,
    };
    loading.value = true;
    const res = await store.forgotPassword(payload);
    loading.value = false;
    if (res && res.success) {
      errorLine.value = {
        message: "Reset password email has been sent",
        success: true,
      };
      isForgotPasswordUI.value = false;
      return;
    }
    errorLine.value = {
      message: res?.message ?? "Something went wrong",
      success: false,
    };
  }
};

const toggleForgotPasswordUI = () => {
  isForgotPasswordUI.value = !isForgotPasswordUI.value;
};
const register = () => {
  router.push("/staff/register");
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
