import {ChangeDetectionStrategy, Component} from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { VehicleModel } from 'src/app/core/models/vehicle.model';

@Component({
  selector: "app-ships-add-edit",
  templateUrl: './ships-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsAddEditComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  shipForm: FormGroup;
  VehicleTypeEnum: string[] = ['Boat', 'Cruise'];
  id: number;
  displayedColumns: string[] = ['licensePlate', 'type', 'status', 'loadingCapacity'];
  appliedFilters: any = {};
  constructor(private readonly fb: UntypedFormBuilder,
              private readonly vehicleService: VehicleService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      combineLatest([
        this.vehicleService.get(this.id)
      ]).subscribe(([vehicle]: [VehicleModel]) => {
        this.initForm(vehicle);
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
      /*this.dockService.list({}).subscribe((response: DockModel[]) => {
        this.originalSource = response;
        this.docks$.next(response);
        this.initForm();
        this.isLoading$.next(false);
      });*/
    }
  }

  applyFilter(target: any, column: string): void {
    if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }
  }

  initForm(data: VehicleModel = <VehicleModel>{}): void {
    this.shipForm = this.fb.group({
      licensePlate: this.fb.control(data?.licensePlate || '', [Validators.required]),
      type: this.fb.control(data?.type || '', [Validators.required]),
      status: this.fb.control(data?.status || '', [Validators.required]),
      loadingCapacity: this.fb.control(data?.loadingCapacity|| '', [Validators.required]),
    });
  }

  saveVehicle(): void {
    this.isLoading$.next(true);
    if (this.id) {
      this.vehicleService.edit(this.id,this.parseData(this.shipForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.vehicleService.create(this.parseData(this.shipForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: VehicleModel): VehicleModel {
    if (!data.vehicleId) delete data.vehicleId;
    return data;
  }
}
