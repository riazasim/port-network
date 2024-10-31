import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { compare } from 'src/app/shared/utils/sort.function';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { IntegrationDeleteModalComponent } from '../integration-delete-modal/integration-delete-modal.component';
import { IntegrationService } from 'src/app/core/services/integration.service';

@Component({
  selector: 'app-integration-list',
  templateUrl: './integration-list.component.html',
  styleUrl: './integration-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['name', 'portName', 'category', 'subCategory', 'actions'];
  dataSource: any[] = [];
  originalSource: any[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly integrationService: IntegrationService,
    private readonly cd: ChangeDetectorRef) {
    this.retrieveIntegrations();
  }
  


  retrieveIntegrations(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = 
    {
      "portId": 59,
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["","","","","","","",""],
      "order": [{"dir": "DESC", "column": 0}]
  }
    this.integrationService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length = response.noTotal;
      this.isLoading$.next(false);
      this.cd.detectChanges();
    })
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading$.next(true);
    let data = 
    {
      "portId": 59,
      "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
      "length": event.pageSize,
      "filters": ["","","","","","","",""],
      "order": [{"dir": "DESC", "column": 0}]
  }
    this.integrationService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
      this.cd.detectChanges();
    })
  }

  openDeleteModal(id: number) {
    this.dialogService.open(IntegrationDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.integrationService.delete(id).subscribe(() => {
              this.retrieveIntegrations();
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
        this.appliedFilters['portName'] = target.value;
        this.appliedFilters['category'] = target.value;
        this.appliedFilters['subCategory'] = target.value;
      } else {
        this.appliedFilters[column] = target.value;
      }
    } else {
      if (isMultipleSearch) {
        delete this.appliedFilters['name']
        delete this.appliedFilters['portName']
        delete this.appliedFilters['category']
        delete this.appliedFilters['subCategory']
      } else {
        delete this.appliedFilters[column];
      }
    }

    this.dataSource = this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        if (isMultipleSearch && target.value) {
          expression =
            el['name'].toLowerCase().includes(this.appliedFilters['name'].toLowerCase()) ||
            el['portName'].toLowerCase().includes(this.appliedFilters['portName'].toLowerCase()) ||
            el['category'].includes(this.appliedFilters['category']) ||
            el['subCategory'].includes(this.appliedFilters['subCategory']);

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


  // filterByStatus(event: any): void {
  //   this.isLoading$.next(true);
  //   switch (event.target.value) {
  //     case 'Active':
  //       this.dataSource = this.originalSource.filter(el => el.status === 'Active');
  //       break;
  //     case 'Service':
  //       this.dataSource = this.originalSource.filter(el => el.status === 'Service');
  //       break;
  //     case 'Closed':
  //       this.dataSource = this.originalSource.filter(el => el.status === 'Closed');
  //       break;
  //     default:
  //       this.dataSource = [...this.originalSource]
  //   }
  //   this.isLoading$.next(false);
  // }

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
        case 'portName': return compare(a.portName, b.portName, isAsc);
        case 'category': return compare(a.category, b.category, isAsc);
        case 'subCategory': return compare(a.subCategory, b.subCategory, isAsc);
        default: return 0;
      }
    });
  }

  redirectAddBerth(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
  // openImportModal(): void {
  //   this.isLoading$.next(true);
  //   this.dialogService.open(IntegrationImportModalComponent, {
  //     disableClose: true,
  //     data: {}
  //   }).afterClosed()
  //     .subscribe({
  //       next: (isImported) => {
  //         if (isImported) {
  //           this.retrieveIntegrations();
  //         } else {
  //           this.isLoading$.next(false);
  //         }
  //       }
  //     });
  // }
}
