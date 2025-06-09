const prisma = require("../config/prismaClient");

async function createGroup({ groupname, userId }) {
    return await prisma.group.create({
        data: {
            groupName: groupname,
            createdById: userId
        }
    })
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

module.exports = {
    createGroup,
    fetchGroups,
    fetchGroup,
    newMember
}