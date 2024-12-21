<!--
  component for the main navigation bar in the application.
  Manages navigation links, theme toggling, and user authentication status.
  Utilizes Vue Router, Vuetify components
-->

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useTheme } from "vuetify/lib/framework";
import { authenStore } from "../store/authen.store";

export default {
  name: "MainNav",

  // Watch route changes and handle authentication logic
  watch: {
    $route(to, from) {
      const token = localStorage.getItem("token");
      if (to.path === "/login" && token) {
        this.$router.push(this.Home.path);
      }
      this.checkAuthen();
    },
  },

  // Methods for authentication and theme handling
  methods: {
    checkAuthen() {
      const token = localStorage.getItem("token");
      if (!token) {
        authenStore.setIsLoggedIn(false);
        authenStore.setUser(null);
      } else {
        authenStore.setIsLoggedIn(true);
        authenStore.setUser(JSON.parse(localStorage.getItem("user")));
      }
    },
    logout() {
      authenStore.setIsLoggedIn(false);
      authenStore.setUser(null);
      localStorage.clear();
    },
  },

  // Setup function for reactive variables and theme initialization
  setup() {
    const instance = getCurrentInstance();
    const theme = useTheme();
    const darkmode = ref(false);

    // Function to toggle theme and save preference to local storage
    function changeTheme() {
      darkmode.value = !darkmode.value;
      theme.global.name.value = darkmode.value
        ? "customDarkTheme"
        : "customLightTheme";
      localStorage.setItem("mode", theme.global.name.value);
    }

    // Initialize theme based on local storage preference
    onMounted(() => {
      const mode = localStorage.getItem("mode");
      if (mode === "customDarkTheme") {
        darkmode.value = true;
        theme.global.name.value = "customDarkTheme";
      } else {
        darkmode.value = false;
        theme.global.name.value = "customLightTheme";
      }
    });

    // Return reactive variables and methods to be used in the template
    return {
      darkmode,
      changeTheme,
      Home: {
        name: "Home",
        path: "/",
      },
      Stammbaum: {
        name: "Stammbaum",
        path: "/choosefamilytree",
      },
      Requests: {
        name: "Anfragen",
        path: "/requests",
      },
      Login: {
        name: "Login",
        path: "/login",
      },
      Agb: {
        name: "AGB",
        path: "/agb",
      },
      Impressum: {
        name: "Impressum",
        path: "/impressum",
      },
      authenStore,
    };
  },
};
</script>

<template>
  <!-- Template for the main navigation bar -->
  <div>
    <v-app-bar dense color="primary">
      <!-- Home icon button -->
      <v-btn icon="mdi-home" :to="Home.path"></v-btn>

      <!-- Navigation tabs -->
      <v-tabs class="navbar">
        <v-tab :to="Stammbaum.path">{{ Stammbaum.name }} </v-tab>
        <v-tab :to="Requests.path" v-if="authenStore.loggedIn"
          >{{ Requests.name }}
        </v-tab>
        <v-tab :to="Agb.path">{{ Agb.name }} </v-tab>
        <v-tab :to="Impressum.path">{{ Impressum.name }} </v-tab>
      </v-tabs>

      <!-- Theme toggle button -->
      <v-spacer></v-spacer>
      <v-btn icon @click="changeTheme">
        <v-icon
          :icon="darkmode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        ></v-icon>
      </v-btn>

      <!-- User information and logout button if logged in -->
      <div
        v-if="authenStore.loggedIn"
        style="display: flex; gap: 10px; align-items: center"
      >
        <v-btn @click="this.$router.push('/profile')">
          {{ authenStore.user.userName }}
        </v-btn>
        <v-btn variant="outlined" @click="logout">Logout</v-btn>
      </div>

      <!-- Login button if not logged in -->
      <div v-else>
        <v-btn variant="outlined" :to="Login.path">{{ Login.name }}</v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<style>
.navbar {
  float: left !important;
}
.v-tab {
  text-transform: none !important;
}
</style>
