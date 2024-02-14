import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { LocationModel } from 'src/app/core/models/location.model';
import { CompanyAddContactModalComponent } from '../companies-add-contact-modal/companies-add-contact-modal.component';
import { CompanyCustomField, CompanyModel } from 'src/app/core/models/company.model';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-companies-add-edit',
  templateUrl: './companies-add-edit.component.html'
})
export class CompaniesAddEditComponent implements OnInit {
  locationForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  location$: BehaviorSubject<CompanyModel|null> = new BehaviorSubject<CompanyModel|null>(null);
  id: number;
  contacts: ContactsModel[] = [];
  listContacts: ContactsModel[] = [];
  customFieldCompanyData: CompanyCustomField[] = [];
  companyData: CustomFieldModel[]|undefined;
  constructor(private fb: UntypedFormBuilder,
              private companyService: CompanyService,
              private router: Router,
              private readonly dialogService: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.companyService.get(this.id).subscribe(async response => {
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

  initForm(data: CompanyModel = <CompanyModel>{}): void {
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
      contacts: this.fb.control(data?.contacts || ''),
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
    this.dialogService.open(CompanyAddContactModalComponent, {
      disableClose: true,
      data: {
        contact,
        contacts: [...this.listContacts],
        companyData: this.companyData,
        customFieldCompanyData: [...this.customFieldCompanyData]
      }
    }).afterClosed()
      .subscribe({
        next: (body: { contact: ContactsModel, customFieldCompanyData: CompanyCustomField[] }) => {
          if (body?.contact) {
            this.isLoading$.next(true);
            this.contacts.push(body?.contact);
            this.contacts = [...this.contacts];
            if (body?.customFieldCompanyData) {
              this.customFieldCompanyData = [...body.customFieldCompanyData];
            }
            this.isLoading$.next(false);
          }
        }
      });
  }

  removeContact(index: number): void {
    this.contacts.splice(index, 1);
  }

  saveLocation(): void {
    if (this.id) {
      this.companyService.edit(this.id, this.parseData(this.locationForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.companyService.create(this.locationForm.value).subscribe(() => {
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
