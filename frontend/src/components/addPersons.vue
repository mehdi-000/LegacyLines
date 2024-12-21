<!-- @author Mehdi Popal
Component to add a new person to the family tree. -->
<template>
  <v-container>
    <!-- Form title and subtitle -->
    <h1 class="text-center mb-1">Familienmitglieder</h1>
    <v-card-subtitle class="text-center mb-3"
      >Füge deine Verwandten hinzu!</v-card-subtitle
    >

    <!-- Form with input fields -->
    <v-form @submit.prevent="submitForm">
      <v-row>
        <!-- First Name input field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="firstName"
            label="Vorname"
            required
          ></v-text-field>
        </v-col>

        <!-- Last Name input field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="lastName"
            label="Nachname"
            required
          ></v-text-field>
        </v-col>

        <!-- Birth Date input field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="birthDate"
            label="Geburtsdatum"
            type="date"
            required
          ></v-text-field>
        </v-col>

        <!-- Gender selection dropdown -->
        <v-col cols="12" md="6">
          <v-select
            v-model="gender"
            :items="['Weiblich', 'Männlich', 'Divers']"
            label="Geschlecht"
            required
          ></v-select>
        </v-col>

        <!-- Hometown autocomplete field -->
        <v-col cols="12" md="6">
          <div class="v-text-1">
            <GMapAutocomplete @place_changed="setPlace" />
          </div>
        </v-col>
      </v-row>

      <!-- Submit button -->
      <v-spacer></v-spacer>
      <v-btn type="submit" class="ml-auto">Erstellen</v-btn>

      <!-- Success and failure messages -->
      <v-row v-if="submitSuccess" class="mt-2">
        <v-col>
          <v-alert type="success">
            {{ firstName }} {{ lastName }} wurde erfolgreich hinzugefügt!
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-if="submitFailed" class="mt-2">
        <v-col>
          <v-alert type="error">
            {{ firstName }} {{ lastName }} konnte nicht hinzugefügt werden!
          </v-alert>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
// Import necessary libraries and components
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;
export default {
  // Component data
  data: () => ({
    authorised: true,
    user: [],
    familyTreeAccess: "",
    flowKey: "",
    loading: true,
    nodes: [],
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: ["W", "M", "D"],
    hometown: "",
    hometownCoordinates: "",
    autocomplete: null,
    submitSuccess: false,
    submitFailed: false,
  }),

  // Component props
  props: {
    FamilyTreeId: {
      type: Number,
      required: true,
    },
    reloadFamilyTree: {
      type: Boolean,
      required: true,
    },
  },

  // Component methods
  methods: {
    // Map gender to code
    mapGenderToCode(gender) {
      const genderMap = {
        Weiblich: "W",
        Männlich: "M",
        Divers: "D",
      };
      return genderMap[gender] || null;
    },

    // Handle form submission
    async submitForm() {
      this.$emit("reload-family-tree", true);

      // API call to add a new person
      try {
        const response = await axios.post(
          `${backendURL}/persons/${this.FamilyTreeId}`,
          {
            FirstName: this.firstName,
            LastName: this.lastName,
            BirthDate: this.birthDate,
            Hometown: this.hometown,
            Gender: this.mapGenderToCode(this.gender),
          }
        );

        console.log(response.data);
        this.submitSuccess = true;
      } catch (error) {
        console.error(error);
        this.submitFailed = true;
        throw error;
      } finally {
        // Reset flags and form fields after 2 seconds
        setTimeout(() => {
          this.submitFailed = false;
          this.submitSuccess = false;
          this.firstName = "";
          this.lastName = "";
          this.birthDate = "";
          this.gender = ["Weiblich", "Männlich", "Divers"];
          this.hometown = "";
        }, 2000);
      }
    },

    // Handle selected place from Autocomplete
    setPlace(place) {
      console.log("Selected Place:", place);
      this.hometown = JSON.stringify(place.geometry.location);
    },
  },
};
</script>

<style>
/* Custom styling for Autocomplete */
.v-text-1 {
  display: inline-block;
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  z-index: 1000;
}

.v-text-1 input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
}

.v-text-1 label {
  position: absolute;
  top: 0;
  left: 8px;
  font-size: 14px;
  color: #333;
  pointer-events: none;
  transition: top 0.3s, font-size 0.3s;
  z-index: 1000;
}

.v-text-1 input:focus + label,
.v-text-1 input:not(:placeholder-shown) + label {
  top: -16px;
  font-size: 12px;
  color: #6200ea;
  z-index: 1000;
}

/* Custom styling for Autocomplete dropdown */
.pac-container {
  z-index: 100000;
}
</style>
