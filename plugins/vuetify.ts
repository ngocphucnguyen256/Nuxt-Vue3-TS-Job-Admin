import { createVuetify, ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// import colors from "vuetify/lib/util/colors";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VDatePicker } from "vuetify/labs/VDatePicker";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#2196F3",
    "primary-darken-1": "#3700B3",
    secondary: "#BBDEFB",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    btn: "#0e7490",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: { ...components, VDataTable, VDatePicker },
    directives,
    theme: {
      defaultTheme: "lightTheme",
      themes: {
        lightTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
