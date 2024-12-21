const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//POST: Create a new Person #tested with
/* 
"FirstName": "May",
"LastName": "Bilal",
"BirthDate":"2004-11-23" ,
"Gender": "W",
"Hometown": "Rouen" 
*/
const createPerson = async (
  firstName,
  lastName,
  birthDate,
  gender,
  hometown,
  familyTreeId
) => {
  // Create FamilyObject
  const createdFamilyObject = await prisma.persons.create({
    data: {
      BirthDate: birthDate,
      Firstname: firstName,
      Gender: gender,
      Hometown: hometown,
      Lastname: lastName,
      FamilyTreeID: parseInt(familyTreeId),
    },
  });

  // Return either the created FamilyObject
  return createdFamilyObject;
};

const getAllPersonsinFamilyTree = async (familyTreeId) => {
  const familyObjects = await prisma.persons.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeId),
    },
    orderBy: {
      BirthDate: "asc",
    },
  });

  return familyObjects;
};

const getPerson = async (personId) => {
  const person = await prisma.persons.findFirst({
    where: {
      PersonID: parseInt(personId),
    },
  });

  return person;
};

module.exports = { createPerson, getAllPersonsinFamilyTree, getPerson };
