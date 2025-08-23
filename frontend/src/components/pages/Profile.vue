<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <!-- Profile Card -->
      <v-card class="profile-card">
        <v-card-title class="text-center"> <h1>My Profile</h1></v-card-title>
        <!-- Layout for user information -->
        <v-row>
          <v-col>
            <!-- Heading for user information -->
            <v-card-subtitle class="bInfo">User Information</v-card-subtitle>
            <!-- Text fields and buttons for user data -->
            <v-card-text>
              <!-- Text field for username -->
              <v-text-field
                v-model="userProfile.username"
                label="Username"
                class="narrow-text-field"
              ></v-text-field>
              <!-- Text field for password -->
              <v-text-field
                v-model="userProfile.password"
                label="Change your password"
                class="narrow-text-field"
                type="password"
                :rules="passwordRules"
              ></v-text-field>
              <!-- Text field for email address -->
              <v-text-field
                v-model="userProfile.email"
                label="E-Mail"
                class="narrow-text-field"
              ></v-text-field>
              <!-- Button to save data -->
              <v-btn @click="saveUserData">Save</v-btn>
              <!-- Button to delete user account -->
              <v-btn class="delete-button" @click="deleteUser"
                >Delete User</v-btn
              >
              <!-- Alerts Feedback -->
              <v-alert v-if="updatefailed" type="error" class="mt-2" dismissible
                >Error saving! Change your data</v-alert
              >
              <v-alert v-if="updated" type="success" class="mt-2" dismissible
                >Data successfully saved</v-alert
              >
              <v-alert v-if="deleted" type="success" class="mt-2" dismissible
                >User successfully deleted</v-alert
              >
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <router-view></router-view>
  </v-app>
</template>

<script>
import axios from "axios"; // Imports Axios for HTTP requests

// Backend URL from environment variables
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Profile",
  // Defines local data
  data() {
    return {
      // Password validation rules
      passwordRules: [
        (value) => !!value || "Please enter a password.",
        (value) =>
          (value && value.length >= 8) ||
          "Your new password must be at least 8 characters long.",
      ],
      // Object for storing user profile data
      userProfile: {
        username: "",
        email: "",
        password: "",
        id: "",
      },
      // State variables for various notifications
      updatefailed: false,
      updated: false,
      deleted: false,
    };
  },
  // Hook called when component is created
  created() {
    console.log("Profile component created");
    this.loadUserData(); // Loads user data on start
  },
  computed: {
    // Property for masked password display
    maskedPassword() {
      return this.showPassword
        ? this.userProfile.password
        : "*".repeat(this.userProfile.password.length);
    },
  },
  methods: {
    // Loads user data from server
    async loadUserData() {
      axios
        .get(`${backendURL}/users/yes/authenticate`, {
          headers: {
            Authorization: localStorage.getItem("token"), // Uses token for authentication
          },
        })
        .then((response) => {
          console.log(response.data, "wss");
          this.userProfile.id = response.data.user.id; // Sets the user ID

          // Further request to load user data
          axios
            .get(`${backendURL}/users/${this.userProfile.id}`)
            .then((response) => {
              console.log(response.data, "user");
              // Updates user profile with loaded data
              this.userProfile.username = response.data.Username;
              this.userProfile.email = response.data.Email;
            });
        });
    },
    // Deletes user account
    async deleteUser() {
      try {
        // Sends delete request to server
        const response = await axios.delete(
          `${backendURL}/users/${this.userProfile.id}`
        );
        console.log("User data successfully deleted:", response.data);

        this.deleted = true; // Sets deleted status
        setTimeout(() => {
          this.$router.push("/register"); // Navigates to registration page
          this.deleted = false; // Resets deleted status
        }, 2000);
      } catch (error) {
        console.error("Error deleting user data:", error);
      }
    },
    // Saves updated user data
    async saveUserData() {
      // Checks password length
      if (
        this.userProfile.password.length < 8 &&
        this.userProfile.password.length > 1
      ) {
        this.updatefailed = true; // Sets error status if password is too short
        setTimeout(() => {
          this.updatefailed = false;
        }, 2000);
        return;
      } else {
        try {
          // Sends update request to server
          const response = await axios.put(
            `${backendURL}/users/${this.userProfile.id}`,
            {
              Username: this.userProfile.username,
              Password: this.userProfile.password,
              Email: this.userProfile.email,
            }
          );

          // Checks server response
          if (response.data) {
            console.log("User data successfully updated:", response.data);

            await this.loadUserData(); // Reloads user data

            this.updated = true; // Sets success status
            setTimeout(() => {
              this.updated = false; // Resets success status
            }, 2000);
          } else {
            console.error(
              "Error updating user data: Invalid response",
              response
            );
          }
        } catch (error) {
          console.error("Error updating user data:", error);
          this.updatefailed = true; // Sets error status on error
          setTimeout(() => {
            this.updatefailed = false; // Resets error status
          }, 2000);
        }
      }
    },
  },
};
</script>

<style>
.profile-card {
  margin-top: 50px;
  padding-top: 10px;
  width: 70%;
}

.narrow-text-field {
  width: 85%;
  padding-left: 5%;
  margin-bottom: 10px;
}
.bInfo {
  padding-left: 30px;
}

.delete-button {
  margin-left: 10px;
  color: red;
}
</style>
