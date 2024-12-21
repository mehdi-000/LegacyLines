<!-- 404 not found page  -->
<template>
  <div>
    <v-row class="px-8 my-40">
      <v-col>
        <h1>Seite nicht gefunden</h1>
        <p>Überprüfe die URL</p>
        <v-btn to="/" class="mt-4">kehre zur Startseite zurück </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col><img :src="notFoundImage" alt="Not Found Image" /> </v-col>
    </v-row>
  </div>
</template>

<script>
import notFoundImage from "/images/not-found.gif";

export default {
  data() {
    return {
      notFoundImage: notFoundImage,
    };
  },
};
</script>

<style></style>
