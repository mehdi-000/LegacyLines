<!-- Registersite -->
<template>
  <!-- Registration form -->
  <v-row justify="center">
    <v-col cols="6">
      <v-card color="surface" class="pa-6 mx-auto">
        <v-card-title class="text-h5">Create Account</v-card-title>

        <v-card-item>
          <!-- Registration form fields -->
          <v-form @submit.prevent>
            <v-text-field v-model="userName" :rules="rules" label="Username">
            </v-text-field>
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
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Confirm Password"
              type="password"
            ></v-text-field>

            <!-- Register button -->
            <v-btn @click="createAcount" type="submit" block class="mt-2"
              >CREATE ACCOUNT
            </v-btn>

            <!-- Display error if registration fails -->
            <v-row v-if="registerFailed" class="mt-2">
              <v-col>
                <v-alert type="error"
                  >Registration failed. Please use a different email address or
                  username.</v-alert
                >
              </v-col>
            </v-row>

            <!-- Link to login page -->
            <v-row class="mt-2">
              <v-col>
                Do you already have an account?
                <span @click="redirectToLogin" class="text-h6 link">LOGIN</span>
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
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rules: [(value) => !!value || "Please enter a first name."],
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
    confirmPasswordRules: [
      (value) => value === this.password || "The passwords do not match.",
    ],
    registerFailed: false,
  }),
  methods: {
    // Redirect to login page
    redirectToLogin() {
      this.$router.push("/login");
    },

    // Handle account creation
    createAcount() {
      axios
        .post(`${backendURL}/users`, {
          UserName: this.userName,
          Email: this.email,
          Password: this.password,
        })
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          this.registerFailed = true;
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
</style>
