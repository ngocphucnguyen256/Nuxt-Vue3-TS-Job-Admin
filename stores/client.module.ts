import { defineStore } from "pinia";

export const useClientStore = defineStore("client", {
  state: () => ({}),
  actions: {
    async getAll(payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.client.params(payload).catch((e) => {
        return e.data;
      });
      return res;
    },
    async create(payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
        error = {},
      } = await $repositories.client.store(payload).catch(() => {
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
    async getDetail(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.client.detail(id).catch(() => {
        return {
          success: false,
          message: "Server error",
        };
      });
      if (success) {
        return {
          success: true,
          data: body,
          message: success.message,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async update(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.client.update(id, payload).catch((e) => {
        return e.data;
      });
      return res;
    },
  },
});
