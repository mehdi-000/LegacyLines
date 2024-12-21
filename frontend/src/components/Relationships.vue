<template>
  <!--Hauptstruktur -->
  <v-app>
    <!-- Hauptcontainer -->
    <v-container>
      <!-- Inhalt, wenn Benutzer angemeldet -->
      <div v-if="AUTHENTICATED" class="text-xs-center">
        <!-- Karte für die Anzeige Familienmitglieder, wenn vorhanden-->
        <v-card v-if="familyMembers.length > 0">
          <h1 class="text-center mb-2">Familienmitglieder</h1>
          <v-card-subtitle class="text-center mb-2">
            Wähle eine Person aus, um die Beziehung zu einer anderen Person
            festzulegen.
          </v-card-subtitle>
          <!-- Schleife Familienmitglieder -->
          <v-row class="mb-4">
            <v-col v-for="(person, index) in familyMembers" :key="index">
              <!-- Details Person -->
              <v-card class="person-card">
                <v-card-title
                  >{{ person.Firstname }} {{ person.Lastname }}</v-card-title
                >
                <v-card-subtitle>
                  Geburtsdatum: {{ formatDate(person.BirthDate) }}<br />
                  Geschlecht: {{ formatGender(person.Gender) }}<br />
                </v-card-subtitle>
                <!-- Beziehungen Kind -->
                <v-card-subtitle v-if="childRelationships[person.PersonID]">
                  <template
                    v-for="relationship in childRelationships[person.PersonID]"
                  >
                    {{ relationship.Relationship_type }}:
                    {{
                      getPersonDetails(relationship.PersonTwoID) + " " || "N/A"
                    }}
                  </template>
                </v-card-subtitle>
                <!-- Button, um als Elternteil oder Kind auszuwählen -->
                <v-btn @click="toggleSelect(person)" class="person-btn">
                  {{ getButtonLabel(person) }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <!-- Anzeige für die ausgewählten Personen und Beziehungstypen -->
        <v-card v-if="selectedPersons.length === 2" class="mb-5">
          <v-card-title>Beziehung festlegen</v-card-title>
          <v-card-subtitle class="relationship-subtitle">
            {{ selectedPersons[1]?.Firstname }}
            {{ selectedPersons[1]?.Lastname }} ist
            {{ selectedRelationshipType }} von
            {{ selectedPersons[0]?.Firstname || "N/A" }}
            {{ selectedPersons[0]?.Lastname || "N/A" }}
          </v-card-subtitle>
          <v-btn v-if="edit" @click="addRelationship" class="small-btn"
            >Zur Liste hinzufügen</v-btn
          >
        </v-card>
        <!-- Liste der ausgewählten Beziehungen -->
        <v-card v-if="selectedRelationships.length > 0" class="mb-5">
          <v-card-title>Ausgewählte Beziehungen</v-card-title>
          <v-list>
            <v-list-item-group v-if="selectedRelationships.length > 0">
              <v-list-item
                v-for="(relationship, index) in selectedRelationships"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title class="relationship-subtitle">
                    {{ formatRelationship(relationship) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-btn v-if="edit" @click="saveAllRelationships" class="small-btn"
            >Alle Beziehungen speichern</v-btn
          >
        </v-card>
        <!-- Dialog Auswahl Beziehungstyp -->
        <v-dialog v-model="dialog" max-width="600" class="mb-5">
          <v-card>
            <v-card-title>Beziehung auswählen</v-card-title>
            <v-card-text>
              <!-- Beziehungstyps (Mutter/Vater) -->
              <v-btn @click="selectMutter" class="small-btn">Mutter</v-btn>
              <v-btn @click="selectVater" class="small-btn">Vater</v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="dialog = false" class="small-btn">Abbrechen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <!-- wenn Benutzer nicht angemeldet  -->
      <div v-else class="text-xs-center mt-4">
        <v-row justify="center">
          <h1>Bitte logge dich ein</h1>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios"; // Axios für HTTP-Anfragen importieren

const backendURL = import.meta.env.VITE_BACKEND_URL; // URL des Backends aus den Umgebungsvariablen

export default {
  // Eigenschaften, die von außen (Elternkomponenten) übergeben werden
  props: {
    FamilyTreeId: {
      type: Number,
      required: true, // Stammbaum-ID, benötigt für Datenabrufe
    },
    reloadFamilyTree: {
      type: Boolean,
      required: true, // Signalisiert, ob der Stammbaum neu geladen werden soll
    },
    reloadRelationships: {
      type: Boolean,
      required: true, // Signalisiert, ob die Beziehungen neu geladen werden sollen
    },
    edit: {
      type: Boolean,
      required: false, // Signalisiert, ob die Beziehungen bearbeitet werden können
      default: false,
    },
  },

  // Lokale Daten der Komponente
  data() {
    return {
      familyMembers: [], // Liste der Familienmitglieder
      selectedPersons: [], // Ausgewählte Personen für Beziehungsfestlegung
      selectedRelationshipType: "", // Art der ausgewählten Beziehung (z.B. Mutter, Vater)
      selectedRelationships: [], // Liste ausgewählter Beziehungen
      childRelationships: {}, // Beziehungen der Kinder (nach Kind-ID organisiert)
      personSelectionState: "child", // Status der Personenauswahl (Kind oder Elternteil)
      dialog: false, // Steuert, ob der Dialog angezeigt wird
      AUTHENTICATED: false, // Authentifizierungsstatus
      user: null, // Aktueller Benutzer
    };
  },

  async mounted() {
    // wenn Komponente eingebunden
  },

  watch: {
    reloadRelationships(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loadFamilyMembers(); // Lade Familienmitglieder neu, wenn Beziehungen sich ändern
      }
    },
  },

  // Wird aufgerufen, wenn die Komponente erstellt wird
  created() {
    this.loadFamilyMembers(); // Lade Familienmitglieder beim Start
    this.loadRelationships(); // Lade Beziehungen beim Start
    this.authenticateUser(); // Überprüfe die Benutzerauthentifizierung
  },

  methods: {
    // Authentifizierung des Benutzers
    authenticateUser() {
      try {
        axios
          .get(`${backendURL}/users/yes/authenticate`, {
            headers: {
              Authorization: localStorage.getItem("token"), // Benutze Token aus dem Local Storage für Authentifizierung
            },
          })
          .then((response) => {
            this.AUTHENTICATED = true; // Setze authentifiziert auf true, wenn erfolgreich
            this.user = response.data; // Speichere Benutzerdaten
          });
      } catch (error) {
        console.error("error ", error); // Fehlerbehandlung
      }
    },

    // Lädt die Familienmitglieder vom Server
    async loadFamilyMembers() {
      try {
        const response = await axios.get(
          `${backendURL}/persons/familytree/${this.FamilyTreeId}`
        ); // Anfrage an die API mit der Stammbaum-ID
        this.familyMembers = response.data; // Speichert die Antwort in der familyMembers-Variable
      } catch (error) {
        console.error("Error loading family members:", error); // Fehlermeldung, falls die Anfrage fehlschlägtt
      }
    },

    // Lädt die Beziehungen der Familienmitglieder
    async loadRelationships() {
      try {
        const response = await axios.get(
          `${backendURL}/relationsships/familyTree/${this.FamilyTreeId}`
        ); // Anfrage an die API
        const relationships = response.data;

        // Organisiert die Beziehungen nach der ID des Kinds
        this.childRelationships = relationships.reduce((acc, relationship) => {
          const childID = relationship.PersonOneID;

          if (!acc[childID]) {
            acc[childID] = [];
          }

          acc[childID].push(relationship); // Fügt die Beziehung zum entsprechenden Kind hinzu
          return acc;
        }, {});
      } catch (error) {
        console.error("Error loading relationships:", error); // Fehlermeldung bei Fehlschlag
      }
    },

    //  Details einer Person anhand ID
    getPersonDetails(personID) {
      const person = this.familyMembers.find((p) => p.PersonID === personID);
      return person ? `${person.Firstname} ${person.Lastname}` : "N/A"; // Sucht Person in Liste der Familienmitglieder
    },

    // Formatiert Beziehungsdaten für Anzeige
    formatRelationship(relationship) {
      const child = relationship.person1;
      const parent = relationship.person2;
      const relationshipType = relationship.relationshipType;

      // Gibt Beziehung formatiert zurück, abhängig vom Beziehungstyp
      if (relationshipType === "Vater" && parent) {
        return `${relationshipType}: ${parent.Firstname || "N/A"} ${
          parent.Lastname || "N/A"
        }`;
      } else if (relationshipType === "Mutter" && parent) {
        return `${relationshipType}: ${parent.Firstname || "N/A"} ${
          parent.Lastname || "N/A"
        }`;
      } else {
        return "N/A"; // "N/A", falls keine Daten vorhanden
      }
    },

    // Wechselt die Auswahl einer Person
    toggleSelect(person) {
      if (this.selectedPersons.length < 2) {
        this.selectedPersons.push(person); // Fügt die Person zur Auswahl hinzu, wenn noch nicht zwei Personen ausgewählt wurden
      }

      // Wechselt zwischen Kind- und Elternteil-Auswahl
      this.personSelectionState =
        this.personSelectionState === "child" ? "parent" : "child";

      // Öffnet den Dialog zur Beziehungsauswahl, wenn zwei Personen ausgewählt wurden
      if (
        this.selectedPersons.length === 2 &&
        this.personSelectionState === "parent"
      ) {
        this.addRelationship(); // Fügt automatisch die Beziehung hinzu, wenn zwei Personen ausgewählt sind
      } else if (this.selectedPersons.length === 2) {
        this.dialog = true; // Öffnet Dialog
      }
    },

    // BestimmLabel des Buttons basierend auf dem Auswahlstatus
    getButtonLabel(person) {
      return this.personSelectionState === "child"
        ? "Als Kind auswählen"
        : "Als Elternteil auswählen";
    },

    // Fügt eine Beziehung zur Liste hinzu
    addRelationship() {
      this.selectedRelationships.push({
        person1: this.selectedPersons[0],
        person2: this.selectedPersons[1],
        relationshipType: this.selectedRelationshipType,
      });

      this.resetSelections(); // Setzt die Auswahl zurück
    },

    // Speichert alle ausgewählten Beziehungen
    async saveAllRelationships() {
      console.log("Saving relationships:", this.selectedRelationships[0]);
      try {
        // Sendet die ausgewählten Beziehungen an den Server
        const response = await axios.post(
          `${backendURL}/relationsships/${this.selectedRelationships[0].person1.PersonID}/${this.selectedRelationships[0].person2.PersonID}`,
          {
            RelationsshipType: this.selectedRelationships[0].relationshipType,
          }
        );

        console.log("Saved relationships:", response.data);
        this.$emit("reload-family-tree", true); // Signalisiert, dass der Stammbaum neu geladen werden soll

        // Leert die Liste der ausgewählten Beziehungen nach dem Speichern
        this.selectedRelationships = [];
      } catch (error) {
        console.error("Error saving relationships:", error); // Fehlermeldung beim Speichern
      }
    },

    // Setzt die Auswahl zurück
    resetSelections() {
      this.selectedPersons = [];
      this.dialog = false;
      this.selectedRelationshipType = "";
      this.personSelectionState = "child";
    },

    // Formatierung für Datum, Geschlecht und Stadt
    formatDate(dateString) {
      // Formatierung des Datumsstringst
      const date = new Date(dateString); // Erstellt ein Datum-Objekt aus dem übergebenen String
      const day = date.getDate(); // Holt den Tag des Monats
      const month = date.getMonth() + 1; // Holt den Monat
      const year = date.getFullYear(); // Holt das Jahr
      return `${day}/${month}/${year}`; // Gibt das Datum im Format Tag/Monat/Jahr zurück
    },
    formatGender(gender) {
      // Formatierung des Geschlechts für die Anzeige
      return gender === "M" ? "Männlich" : "Weiblich"; // Gibt 'Männlich' zurück, wenn das Geschlecht 'M' ist, sonst 'Weiblich'
    },
    formatCity(city) {
      // Formatierung der Stadt für die Anzeige
      return city || "N/A"; // Gibt den Stadtnamen zurück, falls vorhanden, sonst "N/A"
    },
    selectMutter() {
      // Methode zum Auswählen der Beziehung 'Mutter'
      this.selectedRelationshipType = "Mutter"; // Setzt den Beziehungstyp auf 'Mutter'
      this.dialog = false; // Schließt den Dialog
    },
    selectVater() {
      // Methode zum Auswählen der Beziehung 'Vater'
      this.selectedRelationshipType = "Vater"; // Setzt den Beziehungstyp auf 'Vater'
      this.dialog = false; // Schließt den Dialog
    },
  },
};
</script>

<style>
.person-subtitle,
.relationship-subtitle {
  margin-bottom: 10px;
}

.person-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.person-btn {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 215px;
}

.small-btn {
  font-size: 12px;
}

/* Media Queries für die Anpassung des Layouts auf kleineren Bildschirmen */
@media only screen and (max-width: 600px) {
  .v-card-title,
  .v-card-subtitle {
    font-size: 16px; /* Verringert die Schriftgröße für Kartenüberschriften und -untertitel auf 16px auf Bildschirmen kleiner als 600px Breite */
  }
}
</style>
