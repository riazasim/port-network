import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PortAddContactModalComponent } from '../ports-add-contact-modal/ports-add-contact-modal.component';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { PortCustomField, PortModel } from 'src/app/core/models/port.model';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-ports-add-edit',
  templateUrl: './ports-add-edit.component.html'
})
export class PortsAddEditComponent implements OnInit {
  portForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  ports$: BehaviorSubject<PortModel|null> = new BehaviorSubject<PortModel|null>(null);
  id: number;
  contacts: ContactsModel[] = [];
  listContacts: ContactsModel[] = [];
  customFieldPortData: PortCustomField[] = [];
  portData: CustomFieldModel[]|undefined;
  constructor(private fb: UntypedFormBuilder,
              private portService: PortService,
              private router: Router,
              private readonly dialogService: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.portService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.ports$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  clearImgPreview(): void {
    const port = this.ports$.value;
    if (port) {
      port.imgPreview = null as any;
    }
    this.portForm.get('imgPreview')?.patchValue(null);
  }

  initForm(data: PortModel = <PortModel>{}): void {
    this.portForm = this.fb.group({
      //portId: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      addrStreet: this.fb.control(data?.addrStreet || '', [Validators.required]),
      addrStreetNo: this.fb.control(data?.addrStreetNo || '', [Validators.required]),
      addrCity: this.fb.control(data?.addrCity || '', [Validators.required]),
      addrCountry: this.fb.control(data?.addrCountry || '', [Validators.required]),
      addrCounty: this.fb.control(data?.addrCounty || '', [Validators.required]),
      addrZipCode: this.fb.control(data?.addrZipCode || '', [Validators.required]),
      addrTimezone: this.fb.control(data?.addrTimezone || 'Buchrest'),
      contacts: this.fb.control(data?.contacts || []),
      imgPreview: this.fb.control(data?.imgPreview || ''),
     // customFields: this.fb.control(data?.customFields, []),
    });
  }

  setImgPreview(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.portForm.get('imgPreview')?.patchValue(target.files.item(0));
    }
  }

  openAddContactModal(contact?: ContactsModel): void {
    this.dialogService.open(PortAddContactModalComponent, {
      disableClose: true,
      data: {
        contact,
        contacts: [...this.listContacts],
        portData: this.portData,
        customFieldPortData: [...this.customFieldPortData]
      }
    }).afterClosed()
      .subscribe({
        next: (body: { contact: ContactsModel, customFieldPortData: PortCustomField[] }) => {
          if (body?.contact) {
            this.isLoading$.next(true);
            this.contacts.push(body?.contact);
            this.contacts = [...this.contacts];
            if (body?.customFieldPortData) {
              this.customFieldPortData = [...body.customFieldPortData];
            }
            this.isLoading$.next(false);
          }
        }
      });
  }

  removeContact(index: number): void {
    this.contacts.splice(index, 1);
  }

  savePort(): void {
    if (this.id) {
      this.portService.edit(this.id, this.parseData(this.portForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.portService.create(this.portForm.value).subscribe(() => {
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  parseData(port: any): any {
    const data = {...port};
    if (!data.imgPreview) {
      delete data.imgPreview;
    }
    return port;
  }
}
