const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const createUser = async (userName, email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  await prisma.users.create({
    data: {
      Username: userName,
      Email: email,
      Password: hashPassword,
      CreationDate: new Date(),
    },
  });
};

const updateUser = async (userId, updatedData, password) => {
  if (password) {
    const hashPassword = await bcrypt.hash(password, 10);
    updatedData.Password = hashPassword;
  }
  return prisma.users.update({
    where: { UserID: parseInt(userId) },
    data: updatedData,
  });
};

const deleteUser = async (userId) => {
  try {
    // Find all FamilyTrees associated with the user
    const familyTrees = await prisma.familyTree.findMany({
      where: {
        OwnerUserID: parseInt(userId),
      },
    });

    // Delete AccessControl entries related to each FamilyTree
    for (const familyTree of familyTrees) {
      await prisma.accessControl.deleteMany({
        where: {
          FamilyTreeID: parseInt(familyTree.FamilyTreeID),
        },
      });
    }

    // Delete all FamilyTrees associated with the user
    await prisma.familyTree.deleteMany({
      where: {
        OwnerUserID: parseInt(userId),
      },
    });

    // Delete the user
    const deletedUser = await prisma.users.delete({
      where: {
        UserID: parseInt(userId),
      },
    });

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user");
  }
};

const getUser = async (userId) => {
  const UserID = parseInt(userId);
  return prisma.users.findUnique({
    where: {
      UserID: UserID, // <-- Import Int from Prisma
    },
  });
};

const loginUser = async (email, password) => {
  try {
    const getUser = await prisma.users.findUnique({
      where: {
        Email: email,
      },
    });

    if (!getUser) {
      return null; // User not found
    }

    const userPassword = getUser.Password;

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (passwordMatch) {
      return getUser; // should implement a return of jwt token
    } else {
      return null; // Passwords do not match
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error(error); // You can handle the error more gracefully if needed
  }
};

const getAllUser = async () => {
  const users = await prisma.users.findMany();
  return users;
};

const getUsers = async (familyTreeName) => {
  const users = await prisma.users.findMany({
    where: {
      FamilyTree: {
        some: {
          Name: familyTreeName,
        },
      },
    },
  });
  return users;
};

const getUserAddress = async (email) => {
  const user = await prisma.users.findUnique({
    where: { Email: email },
    select: {
      ProfileVisibility: true,
    },
  });

  return user?.ProfileVisibility || null;
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  loginUser,
  getAllUser,
  getUsers,
  getUserAddress,
};
