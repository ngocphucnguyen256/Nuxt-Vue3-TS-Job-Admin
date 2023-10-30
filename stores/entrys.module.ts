import { defineStore } from "pinia";
import { EntryType } from "~/types/payload-type";

export const useEntrysStore = defineStore("entrys", {
  state: () => ({}),
  actions: {
    async getAllEntriesByProjectId(
      id: number,
      payload?: {
        start_day?: string;
        end_day?: string;
      },
    ) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.entrys
        .customWithParam(id.toString(), payload)
        .catch(() => {
          return {
            success: false,
            message: "Something went wrong!",
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
        message,
      };
    },
    async getEntriesStaffListByProjectId(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.entrys
        .customWithParam(`list-staff/${id}`, {})
        .catch(() => {
          return {
            success: false,
            message: "Something went wrong!",
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
        message,
      };
    },
    async update(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.entrys.update(id, payload).catch(() => {
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
    async addStaffToWorkDayList(
      idProject: number,
      payload: Array<{
        entry_id: number;
        date: string;
      }>,
    ) {
      const { $repositories } = useNuxtApp();
      const { success = null, message = null } = await $repositories.entrys
        .custom(`${idProject}`, "POST", {
          data: payload,
        })
        .catch(() => {
          return {
            success: false,
            message: "Something went wrong!",
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
        message,
      };
    },
    async removeEntryByIdWorkday(workDayId: number) {
      const { $repositories } = useNuxtApp();
      const { success = null, message = null } = await $repositories.entrys
        .delete(workDayId)
        .catch(() => {
          return {
            success: false,
            message: "Something went wrong!",
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
        message,
      };
    },
  },
});
