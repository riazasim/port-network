import { ContactsModel } from "./contact.model";
export type CompanyModel = {
    portId?: number;
    name: string;
    addrCoordinates: string;
    addrStreet: string;
    addrNumber: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone:string;
    contacts?: ContactsModel;
    imgPreview: File;
}

export interface CompanyTable {
    items: CompanyModel[];
    noFiltered: number;
    noTotal: number;
}

export interface CompanyCustomField {
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