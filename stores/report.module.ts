import { defineStore } from "pinia";

export const useReportStore = defineStore("report", {
  state: () => ({}),
  actions: {
    async getDetail(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.detail(id).catch(() => {
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
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.update(id, payload).catch(() => {
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
    async getListReportStaff(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report
        .customWithParam(`${id}`, payload)
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
          meta: body.meta,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async getListStaffInProject(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report
        .customWithParam(`list-staff-work/${id}`, null)
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
          meta: body.meta,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async getListStaffIdleProject(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report
        .customWithParam(`list-staff-idle/${id}`, null)
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
          meta: body.meta,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async getListProject() {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report
        .customWithParam(`list/project`, null)
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
          meta: body.meta,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async getDateOfProject(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.customWithParam(`date/${id}`, null)
      .catch(() => {
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
    async getStaffReportDetail(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.customWithParam(`detail/${id}`, null)
      .catch(() => {
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
    async updateDetailStaff(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.updateDetail('/staff-report',id, payload).catch(() => {
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
    async updateDetailAdmin(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.updateDetail('/admin-report',id, payload).catch(() => {
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
    async getListFee(id: number , payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.fee
        .params(payload)
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
          meta: body.meta,
        };
      }
      return {
        success: false,
        message,
      };
    },
    async updateFee(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.fee.updateDetail("",null, payload).catch(() => {
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
    async calculateSalary(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.report.custom(`calculate-salary/${id}`,"POST",payload).catch(() => {
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
  },
});
