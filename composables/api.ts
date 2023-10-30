import { type NitroFetchRequest } from "nitropack";
import { useAuthStore } from "~/stores/auth.module";

export function $api<
  T = unknown,
  R extends NitroFetchRequest = NitroFetchRequest,
>(
  request: Parameters<typeof $fetch<T, R>>[0],
  options?: Partial<Parameters<typeof $fetch<T, R>>[1]>,
) {
  const store = useAuthStore();

  return $fetch<T, R>(request, {
    ...options,
    headers: {
      Authorization: store.auth.access_token
        ? `Bearer ${store.auth.access_token}`
        : "",
      ...options?.headers,
      accept: "application/json",
    },
  }).catch((error) => {
    // Unauthorized
    if (error.response?.status === 401) {
      store.clearAuth();
      // TODO @fixme
      // role will be added later, to check if the user is admin or staff
      navigateTo("/admin/login");
      // navigateTo("/staff/login");
    }
    return Promise.reject(error);
  });
}
