const { callApi } = require('./callApi');
const { Contact } = require('./contact');
const { Mailchimp } = require('./mailchimp');
require('dotenv').config();

const { CONTACTS_API } = process.env;

class Syncer {
  constructor() {
    this.mc = new Mailchimp();
    this.mc.ping();
  }

  async getContacts() {
    // get all contacts
    const getContactsReponse = await callApi(CONTACTS_API);
    return getContactsReponse.data.map((item) => new Contact(item.firstName, item.lastName, item.email));
  }

  getOrCreateList() {
    // Create list if not available
    return this.mc.getList();
  }

  syncContacts(list_id, contacts) {
    return this.mc.upsertContacts(list_id, contacts);
  }
}

module.exports.Syncer = Syncer;
