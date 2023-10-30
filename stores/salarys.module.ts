import { defineStore } from "pinia";

export const useSalarysStore = defineStore("salarys", {
  state: () => ({}),
  actions: {
    async removeSalaryById(salaryId: number) {
      const { $repositories } = useNuxtApp();
      const res = await $repositories.salarys.delete(salaryId).catch((e) => {
        return e.data;
      });
      return res;
    },
  },
});
