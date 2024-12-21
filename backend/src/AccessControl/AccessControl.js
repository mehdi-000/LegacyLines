const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giveAccess = async (familyTreeID, userID, accessType) => {
  // Create the access control
  const accessID = `${userID}_${familyTreeID}`;
  const createdAccessControl = await prisma.accessControl.create({
    data: {
      Users: {
        connect: {
          UserID: parseInt(userID),
        },
      },
      FamilyTree: {
        connect: {
          FamilyTreeID: parseInt(familyTreeID),
        },
      },
      AccessType: accessType,
      AccessID: accessID,
    },
  });

  // Return either the created access control
  return createdAccessControl;
};

const changeAccess = async (familyTreeID, userID, accessType) => {
  // Create the access control
  const changedAccessControl = await prisma.accessControl.update({
    where: {
      AccessID: `${userID}_${familyTreeID}`, // Provide the actual unique identifier
    },
    data: {
      AccessType: accessType,
      // other fields to update
    },
  });

  // Return either the created access control
  return changedAccessControl;
};

const getAccess = async (familyTreeID, userID) => {
  // Search the access control
  const accessControl = await prisma.accessControl.findFirst({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
      UserID: parseInt(userID),
    },
  });

  // Return either the created access control
  return accessControl?.AccessType;
};

const getAllAccess = async (familyTreeID) => {
  // Create the access control
  const accessControl = await prisma.accessControl.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
    },
  });

  // Return either the created access control
  return accessControl;
};

const getAllEditFamilyTree = async (userID) => {
  // Create the access control
  const accessControl = await prisma.accessControl.findMany({
    where: {
      UserID: parseInt(userID),
      AccessType: "edit",
    },
  });

  // Return either the created access control
  return accessControl;
};

const getAllAccessAccesTypeEdit = async (familyTreeID) => {
  // Create the access control
  const accessControl = await prisma.accessControl.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
      AccessType: "edit",
    },
  });

  // Return either the created access control
  return accessControl;
};

const requestJoin = async (familyTreeID, userID) => {
  // Create the access control
  const accessID = `${userID}_${familyTreeID}`;
  const createdAccessControl = await prisma.accessControl.create({
    data: {
      Users: {
        connect: {
          UserID: parseInt(userID),
        },
      },
      FamilyTree: {
        connect: {
          FamilyTreeID: parseInt(familyTreeID),
        },
      },
      AccessType: 'view',
      AccessID: accessID,
    },
  });

  // Return either the created access control
  return createdAccessControl;
};

const acceptRequest = async (accessID) => {
  try {
    return await prisma.accessControl.update({
      where: {
        AccessID: accessID,
      },
      data: {
        AccessType: "edit",
      },
    });
  } catch (err)  {
    throw err;
  }
};

const rejectRequest = async (accessID) => {
  try {
    return await prisma.accessControl.delete({
      where: {
        AccessID: accessID,
      },
    });
  } catch (err)  {
    throw err;
  }
};

async function findRequestByUserId(userId, page, itemsPerPage) {
  try {
    const listTreeOfUser = await prisma.familyTree.findMany({
      where: {
        OwnerUserID: userId,
      },
    });

    const reqList = [];
    for (const item of listTreeOfUser) {
      const req = await prisma.accessControl.findMany({
        where: {
          FamilyTreeID: item.FamilyTreeID,
          AccessType: 'view'
        },
        include: {
          FamilyTree: {
            select: {
              Name: true,
              Describtion: true,
            }
          },
          Users: {
            select: {
              Email: true,
              Username: true
            }
          }
        },
      });

      if (req && req.length > 0) {
        for (const item of req) {
          const tempItem = {...item,
            treeName: item.FamilyTree.Name,
            treeDesc: item.FamilyTree.Describtion,
            reqUserName: item.Users.Username,
            reqUserEmail: item.Users.Email,
          }
          const { FamilyTree, Users, ...newData } = tempItem;

          reqList.push(newData)
        }
      }
    }
    return reqList
  } catch (error) {
    console.error('Error finding trees:', error);
    throw error;
  }
}

module.exports = {
  giveAccess,
  changeAccess,
  getAccess,
  getAllAccess,
  getAllAccessAccesTypeEdit,
  getAllEditFamilyTree,
  requestJoin,
  findRequestByUserId,
  acceptRequest,
  rejectRequest
};