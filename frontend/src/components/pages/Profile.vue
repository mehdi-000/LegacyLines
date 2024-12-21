<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <!-- Profil-Karte -->
      <v-card class="profile-card">
        <v-card-title class="text-center"> <h1>Mein Profil</h1></v-card-title>
        <!-- Layout für Benutzerinformationen -->
        <v-row>
          <v-col>
            <!-- Überschrift für die Benutzerinformationen -->
            <v-card-subtitle class="bInfo">Benutzerinformationen</v-card-subtitle>
            <!-- Textfelder und Buttons für Benutzerdaten -->
            <v-card-text>
              <!-- Textfeld für den Benutzernamen -->
              <v-text-field
                  v-model="userProfile.username"
                  label="Username"
                  class="narrow-text-field"
              ></v-text-field>
              <!-- Textfeld für das Passwort -->
              <v-text-field
                  v-model="userProfile.password"
                  label="ändere dein Passwort"
                  class="narrow-text-field"
                  type="password"
                  :rules="passwordRules"
              ></v-text-field>
              <!-- Textfeld für die E-Mail-Adresse -->
              <v-text-field
                  v-model="userProfile.email"
                  label="E-Mail"
                  class="narrow-text-field"
              ></v-text-field>
              <!-- Button zum Speichern der Daten -->
              <v-btn @click="saveUserData">Speichern</v-btn>
              <!-- Button zum Löschen des Benutzerkontos -->
              <v-btn class="delete-button" @click="deleteUser">Benutzer löschen</v-btn>
              <!-- Alerts Feedback -->
              <v-alert v-if="updatefailed" type="error" class="mt-2" dismissible>Fehler beim Speichern! Ändere deine Daten</v-alert>
              <v-alert v-if="updated" type="success" class="mt-2" dismissible>Daten erfolgreich gespeichert</v-alert>
              <v-alert v-if="deleted" type="success" class="mt-2" dismissible>Benutzer erfolgreich gelöscht</v-alert>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <router-view></router-view>
  </v-app>
</template>

<script>
import axios from "axios"; // Importiert Axios für HTTP-Anfragen

// Backend-URL aus den Umgebungsvariablen
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Profil",
  // Definiert lokale Daten
  data() {
    return {
      // Passwort-Validierungsregeln
      passwordRules: [
        (value) => !!value || "Bitte gib ein Passwort ein.",
        (value) => (value && value.length >= 8) || "Dein neues Passwort muss mindestens 8 Zeichen lang sein.",
      ],
      // Objekt zur Speicherung der Benutzerprofildaten
      userProfile: {
        username: "",
        email: "",
        password: "",
        id: "",
      },
      // Zustandsvariablen für verschiedene Benachrichtigungen
      updatefailed: false,
      updated: false,
      deleted: false,
    };
  },
  // Hook, wird aufgerufen, wenn Komponente erstellt wird
  created() {
    console.log("Profil component created");
    this.loadUserData(); // Lädt Benutzerdaten beim Start
  },
  computed: {
    // Eigenschaft für die maskierte Passwortanzeige
    maskedPassword() {
      return this.showPassword
          ? this.userProfile.password
          : "*".repeat(this.userProfile.password.length);
    },
  },
  methods: {
    // Lädt Benutzerdaten vom Server
    async loadUserData() {
      axios
          .get(`${backendURL}/users/yes/authenticate`, {
            headers: {
              Authorization: localStorage.getItem("token"), // Benutzt Token für Authentifizierung
            },
          })
          .then((response) => {
            console.log(response.data, "wss");
            this.userProfile.id = response.data.user.id; // Setzt die Benutzer-ID

            // Weitere Anfrage, um Benutzerdaten zu laden
            axios
                .get(`${backendURL}/users/${this.userProfile.id}`)
                .then((response) => {
                  console.log(response.data, "user");
                  // Aktualisiert das Benutzerprofil mit geladenen Daten
                  this.userProfile.username = response.data.Username;
                  this.userProfile.email = response.data.Email;
                });
          });
    },
    // Löscht Benutzerkonto
    async deleteUser() {
      try {
        // Sendet Lösch-Anfrage an den Server
        const response = await axios.delete(
            `${backendURL}/users/${this.userProfile.id}`
        );
        console.log("Benutzerdaten erfolgreich gelöscht:", response.data);

        this.deleted = true; // Setzt den gelöscht Status
        setTimeout(() => {
          this.$router.push("/register"); // Navigiert zur Registrierungsseite
          this.deleted = false; // Setzt den gelöscht Status zurück
        }, 2000);
      } catch (error) {
        console.error("Fehler beim Löschen der Benutzerdaten:", error);
      }
    },
    // Speichert die aktualisierten Benutzerdaten
    async saveUserData() {
      // Überprüft die Passwortlänge
      if (
          this.userProfile.password.length < 8 &&
          this.userProfile.password.length > 1
      ) {
        this.updatefailed = true; // Setzt Fehlerstatus, wenn Passwort zu kurz ist
        setTimeout(() => {
          this.updatefailed = false;
        }, 2000);
        return;
      } else {
        try {
          // Sendet Aktualisierungsanfrage an den Server
          const response = await axios.put(
              `${backendURL}/users/${this.userProfile.id}`,
              {
                Username: this.userProfile.username,
                Password: this.userProfile.password,
                Email: this.userProfile.email,
              }
          );

          // Überprüft die Serverantwort
          if (response.data) {
            console.log("Benutzerdaten erfolgreich aktualisiert:", response.data);

            await this.loadUserData(); // Lädt Benutzerdaten neu

            this.updated = true; // Setzt Erfolgsstatus
            setTimeout(() => {
              this.updated = false; // Setzt Erfolgsstatus zurück
            }, 2000);
          } else {
            console.error("Fehler beim Aktualisieren der Benutzerdaten: Ungültige Antwort", response);
          }
        } catch (error) {
          console.error("Fehler beim Aktualisieren der Benutzerdaten:", error);
          this.updatefailed = true; // Setzt Fehlerstatus bei einem Fehler
          setTimeout(() => {
            this.updatefailed = false; // Setzt Fehlerstatus zurück
          }, 2000);
        }
      }
    },
  },
};
</script>

<style>
.profile-card {
  margin-top: 50px;
  padding-top: 10px;
  width: 70%;
}

.narrow-text-field {
  width: 85%;
  padding-left: 5%;
  margin-bottom: 10px;
}
.bInfo {
  padding-left: 30px;
}

.delete-button {
  margin-left: 10px;
  color: red;
}
</style>
