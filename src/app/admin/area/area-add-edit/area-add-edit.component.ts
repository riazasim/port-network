import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AreaModel } from 'src/app/core/models/area.model';
import { AreaService } from 'src/app/core/services/area.service';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-area-add-edit',
  templateUrl: './area-add-edit.component.html',
  styleUrls: ['./area-add-edit.component.scss']
})
export class AreaAddEditComponent implements OnInit {
  areaForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  area$: BehaviorSubject<AreaModel|null> = new BehaviorSubject<AreaModel|null>(null);
  id: number;
  portId: string | null;
  constructor(private fb: UntypedFormBuilder,
              private areaService: AreaService,
              private router: Router,
              private readonly cd: ChangeDetectorRef,
              private readonly organizationService: OrganizationService,
              private route: ActivatedRoute) {
                this.portId = organizationService.getPort();
               }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.areaService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.area$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: AreaModel = <AreaModel>{}): void {
    this.areaForm = this.fb.group({
      portId: this.fb.control(data?.port?.id || this.portId, [Validators.required]),
      name: this.fb.control(data?.name || '', [Validators.required]),
    });
  }
    saveArea(): void {
    if (this.id) {
      this.areaService.edit(this.id, this.parseData(this.areaForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.areaService.create(this.areaForm.value).subscribe(() => {
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: AreaModel): AreaModel {
    if (!data.areaId) delete data.areaId;
    return data;
  }

}
