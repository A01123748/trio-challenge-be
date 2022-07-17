require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_marketing');
const { Contact } = require('./contact');

const { MAILCHIMP_API_KEY } = process.env;
const { MAILCHIMP_API } = process.env;
const { MAILCHIMP_LIST_NAME } = process.env;

class Mailchimp {
  constructor() {
    this.mailchimp = mailchimp.setConfig({
      apiKey: MAILCHIMP_API_KEY,
      server: MAILCHIMP_API,
    });
  }

  ping = () => mailchimp.ping.get();

  getList = async () => {
    const footerContactInfo = {
      company: 'Trio',
      address1: '675 Ponce de Leon Ave NE',
      address2: 'Suite 5000',
      city: 'Atlanta',
      state: 'GA',
      zip: '30308',
      country: 'US',
    };

    const campaignDefaults = {
      from_name: MAILCHIMP_LIST_NAME,
      from_email: 'eliseo.fuentes.garcia@gmai..com',
      subject: 'JS Developer',
      language: 'EN_US',
    };
    // Verify list already exists
    const lists = await mailchimp.lists.getAllLists();
    const filteredLists = lists.lists.filter((list) => list.name === MAILCHIMP_LIST_NAME);
    // let list_id = filteredLists.length > 0 ? filteredLists[0].id : undefined;
    const exists = filteredLists.length > 0;

    let createListRes;
    if (!exists) {
      createListRes = await mailchimp.lists.createList({
        name: MAILCHIMP_LIST_NAME,
        contact: footerContactInfo,
        permission_reminder: 'permission_reminder',
        email_type_option: true,
        campaign_defaults: campaignDefaults,
      });
    } else createListRes = filteredLists[0];
    return createListRes;
  };

  upsertContacts = async (list_id, contacts) => {
    let offset = 0;
    const count = 50;
    let listMembers = await mailchimp.lists.getListMembersInfo(list_id, { count, offset });
    let contactsToUpdate = contacts;
    const filterArray = [];
    while (listMembers?.members?.length) {
      listMembers.members.forEach((member) => {
        const foundContact = contacts.find((contact) => contact.email_address === member.email_address);
        if (!foundContact) {
          // If contact is not found on MockAPI, add to the list and remove/unsubscribe
          contactsToUpdate.push(new Contact(member.merge_fields?.FNAME, member.merge_fields?.LNAME, member.email_address, 'unsubscribed'));
        }
        /* Uncomment lines below to validate if members are updated and DON'T need to be synced up
        */
        // else if(member.merge_fields.FNAME === foundContact.firstName && member.merge_fields.LNAME === foundContact.lastName && member.email_address === foundContact.email_address && member.status === foundContact.status){
        //         // Nothing to update
        //         filterArray.push(member.email_address);
        //     }
      });
      offset += count;
      listMembers = await mailchimp.lists.getListMembersInfo(list_id, { count, offset });
    }
    contactsToUpdate = contactsToUpdate.filter(({ email_address }) => !filterArray.includes(email_address));

    const addMissingMembersRes = await mailchimp.lists.batchListMembers(list_id, { members: contactsToUpdate, update_existing: true });
    return addMissingMembersRes;
  };
}

module.exports.Mailchimp = Mailchimp;
