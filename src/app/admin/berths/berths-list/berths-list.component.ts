import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { compare } from 'src/app/shared/utils/sort.function';
import { BerthsDeleteModalComponent } from '../berths-delete-modal/berths-delete-modal.component';
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { BerthsImportModalComponent } from "../berths-import-modal/berths-import-modal.component";
import { BerthService } from 'src/app/core/services/berth.service';
import { BerthModel } from 'src/app/core/models/berth.model';

@Component({
  selector: 'app-berths-list',
  templateUrl: './berths-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BerthsListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns: string[] = ['name', 'status', 'addrCoordinates', 'length', 'width', 'depth', 'actions'];
  dataSource: BerthModel[] = [];
  originalSource: BerthModel[] = [];
  appliedFilters: any = {};

  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly berthService: BerthService,
    private readonly cd: ChangeDetectorRef) {
    this.retrieveBerths();
  }


  retrieveBerths(): void {

    this.pageIndex = 0;
    this.pageSize = 5;

    let data = {
      "start": this.pageIndex,
      "length": this.pageSize,
      "filters": ["", "", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.berthService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.length = response.noTotal;
      this.isLoading$.next(false);
      this.cd.detectChanges();
    })
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading$.next(true);
    let data = {
      "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

      "length": event.pageSize,
      "filters": ["", "", "", "", "", ""],
      "order": [{ "dir": "DESC", "column": 0 }]
    }
    this.berthService.pagination(data).subscribe(response => {
      this.dataSource = response.items;
      this.originalSource = response.items;
      this.isLoading$.next(false);
      this.cd.detectChanges();
    })
  }

  openDeleteModal(id: number) {
    this.dialogService.open(BerthsDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.berthService.delete(id).subscribe(() => {
              this.retrieveBerths();
              this.cd.detectChanges();
            })
          }
        }
      });
  }

  applyFilter(target: any, column: string, isMultipleSearch = false): void {
    if (target.value) {
      if (isMultipleSearch) {
        this.appliedFilters['name'] = target.value;
        this.appliedFilters['status'] = target.value;
        // this.appliedFilters['port'] = target.value;
        this.appliedFilters['length'] = target.value;
        this.appliedFilters['width'] = target.value;
        this.appliedFilters['depth'] = target.value;
      } else {
        this.appliedFilters[column] = target.value;
      }
    } else {
      if (isMultipleSearch) {
        delete this.appliedFilters['name']
        delete this.appliedFilters['status']
        // delete this.appliedFilters['port']
        delete this.appliedFilters['length']
        delete this.appliedFilters['width']
        delete this.appliedFilters['depth']
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
            el['status'].toLowerCase().includes(this.appliedFilters['status'].toLowerCase()) ||
            // el['port'].toLowerCase().includes(this.appliedFilters['port'].toLowerCase()) ||
            el['length'].toLowerCase().includes(this.appliedFilters['length'].toLowerCase()) ||
            el['width'].toLowerCase().includes(this.appliedFilters['width'].toLowerCase())  ||
          el['depth'].toLowerCase().includes(this.appliedFilters['depth'].toLowerCase());

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
        case 'addrCoordinates': return compare(a.addrCoordinates, b.addrCoordinates, isAsc);
        // case 'port': return compare(a.port, b.port, isAsc);
        case 'length': return compare(a.length, b.length, isAsc);
        case 'width': return compare(a.width, b.width, isAsc);
        case 'depth': return compare(a.depth, b.depth, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  redirectAddBerth(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
  openImportModal(): void {
    this.isLoading$.next(true);
    this.dialogService.open(BerthsImportModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isImported) => {
          if (isImported) {
            this.retrieveBerths();
          } else {
            this.isLoading$.next(false);
          }
        }
      });
  }
}
