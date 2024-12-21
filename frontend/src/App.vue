<script setup>
import MainNav from "@/components/MainNav.vue";
import MainFooter from "@/components/MainFooter.vue";
</script>

<template>
  <v-app>
    <MainNav></MainNav>
    <v-main class="align-center justify-center">
      <v-container fluid>
        <v-fade-transition>
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-main>

    <MainFooter></MainFooter>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
