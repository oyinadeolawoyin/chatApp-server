const prisma = require("../config/prismaClient");

async function findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
}

async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
        include: {
          contacts: true
        }
    });
}

async function createUser({ username, password,  email, country, image, gender, bio }) {
    return await prisma.user.create({
      data: {
        username,
        password,
        email,
        country,
        gender,
        image: image || null,
        bio
      },
    });
}

module.exports = {
    findUserByEmail,
    findUserByUsername,
    createUser,
}