<template>
  <v-container class="legal-container" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 legal-card" elevation="3" rounded="xl">
          <v-card-title class="text-h4 font-weight-bold mb-4"
            >Terms and Conditions</v-card-title
          >
          <v-card-text class="text-body-1">
            <div v-for="(section, i) in agbSections" :key="i" class="mb-6">
              <h2 class="text-h6 font-weight-medium mb-2">
                {{ section.title }}
              </h2>
              <p>{{ section.text }}</p>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-6 legal-card mt-10" elevation="3" rounded="xl">
          <v-card-title class="text-h4 font-weight-bold mb-4"
            >Privacy Policy</v-card-title
          >
          <v-card-text class="text-body-1">
            <div
              v-for="(section, i) in datenschutzSections"
              :key="i"
              class="mb-6"
            >
              <h2 class="text-h6 font-weight-medium mb-2">
                {{ section.title }}
              </h2>
              <p v-if="section.text">{{ section.text }}</p>
              <ul v-if="section.list" class="pl-4">
                <li v-for="(item, j) in section.list" :key="j">– {{ item }}</li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AGB",
  data() {
    return {
      agbSections: [
        {
          title: "1. Scope of Application",
          text: "These terms and conditions apply to the use of our platform, particularly for registered users who create family trees.",
        },
        {
          title: "2. Registration",
          text: "The use of certain features (e.g., creating family trees) requires registration with a valid email address.",
        },
        {
          title: "3. Content in Family Trees",
          text: "Users can enter names, birth dates, and locations. The responsibility for accuracy and lawful publication lies with the user.",
        },
        {
          title: "4. Cancellation",
          text: "You can delete your account at any time. Personal data will be handled in accordance with GDPR.",
        },
        {
          title: "5. Liability",
          text: "We assume no liability for content created by users.",
        },
      ],
      datenschutzSections: [
        {
          title: "1. General",
          text: "We protect your data in accordance with GDPR. This statement informs you about the nature, scope, and purpose of data collection.",
        },
        {
          title: "2. Collected Data",
          text: "When using our site, the following data is stored:",
        },
        {
          title: "Server Log Data",
          list: [
            "IP address",
            "Browser type and version",
            "Time of request",
            "Referrer URL",
          ],
        },
        {
          title: "3. User Data",
          text: "When creating an account, we store your email address and, if applicable, voluntary information such as names or birth dates of entered persons.",
        },
        {
          title: "4. Your Rights",
          list: [
            "Information",
            "Correction",
            "Deletion",
            "Restriction",
            "Objection",
            "Data portability",
          ],
        },
        { title: "5. Cookies", text: "This site does not use cookies." },
        {
          title: "6. Changes",
          text: "We reserve the right to adjust this privacy policy. The current version is always valid.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.legal-container {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
</style>
