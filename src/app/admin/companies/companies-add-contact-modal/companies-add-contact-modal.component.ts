import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { PortCustomField } from 'src/app/core/models/port.model';
import { CompanyCustomField } from 'src/app/core/models/company.model';

@Component({
  selector: 'app-companies-add-contact-modal',
  templateUrl: './companies-add-contact-modal.component.html',
  styleUrls: ['./companies-add-contact-modal.component.scss']
})
export class CompanyAddContactModalComponent {
  contact: ContactsModel|null;
  contactId: number|null = null;
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {
                contact: ContactsModel, 
                contacts: ContactsModel[],
                customFieldCompanyData: CompanyCustomField[],
                companyData: CustomFieldModel[]
              }) {
                if (this.data.contact) {
                  this.contactId = <number>this.data.contact.id;
                  this.setContact({ target: { value: <number>this.data.contact.id }} as any)
                }
  }

  setContact(event: Event): void {
    const contact = this.data.contacts.find(p => p.id === +(event.target as any).value);
    this.contact = {...<ContactsModel>contact};
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
