import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingImportModalComponent } from '../scheduling-import-modal/scheduling-import-modal.component';
import { SchedulingPlanModalComponent } from '../scheduling-plan-modal/scheduling-plan-modal.component';
import { PlanningService } from 'src/app/core/services/planning.service';
import { UpdatePlanningDock } from 'src/app/core/models/planning.model';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { MatSidenav } from '@angular/material/sidenav';
import { ComvexPlanningList, SchedulingModel, SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { getTimeSlot } from '../scheduling-box.helper';
import { OperationModel } from 'src/app/core/models/operation.model';
import { SchedulingUpgradeWarningModalComponent } from '../scheduling-upgrade-warning-modal/scheduling-upgrade-warning-modal.component';
import { SchedulingCancelModalComponent } from '../scheduling-cancel-modal/scheduling-cancel-modal.component';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { SchedulingRejectModalComponent } from '../scheduling-reject-modal/scheduling-reject-modal.component';
import { SchedulingCheckinCheckoutModalComponent } from '../scheduling-checkin-checkout-modal/scheduling-checkin-checkout-modal.component';
import { VehicleListComponent } from '../../vehicle/vehicle-list/vehicle-list.component';
import { ComvexListComponent } from '../../vehicle/comvex-list/comvex-list.component';
import { ComvexListReorderComponent } from '../../vehicle/comvex-list-reorder/comvex-list-reorder.component';
import { FilterModel, FilterTypeENum } from '../scheduling-search-bar/scheduling-search-bar.component';
import { PageSettingsModel } from 'src/app/core/models/page.model';
import defaultPageSettings from '../../../core/constants/page.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(VehicleListComponent) vehicleListComponent: VehicleListComponent;
  @ViewChild(ComvexListComponent) comvexListComponent: ComvexListComponent;
  @ViewChild(ComvexListReorderComponent) comvexListReorderComponent: ComvexListReorderComponent;
  readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  readonly cardLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly componentName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly isTableView$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isToggleOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isMobileCardList$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isTimeSlotFilterMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly editPlanning$: BehaviorSubject<SchedulingPreviewModel|null> = new BehaviorSubject<SchedulingPreviewModel|null>(null);
  readonly hasReachedEndPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly sortBy$: BehaviorSubject<number> = new BehaviorSubject<number>(12);
  readonly sortOrder$: BehaviorSubject<string> = new BehaviorSubject('DESC');
  readonly isComvexReorder$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 

  plannings: SchedulingPreviewModel[] = []
  filterDate: Date = new Date();
  filterTypeEnum = FilterTypeENum;

  logId: number;
  
  toggleRef: MatSnackBarRef<TextOnlySnackBar>;
  statuses: StatusListModel[] = [];
  operations: OperationModel[] = [];

  pageSettings: PageSettingsModel = {...defaultPageSettings};
  appliedFilters: any = {};

  innerWidth: number;
  readonly isComvexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isUmexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  comvexSubscription: Subscription;
  umexSubscription: Subscription;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.applyMobileView();
  }

  constructor(private readonly dialogService: MatDialog,
              private readonly planningService: PlanningService,
              private readonly snackBar: MatSnackBar,
              private readonly statusListService: StatusListService,
              private readonly cd: ChangeDetectorRef,
              private readonly organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.retrieveSIDStatuses();
    this.subscribeForLocationChange(true);
    this.subscribeForSortByChanges(true);
    this.subscribeForSortOrderChanges(true);
    this.subscribeForOrganizationChanges();
  }

  ngAfterViewInit(): void {
    this.innerWidth = window.innerWidth;
    this.applyMobileView();
  }

  subscribeForOrganizationChanges(): void {
    if (!this.comvexSubscription)
    this.comvexSubscription = this.organizationService.isComvexOrganization$.subscribe((isComvex) => {
      this.isComvexOrganization$.next(isComvex);
    })

    if (!this.umexSubscription)
    this.umexSubscription = this.organizationService.isUmexOrganization$.subscribe((isUmex) => {
      this.isUmexOrganization$.next(isUmex);
    })
  }

  subscribeForSortByChanges(isFirstLoad: boolean = false): void {
    this.sortBy$.subscribe((response) => {
      this.appliedFilters['column'] = response;
      if (!isFirstLoad) this.retrievePlannings();
      isFirstLoad = false;
    });
  }

  subscribeForSortOrderChanges(isFirstLoad: boolean = false): void {
    this.sortOrder$.subscribe((dir) => {
      this.appliedFilters['dir'] = dir;
      if (!isFirstLoad) this.retrievePlannings();
      isFirstLoad = false;
    });
  }

  setTimeSlotFilterMode(event: { key: FilterModel, value: string }): void {
    if (!event.value) {
      this.isTimeSlotFilterMode$.next(false);
    } else {
      this.isTimeSlotFilterMode$.next(true);
    }
    this.setSingleSearchFilter(event);
  }

  setSingleSearchFilter(event: { key: FilterModel, value: string }): void {
    this.isLoading$.next(true);
    let key;

    if (event.key.prev) {
      let prev;
      switch (event.key.prev) {
        case FilterTypeENum.sId: prev = 'sId'; break;
        case FilterTypeENum.truckLicensePlateFront: prev = 'truckLicensePlateFront'; break;
        case FilterTypeENum.truckLicensePlateBack: prev = 'truckLicensePlateBack'; break;
        case FilterTypeENum.dockName: prev = 'dockName'; break;
        case FilterTypeENum.status: prev = 'status'; break;
        case FilterTypeENum.timeSlot: prev = 'timeSlot'; break;
      }
      delete this.appliedFilters[prev];
    }

    switch (event.key.curr) {
      case FilterTypeENum.sId: key = 'sId'; break;
      case FilterTypeENum.truckLicensePlateFront: key = 'truckLicensePlateFront'; break;
      case FilterTypeENum.truckLicensePlateBack: key = 'truckLicensePlateBack'; break;
      case FilterTypeENum.dockName: key = 'dockName'; break;
      case FilterTypeENum.status: key = 'status'; break;
      case FilterTypeENum.timeSlot: key = 'timeSlot'; break;
    }
    /**
      * key
      * 0 = SID filter
      * 1 = truckLicensePlateFront filter
      * 2 = truckLicensePlateBack filter
      * 3 = dockName filter
      * 4 = status name filter
      * 5 = schedulingDate filter
    */
    this.appliedFilters[key] = event.value;
    this.retrievePlannings();
  }

  applyMobileView(): void {
    if (this.innerWidth < 993) {
      if (!this.isMobileCardList$.getValue()) this.isMobileCardList$.next(true);
    } else {
      if (this.isMobileCardList$.getValue()) this.isMobileCardList$.next(false);
    }
  }

  onBottomReached(): void {
    this.pageSettings.start = this.pageSettings.start + 20;
    this.retrievePlannings(true);
  }

  subscribeForLocationChange(isFirstLoad: boolean = false): void {
    this.organizationService.organization.subscribe((response) => {
      if (response) {
        if (!isFirstLoad) this.isLoading$.next(true);
        this.retrievePlannings();
      } else {
        this.isLoading$.next(false);
      }
      isFirstLoad = false;
    });
  }

  retrieveSIDStatuses(): void {
    this.statusListService.listSid().subscribe({
      next: (list: StatusListModel[]) => {
        this.statuses = list;
      }
    })
  }

  toggleSelectMode(): void {
    if (this.isToggleOpened$.value) return;
    this.isToggleOpened$.next(true);
    this.toggleRef = this.snackBar.open('SID has been copied, please select the cell to schedule the planning!', 'Exit', {
      panelClass: ['tw-bg-white']
    })
    
    this.toggleRef.afterDismissed().subscribe(() => {
      navigator.clipboard.writeText("");
      this.isToggleOpened$.next(false);
      this.cd.detectChanges();
    })
  }

  drop(event: any): void {
    const planning = this.isToggleOpened$.value ? this.plannings.find(p => p.id === this.logId) : event.item.data;
    const data = event.container.data;
    
    if (event.previousContainer === event.container) {
    } else {
      this.isLoading$.next(true);
      const day = this.filterDate.getDate() < 10 ? `0${this.filterDate.getDate()}` : this.filterDate.getDate();
      const month = this.filterDate.getMonth() < 10 ? `0${this.filterDate.getMonth() + 1}` : this.filterDate.getMonth() + 1;
      const year = this.filterDate.getFullYear();
      const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
      if (!plannedStatus) {
        this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
          verticalPosition: 'top', 
        })
        return;
      }
      this.updatePlanning(<any>{
        assigningDate: `${year}-${month}-${day}`,
        hour: this.getHour(data.index),
        planning: planning.id, 
        dock: data.dock,
        statusListStatus: <number>plannedStatus?.id,
        timeSlot: this.getHour(data.index)
      });
    }
  }

  getHour(index: number): string {
    return `${index < 10 ? '0'+ index+':00:00' : index+':00:00'}`;
  }

  handleDateChange(event: string | Date): void {
    this.filterDate = <Date>event;
    this.plannings.length = 0;
    this.isLoading$.next(true);
    this.retrievePlannings();
  }

  handleOpenPlanUpgradeWarning(): void {
    this.sidenav.close();
    this.dialogService.open(SchedulingUpgradeWarningModalComponent, {
      disableClose: true
    }).afterClosed().subscribe(() => null)
  }

  updatePlanning(data: UpdatePlanningDock): void {
    this.planningService.updatePlanningToDock(data).subscribe({
      next: () => {
        if (this.isTableView$.getValue() && this.isComvexOrganization$.getValue()) {
          if (this.isComvexReorder$.getValue()) {
            this.comvexListReorderComponent.retrievePlannings();
          }
          if (!this.isComvexReorder$.getValue()) {
            this.comvexListComponent.retrievePlannings();
          }
          this.isLoading$.next(false);
        } else if (this.isTableView$.getValue() && !this.isComvexOrganization$.getValue()) {
          this.vehicleListComponent.retrievePlannings();
          this.isLoading$.next(false);
        } else {
          this.retrievePlannings();
        }
        this.snackBar.open('SID has been scheduled!', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top', 
        })
        if (this.isToggleOpened$.value) this.logId = 0;
        this.isToggleOpened$.next(false);
      },
      error: (body) => {
        if (this.isToggleOpened$.value) this.logId = 0;
        this.isToggleOpened$.next(false);
        handleError(this.snackBar, body, this.isLoading$)
      }
    });
  }

  openImportModal(): void {
      this.isLoading$.next(true);
      this.dialogService.open(SchedulingImportModalComponent, {
        disableClose: true,
        data: {}
      }).afterClosed()
        .subscribe({
          next: (isImported) => {
            if (isImported) {
              this.retrievePlannings();
            } else {
              this.isLoading$.next(false);
            }
          }
        });
  }

  openCancellationModal(planning: SchedulingPreviewModel): void {
    this.dialogService.open(SchedulingCancelModalComponent, {
      disableClose: true,
      data: planning
    }).afterClosed()
      .subscribe({
        next: (isCancel) => {
          if (isCancel) {
            this.isLoading$.next(true);
            this.cancelPlanning(<number>planning.id);
          }
        }
      });
  }

  openRejectModal(planning: SchedulingPreviewModel): void {
    this.dialogService.open(SchedulingRejectModalComponent, {
      disableClose: true,
      data: planning
    }).afterClosed()
      .subscribe({
        next: (isCancel) => {
          if (isCancel) {
            this.isLoading$.next(true);
            this.rejectPlanning(<number>planning.id);
          }
        }
      });
  }

  cancelPlanning(planningId: number): void {
    this.planningService.cancel(planningId).subscribe({
      next: () => {
        this.snackBar.open('SID cancelled!', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top', 
        })
        this.retrievePlannings();
      },
      error: (body) => {
        handleError(this.snackBar,  body, this.isLoading$);
      }
    })
  }

  rejectPlanning(planningId: number): void {
    this.planningService.reject(planningId).subscribe({
      next: () => {
        this.snackBar.open('SID rejected!', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top', 
        })
        this.retrievePlannings();
      },
      error: (body) => {
        handleError(this.snackBar,  body, this.isLoading$);
      }
    })
  }

  openCheckinModal(planning: SchedulingPreviewModel): void {
    this.dialogService.open(SchedulingCheckinCheckoutModalComponent, {
      disableClose: true,
      data: {
        planning,
        type: 'checkin'
      }
    }).afterClosed()
      .subscribe({
        next: (checkIn) => {
          if (checkIn) {
            this.isLoading$.next(true);
            this.checkInPlanning(<number>planning.id);
          }
        }
      });
  }

  openCheckOutModal(planning: SchedulingPreviewModel): void {
    this.dialogService.open(SchedulingCheckinCheckoutModalComponent, {
      disableClose: true,
      data: {
        planning,
        type: 'checkout'
      }
    }).afterClosed()
      .subscribe({
        next: (checkIn) => {
          if (checkIn) {
            this.isLoading$.next(true);
            this.checkOutPlanning(<number>planning.id);
          }
        }
      });
  }

  checkInPlanning(id: number): void {
    this.planningService.checkin(id).subscribe({
      next: () => {
      this.snackBar.open('SID checked-in!', 'Success', {
        duration: 3000,
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
        verticalPosition: 'top', 
      })
      this.retrievePlannings();
    }, error: (body) => {
      handleError(this.snackBar,  body, this.isLoading$);
    }});
  }

  checkOutPlanning(id: number): void {
    this.planningService.checkout(id).subscribe({
      next: () => {
      this.snackBar.open('SID checked-out!', 'Success', {
        duration: 3000,
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
        verticalPosition: 'top', 
      })
      this.retrievePlannings();
    }, error: (body) => {
      handleError(this.snackBar,  body, this.isLoading$);
    }});
  }

  retrievePlannings(fetchMore: boolean = false): void {
    if (fetchMore && this.hasReachedEndPage$.getValue() || this.isTableView$.getValue()) {
      return;
    }

    if (!fetchMore) this.pageSettings = {...defaultPageSettings};
    if (fetchMore) this.cardLoading$.next(true);

    this.planningService.list({ schedulingDate: getFormattedDate(this.filterDate), ...this.appliedFilters, ...this.pageSettings })
                        .subscribe((response: SchedulingModel[]) => {
      if (fetchMore) {
        if (!response.length) {
          this.hasReachedEndPage$.next(true);
          this.cardLoading$.next(false);
          return;
        }
        this.plannings.push(...<SchedulingPreviewModel[]>response);
        this.cardLoading$.next(false);
      } else {
        this.plannings = <SchedulingPreviewModel[]>response;
        this.hasReachedEndPage$.next(false);
      }

      this.isLoading$.next(false);
    });
  }

  openPlanEditModal(event: any): void {
    const planning = this.editPlanning$.getValue();
    const data = event.container.data;

    this.dialogService.open(SchedulingPlanModalComponent, {
      disableClose: true,
      data: {
        planning,
        ...data,
        timeSlot: getTimeSlot(data.index),
        date: this.filterDate
      }
    }).afterClosed()
      .subscribe({
        next: (response) => {
          if (response) {
            this.isLoading$.next(true);
            const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
            if (!plannedStatus) {
              this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
                duration: 3000,
                horizontalPosition: 'center',
                panelClass: ['error-snackbar'],
                verticalPosition: 'top', 
              })
              return;
            }
            this.updatePlanning(<any>{
              assigningDate: getFormattedDate(this.filterDate),
              hour: this.getHour(data.index),
              planning: <number>(<SchedulingModel>planning).id,
              dock: data.dock,
              statusListStatus: plannedStatus.id,
              timeSlot: this.getHour(data.index)
            });
          } else {
            this.toggleRef.dismiss();
          }
        },
        error: (body) => {
          handleError(this.snackBar, body, this.isLoading$);
        }
      });
  }

  openPlanModal(event: any): void {
    const planning = this.isToggleOpened$.value ? this.editPlanning$.getValue() : event.item.data;
    const data = event.container.data;

    this.dialogService.open(SchedulingPlanModalComponent, {
      disableClose: true,
      data: {
        planning,
        ...data,
        timeSlot: getTimeSlot(data.index),
        date: this.filterDate
      }
    }).afterClosed()
      .subscribe({
        next: (response) => {
          if (response) {
            this.isLoading$.next(true);
            const plannedStatus = this.statuses.find(s => s.name.toLowerCase() === 'planned');
            if (!plannedStatus) {
              this.snackBar.open('Please add "Planned" status in Lists module.', 'Warning', {
                duration: 3000,
                horizontalPosition: 'center',
                panelClass: ['error-snackbar'],
                verticalPosition: 'top', 
              })
              return;
            }
            this.updatePlanning(<any>{
              assigningDate: getFormattedDate(this.filterDate),
              hour: this.getHour(data.index),
              planning: planning.id,
              dock: data.dock,
              statusListStatus: plannedStatus.id,
              timeSlot: this.getHour(data.index)
            });
          } else {
            this.toggleRef.dismiss();
          }
        }
      });
  }

  toggleSidenav(data: { view: string, id: number, planning?: SchedulingPreviewModel }) {
    switch (data.view) {
      case 'copy':
        this.logId = data.id;
        this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
        this.toggleSelectMode();
        this.componentName$.next(data.view);
        break;
      case 'view': 
        this.logId = data.id;
        const planning = data.planning ? data.planning : this.plannings.find(p => p.id === data.id) || null;
        this.editPlanning$.next(planning)
        this.componentName$.next(data.view);
        this.sidenav.open();
        break;
      case 'mess':
        this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
        this.componentName$.next(data.view);
        this.sidenav.open();
        break;
      case 'edit':
        this.editPlanning$.next(this.plannings.find(p => p.id === data.id) || null)
        this.componentName$.next(data.view);
        this.isLoading$.next(false);
        this.sidenav.open();
        break;
    }
  }

  openDeleteModal(planning: SchedulingPreviewModel|ComvexPlanningList|null): void {
    if (!planning) return;

    this.dialogService.open(SchedulingDeleteModalComponent, {
      disableClose: true,
      data: {
        sId: planning.sId
      }
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.planningService.delete(<number>planning.id).subscribe({
              next: () => {
              this.snackBar.open('SID deleted!', 'Success', {
                duration: 3000,
                horizontalPosition: 'center',
                panelClass: ['success-snackbar'],
                verticalPosition: 'top', 
              })
              this.retrievePlannings();
            }, error: (body) => handleError(this.snackBar, body, this.isLoading$)})
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.comvexSubscription) this.comvexSubscription.unsubscribe();
    if (this.umexSubscription) this.umexSubscription.unsubscribe();
  }
}
