//A Vue store module that manages the authentication state of the application in a reactive way

import { reactive } from 'vue'

// Creating a reactive store object for authentication-related state
export const authenStore = reactive({

    // Boolean indicating whether the user is currently logged in or not
    loggedIn: false,

    // Object representing the user information; initially set to null
    user: null,

    // Method to set the 'loggedIn' state based on the provided value
    setIsLoggedIn(val) {
        this.loggedIn = val;
    },

    // Method to set the 'user' state based on the provided value
    setUser(val) {
        this.user = val
    }
})