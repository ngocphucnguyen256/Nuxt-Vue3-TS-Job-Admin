import { error } from "console";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({}),
  actions: {
    async getMessageInRoom(payload: { chatRoomId: string }) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.chat
        .customWithParam(`chat-rooms/${payload.chatRoomId}/messages`, {})
        .catch((e) => {
          return e.data;
        });
      return res;
    },
    async getAllChatRooms(payload: any) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.chat
        .customWithParam("chat-rooms", payload)
        .catch((e) => {
          return e.data;
        });
      return res;
    },
    async sendMessage(payload: { chatRoomId: string; content: string }) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.chat
        .custom("messages", "POST", payload)
        .catch((e) => {
          return e.data;
        });
      return res;
    },
    async createChatRoom(payload: { name: string }) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.chat
        .custom("chat-rooms", "POST", payload)
        .catch(() => {
          return {
            success: false,
            message: "Server error",
          };
        });
      if (res) {
        return {
          success: true,
          data: res.data,
          message: "Create chat room success",
        };
      }
      return {
        success: false,
        message: "Create chat room fail",
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
    getWsURL() {
      const { $repositories } = useNuxtApp();
      return $repositories.ws.ws("chat");
    },
  },
});
