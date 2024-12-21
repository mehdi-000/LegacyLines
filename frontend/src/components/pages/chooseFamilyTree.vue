<template>
  <v-container>
    <!-- Show family trees if user is authenticated -->
    <div v-if="AUTHENTICATED" class="text-xs-center">
      <v-row justify="center" class="mb-4">
        <h1>Wähle einen Stammbaum</h1>
      </v-row>

      <!-- Display family trees using v-item-group -->
      <v-item-group mandatory>
        <v-row>
          <v-col
            v-for="familytree in familytrees"
            :key="familytree.FamilyTreeID"
            cols="5"
            md="4"
            @click="toggle(familytree.FamilyTreeID)"
          >
            <DisplayFamilyTree
              :FamilyTreeId="familytree.FamilyTreeID"
              DisplaySize="25vh"
              :ReloadFamilyTree="this.shouldReloadFamilyTree"
            />
          </v-col>
        </v-row>
      </v-item-group>

      <!-- Button to create a new family tree -->
      <v-row class="mt-4">
        <v-btn @click="this.$router.push('/')" type="submit" class="ml-auto">
          Neu erstellen
        </v-btn>
      </v-row>
    </div>

    <!-- Show login message if user is not authenticated -->
    <div v-else class="text-xs-center mt-4">
      <v-row justify="center">
        <h1>Bitte logge dich ein</h1>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import DisplayFamilyTree from "../DisplayFamilyTree.vue";
import router from "../../router";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "chooseFamilyTree",

  data: () => ({
    user: {},
    loading: true,
    error: "",
    familytrees: [],
    familyTreeId: null,
    AUTHENTICATED: false,
    shouldReloadFamilyTree: false,
    isOpenCreateDialog: false,
  }),

  components: {
    DisplayFamilyTree,
  },

  methods: {
    // Navigate to the selected family tree
    toggle(familyTreeId) {
      router.push({ name: "FamilyTree", params: { familyTreeId } });
    },

    // Toggle the create dialog visibility
    openCreateDialog() {
      this.isOpenCreateDialog = !this.isOpenCreateDialog;
    },
  },

  async mounted() {
    try {
      // Check user authentication
      const userResponse = await axios.get(
        `${backendURL}/users/yes/authenticate`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Get family trees based on user's access control
      const accessControlResponse = await axios.get(
        `${backendURL}/accessControl/user/${userResponse.data.user.id}`
      );

      this.familytrees = accessControlResponse.data;
      this.AUTHENTICATED = true;
    } catch (error) {
      console.error(error);
      throw error;
    }

    this.loading = false;
  },
};
</script>

<style></style>
