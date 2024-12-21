import { PrismaClient, AccessControl } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const getAllUsers = await prisma.users.findMany()

/* await prisma.users.create({
    data: {
        Email: "msmsmm@hotmail.com",
        BirthDate: new Date("1999-01-01"),
        FirstName: "Mohamed",
        LastName: "Sayed",
        Gender: 'M',
        Username: "MohamedSayed",
        Password: "12345678",
        ProfilePicture: Buffer.from(""), // Convert the string to a Buffer
        CreationDate: new Date("2023-12-04T20:12:49.674Z"),
        LastLoginDate: new Date("2023-12-04T20:12:49.674Z"),
        IsActive: true, // Add the missing property
        ProfileVisibility: true, // Add the missing property
        FamilyTree: {
            create: {
                Name: "Sayed",
                CreationDate: new Date("2021-01-01"),
                Describtion: "Sayed Family Tree",
                IsPublic: true,
                
        }
        }
    }
    
}) */
const user = await prisma.users.findMany({
/*     where: {
        Email: {
            contains: 'm'
        }
    }, */
    where: {
        FamilyTree: {
            some: {
                Name: {
                    contains: 'Sayed'
                }
            }
        
        }
/*     orderBy: {
        Password: 'asc'
    }, */
}
})
console.log(getAllUsers); 
}

main() 
.catch(e => {
    console.error(e.message)
})
.finally(async () => {
    await prisma.$disconnect()
})