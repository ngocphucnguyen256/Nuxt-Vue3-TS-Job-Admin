import { LoginPayloadType, methodType } from "~/types/payload-type";

const XSRF_TOKEN = useCookie("XSRF-TOKEN");

interface ApiService {
  index(payload: any): Promise<any>;
  all(): Promise<any>;
  logout(): Promise<any>;
  login(payload: LoginPayloadType): Promise<any>;
  detail(id: number): Promise<any>;
  delete(id: number): Promise<any>;
  update(id: number, payload: any): Promise<any>;
  updateDetail(path: string, id: any, payload: any): Promise<any>;
  store(payload: any): Promise<any>;
  custom(type: string, method: methodType, payload?: any): Promise<any>;
  customWithParam(type: string, payload: any): Promise<any>;
  params(payload: any): Promise<any>;
  me(): Promise<any>;
  download(payload: any): Promise<any>;
  ws(path: string): string;
}

export default ($fetch: any) =>
  (resource: string): ApiService => ({
    index(payload: any): Promise<any> {
      return $fetch(`${resource}`, { params: payload });
    },

    ws(path: string): string {
      const ws = resource.replace("http", "ws");
      return `${ws}/${path}`;
    },

    all(): Promise<any> {
      return $fetch(`${resource}/all`);
    },

    logout(): Promise<any> {
      return $api(`${resource}/logout`, {
        method: "POST",
      });
    },

    login(payload: LoginPayloadType): Promise<any> {
      return $fetch(`${resource}/login`, {
        method: "POST",
        body: payload,
        headers: {
          "content-type": "application/json",
          "X-CSRF-TOKEN": XSRF_TOKEN.value || "",
        },
      });
    },

    detail(id: number): Promise<any> {
      return $api(`${resource}/${id}`);
    },

    delete(id: number): Promise<any> {
      return $api(`${resource}/${id}`, {
        method: "DELETE",
      });
    },

    update(id: number, payload: any): Promise<any> {
      return $api(`${resource}/${id}`, {
        method: "PUT",
        body: payload,
      });
    },

    updateDetail(path: string, id: any, payload: any): Promise<any> {
      if (id) {
        return $api(`${resource}${path}/${id}`, {
          method: "PUT",
          body: payload,
        });
      }
      return $api(`${resource}${path}`, {
        method: "PUT",
        body: payload,
      });
    },

    store(payload: any): Promise<any> {
      return $api(`${resource}`, {
        method: "POST",
        body: payload,
      });
    },

    custom(type: string, method: methodType, payload: any = {}): Promise<any> {
      if (method === "GET" || method === "DELETE") {
        return $api(`${resource}/${type}`, {
          method,
          params: payload,
        });
      }
      return $api(`${resource}/${type}`, {
        method,
        body: payload,
      });
    },

    customWithParam(type: string, payload: any): Promise<any> {
      if (type) {
        return $api(`${resource}/${type}`, {
          params: payload,
        });
      }
      return $api(`${resource}`, {
        params: payload,
      });
    },

    params(payload: any): Promise<any> {
      return $api(`${resource}`, {
        params: payload,
      });
    },

    me(): Promise<any> {
      return $fetch(`${resource}/me`);
    },

    download(payload: any): Promise<any> {
      return $api(`${resource}/download`, {
        body: payload,
        method: "POST",
        responseType: "blob",
      });
    },
  });
