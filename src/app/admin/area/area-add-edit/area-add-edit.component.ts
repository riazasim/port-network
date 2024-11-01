import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { AreaService } from 'src/app/core/services/area.service';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-area-add-edit',
  templateUrl: './area-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaAddEditComponent implements OnInit {
  areaForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  area$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  id: number;
  portId: string | null;
  creatingNewPort: boolean = true;
  constructor(private fb: UntypedFormBuilder,
    private areaService: AreaService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly organizationService: OrganizationService,
    private readonly cd: ChangeDetectorRef) {
      this.portId = organizationService.getPort();
  }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }
  
  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.creatingNewPort = false;
      this.areaService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.area$.next({ ...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: any = <any>{}): void {
    this.areaForm = this.fb.group({
      portId: this.fb.control(data?.port?.id || this.portId, [Validators.required]),
      name: this.fb.control(data?.name || '', [Validators.required]),
    });

  }

  saveArea(): void {
    this.isLoading$.next(true);
    if (this.id) {
      this.areaService.edit(this.id, this.parseData(this.areaForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.areaService.create(this.parseData(this.areaForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: any): any {
    if (!data.berthId) delete data.berthId;
    return data;
  }
}
