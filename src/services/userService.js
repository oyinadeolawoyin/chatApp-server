const prisma = require("../config/prismaClient");

async function fetchUser(userId) {
    return prisma.user.findUnique({
        where: { id: userId },
        include: {
            contacts: true,
            groups: true,
            member: {
                include: {
                    group: {
                        select: {
                            groupName: true
                        }
                    }
                }
            },
            chats: true,
        }
    })   
}

async function updateUser({ username, hashPassword, email, country, gender, image, bio, userId }) {
    return await prisma.user.update({
      where: {  id: userId },
      data: {
        username,
        password: hashPassword,
        email,
        country,
        gender,
        image: image,
        bio,
      },
    });
}

module.exports = {
    fetchUser,
    updateUser
}