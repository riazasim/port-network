import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ResponseArrayPaginationWrapper, ResponseItemWrapper } from "../models/response-wrappers.types";
import { environment } from "src/environments/environment";
import { pluckArrayPaginationWrapperData, pluckItemWrapperData, wrapJsonForRequest } from "src/app/shared/utils/api.functions";
import { CustomFieldData } from "../models/custom-field.model";

@Injectable({
    providedIn: 'root'
})
export class MicroService {
    constructor(private readonly http: HttpClient) { }
    getMicroPlanningConvoyes(data: any): Observable<any> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPlanningConvoyes`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: any) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }
    getPorts(data: any ): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/micro/port/list`, data )
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }
    
    getCompanies(data: any): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/micro/company/list`, data )
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }
}
