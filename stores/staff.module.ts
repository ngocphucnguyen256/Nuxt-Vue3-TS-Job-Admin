import { defineStore } from "pinia";

export const useStaffStore = defineStore("staff", {
  state: () => ({}),
  actions: {
    async getAll(payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.staff.params(payload).catch((e) => {
        return e.data;
      });
      return res;
    },
    async getDetail(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
      } = await $repositories.staff.detail(id).catch(() => {
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
    async getDetailMe() {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.staff
        .custom("me/info", "GET")
        .catch((e) => {
          return e.data;
        });
      return res;
    },
    async download(staffIds: Array<number>) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.staff
        .download({
          id_staff: staffIds,
        })
        .then((response) => {
          if (response instanceof Blob) {
            const blob = response;
            // Create a URL for the Blob
            const blobUrl = URL.createObjectURL(blob);
            // Create a temporary anchor element for downloading
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = "staff.xlsx";
            anchor.style.display = "none";
            // Attach the anchor to the DOM and trigger a click event
            document.body.appendChild(anchor);
            anchor.click();
            // Clean up after download
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobUrl);
          }
        })
        .catch(() => {});
      return res;
    },
    async staffEntryToProject(id: number) {
      const { $repositories } = useNuxtApp();
      const {
        success = null,
        body = {},
        message = null,
        error = {},
      } = await $repositories.staff.custom(`entry/${id}`, "POST").catch((e) => {
        if (e.response?.status === 406) {
          return {
            success: false,
            message: "Only staff can entry to project",
          };
        }
        if (e.response?.status === 400) {
          return {
            success: false,
            message: "Staff is already in project",
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
          data: body,
          message: success.message,
        };
      }
      return {
        success: false,
        message: message || error.message.system_mess,
      };
    },
    async update(id: number, payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.staff.update(id, payload).catch((e) => {
        return e.data;
      });
      return res;
    },
  },
});
