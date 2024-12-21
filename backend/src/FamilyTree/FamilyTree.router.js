const express = require("express");
const familyTreeService = require("./FamilyTree");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const familyTreeRouter = express.Router();

// GET: Get a specific FamilyTree #tested
familyTreeRouter.get("/getById/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const familyTree = await familyTreeService.getFamilyTree(id);
    if (!familyTree) {
      return res.status(404).json({ message: "FamilyTree not found" });
    } else {
      return res.status(200).json(familyTree);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST: Create a new FamilyTree #tested
/* {
  "name": "firstincestgroup",
  "userID": 1,
  "description": "this is a crazy thing",
  "isPublic": false
} */
familyTreeRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const name = req.body.name;
    const userID = Number(req.body.userID);
    const description = req.body.description;
    const ispublic = Boolean(req.body.ispublic);
    try {
      const familyTree = await familyTreeService.createFamilyTree(
        name,
        userID,
        description,
        ispublic
      );
      if (!familyTree) {
        return res.status(404).json({ message: "FamilyTree not found" });
      } else {
        return res.status(200).json(familyTree);
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);
familyTreeRouter.get("/getOwner/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const familyTree = await familyTreeService.getFamilyTreeOwner(id);
    if (!familyTree) {
      return res.status(404).json({ message: "FamilyTree not found" });
    } else {
      return res.status(200).json(familyTree);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

familyTreeRouter.get("/search/:name", async (req, res) => {
  const name = req.params.name;
  const userId = req.query.userId;
  try {
    const familyTrees = await familyTreeService.searchFamilyTrees(name, userId);
    if (!familyTrees || (familyTrees && familyTrees.length === 0)) {
      return res.status(404).json({ message: "FamilyTree not found" });
    } else {
      return res.status(200).json(familyTrees);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

familyTreeRouter.get("/searchAll", async (req, res) => {
  const userId = req.query.userId;
  try {
    const familyTrees = await familyTreeService.searchAllFamilyTrees(userId);
    if (!familyTrees || (familyTrees && familyTrees.length === 0)) {
      return res.status(404).json({ message: "FamilyTree not found" });
    } else {
      return res.status(200).json(familyTrees);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

familyTreeRouter.get("/nodes/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const nodes = await familyTreeService.getNodePosition(familyTreeId);
    if (!nodes) {
      return res.status(404).json({ message: "Nodes not found" });
    } else {
      return res.status(200).json(nodes);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

familyTreeRouter.post("/nodes/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const nodePosition = req.body.NodePosition;
  try {
    const nodes = await familyTreeService.setNodePosition(
      nodePosition,
      familyTreeId
    );
    if (!nodes) {
      return res.status(404).json({ message: "Can't save Position" });
    } else {
      return res.status(200).json(nodes);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

familyTreeRouter.delete("/nodes/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const familyTree = await familyTreeService.deleteNodePosition(familyTreeId);
    if (!familyTree) {
      return res.status(404).json({ message: "FamilyTree not found" });
    } else {
      return res.status(200).json(familyTree);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = familyTreeRouter;
