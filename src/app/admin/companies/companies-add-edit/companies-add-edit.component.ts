import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CompanyModel, ContactsModel } from 'src/app/core/models/company.model';
import { PortModel } from 'src/app/core/models/port.model';
import { CompanyService } from 'src/app/core/services/company.service';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-companies-add-edit',
  templateUrl: './companies-add-edit.component.html',
  styleUrls: ['companies-add-edit.component.scss']
})
export class CompaniesAddEditComponent implements OnInit {
  companyForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  @ViewChild('stepper', { static: false }) matStepper: MatStepper;
  company$: BehaviorSubject<CompanyModel | null> = new BehaviorSubject<CompanyModel | null>(null);
  id: number;
  portId: string | null;
  isLinear = true;
  constructor(private fb: UntypedFormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly organizationService: OrganizationService,
    private readonly cd: ChangeDetectorRef) { 
      this.portId = organizationService.getPort();
    }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  next(index: any): void {
    if (this.matStepper) {
      this.matStepper.selectedIndex = index;
    }
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.companyService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.company$.next({ ...response })
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
      portId: this.fb.control(data?.port?.id || this.portId, [Validators.required]),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      addrStreet: this.fb.control(data?.addrStreet || '', [Validators.required]),
      addrStreetNo: this.fb.control(data?.addrStreetNo || '', [Validators.required]),
      addrCity: this.fb.control(data?.addrCity || '', [Validators.required]),
      addrCountry: this.fb.control(data?.addrCountry || '', [Validators.required]),
      addrCounty: this.fb.control(data?.addrCounty || '', [Validators.required]),
      addrZipCode: this.fb.control(data?.addrZipCode || '', [Validators.required]),
      countryCode: this.fb.control(data?.countryCode || '', [Validators.required]),
      companyVatNumber: this.fb.control(data?.companyVatNumber || '', [Validators.required]),
      isTypeShipOwner: this.fb.control(data?.isTypeShipOwner || ''),
      isTypeAgentCompany: this.fb.control(data?.isTypeAgentCompany || ''),
      isTypeManeuveringCompany: this.fb.control(data?.isTypeManeuveringCompany || ''),
      isTypePortOperator: this.fb.control(data?.isTypePortOperator || ''),
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
      firstName: [contact?.firstName || '', Validators.required],
      lastName: [contact?.lastName || '', Validators.required],
      phoneRegionCode: [contact?.phoneRegionCode || '', Validators.required],
      phoneNumber: [contact?.phoneNumber || '', Validators.required],
    });
    this.contacts.push(newContact);
  }

  removeContact(index: number): void {
    const companyId = this.company$?.value?.id;
    const contactsArray = this.company$?.value?.contacts;

    if (companyId && contactsArray && contactsArray.length > 0) {
      const contactId = contactsArray[index]?.id; 
      if (contactId !== null && contactId !== undefined && contactId > -1) {
        this.companyService.deleteContact(companyId, contactId).subscribe({
          next: () => {
            console.log('Contact deleted successfully');
            this.contacts.removeAt(index); 
            this.cd.detectChanges();
            return this.companyForm.get('contacts');
          },
          error: error => {
            console.error('Error deleting contact:', error);
          }
        });
      }
    } else {
      this.contacts.removeAt(index);
    }
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
    const data = { ...company };
    if (!data.imgPreview) {
      delete data.imgPreview;
    }
    return company;
  }
}
