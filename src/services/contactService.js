const prisma = require("../config/prismaClient");

async function newContact({ username, userId }) {
    return await prisma.contact.create({
        data: {
            friendName: username,
            userId: userId
        }
    })
}

async function fetchContacts(userId) {
    return await prisma.contact.findMany({
        where: { userId },
        include: {
            chats: true
        }
    })
}

module.exports = {
    newContact,
    fetchContacts
}