import { useAuthStore } from "~/stores/auth.module";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  // no token + not login page => redirect to login page
  const shouldToLogin = !!(
    from.name !== "admin-login" &&
    from.name !== "staff-login" &&
    !localStorage.getItem("token") &&
    to.path !== "/admin/login" &&
    to.path !== "/staff/login"
  );
  if (shouldToLogin) {
    if (to.path === "/staff/register") return;
    // if path the url is in the staff folder then redirect to staff login
    if (to.path.includes("/staff")) {
      // there a case that admin/staff/... is in the url, so we need to check this
      if (to.path.includes("/admin/staff")) {
        return navigateTo("/admin/login");
      }
      return navigateTo("/staff/login");
    }
    return navigateTo("/admin/login");
  }
  // have token + login page => redirect to home page
  const shouldLogout = !!(
    localStorage.getItem("token") &&
    (to.path === "/admin/login" || to.path === "/staff/login")
  );
  if (shouldLogout) {
    authStore.logout();
    return;
  }
  // have token + not login page => check expired time -> set token
  const shouldCheckToken = !!(
    from.name !== "admin-login" &&
    from.name !== "staff-login" &&
    localStorage.getItem("token")
  );
  if (shouldCheckToken) {
    const isExpired =
      Date.now() > JSON.parse(localStorage.getItem("expires_in") ?? "0");
    if (isExpired) {
      authStore.clearAuth();
      return;
    }
    authStore.setToken(JSON.parse(localStorage.getItem("token") ?? ""));
    authStore.setUser(JSON.parse(localStorage.getItem("user") ?? ""));
  }
});
