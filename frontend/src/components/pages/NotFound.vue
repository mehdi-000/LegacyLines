<!-- 404 not found page  -->
<template>
  <div>
    <v-row class="px-8 my-40">
      <v-col>
        <h1>Page not found</h1>
        <p>Check the URL</p>
        <v-btn to="/" class="mt-4">Return to homepage</v-btn>
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
