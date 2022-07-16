const { Contact } = require("./contact");
const { Syncer, Mailchimp } = require("./syncer");

const sync = async (req, res) => {
    // Initialize syncer class
    const syncer = new Syncer();
    // Get current contacts list from source
    const response = await syncer.getContacts();
    const contacts = response.data.map(item => new Contact(item.firstName, item.lastName, item.email));
    //Create list if not available
    const mc = new Mailchimp();
    await mc.ping();
    const getListReponse = await mc.getList();

    // Upsert contacts from source into Mailchimp
    let upsert;
    if(getListReponse){
            upsert = await mc.upsertContacts(contacts);
        if(upsert?.error_count){
            return res.status(400).json(upsert.errors);
        }

        const {new_members, updated_members} = upsert;
        return res.status(response.status).json({new_members: new_members.length, updated_members: updated_members.length});
    }
    return res.status(400).send("Unable to create list");

}

module.exports.sync = sync;