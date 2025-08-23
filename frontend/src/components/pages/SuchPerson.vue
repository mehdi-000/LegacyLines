<script>
export default {
  name: "About",
};
</script>

<template>
  <div class="pa-md-10 text-center">
    <h1>Discover Your Family History</h1>
    <div class="text-h5 pa-md-4 text-grey text-center">
      Search FamilySearch for a specific ancestor. Even your best guess is
      enough.
    </div>
  </div>

  <v-layout class="rounded rounded-md">
    <v-card
      class="text-center pa-md-5 pa-4 rounded-e-xl"
      style="background-color: antiquewhite"
      min-width="400"
      min-height="400"
      title="Search"
    >
      <form>
        <v-text-field label="Name"></v-text-field>

        <v-text-field label="Last Name"></v-text-field>

        <v-text-field label="Birthday"></v-text-field>

        <v-select label="Birthplace"></v-select>

        <v-btn class="me-4" type="submit"> submit </v-btn>
      </form>
    </v-card>

    <v-main class="d-flex justify-center md-10" style="min-height: 300px">
      <v-container>
        <v-row align="center" justify="center">
          <v-card class="mx-auto" max-width="344" variant="outlined">
            <v-card-item>
              <div>
                <div class="text-overline mb-1">Tip for you</div>
                <div class="text-h4 mb-1">Step 1</div>
                <div class="text-caption">
                  I'm a thing. But, like most politicians, he promised more than
                  he could deliver. You won't have time for sleeping, soldier,
                  not with all the bed making you'll be doing.
                </div>
              </div>
            </v-card-item>

            <v-card-actions>
              <v-btn variant="text" @click="reveal = true"> Read more </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
                <v-card-text class="pb-0">
                  <p>
                    late 16th century (as a noun denoting a place where alms
                    were distributed): from medieval Latin eleemosynarius, from
                    late Latin eleemosyna 'alms', from Greek eleēmosunē
                    'compassion'
                  </p>
                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-btn variant="text" @click="reveal = false"> Close </v-btn>
                </v-card-actions>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>
