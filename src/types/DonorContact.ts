export interface Contact{
    contactID?: number;
    donorID : number;
    contact_name: string;
    contact_phone: string;
    email: string;
    alternate_phone: string;
    fax: string;
}

export type ContactInput = Omit<Contact, "contactID">;