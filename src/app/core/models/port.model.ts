import { ContactsModel } from "./contact.model";
export type PortModel = {
    id?: number;
    name: string;
    addrCoordinates: string;
    addrStreet: string;
    addrStreetNo: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone?:string | '';
    contacts: ContactsModel | [];
    imgPreview: File;
}

export interface PortTable {
    items: PortModel[];
    noFiltered: number;
    noTotal: number;
}

export interface PortCustomField {
    customField: number;
    name: string;
    value: string | string[] | number;
}

// export type ContactsModel = {
//    contactsIs?: number;
//    name:string;
//    capacity: number;
//    occupiedCapacity: number;
//    client: string;
//    product: string;
// }