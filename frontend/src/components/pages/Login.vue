<template>
  <!-- Login form -->
  <v-row justify="center">
    <v-col cols="6">
      <v-card color="surface" class="pa-6 mx-auto">
        <v-card-title class="text-h5">Login</v-card-title>

        <v-card-item>
          <!-- Login form fields -->
          <v-form @submit.prevent>
            <v-text-field
              prepend-inner-icon="mdi-email"
              v-model="email"
              :rules="emailRules"
              label="E-Mail"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="password"
              :rules="passwordRules"
              label="Password"
              type="password"
            ></v-text-field>

            <!-- Login button -->
            <v-btn @click="Login" type="submit" block class="mt-2">LOGIN</v-btn>

            <!-- Display error if login fails -->
            <v-row v-if="loginFailed" class="mt-2">
              <v-col>
                <v-alert type="error"
                  >Login failed. Please check your login information.</v-alert
                >
              </v-col>
            </v-row>

            <!-- Link to registration page -->
            <v-row class="mt-2">
              <v-col>
                No account?
                <span @click="redirectToRegister" class="text-h6 link"
                  >CREATE ONE</span
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;
export default {
  data: () => ({
    email: "",
    password: "",
    checkbox: false,
    emailRules: [
      (value) => !!value || "Please enter an email address.",
      (value) => /.+@.+\..+/.test(value) || "Invalid email address.",
    ],
    passwordRules: [
      (value) => !!value || "Please enter a password.",
      (value) =>
        (value && value.length >= 8) ||
        "The password must be at least 8 characters long.",
    ],
    loginFailed: false,
  }),
  methods: {
    // Redirect to registration page
    redirectToRegister() {
      this.$router.push("/register");
    },

    // Handle login
    Login() {
      axios
        .post(`${backendURL}/users/login`, {
          Email: this.email,
          Password: this.password,
        })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          this.loginFailed = true;
        });
    },
  },
};
</script>

<style>
/* Custom styles */
.link {
  cursor: pointer;
  color: hotpink;
  text-decoration: underline;
}

.text-caption {
  font-size: 0.75rem;
  margin-top: -8px;
}
</style>
