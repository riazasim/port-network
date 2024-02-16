import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CompanyAddContactModalComponent } from '../companies-add-contact-modal/companies-add-contact-modal.component';
import { CompanyCustomField, CompanyModel, ContactsModel } from 'src/app/core/models/company.model';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-companies-add-edit',
  templateUrl: './companies-add-edit.component.html'
})
export class CompaniesAddEditComponent implements OnInit {
  companyForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  company$: BehaviorSubject<CompanyModel|null> = new BehaviorSubject<CompanyModel|null>(null);
  id: number;
  contactsList: ContactsModel[] = [];
  customFieldCompanyData: CompanyCustomField[] = [];
  companyData: CustomFieldModel[]|undefined;
  constructor(private fb: UntypedFormBuilder,
              private companyService: CompanyService,
              private router: Router,
              private readonly dialogService: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
    this.retrieveContacts();
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
      //companyId: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      addrStreet: this.fb.control(data?.addrStreet || '', [Validators.required]),
      addrStreetNo: this.fb.control(data?.addrStreetNo || '', [Validators.required]),
      addrCity: this.fb.control(data?.addrCity || '', [Validators.required]),
      addrCountry: this.fb.control(data?.addrCountry || '', [Validators.required]),
      addrCounty: this.fb.control(data?.addrCounty || '', [Validators.required]),
      addrZipCode: this.fb.control(data?.addrZipCode || '', [Validators.required]),
      addrTimezone: this.fb.control(data?.addrTimezone || ''),
      contacts: this.fb.control(data?.contacts || []),
      imgPreview: this.fb.control(data?.imgPreview || ''),
     // customFields: this.fb.control(data?.customFields, []),
    });
  }

  setImgPreview(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.companyForm.get('imgPreview')?.patchValue(target.files.item(0));
    }
  }

  retrieveContacts(){
          this.companyService.addCompanyContact({
            "companyId": 1,
            "contacts":[
                {"name":"Umar", "capacity":44,"occupiedCapacity":33,"client":"Waqar Sahu","product":"New Product"},
                {"name":"Umar", "capacity":44,"occupiedCapacity":33,"client":"Waqar Sahu","product":"New Product"},
                {"name":"Umar", "capacity":44,"occupiedCapacity":33,"client":"Waqar Sahu","product":"New Product"}
    ]
          }).subscribe(response =>{
            console.log(response,'contacts');
        })
  }

  removeContact(index: number): void {
    this.contactsList.splice(index, 1);
  }

  saveLocation(): void {
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
