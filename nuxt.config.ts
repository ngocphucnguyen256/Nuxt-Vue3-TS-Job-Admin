import { createResolver } from "@nuxt/kit";
import type { NuxtConfig } from "@nuxt/types";
import vuetify from "vite-plugin-vuetify";
import { MasterKeys } from "./environments/config.js";
const { resolve } = createResolver(import.meta.url);

const appEnv = process.env.NODE_ENV || "development";

type MasterKeysType = {
  [key: string]: {
    BASE_URL: string;
    BASE_ENV: string;
    PORT: number;
    API_PORT?: number;
    PREFIX: string;
  };
};

const masterKeys: MasterKeysType = {
  ...MasterKeys,
};

// https://nuxt.com/docs/api/configuration/nuxt-config
const defineNuxtConfig: NuxtConfig = {
  devtools: { enabled: false },
  runtimeConfig: {
    apiKey: "", // Default to an empty string, automatically set at runtime using process.env.NUXT_API_KEY
    public: {
      baseURL: masterKeys[appEnv].BASE_URL,
      BASE_API_URL: `${masterKeys[appEnv].BASE_URL}${
        masterKeys[appEnv].API_PORT ? `:${masterKeys[appEnv].API_PORT}` : ""
      }/${masterKeys[appEnv].PREFIX}`,
    },
  },

  app: {
    head: {
      title: "Nuxt Vue3 TS Work Admin",
      titleTemplate: "%s - Nuxt Vue3 TS Work Admin",
      bodyAttrs: {
        class: "bodyAttrs",
      },
      htmlAttrs: {
        class: "htmlAttrs",
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700&display=swap",
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Custom error page handling
  // nuxt 3 moved error page from layouts to root
  layout: "error", // Use the custom error layout for all error pages

  generate: {
    // Define custom error pages for specific status codes
    fallback: "error.html", // The fallback page for unknown routes or error pages
  },

  css: [
    resolve("./assets/variables.scss"),
    resolve("./assets/scss/main.scss"),
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  components: [
    {
      prefix: "Admin",
      path: resolve("./components/layouts/admin"),
      global: true,
    },
    {
      prefix: "Client",
      path: resolve("./components/layouts/client"),
      global: true,
    },
    {
      path: resolve("./components/commons"),
      global: true,
    },
    {
      path: resolve("./components/customs"),
      global: true,
    },
  ],

  build: {
    transpile: ["vuetify"],
  },
  buildModules: ["@nuxt/typescript-build"],

  modules: ["@pinia/nuxt"],
  pinia: {
    autoImports: ["defineStore", "acceptHMRUpdate"],
  },

  plugins: ["@/plugins/repositories", "@/plugins/ofetch", "@/plugins/vuetify"],
  middleware: {
    // global middleware
    auth: "@/middleware/auth",
  },
};

export default defineNuxtConfig;
