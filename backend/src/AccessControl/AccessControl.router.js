const express = require("express");

const AccessControlRouter = express.Router();

const accessControlService = require("./AccessControl");

// POST: Give a user access to a family tree #tested
AccessControlRouter.post("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  const accessType = req.body.AccessLevel;
  console.log(familyTreeId, "familyTreeId");

  /*   const existingAccess = await accessControlService.getAccess(
    familyTreeId,
    userId
  );

  if (existingAccess) {
    return res.status(400).json({
      message: "User already has access with level: " + existingAccess,
    });
  } */
  try {
    // Grant access
    const accessControl = await accessControlService.giveAccess(
        familyTreeId,
        userId,
        accessType
    );

    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get all users with access to a family tree #tested
AccessControlRouter.get("/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const accessControl = await accessControlService.getAllAccess(familyTreeId);
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET: Get all family trees a user has access to #nottested
AccessControlRouter.get("/user/:userid", async (req, res) => {
  const userid = Number(req.params.userid);
  try {
    const accessControl = await accessControlService.getAllEditFamilyTree(
        userid
    );
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

AccessControlRouter.get("/getListRequest/:userid", async (req, res) => {
  const userid = Number(req.params.userid);
  const {page, itemsPerPage} = req.query;
  console.log(page, itemsPerPage)
  try {
    const accessControl = await accessControlService.findRequestByUserId(
        userid
    );

    return res.status(200).json(accessControl);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

AccessControlRouter.put("/accept/:AccessID", async (req, res) => {
  const AccessID = req.params.AccessID;
  try {
    const accessControl = await accessControlService.acceptRequest(AccessID);

    return res.status(200).json(accessControl);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

AccessControlRouter.delete("/reject/:AccessID", async (req, res) => {
  const AccessID = req.params.AccessID;
  try {
    const accessControl = await accessControlService.rejectRequest(AccessID);

    return res.status(200).json(accessControl);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET: Get Access Level of a user to a family tree #nottested
AccessControlRouter.get("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  try {
    const accessControl = await accessControlService.getAccess(
        familyTreeId,
        userId
    );
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//PUT: Update Access Level of a user to a family tree #nottested
AccessControlRouter.put("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  const accessType = req.body.AccessType;
  try {
    const accessControl = await accessControlService.changeAccess(
        familyTreeId,
        userId,
        accessType
    );
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

AccessControlRouter.post("/requestJoin", async (req, res) => {
  const familyTreeId = Number(req.body.familyTreeId);
  const userId = Number(req.body.userId);

  const existingAccess = await accessControlService.getAccess(
      familyTreeId,
      userId
  );

  if (existingAccess) {
    return res.status(400).json({
      message: "You have already request to join this tree."
    });
  }
  try {
    // Grant access
    const accessControl = await accessControlService.requestJoin(
        familyTreeId,
        userId
    );

    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = AccessControlRouter;