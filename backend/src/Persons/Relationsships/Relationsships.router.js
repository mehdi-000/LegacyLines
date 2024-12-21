const express = require("express");

const RelationsshipsService = require("./Relationsships");

const RelationsshipsRouter = express.Router();

// POST: Create new Relationsship #nottested
RelationsshipsRouter.post("/:personOneId/:personTwoId", async (req, res) => {
  const personOneId = Number(req.params.personOneId);
  const personTwoId = Number(req.params.personTwoId);
  const relationsshipType = req.body.RelationsshipType;

  try {
    const relationsships = await RelationsshipsService.createRelationsship(
      personOneId,
      personTwoId,
      relationsshipType
    );

    if (!relationsships) {
      return res.status(404).json({ message: "Relationsship not found" });
    } else {
      return res.status(200).json(relationsships);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get all Relationsships in a FamilyTree #nottested
RelationsshipsRouter.get("/familytree/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const relationsships = await RelationsshipsService.getAllRelationsships(
      familyTreeId
    );
    if (!relationsships) {
      return res.status(404).json({ message: "Relationsships not found" });
    } else {
      return res.status(200).json(relationsships);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get parents of a person #nottested
RelationsshipsRouter.get("/parents/:personOneId", async (req, res) => {
  const personOneId = Number(req.params.personOneId);
  try {
    const relationsships = await RelationsshipsService.getParents(personOneId);
    if (!relationsships) {
      return res.status(404).json({ message: "Relationsships not found" });
    } else {
      return res.status(200).json(relationsships);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE: Delete a relationsship #nottested
RelationsshipsRouter.delete("/:relationsshipId", async (req, res) => {
  const relationsshipId = Number(req.params.relationsshipId);
  try {
    const relationsships = await RelationsshipsService.deleteRelationsship(
      relationsshipId
    );
    if (!relationsships) {
      return res.status(404).json({ message: "Relationsships not found" });
    } else {
      return res.status(200).json(relationsships);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get a specific Relationsship #nottested
RelationsshipsRouter.get("/:personTwoId", async (req, res) => {
  const personTwoId = Number(req.params.personTwoId);
  try {
    const relationsships = await RelationsshipsService.getRelationsship(
      personTwoId
    );
    if (!relationsships) {
      return res.status(404).json({ message: "Relationsship not found" });
    } else {
      return res.status(200).json(relationsships);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = RelationsshipsRouter;
