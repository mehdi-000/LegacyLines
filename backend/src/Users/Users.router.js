const express = require("express");
const { body, validationResult } = require("express-validator");
const UsersService = require("./Users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Usersrouter = express.Router();

Usersrouter.use(passport.initialize());

require("../utils/passport-config");

// GET: Get all users #tested
Usersrouter.get("/", async (req, res) => {
  try {
    const users = await UsersService.getAllUser();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get a specific user #tested
Usersrouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UsersService.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

Usersrouter.get(
    "/yes/authenticate",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      try {
        // Your logic here

        res.status(200).send({
          success: true,
          user: {
            id: req.user.UserID,
            email: req.user.Email,
          },
        });
      } catch (error) {
        console.error("Error in /yes/authenticate:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
    }
);

// POST: Login a user #tested have to implement jwt
Usersrouter.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await UsersService.loginUser(Email, Password);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const payload = {
        id: user.UserID,
        email: user.Email,
        userName: user.Username
      };
      const secretOrPrivateKey = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: "1d" });
      return res.status(200).send({
        success: true,
        message: "Login successful",
        token: "Bearer " + token,
        user: payload
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST: Create a new user #tested
Usersrouter.post("/", async (req, res) => {
  try {
    // Extract data from request body
    /*user data example
    {
  "Email": "user@example.com",
  "Password": "securePassword",
  "UserName": "john_doe",
}*/

    const { Email, Password, UserName } = req.body;

    // Call the UsersService to create a new user
    await UsersService.createUser(UserName, Email, Password);

    // Send a success response
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    // Handle errors and send an appropriate response
    return res.status(500).json({ message: err.message });
  }
});

// PUT: Update an existing user #tested
Usersrouter.put("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const userActive = await UsersService.getUser(userId);
    if (!userActive) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const updateUser = req.body;
      const password = updateUser.Password;
      const updatedUser = await UsersService.updateUser(
          userId,
          updateUser,
          password
      );
      return res.status(200).json(updatedUser);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE: Delete an existing user #tested
Usersrouter.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UsersService.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const deletedUser = await UsersService.deleteUser(userId);
      return res.status(204).json("User deleted successfully");
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = Usersrouter;
