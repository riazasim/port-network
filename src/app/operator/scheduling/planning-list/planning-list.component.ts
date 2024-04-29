﻿import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { PlanningService } from 'src/app/core/services/planning.service';
import { PlanningModel } from 'src/app/core/models/planning.model';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { SchedulingImportModalComponent } from '../scheduling-import-modal/scheduling-import-modal.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-planning-list',
    templateUrl: './planning-list.component.html',
    styleUrl: './planning-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningListComponent implements OnChanges {
    @Output() triggerOpenLogs: EventEmitter<{ view: string, id: number, planning: PlanningModel, modal: string }> = new EventEmitter();
    @Output() onPaginate: EventEmitter<any> = new EventEmitter();
    @Output() retrievePlannings: EventEmitter<any> = new EventEmitter();
    @Input() isTableLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    @Input() userRole: string;
    @Input() plannings: PlanningModel[] = [];
    @Input() length: number;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['id', 'manevre', 'vesselId', 'berth', 'products', 'estimatedTimeArrival', 'relativeTimeArrival', 'delay', 'coordinates', 'shipmentStatus', 'actions'];
    dataSource: PlanningModel[] = [];
    originalSource: PlanningModel[] = [];
    appliedFilters: any = {};
    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;

    constructor(private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly cd: ChangeDetectorRef,
        private readonly authService: AuthService
    ) {
        this.dataSource = this.plannings;
        this.originalSource = this.plannings;
        this.isLoading$.next(false)
        this.isTableLoading$.next(false);
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = this.plannings;
        this.originalSource = this.plannings;
        this.isLoading$.next(false)
    }

    retrievePlanningList(filterDate: string): void {
        this.retrievePlannings.emit();
        // this.pageIndex = 0;
        // this.pageSize = 5;
        // let data = {
        //     "start": this.pageIndex,
        //     "length": this.pageSize,
        //     "filters": [filterDate, "", "", "", "", ""],
        //     "order": [{ "dir": "DESC", "column": 0 }]
        // }
        // this.planningService.pagination(data).subscribe({
        //     next: response => {
        //         this.dataSource = response.items;
        //         this.originalSource = response.items;
        //         this.length = response.noTotal;
        //         this.cd.detectChanges();
        //         this.isLoading$.next(false);
        //     }
        // })
    }

    onPaginateChange(event: PageEvent) {
        this.onPaginate.emit({ start: event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex, length: event.pageSize })
        // let data = {
        //     "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
        //     "length": event.pageSize,
        //     "filters": ["", "", "", "", "", ""],
        //     "order": [{ "dir": "DESC", "column": 0 }]
        // }
        // this.planningService.pagination(data).subscribe({
        //     next: response => {
        //         this.dataSource = response.items;
        //         this.originalSource = response.items;
        //         this.cd.detectChanges();
        //     }
        // })
    }

    OnEmit(row: any, modal: string) {
        this.triggerOpenLogs.emit({ view: 'view', id: row.planning.id, planning: row, modal: modal })
    }

    openDeleteModal(id: number) {
        this.dialogService.open(SchedulingDeleteModalComponent, {
            disableClose: true,
            data: { "id": id, "title": "planning" }
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isTableLoading$.next(true);
                        this.planningService.delete(id).subscribe(() => {
                            this.retrievePlanningList('');
                            this.cd.detectChanges();
                        })
                    }
                }
            });
    }

    applyFilter(target: any, column: string, isMultipleSearch = false): void {
        if (target.value) {
            if (isMultipleSearch) {
                this.appliedFilters['contactFirstName'] = target.value;
                this.appliedFilters['contactLastName'] = target.value;
                this.appliedFilters['contactPhoneRegionCode'] = target.value;
                this.appliedFilters['contactPhone'] = target.value;
                this.appliedFilters['contactEmail'] = target.value;
            } else {
                this.appliedFilters[column] = target.value;
            }
        } else {
            if (isMultipleSearch) {
                delete this.appliedFilters['contactFirstName']
                delete this.appliedFilters['contactLastName']
                delete this.appliedFilters['contactPhoneRegionCode']
                delete this.appliedFilters['contactPhone']
                delete this.appliedFilters['contactEmail']
            } else {
                delete this.appliedFilters[column];
            }
        }

        this.dataSource = this.originalSource.filter((el: any) => {
            if (Object.keys(this.appliedFilters).length) {
                let expression = false;
                if (isMultipleSearch && target.value) {
                    expression =
                        el['contactFirstName'].concat(' ', el['contactLastName']).toLowerCase().includes(this.appliedFilters['contactFirstName'].toLowerCase()) ||
                        el['contactLastName'].concat(' ', el['contactFirstName']).toLowerCase().includes(this.appliedFilters['contactLastName'].toLowerCase()) ||
                        el['contactPhoneRegionCode'].toLowerCase().includes(this.appliedFilters['contactPhoneRegionCode'].toLowerCase()) ||
                        el['contactPhone'].toLowerCase().includes(this.appliedFilters['contactPhone'].toLowerCase()) ||
                        el['contactEmail'].toLowerCase().includes(this.appliedFilters['contactEmail'].toLowerCase());

                    return expression;
                } else {
                    for (let filter in this.appliedFilters) {
                        expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                        if (!expression) break;
                    }

                    return expression;
                }
            }

            return isMultipleSearch ? true : el[column].includes(target.value);
        });
    }

    sortData(sort: Sort): void {
        const data = this.dataSource.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource = data;
            return;
        }

        this.dataSource = data.sort((a: any, b: any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return compare(a.id, b.id, isAsc);
                case 'manevre': return compare(a.manevre, b.manevre, isAsc);
                case 'vesselId': return compare(a.vesselId, b.vesselId, isAsc);
                case 'berth': return compare(a.berth, b.berth, isAsc);
                case 'products': return compare(a.products, b.products, isAsc);
                case 'estimatedTimeArrival': return compare(a.estimatedTimeArrival, b.estimatedTimeArrival, isAsc);
                case 'relativeTimeArrival': return compare(a.relativeTimeArrival, b.relativeTimeArrival, isAsc);
                case 'delay': return compare(a.delay, b.delay, isAsc);
                case 'coordinates': return compare(a.coordinates, b.coordinates, isAsc);
                case 'shipmentStatus': return compare(a.shipmentStatus, b.shipmentStatus, isAsc);
                default: return 0;
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
                        this.retrievePlanningList('');
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }
}
