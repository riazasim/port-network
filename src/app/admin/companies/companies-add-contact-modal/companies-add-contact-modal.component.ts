import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { PortCustomField } from 'src/app/core/models/port.model';
import { CompanyCustomField } from 'src/app/core/models/company.model';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-companies-add-contact-modal',
  templateUrl: './companies-add-contact-modal.component.html',
  styleUrls: ['./companies-add-contact-modal.component.scss']
})
export class CompanyAddContactModalComponent {
  contact: any|null;
  contactId: number|null = null;
  contactList: any
  constructor(private readonly dialogRef: MatDialogRef<any>,
              private readonly companyService: CompanyService,
              @Inject(MAT_DIALOG_DATA) public data: {
                contact: any, 
                contacts: any[],
                customFieldCompanyData: CompanyCustomField[],
                companyData: CustomFieldModel[]
              }) {
                this.retriveContacts()
                if (this.data.contact) {
                  this.contactId = <number>this.data.contact.id;
                  this.setContact({ target: { value: <number>this.data.contact.id }} as any)
                }
  }

  setContact(event: Event): void {
    const contact = this.data.contacts.find(p => p.id === +(event.target as any).value);
    this.contact = {...<any>contact};
  //   this.contactService.pagination({
  //     "start": 0,
  //     "length": 0,
  //     "filters": ["","","","","","","","",""],
  //     "order": [{"dir": "DESC", "column": 0}]
  // }).subscribe(response =>{
  //   this.portList = response.items
  // })
  }
  retriveContacts(){
    this.companyService.pagination({
      "start": 0,
      "length": 0,
      "filters": ["","","","","","","","",""],
      "order": [{"dir": "DESC", "column": 0}]
  }).subscribe(response =>{
    console.log(response,'contacts')
    this.contactList = response.items
  })
  }
  

  resetContact(): void {
    this.contact = null;
    this.contactId = null;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close({ contact: this.contact, customFieldCompanyData: this.data.customFieldCompanyData });
  }

}
