const groupService = require("../services/groupService");

async function createGroup(req, res) {
    const { groupname } = req.body;

    try { 
        const userId = Number(req.user.id);
        const newgroup = await groupService.createGroup({ groupname, userId });
        res.status(200).json({ group: newgroup });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function fetchGroups(req, res) {
    try{
        const userId = Number(req.user.id);
        const groups = await groupService.fetchGroups(userId);
        res.status(200).json({ groups: groups });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
    }
}

async function fetchGroup(req, res) {
    const { groupId } = req.params;
    try{
        const group = await groupService.fetchGroup(groupId);
        res.status(200).json({ group: group });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
    }
}

async function newMember(req, res) {
    const { groupId } = req.params;
    console.log("groid", groupId);

    try{
        const userId = Number(req.user.id);
        const membername = req.user.username;
        const newMember = await groupService.newMember({ membername, userId, groupId });
        console.log("new", newMember);
        res.status(200).json({ member: newMember });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

module.exports = {
    createGroup,
    fetchGroups,
    fetchGroup,
    newMember
}