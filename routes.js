const { Syncer } = require("./syncer");

const sync = async (req, res) => {
    // Initialize syncer class
    const syncer = new Syncer();
    // Get current contacts list from source
    const contacts = await syncer.getContacts();
    
    if(contacts){
        const getListReponse = await syncer.getOrCreateList();
        if(getListReponse){
            const uploadContactsRes = await syncer.syncContacts(getListReponse.id, contacts);
            if(uploadContactsRes?.error_count){
                return res.status(400).json(uploadContactsRes.errors);
            }
            const {new_members, updated_members} = uploadContactsRes;
            return res.status(200).json({new_members: new_members.length, updated_members: updated_members.length});
        }
        return res.status(400).send("Unable to create list");
    }
    return res.status(400).send("No contacs need sync");
}

module.exports.sync = sync;