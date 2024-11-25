﻿import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { PlanningService } from 'src/app/core/services/planning.service';
import { PlanningModel } from 'src/app/core/models/planning.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';


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
    @Input() transportMode: string;
    @Input() plannings: any;
    @Input() length: number;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['rid', 'sid', 'manevre', 'vesselId', 'berth', 'products', 'estimatedTimeArrival', 'relativeTimeArrival', 'delay', 'coordinates', 'shipmentStatus'];
    dataSource: any[] = [];
    originalSource: any[] = [];
    appliedFilters: any = {};
    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    logId: number;
    logModal: string;

    constructor(private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly cd: ChangeDetectorRef,
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
    }

    onPaginateChange(event: PageEvent) {
        this.onPaginate.emit({ start: event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex, length: event.pageSize })
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
}
