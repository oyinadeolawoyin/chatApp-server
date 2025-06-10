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
            chats: true,
            createdBy: {
                select: {
                  username: true
                }
            }
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
            userId: userId,
            image: image,
            groupId: Number(groupId)
        }
    })
}

async function fetchChats(groupId) {
    return await prisma.chat.findMany({
       where: { groupId: Number(groupId) },
    })
}

async function deleteChat(chatId) {
    return await prisma.chat.delete({
        where: { id: Number(chatId) }
    })
}

module.exports = {
    createGroup,
    fetchAllGroup,
    fetchGroups,
    fetchGroup,
    newMember,
    createChat,
    fetchChats,
    deleteChat
}