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


async function fetchContact(contactId) {
    return await prisma.contact.findUnique({
        where: { id: Number(contactId) },
        include: {
            chats: true,
        }
    })
}

async function createChat({ username, content, image, userId, contactId }) {
    return prisma.chat.create({
        data: {
            username,
            content: content,
            userId: userId,
            image: image,
            contactId: Number(contactId)
        }
    })
}

async function fetchChats(contactId) {
    return await prisma.chat.findMany({
       where: { contactId: Number(contactId) },
    })
}

async function deleteChat(chatId) {
    return await prisma.chat.delete({
        where: { id: Number(chatId) }
    })
}

async function blockContact({ status, contactId }) {
    return prisma.contact.update({
        where: { id: Number(contactId) },
        data: {
            status
        }
    })
}

module.exports = {
    newContact,
    fetchContacts,
    fetchContact,
    createChat,
    fetchChats,
    deleteChat,
    blockContact
}