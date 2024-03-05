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
      // Define the GraphQL mutation
      const mutation = gql`
        mutation createUserSession($username: String!, $password: String!) {
          createUserSession(username: $username, password: $password) {
            user {
              username
            }
          }
        }
      `;

      try {
        // Execute the mutation using useMutation
        const { mutate, onDone, onError } = useMutation(mutation, {
          variables: {
            username: payload.username,
            password: payload.password,
          },
        });

        let success = false;
        let message = "";

        // Handle successful mutation
        onDone((response) => {
          const userDetail = {
            email: payload.username || "", // Assuming you have a way to get the user's email from the payload or response
          };
          this.setAuth(response.data.createUserSession, userDetail); // Adjust according to your actual response structure
          success = true;
          message = "Login successful";
        });

        // Handle mutation error
        onError((error) => {
          success = false;
          message = error.message || "Login failed";
        });

        // Execute the mutation
        await mutate();

        return { success, message };
      } catch (e: any) {
        // Handle errors outside of GraphQL errors (network issues, etc.)
        return {
          success: false,
          message: e.message || "An error occurred during login",
        };
      }
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
      payload: Auth,
      userDetail: {
        email: string;
      },
    ) {
      this.auth = payload ?? defaultAuth;
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
