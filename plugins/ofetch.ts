import { ofetch } from "ofetch";
import { useAuthStore } from "~/stores/auth.module";

export default defineNuxtPlugin((_nuxtApp) => {
  // globalThis.$fetch = ofetch.create({
  //   onRequest({ request, options }) {
  //     const authStore = useAuthStore();
  //     if (authStore.auth.access_token) {
  //       options.headers = {
  //         Authorization: `Bearer ${authStore.auth.access_token}`,
  //       };
  //       console.log(options);
  //     } else {
  //       console.log("Not authenticated");
  //     }
  //   },
  //   onRequestError({ error }) {
  //     console.error(error);
  //   },
  // });
});
