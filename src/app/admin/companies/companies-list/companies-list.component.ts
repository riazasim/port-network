import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { CompaniesDeleteModalComponent } from '../companies-delete-modal/companies-delete-modal.component';
import { LocationModel } from 'src/app/core/models/location.model';
import {PageEvent} from "@angular/material/paginator";
import {BehaviorSubject} from "rxjs";
import {CompaniesImportModalComponent} from "../companies-import-modal/companies-import-modal.component";
import { CompanyModel } from 'src/app/core/models/company.model';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['name', 'addrStreet', 'addrStreetNo', 'addrCity', 'addrCountry', 'addrZipCode', 'addrCoordinates', 'actions'];
    dataSource: CompanyModel[] = [];
    originalSource: CompanyModel[] = [];
    appliedFilters: any = {};

    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

  constructor(private readonly dialogService: MatDialog,
              private readonly companyService: CompanyService,
              private readonly cd: ChangeDetectorRef) {
                this.retrieveCompanies();
               }
    retrieveCompanies(): void {
        this.pageIndex=0;
        this.pageSize=5;

        let data={
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.companyService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.length=response.noTotal;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        //  console.log("API call");
        let data={
          "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

            "length": event.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.companyService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

  openDeleteModal(id: number) {
    this.dialogService.open(CompaniesDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
              this.isLoading$.next(true);
              this.companyService.delete(id).subscribe(() => {
              this.retrieveCompanies();
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
        case 'addrStreet': return compare(a.addrStreet, b.addrStreet, isAsc);
        case 'addrStreetNo': return compare(a.addrStreetNo, b.addrStreetNo, isAsc);
        case 'addrCounty': return compare(a.addrCounty, b.addrCounty, isAsc);
        case 'addrCity': return compare(a.addrCity, b.addrCity, isAsc);
        case 'addrCountry': return compare(a.addrCountry, b.addrCountry, isAsc);
        case 'addrZipCode': return compare(a.addrZipCode, b.addrZipCode, isAsc);
        case 'addrCoordinates': return compare(a.addrCoordinates, b.addrCoordinates, isAsc);
        default: return 0;
      }
    });
  }
    openImportModal(): void {
        this.isLoading$.next(true);
        this.dialogService.open(CompaniesImportModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isImported) => {
                    if (isImported) {
                        this.retrieveCompanies();
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }
}
