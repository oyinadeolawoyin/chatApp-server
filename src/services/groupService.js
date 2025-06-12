const prisma = require("../config/prismaClient");

async function createGroup({ groupname, userId }) {
    return await prisma.group.create({
        data: {
            groupName: groupname,
            createdById: userId
        }
    })
}

async function fetchAllGroup() {
    return await prisma.group.findMany()
}

async function fetchGroups(userId) {
    return await prisma.group.findMany({
        where: { createdById: userId },
        include: {
            members: true,
            chats: true,
            createdBy: {
                select: {
                  username: true
                }
            }
        }
    })
}

async function fetchGroup(groupId) {
    return await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: {
            members: true,
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
            createdBy: {
                select: {
                    username: true
                }
            }
        }
    });
}

async function findMember({ groupId, membername}) {
    return prisma.member.findFirst({
        where: {
            groupId: Number(groupId),
            memberName: membername
        }
    })
}

async function newMember({ membername, userId, groupId }) {
    return prisma.member.create({
        data: {
            memberName: membername,
            userId: userId,
            groupId: Number(groupId)
        }
    })
}

async function createChat({ username, content, image, userId, groupId }) {
    return prisma.chat.create({
        data: {
            username,
            content: content,
            image: image,
            groupId: Number(groupId),
            users: {
                connect: [{ id: Number(userId) }]
            }
        }
    });
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

module.exports = {
    createGroup,
    fetchAllGroup,
    fetchGroups,
    fetchGroup,
    newMember,
    findMember,
    createChat,
    deleteChat,
    likeChat
}