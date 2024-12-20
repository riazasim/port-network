export type PortModel = {
    id?: number; 
    portId?: number;
    name: string;
    addrCoordinates: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    // addrTimezone?:string | '';
    contacts: ContactsModel[] | [];
    // zones: ZonesModel[] | [];
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

export interface ContactsModel {
    id?: number;
   contactId?: number;
   firstName:string;
   lastName: string;
   phoneNumber: string;
//    client: string;
//    product: string;
}
export interface ZonesModel {
    id?: number;
   name:string;
   coordinates:string;
}

export interface ContactsTable {
    items: ContactsModel[];
    noFiltered: number;
    noTotal: number;
}