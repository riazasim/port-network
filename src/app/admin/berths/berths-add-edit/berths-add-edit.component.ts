import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { BerthModel } from 'src/app/core/models/berth.model';
import { PortModel } from 'src/app/core/models/port.model';
import { BerthService } from 'src/app/core/services/berth.service';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-berths-add-edit',
  templateUrl: './berths-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BerthsAddEditComponent implements OnInit {
  berthForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  berth$: BehaviorSubject<BerthModel | null> = new BehaviorSubject<BerthModel | null>(null);
  id: number;
  portId: number | null;
  ports: PortModel[] = [];
  creatingNewPort: boolean = true;
  constructor(private fb: UntypedFormBuilder,
    private berthService: BerthService,
    private readonly portService: PortService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.subscribeForQueryParams();
    this.retrievePorts();
  }
  
  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.creatingNewPort = false;
      this.berthService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.berth$.next({ ...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: BerthModel = <BerthModel>{}): void {
    this.berthForm = this.fb.group({
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      portId: this.fb.control(data?.port?.id || '', [Validators.required]),
      length: this.fb.control(data?.length || '', [Validators.required]),
      // width: this.fb.control(data?.width || '', [Validators.required]),
      depth: this.fb.control(data?.depth || '', [Validators.required]),
      status: this.fb.control({ value: data?.status || 'Activate', disabled: this.creatingNewPort }, [Validators.required]),
      // status: this.fb.control(data?.status || 'Activate', [Validators.required]),
    });

  }
  onPortChange(value: any) {
    this.subscribeForPortChanges(value.target.value);
  }

  subscribeForPortChanges(data: any): void {
    this.berthForm.get('portId')?.setValue(data);
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

  saveBerth(): void {
    this.isLoading$.next(true);
    if (this.id) {
      this.berthService.edit(this.id, this.parseData(this.berthForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.berthService.create(this.parseData(this.berthForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: BerthModel): BerthModel {
    if (!data.berthId) delete data.berthId;
    return data;
  }
}
