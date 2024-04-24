import { LoginPayloadType } from "~/types/payload-type";
import { TOKEN_EXPIRED_TIME } from "~/utils/consts/const";

interface Auth {
  access_token: string;
  token_type: string;
  time: number;
  expires_in: number;
  user: {
    email: string;
  };
}

const defaultAuth: Auth = {
  access_token: "",
  token_type: "",
  time: 0,
  expires_in: 0,
  user: {
    email: "",
  },
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: defaultAuth,
  }),
  getters: {
    getAuth: (state) => state.auth,
  },
  actions: {
    async login(
      payload: LoginPayloadType,
    ): Promise<{ success: boolean; message: any } | undefined> {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.auth.login(payload).catch((e) => {
        if (e.response?.status === 403) {
          return {
            success: false,
            message: "メールアドレスまたはパスワードが間違っています!",
          };
        }
        return {
          success: false,
          message: "Server error",
        };
      });
      if (res.data) {
        // have another api to get this data later, use this mock data for now
        const userDetail = {
          email: payload.email,
        };
        this.setAuth(
          {
            access_token: res.data.token,
            // token_type: body.token_type,
            // time: body.expires_in,
            // expires_in: 0,
            // user: userDetail,
          },
          userDetail,
        );
        return { success: true, message: "Login success" };
      }
      return {
        success: false,
        message: res.message || "Server error",
      };
    },
    async signUp(
      payload: LoginPayloadType,
    ): Promise<{ success: boolean; message: any } | undefined> {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.auth
        .custom("signup", "POST", payload)
        .catch((e) => {
          if (e.response?.status === 403) {
            return {
              success: false,
              message: "Email already exists!",
            };
          }
          return {
            success: false,
            message: "Server error",
          };
        });
      if (res) {
        return { success: true, message: "Signup success" };
      }
      return {
        success: false,
        message: res.message || "Server error",
      };
    },
    setDataLocalStorage() {
      localStorage.setItem("token", JSON.stringify(this.auth.access_token));
      localStorage.setItem("expires_in", JSON.stringify(this.auth.expires_in));
      localStorage.setItem("user", JSON.stringify(this.auth.user));
    },
    removeDataLocalStorage() {
      localStorage.removeItem("token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("user");
    },
    setAuth(
      payload: Pick<Auth, "access_token">,
      userDetail: {
        email: string;
      },
    ) {
      this.auth.access_token = payload.access_token;
      this.auth.user = userDetail;
      this.auth.expires_in =
        Date.now() + (this.auth.time * 1000 || TOKEN_EXPIRED_TIME);
      this.setDataLocalStorage();
    },

    setUser(payload: { email: string }) {
      this.auth.user = payload;
      localStorage.setItem("user", JSON.stringify(this.auth.user));
    },
    clearAuth() {
      this.auth = defaultAuth;
      this.removeDataLocalStorage();
    },
    setToken(payload: string) {
      this.auth.access_token = payload;
      localStorage.setItem("token", JSON.stringify(this.auth.access_token));
    },
    async logout() {
      const { $repositories } = useNuxtApp();
      const { success = null } = await $repositories.auth.logout().catch(() => {
        return {
          success: false,
          message: "Server error",
        };
      });
      this.clearAuth();
      if (success) {
        return { success: true, message: success.message };
      }
      return {
        success: false,
        message: "Server error",
      };
    },
    async sendMailToListIdStaff(payload: {
      id_staff: Array<number>;
      title: string;
      content: string;
    }) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        message = null,
        error = {},
      } = await $repositories.auth
        .custom("send-mail", "POST", payload)
        .catch(() => {
          return {
            success: false,
            message: "Server error",
          };
        });
      if (success) {
        return { success: true, message: success.message };
      }
      return {
        success: false,
        message: message || error.message.system_mess,
      };
    },
    async forgotPassword(payload: { email: string }) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        message = null,
        error = {},
      } = await $repositories.auth
        .custom("forget-password", "POST", payload)
        .catch(() => {
          return {
            success: false,
            message: "Server error",
          };
        });
      if (success) {
        return { success: true, message: success.message };
      }
      return {
        success: false,
        message: message || error.message.system_mess,
      };
    },
    async changePassword(payload: {
      old_password: string;
      new_password: string;
      new_password_confirmation: string;
    }) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        message = null,
        error = {},
      } = await $repositories.auth
        .custom("change-password", "POST", payload)
        .catch(() => {
          return {
            success: false,
            message: "Server error",
          };
        });
      if (success) {
        return { success: true, message: success.message };
      }
      return {
        success: false,
        message: message || error.message.system_mess,
      };
    },
    async registerStaffAccount(payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
        error = {},
      } = await $repositories.auth
        .custom("staffs", "POST", payload)
        .catch(() => {
          return {
            success: false,
            message: "Server error",
          };
        });
      if (success) {
        return {
          success: true,
          data: body.data,
          message: success.message,
        };
      }
      return {
        success: false,
        message: message || error.message,
      };
    },
  },
});
