<!-- Registersite -->
<template>
  <!-- Registration form -->
  <v-row justify="center">
    <v-col cols="6">
      <v-card color="surface" class="pa-6 mx-auto">
        <v-card-title class="text-h5">Konto erstellen</v-card-title>

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
              label="Passwort"
              type="password"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Passwort bestätigen"
              type="password"
            ></v-text-field>

            <!-- Register button -->
            <v-btn @click="createAcount" type="submit" block class="mt-2"
              >KONTO ERSTELLEN
            </v-btn>

            <!-- Display error if registration fails -->
            <v-row v-if="registerFailed" class="mt-2">
              <v-col>
                <v-alert type="error"
                  >Registrierung fehlgeschlagen. Bitte verwende eine andere
                  E-Mail-Adresse oder Benutzernamen.</v-alert
                >
              </v-col>
            </v-row>

            <!-- Link to login page -->
            <v-row class="mt-2">
              <v-col>
                Du hast bereits ein Konto?
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
    rules: [(value) => !!value || "Bitte gib einen Vornamen ein."],
    emailRules: [
      (value) => !!value || "Bitte gib eine E-Mail-Adresse ein.",
      (value) => /.+@.+\..+/.test(value) || "Ungültige E-Mail-Adresse.",
    ],
    passwordRules: [
      (value) => !!value || "Bitte gib ein Passwort ein.",
      (value) =>
        (value && value.length >= 8) ||
        "Das Passwort muss mindestens 8 Zeichen lang sein.",
    ],
    confirmPasswordRules: [
      (value) =>
        value === this.password || "Die Passwörter stimmen nicht überein.",
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
