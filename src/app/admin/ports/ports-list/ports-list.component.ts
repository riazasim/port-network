﻿import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { PortsDeleteModalComponent } from '../ports-delete-modal/ports-delete-modal.component';
import { LocationModel } from 'src/app/core/models/location.model';
import {PageEvent} from "@angular/material/paginator";
import {BehaviorSubject} from "rxjs";
import {PortsImportModalComponent} from "../ports-import-modal/ports-import-modal.component";
import { PortModel } from 'src/app/core/models/port.model';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-ports-list',
  templateUrl: './ports-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortsListComponent {
 // isLoading: boolean = true;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['name', 'addrStreet', 'addrStreetNo', 'addrCity', 'addrCountry', 'addrZipCode', 'addrCoordinates', 'actions'];
  // originalColumns: string[] = ['id', 'name', 'addrStreet', 'addrNumber', 'addrCounty', 'addrCity', 'addrCountry', 'addrZipCode', 'contact', 'actions'];
  //displayedColumns: string[] = [];
  // dataSource: any = []
  // originalSource: any = [];
    dataSource: PortModel[] = [];
    originalSource: PortModel[] = [];
    appliedFilters: any = {};

    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly portService: PortService,
              private readonly cd: ChangeDetectorRef) {
                this.retrievePorts();
               }

  // retrieveLocations(): void {
  //   this.locationService.listTable({}).subscribe((response: any[]) => {
  //     const existColumns = this.initializeColumns(response);
  //     if (existColumns) {
  //       this.dataSource = response;
  //       this.originalSource = response;
  //     }
  //     this.isLoading = false;
  //     this.cd.detectChanges();
  //   });
  // }


    retrievePorts(): void {

        this.pageIndex=0;
        this.pageSize=5;

        let data={
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.portService.pagination(data).subscribe(response => {
            //console.log(response)
            // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
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
        this.portService.pagination(data).subscribe(response => {
            // let result =(<any>response.items).map(((c: CustomFieldData) => c.attributes));
            // console.log('Api call')
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }




  // retrieveLocations(): void {
  //   this.locationService.pagination({}).subscribe((response) => {
  //     const existColumns = this.initializeColumns(response);
  //     if (existColumns) {
  //       this.dataSource = response;
  //       this.originalSource = response;
  //     }
  //     this.isLoading = false;
  //     this.cd.detectChanges();
  //   });
  // }

  // initializeColumns(response: LocationModel[]) {
  //   if (!response.length || !Object.keys(response[0]).length) {
  //     return false;
  //   }
  //
  //   let contactAdded = false;
  //   this.displayedColumns = [...Object.keys(response[0]), 'actions'].map(x => {
  //     if (!contactAdded && ['firstName', 'lastName', 'mobile', 'email'].includes(x)) {
  //       contactAdded = true;
  //       return 'contact';
  //     }
  //
  //     return x;
  //   }).filter(x => this.originalColumns.includes(x))
  //
  //   return true;
  // }

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
        case 'addrStreet': return compare(a.addrStreet, b.addrStreet, isAsc);
        case 'addrStreetNo': return compare(a.addrStreetNo, b.addrStreetNo, isAsc);
        case 'addrCounty': return compare(a.addrCounty, b.addrCounty, isAsc);
        case 'addrCity': return compare(a.addrCity, b.addrCity, isAsc);
        case 'addrCountry': return compare(a.addrCountry, b.addrCountry, isAsc);
        case 'addrZipCode': return compare(a.addrZipCode, b.addrZipCode, isAsc);
        default: return 0;
      }
    });
  }

  // redirectAddPort(): void {
  //   this.router.navigate(['../add'], { relativeTo: this.route });
  // }
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
