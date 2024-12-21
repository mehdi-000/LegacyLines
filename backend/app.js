/* require("dotenv").config({
  path: "../.env",
});
 */
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const users = require("./src/Users/Users.router");
const familyTree = require("./src/FamilyTree/FamilyTree.router");
const persons = require("./src/Persons/Persons.router");
const accessControl = require("./src/AccessControl/AccessControl.router");
const relationsships = require("./src/Persons/Relationsships/Relationsships.router");

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/persons", persons);
app.use("/users", users);
app.use("/familyTree", familyTree);
app.use("/accessControl", accessControl);
app.use("/relationsships", relationsships);
app.get("/test-env", (req, res) => {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;

  res.json({ databaseUrl, jwtSecret });
});

module.exports = app;
