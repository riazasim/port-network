import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { AreaImportModalComponent } from '../area-import-modal/area-import-modal.component';
import { AreaDeleteModalComponent } from '../area-delete-modal/area-delete-modal.component';
import { AreaService } from 'src/app/core/services/area.service';
import { AreaModel } from 'src/app/core/models/area.model';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
    selector: 'app-area-list',
    templateUrl: './area-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['name', 'actions'];
    dataSource: AreaModel[] = [];
    originalSource: AreaModel[] = [];
    appliedFilters: any = {};
    portId: string | null;
    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(private readonly dialogService: MatDialog,
        private readonly areaService: AreaService,
        private readonly cd: ChangeDetectorRef,
        private readonly router: Router,
        private readonly organizationService: OrganizationService,
        private readonly route: ActivatedRoute,) {
            this.portId = organizationService.getPort();
        this.retrieveArea();
    }


    retrieveArea(): void {

        this.pageIndex = 0;
        this.pageSize = 5;

        let data = {
            "portId":this.portId,
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.areaService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.length = response.noTotal;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    redirectAddArea(): void {
        this.router.navigate(['../add'], { relativeTo: this.route });
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        let data = {
            "portId":this.portId,
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

            "length": event.pageSize,
            "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.areaService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    openDeleteModal(id: number) {
        this.dialogService.open(AreaDeleteModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.areaService.delete(id).subscribe(() => {
                            this.retrieveArea();
                            this.cd.detectChanges();
                        })
                    }
                }
            });
    }

    applyFilter(target: any, column: any, isMultipleSearch = false): void {
        if (target.value) {
          if (isMultipleSearch) {
            this.appliedFilters['name'] = target.value;
          } else {
            this.appliedFilters[column] = target.value;
          }
        } else {
          if (isMultipleSearch) {
            delete this.appliedFilters['name']
          } else {
            delete this.appliedFilters[column];
          }
        }
    
        this.dataSource = this.originalSource.filter((el: any) => {
          if (Object.keys(this.appliedFilters).length) {
            let expression = false;
            if (isMultipleSearch && target.value) {
              expression =
                el['name'].toLowerCase().includes(this.appliedFilters['name'].toLowerCase());
    
              return expression;
            } else {
              for (let filter in this.appliedFilters) {
                expression = el[filter].toString().toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
                if (!expression) break;
              }
    
              return expression;
            }
          }
    
          return isMultipleSearch ? true : el[column].toString().includes(target.value);
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
                default: return 0;
            }
        });
    }
    openImportModal(): void {
        this.isLoading$.next(true);
        this.dialogService.open(AreaImportModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isImported) => {
                    if (isImported) {
                        this.retrieveArea();
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }
}
