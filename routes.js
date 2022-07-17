const { Syncer } = require('./syncer');

const { API_TOKEN } = process.env;

const security = (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== `Bearer ${API_TOKEN}`) {
    return res.status(401).send('Unauthorized!');
  }
  return next();
}

const sync = async (req, res) => {
  // Initialize syncer class
  const syncer = new Syncer();
  // Get current contacts list from source
  const contacts = await syncer.getContacts();

  if (contacts) {
    const getListReponse = await syncer.getOrCreateList();
    if (getListReponse) {
      const uploadContactsRes = await syncer.syncContacts(getListReponse.id, contacts);
      if (uploadContactsRes?.error_count) {
        return res.status(400).json(uploadContactsRes.errors);
      }
      const { new_members, updated_members } = uploadContactsRes;
      return res.status(200).json({ new_members: new_members.length, updated_members: updated_members.length });
    }
    return res.status(400).send('Unable to create list');
  }
  return res.status(400).send('No contacs need sync');
};

const helloWorld = (req, res) => {
  res.send('Hello World!');
};

module.exports.security = security;
module.exports.sync = sync;
module.exports.helloWorld = helloWorld;