import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ContactsModel } from 'src/app/core/models/contact.model';
import { PortModel } from 'src/app/core/models/port.model';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-ports-add-edit',
  templateUrl: './ports-add-edit.component.html',
  styleUrls: ['./ports-add-edit.component.scss']
})
export class PortsAddEditComponent implements OnInit {
  portForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  ports$: BehaviorSubject<PortModel|null> = new BehaviorSubject<PortModel|null>(null);
  id: number;
  constructor(private fb: UntypedFormBuilder,
              private portService: PortService,
              private router: Router,
              private readonly cd: ChangeDetectorRef,
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
      // portId: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
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
    return this.portForm.get('contacts');
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
    const portId = this.ports$?.value?.id;
    const contactsArray = this.ports$?.value?.contacts;
  
    if (portId && contactsArray && contactsArray.length >= index) {
      const contactId = contactsArray[index]?.id; // Get the ID of the contact at the specified index
      if (contactId) {
        this.portService.deleteContact(portId, contactId).subscribe({
          next: () => {
            console.log('Contact deleted successfully');
            this.contacts.removeAt(index); // Remove the contact from the form array
            this.cd.detectChanges();
            return this.portForm.get('contacts');
          },
          error: error => {
            console.error('Error deleting contact:', error);
            // Handle error, such as showing an error message to the user
          }
        });
      }
    }
  }

  setImgPreview(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.portForm.get('imgPreview')?.patchValue(target.files.item(0));
    }
  }
  // removeContact(index: number): void {
  //   this.contacts.splice(index, 1);
  // }

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
