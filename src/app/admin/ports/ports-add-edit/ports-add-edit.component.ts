﻿import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocationModel } from 'src/app/core/models/location.model';
import { LocationService } from 'src/app/core/services/location.service';
import { PortAddContactModalComponent } from '../ports-add-contact-modal/ports-add-contact-modal.component';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingCustomField } from 'src/app/core/models/scheduling.model';
import { PortCustomField } from 'src/app/core/models/port.model';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';

@Component({
  selector: 'app-ports-add-edit',
  templateUrl: './ports-add-edit.component.html'
})
export class PortsAddEditComponent implements OnInit {
  locationForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  location$: BehaviorSubject<LocationModel|null> = new BehaviorSubject<LocationModel|null>(null);
  id: number;
  contacts: ContactsModel[] = [];
  listContacts: ContactsModel[] = [];
  customFieldPortData: PortCustomField[] = [];
  portData: CustomFieldModel[]|undefined;
  constructor(private fb: UntypedFormBuilder,
              private locationService: LocationService,
              private router: Router,
              private readonly dialogService: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.locationService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.location$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  clearImgPreview(): void {
    const location = this.location$.value;
    if (location) {
      location.imgPreview = null as any;
    }
    this.locationForm.get('imgPreview')?.patchValue(null);
  }

  initForm(data: LocationModel = <LocationModel>{}): void {
    this.locationForm = this.fb.group({
      //locationId: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      addrStreet: this.fb.control(data?.addrStreet || '', [Validators.required]),
      addrNumber: this.fb.control(data?.addrNumber || '', [Validators.required]),
      addrCity: this.fb.control(data?.addrCity || '', [Validators.required]),
      addrCountry: this.fb.control(data?.addrCountry || '', [Validators.required]),
      addrCounty: this.fb.control(data?.addrCounty || '', [Validators.required]),
      addrZipCode: this.fb.control(data?.addrZipCode || '', [Validators.required]),
      addrTimezone: this.fb.control(data?.addrTimezone || '', [Validators.required]),
      contactFirstName: this.fb.control(data?.contactFirstName || '', [Validators.required]),
      contactLastName: this.fb.control(data?.contactLastName || '', [Validators.required]),
      contactPhone : this.fb.control(data?.contactPhone || '', [Validators.required]),
      contactPhoneRegionCode: this.fb.control(data?.contactPhoneRegionCode || '', [Validators.required]),
      contactEmail: this.fb.control(data?.contactEmail || '', [Validators.required, Validators.email]),
      comments: this.fb.control(data?.comments || '', []),
      imgPreview: this.fb.control(data?.imgPreview, []),
     // customFields: this.fb.control(data?.customFields, []),
    });
  }

  setImgPreview(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.locationForm.get('imgPreview')?.patchValue(target.files.item(0));
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
      this.locationService.edit(this.id, this.parseData(this.locationForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.locationService.create(this.locationForm.value).subscribe(() => {
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  parseData(location: any): any {
    const data = {...location};
    if (!data.imgPreview) {
      delete data.imgPreview;
    }
    return location;
  }
}
