import { PortModel } from "./port.model";

// import { ContactsModel } from "./contact.model";
export interface CompanyModel {
    id?: number;
    companyId?: number;
    name: string;
    addrCoordinates: string;
    port:PortModel;
    addrStreet: string;
    addrStreetNo: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone?:string | '';
    contacts: ContactsModel[] | [];
    countryCode: string;
    companyVatNumber: string;
    isTypeShipOwner: boolean;
    isTypeAgentCompany: boolean;
    isTypeManeuveringCompany: boolean;
    isTypePortOperator: boolean;
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

export interface ContactsModel {
    id?: number;
   contactId?: number;
   firstName:string;
   lastName: string;
   phoneRegionCode: string;
   phoneNumber: string;
//    client: string;
//    product: string;
}

export interface ContactsTable {
    items: ContactsModel[];
    noFiltered: number;
    noTotal: number;
}