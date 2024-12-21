const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createRelationsship = async (
  personOneID,
  personTwoID,
  relationsshipType
) => {
  // Create FamilyObject
  const createdRelationsship = await prisma.relationsships.create({
    data: {
      PersonTwoID: parseInt(personTwoID),
      Relationship_type: relationsshipType,
      PersonOneID: parseInt(personOneID),
    },
  });

  // Return either the created FamilyObject
  return createdRelationsship;
};

const getAllRelationsships = async (familyTreeId) => {
  const persons = await prisma.relationsships.findMany({
    where: {},
  });

  return persons;
};

const deleteRelationsship = async (relationsshipID) => {
  const deletedRelationsship = await prisma.relationsships.delete({
    where: {
      RelationsshipID: parseInt(relationsshipID),
    },
  });

  return deletedRelationsship;
};

// The personOneID is always the child in the relationsship
const getRelationsship = async (personTwoID) => {
  const relationsship = await prisma.relationsships.findFirst({
    where: {
      PersonTwoID: parseInt(personTwoID),
    },
  });

  return relationsship.Relationship_type;
};

const getParents = async (personOneID) => {
  const relationsship = await prisma.relationsships.findMany({
    where: {
      PersonOneID: parseInt(personOneID),
    },
  });

  return relationsship;
};

/* Idee um den FamiyTree zu bauen
Wir iterieren durch alle moms älteste zuerst und schauen ob sie Kinder hat und zeige diese an 
dann kommt die nächste mom und so weiter zum schluss werden die dads hinzugefügt */

module.exports = {
  createRelationsship,
  getAllRelationsships,
  deleteRelationsship,
  getRelationsship,
  getParents,
};
