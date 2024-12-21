const express = require("express");
const PersonsService = require("./Persons");

const PersonsRouter = express.Router();

// POST: Create a new FamilyObject #tested

PersonsRouter.post("/:familyTreeId", async (req, res) => {
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const birthDate = new Date(req.body.BirthDate); // Parse the date
  const hometown = req.body.Hometown;
  const gender = req.body.Gender;
  const familyTreeId = Number(req.params.familyTreeId);

  try {
    const persons = await PersonsService.createPerson(
      firstName,
      lastName,
      birthDate,
      gender,
      hometown,
      familyTreeId
    );

    if (!persons) {
      return res.status(404).json({ message: "FamilyObject not found" });
    } else {
      return res.status(200).json(persons);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get all Persons in a FamilyTree #tested
PersonsRouter.get("/familyTree/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const persons = await PersonsService.getAllPersonsinFamilyTree(
      familyTreeId
    );
    if (!persons) {
      return res.status(404).json({ message: "FamilyObjects not found" });
    } else {
      return res.status(200).json(persons);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get a specific Person #tested
PersonsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const persons = await PersonsService.getPerson(id);
    if (!persons) {
      return res.status(404).json({ message: "FamilyObject not found" });
    } else {
      return res.status(200).json(persons);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = PersonsRouter;
