export type PortModel = {
    id?: number; 
    portId?: number;
    name: string;
    addrCoordinates: string;
    addrStreet: string;
    addrStreetNo: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone?:string | '';
    contacts: ContactsModel[] | [];
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
   name:string;
   capacity: number;
   occupiedCapacity: number;
   client: string;
   product: string;
}

export interface ContactsTable {
    items: ContactsModel[];
    noFiltered: number;
    noTotal: number;
}