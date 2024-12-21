// Import necessary modules and plugins
import { createApp } from "vue";
import App from "./App.vue";
import VueGoogleMaps from "vue-google-maps-community-fork";

// Import Vuetify styles and components
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

// Import router
import router from "./router";

const app = createApp(App);

// Define custom dark and light themes for Vuetify
const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#15202b",
    secondary: "#00C6B5",
    third: "#EA80FC",
    error: "#fa379c",
    info: "#2196F3",
    success: "#37fabf",
    warning: "#fb8c00",
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    background: "#ffffff",
    surface: "#f8f8f8",
    primary: "#E2D2C4",
    secondary: "#6B9480",
    third: "#566156",
    error: "#d96550",
    info: "#2196F3",
    success: "#2db371",
    warning: "#fb8c00",
  },
};

// Use the router, Vuetify, and Google Maps plugins
app.use(router);
app.use(
  createVuetify({
    components,
    directives,
    defaults: {
      VBtn: {
        color: "secondary",
        variant: "tonal",
        rounded: "xl",
      },
      VTextField: {
        outlined: true,
        color: "third",
      },
    },
    theme: {
      defaultTheme: "customLightTheme",
      themes: {
        customLightTheme,
        customDarkTheme,
      },
    },
  })
);

app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAkvA4gjTBrfCNBJ64OXw_w4cbFjBIvpoY",
    libraries: "places",
  },
});

app.mount("#app");
