<!--@author Mehdi Popal -->
<!-- This page shows the  -->
<template>
  <!-- Main container for the Familytree component -->
  <div>
    <!-- Title and subtitle for the Familytree -->
    <h1 class="text-center">Stammbaum</h1>
    <v-card-subtitle class="text-center mt--1"
      >Deine Familiengeschichte im Überblick</v-card-subtitle
    >

    <!-- Show a message and redirect if not authorized -->
    <v-container v-if="!isAuthorized">
      <h1>Bitte logge dich ein!</h1>
      <span to="/login"></span>
    </v-container>

    <!-- Display components if authorized -->
    <v-container v-if="isAuthorized">
      <!-- DisplayFamilyTree component -->
      <DisplayFamilyTree
        :FamilyTreeId="this.familyTreeId"
        DisplaySize="100vh"
        :ReloadFamilyTree="this.shouldReloadFamilyTree"
      />

      <!-- GoogleMapsItem component -->
      <v-container>
        <GoogleMapsItem
          :FamilyTreeId="this.familyTreeId"
          :reloadMap="this.shouldReloadFamilyTree"
        />
      </v-container>
    </v-container>

    <!-- addPersons component -->
    <v-container>
      <addPersons
        :FamilyTreeId="this.familyTreeId"
        @reload-family-tree="handleReloadFamilyTree"
      />
    </v-container>

    <!-- Relationships component -->
    <v-container>
      <Relationships
        :FamilyTreeId="this.familyTreeId"
        @reload-family-tree="handleReloadFamilyTree"
        :reloadRelationships="this.shouldReloadFamilyTree"
        edit="true"
      />
    </v-container>
  </div>
</template>

<script>
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import GoogleMapsItem from "../GoogleMapsItem.vue";
import addPersons from "@/components/addPersons.vue";
import Relationships from "@/components/Relationships.vue";
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Familytree",
  components: {
    DisplayFamilyTree,
    addPersons,
    Relationships,
    GoogleMapsItem,
  },
  props: {
    familyTreeId: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    isAuthorized: false,
    shouldReloadFamilyTree: false,
  }),

  methods: {
    // Function to handle reloading the Familytree
    handleReloadFamilyTree(value) {
      this.shouldReloadFamilyTree = !this.shouldReloadFamilyTree;
    },
  },

  mounted() {
    // Check if the user is authorized on component mount
    axios
      .get(`${backendURL}/users/yes/authenticate`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        this.isAuthorized = true;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped></style>
