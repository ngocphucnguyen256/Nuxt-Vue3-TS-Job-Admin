import createRepository from "~/apis/repository";

export default defineNuxtPlugin((nuxtApp) => {
  const BASE_API_URL = useRuntimeConfig().public.BASE_API_URL || "";
  const repositoryWithFetch = createRepository($fetch);
  return {
    provide: {
      repositories: {
        auth: repositoryWithFetch(`${BASE_API_URL}/auth`),
        common: repositoryWithFetch(`${BASE_API_URL}`),
        client: repositoryWithFetch(`${BASE_API_URL}/clients`),
        project: repositoryWithFetch(`${BASE_API_URL}/projects`),
        staff: repositoryWithFetch(`${BASE_API_URL}/staffs`),
        entrys: repositoryWithFetch(`${BASE_API_URL}/entrys`),
        report: repositoryWithFetch(`${BASE_API_URL}/reports`),
        salarys: repositoryWithFetch(`${BASE_API_URL}/salarys`),
        fee: repositoryWithFetch(`${BASE_API_URL}/fees`),
      },
    },
  };
});
