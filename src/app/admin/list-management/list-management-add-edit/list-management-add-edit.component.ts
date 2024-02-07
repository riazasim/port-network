import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PartnerModel } from '../../../core/models/partner.model';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { StatusListService } from 'src/app/core/services/status-list.service';

@Component({
  selector: 'app-list-management-list-add-edit',
  templateUrl: './list-management-add-edit.component.html',
})
export class ListManagementAddEditComponent {
  isLoading: boolean = true;
  listForm: FormGroup;
  lists: StatusListModel[] = [];
  id: number;

  constructor(private readonly fb: UntypedFormBuilder,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly listService: StatusListService,
              private readonly cd: ChangeDetectorRef) {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        // this.listService.get(params.id).subscribe(response => {
        //   this.id = params.id;
        //   this.initForm(response);
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // });
      } else {
        this.initForm();
        this.isLoading = false;
        this.cd.detectChanges();
      }
    })
  }

  updateListId(event: MatAutocompleteSelectedEvent): void {
    this.listForm.get('name')?.patchValue(event.option.value.name);
    this.listForm.get('id')?.patchValue(event.option.value.id);
  }

  initForm(data: StatusListModel = <StatusListModel>{}): void {
    this.listForm = this.fb.group({
      name: this.fb.control(data?.name || '', [Validators.required]),
      type: this.fb.control(data?.type || '', [Validators.required]),
      color: this.fb.control(data?.color || '', [Validators.required]),
      description: this.fb.control(data?.description || '', [Validators.required]),
    });
  }

  saveList(): void {
    this.isLoading = true;
    if (this.listForm.get('id')?.getRawValue()) {
      // this.listService.edit(this.parseData(this.listForm.value)).subscribe(() => {
      //   this.isLoading = false;
      //   this.router.navigate(['../../success'], { relativeTo: this.route });
      // });
    } else {
      // this.listService.create(this.parseData(this.listForm.value)).subscribe(() => {
      //   this.isLoading = false;
      //   this.router.navigate(['../success'], { relativeTo: this.route });
      // });
    }
  }

  private parseData(data: PartnerModel): PartnerModel {
    if (!data.id) delete data.id;
    data.status = data.status as any === "true" ? true : false;
    return data;
  }
}
