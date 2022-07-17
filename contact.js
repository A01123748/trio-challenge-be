class Contact {
  constructor(firstName, lastName, emailAddress, status = 'subscribed') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email_address = emailAddress;
    this.merge_fields = { FNAME: firstName, LNAME: lastName };
    this.status = status;
  }
}

module.exports.Contact = Contact;
