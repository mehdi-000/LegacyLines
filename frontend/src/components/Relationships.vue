<template>
  <v-app>
    <v-container>
      <div v-if="AUTHENTICATED">
        <v-card class="mb-5">
          <v-card-title class="text-h5 m-2"
            >👨‍👩‍👧 Establish Family Relationships</v-card-title
          >
          <v-card-subtitle>
            1. Select a person as child<br />
            2. Then another person as parent<br />
            3. Choose the relationship type
          </v-card-subtitle>
        </v-card>

        <v-row>
          <v-col
            v-for="person in familyMembers"
            :key="person.PersonID"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :elevation="selectedPersons.includes(person) ? 10 : 2"
              class="pa-3"
            >
              <div class="text-h6 text-center">
                {{ person.Firstname }} {{ person.Lastname }}
              </div>
              <div class="text-caption text-center">
                Born: {{ formatDate(person.BirthDate) }}
              </div>
              <v-avatar size="64" class="mb-2"> </v-avatar>
              <v-btn
                color="secondary"
                class="mt-2"
                block
                @click="selectPerson(person)"
                :disabled="selectedPersons.includes(person)"
              >
                {{ getSelectionLabel() }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Dialog for relationship type -->
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="text-h6">Select Relationship</v-card-title>
            <v-card-text>
              <v-btn
                block
                color="secondary"
                class="mb-2"
                @click="selectRelationshipType('Mother')"
                >Mother</v-btn
              >
              <v-btn
                block
                color="secondary"
                @click="selectRelationshipType('Father')"
                >Father</v-btn
              >
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelSelection">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Show relationships -->
        <v-card class="mt-5" v-if="selectedRelationships.length">
          <v-card-title class="text-h6">Selected Relationships</v-card-title>
          <v-card-text>
            <v-chip
              v-for="(rel, index) in selectedRelationships"
              :key="index"
              color="primary"
              class="ma-1"
              label
            >
              {{ rel.relationshipType }}: {{ rel.person2.Firstname }} →
              {{ rel.person1.Firstname }}
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success" @click="saveAllRelationships"
              >Save All Relationships</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>

      <!-- Not logged in -->
      <div v-else class="text-center mt-5">
        <h2>Please log in.</h2>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios"; // Import Axios for HTTP requests

const backendURL = import.meta.env.VITE_BACKEND_URL; // Backend URL from environment variables

export default {
  // Properties passed from outside (parent components)
  props: {
    FamilyTreeId: {
      type: Number,
      required: true, // Family tree ID, needed for data retrieval
    },
    reloadFamilyTree: {
      type: Boolean,
      required: true, // Signals whether the family tree should be reloaded
    },
    reloadRelationships: {
      type: Boolean,
      required: true, // Signals whether relationships should be reloaded
    },
    edit: {
      type: Boolean,
      required: false, // Signals whether relationships can be edited
      default: false,
    },
  },

  // Local component data
  data() {
    return {
      familyMembers: [], // List of family members
      selectedPersons: [], // Selected persons for relationship establishment
      selectedRelationshipType: "", // Type of selected relationship (e.g., Mother, Father)
      selectedRelationships: [], // List of selected relationships
      childRelationships: {}, // Child relationships (organized by child ID)
      personSelectionState: "child", // Status of person selection (child or parent)
      dialog: false, // Controls whether dialog is displayed
      AUTHENTICATED: false, // Authentication status
      user: null, // Current user
    };
  },

  async mounted() {
    // when component is mounted
  },

  watch: {
    reloadRelationships(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loadFamilyMembers(); // Reload family members when relationships change
      }
    },
  },

  // Called when component is created
  created() {
    this.loadFamilyMembers(); // Load family members on start
    this.loadRelationships(); // Load relationships on start
    this.authenticateUser(); // Check user authentication
  },

  methods: {
    selectPerson(person) {
      if (this.selectedPersons.length < 2) {
        this.selectedPersons.push(person);
        if (this.selectedPersons.length === 2) {
          this.dialog = true;
        }
      }
    },

    getSelectionLabel() {
      return this.selectedPersons.length === 0
        ? "Select as Child"
        : "Select as Parent";
    },

    selectRelationshipType(type) {
      this.selectedRelationshipType = type;
      this.addRelationship();
      this.dialog = false;
    },

    cancelSelection() {
      this.selectedPersons = [];
      this.dialog = false;
    },

    addRelationship() {
      this.selectedRelationships.push({
        person1: this.selectedPersons[0], // Child
        person2: this.selectedPersons[1], // Parent
        relationshipType: this.selectedRelationshipType,
      });
      this.selectedPersons = [];
      this.selectedRelationshipType = "";
    },
    // User authentication
    authenticateUser() {
      try {
        axios
          .get(`${backendURL}/users/yes/authenticate`, {
            headers: {
              Authorization: localStorage.getItem("token"), // Use token from Local Storage for authentication
            },
          })
          .then((response) => {
            this.AUTHENTICATED = true; // Set authenticated to true when successful
            this.user = response.data; // Store user data
          });
      } catch (error) {
        console.error("error ", error); // Error handling
      }
    },

    // Loads family members from server
    async loadFamilyMembers() {
      try {
        const response = await axios.get(
          `${backendURL}/persons/familytree/${this.FamilyTreeId}`
        ); // Request to API with family tree ID
        this.familyMembers = response.data; // Stores response in familyMembers variable
      } catch (error) {
        console.error("Error loading family members:", error); // Error message if request fails
      }
    },

    // Loads relationships of family members
    async loadRelationships() {
      try {
        const response = await axios.get(
          `${backendURL}/relationsships/familyTree/${this.FamilyTreeId}`
        ); // Request to API
        const relationships = response.data;

        // Organizes relationships by child ID
        this.childRelationships = relationships.reduce((acc, relationship) => {
          const childID = relationship.PersonOneID;

          if (!acc[childID]) {
            acc[childID] = [];
          }

          acc[childID].push(relationship); // Adds relationship to corresponding child
          return acc;
        }, {});
      } catch (error) {
        console.error("Error loading relationships:", error); // Error message on failure
      }
    },

    //  Person details by ID
    getPersonDetails(personID) {
      const person = this.familyMembers.find((p) => p.PersonID === personID);
      return person ? `${person.Firstname} ${person.Lastname}` : "N/A"; // Searches person in family members list
    },

    // Formats relationship data for display
    formatRelationship(relationship) {
      const child = relationship.person1;
      const parent = relationship.person2;
      const relationshipType = relationship.relationshipType;

      // Returns formatted relationship depending on relationship type
      if (relationshipType === "Vater" && parent) {
        return `${relationshipType}: ${parent.Firstname || "N/A"} ${
          parent.Lastname || "N/A"
        }`;
      } else if (relationshipType === "Mutter" && parent) {
        return `${relationshipType}: ${parent.Firstname || "N/A"} ${
          parent.Lastname || "N/A"
        }`;
      } else {
        return "N/A"; // "N/A" if no data available
      }
    },

    // Toggles person selection
    toggleSelect(person) {
      if (this.selectedPersons.length < 2) {
        this.selectedPersons.push(person); // Adds person to selection if not yet two persons selected
      }

      // Switches between child and parent selection
      this.personSelectionState =
        this.personSelectionState === "child" ? "parent" : "child";

      // Opens dialog for relationship selection when two persons are selected
      if (
        this.selectedPersons.length === 2 &&
        this.personSelectionState === "parent"
      ) {
        this.addRelationship(); // Automatically adds relationship when two persons are selected
      } else if (this.selectedPersons.length === 2) {
        this.dialog = true; // Opens dialog
      }
    },

    // Button label based on selection status
    getButtonLabel(person) {
      return this.personSelectionState === "child"
        ? "Select as Child"
        : "Select as Parent";
    },

    // Adds a relationship to the list
    addRelationship() {
      this.selectedRelationships.push({
        person1: this.selectedPersons[0],
        person2: this.selectedPersons[1],
        relationshipType: this.selectedRelationshipType,
      });

      this.resetSelections(); // Resets selection
    },

    // Saves all selected relationships
    async saveAllRelationships() {
      console.log("Saving relationships:", this.selectedRelationships[0]);
      try {
        // Sends selected relationships to server
        const response = await axios.post(
          `${backendURL}/relationsships/${this.selectedRelationships[0].person1.PersonID}/${this.selectedRelationships[0].person2.PersonID}`,
          {
            RelationsshipType: this.selectedRelationships[0].relationshipType,
          }
        );

        console.log("Saved relationships:", response.data);
        this.$emit("reload-family-tree", true); // Signals that family tree should be reloaded

        // Clears list of selected relationships after saving
        this.selectedRelationships = [];
      } catch (error) {
        console.error("Error saving relationships:", error); // Error message when saving
      }
    },

    // Resets selection
    resetSelections() {
      this.selectedPersons = [];
      this.dialog = false;
      this.selectedRelationshipType = "";
      this.personSelectionState = "child";
    },

    // Formatting for date, gender and city
    formatDate(dateString) {
      // Formatting of date string
      const date = new Date(dateString); // Creates date object from passed string
      const day = date.getDate(); // Gets day of month
      const month = date.getMonth() + 1; // Gets month
      const year = date.getFullYear(); // Gets year
      return `${day}/${month}/${year}`; // Returns date in Day/Month/Year format
    },
    formatGender(gender) {
      // Formatting of gender for display
      return gender === "M" ? "Male" : "Female"; // Returns 'Male' if gender is 'M', otherwise 'Female'
    },
    formatCity(city) {
      // Formatting of city for display
      return city || "N/A"; // Returns city name if available, otherwise "N/A"
    },
    selectMother() {
      // Method for selecting 'Mother' relationship
      this.selectedRelationshipType = "Mother"; // Sets relationship type to 'Mother'
      this.dialog = false; // Closes dialog
    },
    selectFather() {
      // Method for selecting 'Father' relationship
      this.selectedRelationshipType = "Father"; // Sets relationship type to 'Father'
      this.dialog = false; // Closes dialog
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

/* Media Queries for adjusting layout on smaller screens */
@media only screen and (max-width: 600px) {
  .v-card-title,
  .v-card-subtitle {
    font-size: 16px; /* Reduces font size for card titles and subtitles on screens smaller than 600px width */
  }
}
</style>
