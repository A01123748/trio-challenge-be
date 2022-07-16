class Contact{
    constructor(firstName, lastName, email_address, status = "subscribed"){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email_address = email_address;
        this.merge_fields= {FNAME: firstName, LNAME: lastName};
        this.status = status;
    }
}

module.exports.Contact = Contact;