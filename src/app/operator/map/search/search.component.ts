import { ChangeDetectorRef, Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { MicroService } from 'src/app/core/services/micro.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    @Output() results: EventEmitter<any> = new EventEmitter()
    @Output() mapLoading$: EventEmitter<boolean> = new EventEmitter(true)
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    companies: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    departurePorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    arrivalPorts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    isContentLoading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    isDeparturePortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isArrivalPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isCompaniesLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)

    timeOptions: any[] = [
        { value: 'ridTime', name: 'RID Time' },
        { value: 'operationsTime', name: 'Operations Time' },
        { value: 'berthTime', name: 'Berth Time' },
        { value: 'WaitingTime', name: 'Waiting Time' },
        { value: 'exitTime', name: 'Exit Time' }
    ];

    timeFilterForm: FormGroup;
    companiesFilterForm: FormGroup;
    sidFilterForm: FormGroup;
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date("");
    dateVal: string;
    resultsArray: any[] = [];
    // companies: any[] = [];
    statusFilters: number[] = [];
    pageIndex: number;
    pageSize: number;
    length: number = 0;
    timeFilter: any = {};
    ports: any[] = [];
    portId = null;
    companyId: number = 0;
    arrivalPortId: number = 0;
    departurePortId: number = 0;
    departurePortStart: number = 0;
    departurePortQuery: string = "";
    selctedArrivalPortId: number = 0;
    arrivalPortStart: number = 0;
    arrivalPortQuery: string = "";
    
    companyStart: number = 0;
    companyQuery: string = "";
    

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }


    constructor(
        private readonly microService: MicroService,
        private readonly cd: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.getResults();
        this.retriveDeparturePorts();
        this.retriveArrivalPorts();
        this.retriveCompanines()
        this.initForms();
        this.OnDateChange(this.dateModal);
    }

    initForms() {
        this.initTimeFilterForm();
        this.initCompanyFiterForm();
        this.initSIDFilterForm();
    }

    // retrivePorts() {
        // this.microService.getPorts().subscribe({
        //     next: res => {
        //         res?.forEach((item: any) => {
        //             this.ports.push(item?.attributes);
        //         });
        //         this.isPortsLoading$.next(false)
        //     },
        //     error: err => {
        //         throw err;
        //     }
        // })
    // }

    // retriveCompanines() {

    //     this.microService.getCompanies(this.portId).subscribe({
    //         next: res => {
    //             res?.forEach((item: any) => {
    //                 this.companies.push(item?.attributes);
    //             });
    //             this.isCompaniesLoading$.next(false);
    //         },
    //         error: err => {
    //             throw err
    //         }
    //     })
    // }

    retriveDeparturePorts(query?: any, len?: any, portId?: any) {
            this.isContentLoading$.next(true);
            // this.selctedDeparturePortId = portId !== undefined ? Number(portId) : 0;
            this.departurePortQuery = query !== undefined ? String(query) : "";
            this.departurePortStart = len !== undefined ? Number(len) : 0; 
            const data = {
                // selectedId: this.selctedDeparturePortId,
                start: this.departurePortStart > 0 ? this.departurePortStart : 0,
                length: 20,
                filter: this.departurePortQuery,
            };
    
            this.microService.getPorts(data).subscribe({
                next: res => {
                    if (res.length > 0) {
                        let temp: any[] = [];
                        res?.forEach((item: any) => {
                            temp.push(item?.attributes);
                        });
                            this.departurePorts.next(temp)
                        
                        this.cd.detectChanges();
                    }
                    this.isContentLoading$.next(false);
                    this.isDeparturePortsLoading$.next(false);
                },
                error: err => {
                    this.isContentLoading$.next(false);
                    throw err;
                }
            })
        }
        
        retriveArrivalPorts(query?: any, len?: any, portId?: any) {
            this.isContentLoading$.next(true);
            // this.selctedArrivalPortId = portId !== undefined ? Number(portId) : 0;
            this.arrivalPortQuery = query !== undefined ? String(query) : "";
            this.arrivalPortStart = len !== undefined ? Number(len) : 0; 
            const data = {
                // selectedId: this.selctedArrivalPortId,
                start: this.arrivalPortStart > 0 ? this.arrivalPortStart : 0,
                length: 20,
                filter: this.arrivalPortQuery,
            };
    
            this.microService.getPorts(data).subscribe({
                next: res => {
                    if (res.length > 0) {
                        let temp: any[] = [];
                        res?.forEach((item: any) => {
                            temp.push(item?.attributes);
                        });
                            this.arrivalPorts.next(temp)
                        
                        this.cd.detectChanges();
                    }
                    this.isContentLoading$.next(false);
                    this.isArrivalPortsLoading$.next(false);
                },
                error: err => {
                    this.isContentLoading$.next(false);
                    throw err;
                }
            })
        }

    retriveCompanines(query?: any, len?: any): void {
        this.isContentLoading$.next(true);
        this.companyQuery = query !== undefined ? String(query) : ""
        this.companyStart += len !== undefined ? Number(len) : 0

        let data = {
            "portId": "",
            "start": this.companyStart > 0 ? this.companyStart : 0,
            "length": 20,
            "filter": this.companyQuery,
        }
        this.microService.getCompanies(data).subscribe({
            next: res => {
                if (res.length > 0) {
                    let temp: any[] = [];
                    res?.forEach((item: any) => {
                        temp.push(item?.attributes);
                    });
                    this.companies.next(temp);
                    this.cd.detectChanges();
                }
                // if (this.products.length === 0) {
                //     this.stepTwoForm.patchValue({ products: null })
                // }
                this.isContentLoading$.next(false);
            },
            error: err => {
                this.isContentLoading$.next(false);
                throw err
            }
        })
    }

    onCompaniesChange(ev: any, action: string = "search") {
        if (action === "search") {
            this.companyId = ev?.target?.value;
        }
        if (action === "delete") {
            this.companyId = 0;
            this.portId = null;
            this.initCompanyFiterForm();
            this.isCompaniesLoading$.next(true);
        }
        this.getResults();
    }

    onSIDChange(ev: any, type: string, action: string = "search") {
        if (action === "search" && type === 'ap') {
            this.arrivalPortId = ev?.target?.value;
        }
        if (action === "search" && type === 'dp') {
            this.departurePortId = ev?.target?.value;
        }
        if (this.departurePortId !== 0 && this.arrivalPortId !== 0) {
            this.getResults(this.dateVal);
        }
        if (action === "delete") {
            this.arrivalPortId = 0;
            this.departurePortId = 0;
            this.getResults();
            this.initSIDFilterForm();
            this.dateModal = new Date();
        }
    }

    onImgClick(number: number) {
        this.isActive = number;
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.sidFilterForm.patchValue({ estimatedTimeArrival : this.dateVal})
        if(this.sidFilterForm.valid){
            this.getResults(this.dateVal);
        }
    }

    formatDate(date: Date | string): string {
        let formattedDate = '';

        if (typeof date === 'string') {
            const tempDate = new Date(date);
            formattedDate = this.formatDateObject(tempDate);
        } else {
            formattedDate = this.formatDateObject(date);
        }

        return formattedDate;
    }


    OnStatusChange(value: any , action: string = 'search') {
        if(action === 'search'){
            if (this.statusFilters.includes(value)) {
                const index = this.statusFilters.indexOf(value);
                this.statusFilters.splice(index, 1);
                this.getResults();
            }
            else {
                this.statusFilters.push(value);
                this.getResults();
            }
        }
        if(action === 'delete'){
            this.statusFilters = [];
            this.getResults();
        }
    }

    OnTimeChange(action: string = 'search') {
        if (this.timeFilterForm.controls['clauseBy'].value === 'greaterThan') {
            this.timeFilterForm.patchValue({ lessThanVal: 0 });
        }
        if (this.timeFilterForm.controls['clauseBy'].value === 'lessThan') {
            this.timeFilterForm.patchValue({ greaterThanVal: 0 });
        }
        if (this.timeFilterForm.valid && action === 'search') {
            this.timeFilter = this.timeFilterForm.value;
            this.getResults()
        }
        if (action === 'delete') {
            this.timeFilter = {};
            this.initTimeFilterForm();
            this.getResults();
        }
    }

    getResults(date: any = ""): void {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        console.log(this.timeFilter)
        let data = {
            "transportMode": "WATER",
            "start": 0,
            "length": 5,
            "filters": [null, "", this.companyId, this.statusFilters, date, this.departurePortId, this.arrivalPortId, this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.mapLoading$.emit(false);
                this.results.emit(response.items);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
                this.isLoading$.next(false);
            }
        })
    }



    onPaginateChange(event: PageEvent) {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        let data = {
            "transportMode": "WATER",
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
            "length": event.pageSize,
            "filters": ["", "", "", this.statusFilters, "", "", "", this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.results.emit(response.items);
                this.mapLoading$.emit(false);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
                this.isLoading$.next(false);
            }
        })
    }

    initTimeFilterForm() {
        this.timeFilterForm = this.fb.group({
            filterByTime: this.fb.control('', [...createRequiredValidators()]),
            searchBy: this.fb.control('', [...createRequiredValidators()]),
            clauseBy: this.fb.control('between', [...createRequiredValidators()]),
            greaterThanVal: this.fb.control('', [...createRequiredValidators()]),
            lessThanVal: this.fb.control('', [...createRequiredValidators()]),
        });
    }
    initSIDFilterForm() {
        this.sidFilterForm = this.fb.group({
            estimatedTimeArrival: this.fb.control('', [...createRequiredValidators()]),
            departurePort: this.fb.control('', [...createRequiredValidators()]),
            arrivalPort: this.fb.control('', [...createRequiredValidators()]),
        });
    }
    initCompanyFiterForm() {
        this.companiesFilterForm = this.fb.group({
            portId: this.fb.control(null),
            companyId: this.fb.control('', [...createRequiredValidators()]),
        });
    }

}
