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
            chats: {
                include: {
                    likes: {
                        include: {
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            },
        }
    })
}


async function fetchContact(contactId) {
    return await prisma.contact.findUnique({
        where: { id: Number(contactId) },
        include: {
            chats: {
                include: {
                    likes: {
                        include: {
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            },
        }
    })
}

async function createChat({ username, content, image, contacts, users }) {
    return prisma.chat.create({
        data: {
            username,
            content: content,
            image: image,
            users: {
                connect: users.map(userId => ({ id: Number(userId) }))
            },
            contact: {
                connect: contacts.map(contactId => ({ id: Number(contactId) }))
            }
        }
    })
}

async function deleteChat(chatId) {
    return await prisma.chat.delete({
        where: { id: Number(chatId) }
    })
}

async function likeChat(chatId, userId) {
    return await prisma.like.create({
        data: { 
            chatId: Number(chatId),
            userId: Number(userId)
        }
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
    deleteChat,
    blockContact,
    likeChat
}