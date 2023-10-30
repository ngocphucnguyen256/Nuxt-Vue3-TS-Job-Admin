import { error } from "console";
import { defineStore } from "pinia";

export const useProjectStore = defineStore("project", {
  state: () => ({}),
  actions: {
    async getAll(payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.project.params(payload).catch((e) => {
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
      } = await $repositories.project.store(payload).catch(() => {
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
      } = await $repositories.project.detail(id).catch(() => {
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
      const res = await $repositories.project
        .update(id, payload)
        .catch((error) => {
          return error.data;
        });
      return res;
    },
    async getDetailListStaff(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.project
        .customWithParam(`list-staff/${id}`, payload)
        .catch((e) => {
          return e.data;
        });
      return res;
    },
    async acceptStaffToProject(
      id: number,
      payload: {
        id_staff: Array<number>;
      },
    ) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        message = null,
        error = {},
      } = await $repositories.project
        .custom(`accept/${id}`, "PUT", payload)
        .catch((e) => {
          if (e.response?.status === 406) {
            return {
              success: false,
              message: "Staff is already in project",
            };
          }
          if (e.response?.status === 400) {
            return {
              success: false,
              message: "Project is full member",
            };
          }
          return {
            success: false,
            message: e.message,
          };
        });
      if (success) {
        return {
          success: true,
          message: success.message,
        };
      }
      return {
        success: false,
        message: message || error.message.system_mess,
      };
    },
    async getEntryProjectsStaff(payload: { status: number | undefined }) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.project
        .customWithParam("list-project/staff", payload)
        .catch((e) => {
          return e.data;
        });
      return res;
    },
  },
});
