import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CompanyModel, ContactsModel } from 'src/app/core/models/company.model';
import { PortModel } from 'src/app/core/models/port.model';
import { CompanyService } from 'src/app/core/services/company.service';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-companies-add-edit',
  templateUrl: './companies-add-edit.component.html',
  styleUrls: ['companies-add-edit.component.scss']
})
export class CompaniesAddEditComponent implements OnInit {
  companyForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  company$: BehaviorSubject<CompanyModel|null> = new BehaviorSubject<CompanyModel|null>(null);
  id: number;
  portId: number | null;
  ports: PortModel[] = [];
  constructor(private fb: UntypedFormBuilder,
              private companyService: CompanyService,
              private readonly portService: PortService,
              private router: Router,
              private route: ActivatedRoute,
              private readonly cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
    this.retrievePorts();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.companyService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.company$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  clearImgPreview(): void {
    const company = this.company$.value;
    if (company) {
      company.imgPreview = null as any;
    }
    this.companyForm.get('imgPreview')?.patchValue(null);
  }

  initForm(data: CompanyModel = <CompanyModel>{}): void {
    this.companyForm = this.fb.group({
      // companyId: this.fb.control(data?.companyId),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      portId: this.fb.control(data?.port?.id || '', [Validators.required]),
      addrStreet: this.fb.control(data?.addrStreet || '', [Validators.required]),
      addrStreetNo: this.fb.control(data?.addrStreetNo || '', [Validators.required]),
      addrCity: this.fb.control(data?.addrCity || '', [Validators.required]),
      addrCountry: this.fb.control(data?.addrCountry || '', [Validators.required]),
      addrCounty: this.fb.control(data?.addrCounty || '', [Validators.required]),
      addrZipCode: this.fb.control(data?.addrZipCode || '', [Validators.required]),
      addrTimezone: this.fb.control(data?.addrTimezone || 'Buchrest'),
      contacts: this.fb.array([]),
      imgPreview: this.fb.control(data?.imgPreview || ''),
    });

  if (data.contacts) {
    data.contacts.forEach(contact => {
      this.addContact(contact);
    });
  }
}

get contacts(): any {
  return this.companyForm.get('contacts');
}

addContact(contact?: ContactsModel): void {
  const newContact = this.fb.group({
    name: [contact?.name || '', Validators.required],
    capacity: [contact?.capacity || '', Validators.required],
    occupiedCapacity: [contact?.occupiedCapacity || '', Validators.required],
    client: [contact?.client || '', Validators.required],
    product: [contact?.product || '', Validators.required],
  });
  this.contacts.push(newContact);
}

removeContact(index: number): void {
  const companyId = this.company$?.value?.id;
  const contactsArray = this.company$?.value?.contacts;

  if (companyId && contactsArray && contactsArray.length > 0) {
    const contactId = contactsArray[index]?.id; // Get the ID of the contact at the specified index
    if (contactId !== null && contactId !== undefined && contactId > -1) {
      this.companyService.deleteContact(companyId, contactId).subscribe({
        next: () => {
          console.log('Contact deleted successfully');
          this.contacts.removeAt(index); // Remove the contact from the form array
          this.cd.detectChanges();
          return this.companyForm.get('contacts');
        },
        error: error => {
          console.error('Error deleting contact:', error);
          // Handle error, such as showing an error message to the user
        }
      });
    }
  } else {
    this.contacts.removeAt(index);
  }
}

onPortChange(value: any) {
  this.subscribeForPortChanges(value.target.value);
} 

subscribeForPortChanges(data: any): void {
  this.companyForm.get('portId')?.setValue(data);
}

retrievePorts() {
  this.portService.pagination({
    "start": 0,
    "length": 0,
    "filters": ["", "", "", "", "", "", "", "", ""],
    "order": [{ "dir": "DESC", "column": 0 }]
  }).subscribe(response => {
    this.ports = response.items
    this.cd.detectChanges();
  })
}

  setImgPreview(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.companyForm.get('imgPreview')?.patchValue(target.files.item(0));
    }
  }
  saveCompany(): void {
    if (this.id) {
      this.companyService.edit(this.id, this.parseData(this.companyForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.companyService.create(this.companyForm.value).subscribe(() => {
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  parseData(company: any): any {
    const data = {...company};
    if (!data.imgPreview) {
      delete data.imgPreview;
    }
    return company;
  }
}
