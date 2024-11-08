import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';
import { PortsDeleteModalComponent } from '../ports-delete-modal/ports-delete-modal.component';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { PortsImportModalComponent } from "../ports-import-modal/ports-import-modal.component";
import { PortModel } from 'src/app/core/models/port.model';
import { PortService } from 'src/app/core/services/port.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-ports-list',
    templateUrl: './ports-list.component.html',
    styleUrl: './ports-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortsListComponent {
    @ViewChild('sidenav') sidenav: MatSidenav;
    readonly componentName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['name', 'addrCity', 'addrCountry', 'addrZipCode', 'addrCoordinates', 'actions'];
    // originalColumns: string[] = ['id', 'name', 'addrStreet', 'addrNumber', 'addrCounty', 'addrCity', 'addrCountry', 'addrZipCode', 'contact', 'actions'];
    dataSource: PortModel[] = [];
    originalSource: PortModel[] = [];
    appliedFilters: any = {};

    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(private readonly dialogService: MatDialog,
        private readonly portService: PortService,
        private readonly cd: ChangeDetectorRef,
        private readonly router: Router,
        private readonly route: ActivatedRoute,) {
        this.retrievePorts();
    }


    retrievePorts(): void {

        this.pageIndex = 0;
        this.pageSize = 5;

        let data = {
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.portService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.length = response.noTotal;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    redirectAddPort(): void {
        this.router.navigate(['../add'], { relativeTo: this.route });
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        let data = {
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

            "length": event.pageSize,
            "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.portService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    OnEmit(row: any) {
        console.log(this.sidenav)
        this.sidenav.open()
    }

    openDeleteModal(id: number) {
        this.dialogService.open(PortsDeleteModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.portService.delete(id).subscribe(() => {
                            this.retrievePorts();
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
                case 'name': return compare(a.name, b.name, isAsc);
                // case 'addrStreet': return compare(a.addrStreet, b.addrStreet, isAsc);
                // case 'addrStreetNo': return compare(a.addrStreetNo, b.addrStreetNo, isAsc);
                case 'addrCounty': return compare(a.addrCounty, b.addrCounty, isAsc);
                case 'addrCity': return compare(a.addrCity, b.addrCity, isAsc);
                case 'addrCountry': return compare(a.addrCountry, b.addrCountry, isAsc);
                case 'addrZipCode': return compare(a.addrZipCode, b.addrZipCode, isAsc);
                default: return 0;
            }
        });
    }
    openImportModal(): void {
        this.isLoading$.next(true);
        this.dialogService.open(PortsImportModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isImported) => {
                    if (isImported) {
                        this.retrievePorts();
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }
}
