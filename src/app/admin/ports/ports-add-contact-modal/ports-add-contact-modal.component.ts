import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { PortCustomField } from 'src/app/core/models/port.model';

@Component({
  selector: 'app-ports-add-contact-modal',
  templateUrl: './ports-add-contact-modal.component.html',
  styleUrls: ['./ports-add-contact-modal.component.scss']
})
export class PortAddContactModalComponent {
  contact: ContactsModel|null;
  contactId: number|null = null;
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {
                contact: ContactsModel, 
                contacts: ContactsModel[],
                customFieldPortData: PortCustomField[],
                portData: CustomFieldModel[]
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
    this.dialogRef.close({ contact: this.contact, customFieldPortData: this.data.customFieldPortData });
  }

}
