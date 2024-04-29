import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
    pluckArrayPaginationWrapperData,
    pluckArrayWrapperData,
    pluckItemWrapperData,
    wrapJsonForRequest,
    wrapJsonListForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
    ResponseArrayPaginationWrapper,
    ResponseArrayWrapper,
    ResponseItemWrapper
} from '../models/response-wrappers.types';
import { UserModel, UserTable } from '../models/user.model';
import { CustomFieldData } from "../models/custom-field.model";
import { ProfileModel } from '../models/profile.model';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    create(data: UserModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/user/create`, wrapJsonForRequest(data));
    }

    edit(id: number, data: UserModel): Observable<any> {
        data['userId'] = id;
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/user/update`, wrapJsonForRequest(data)).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
    }

    get(id: number): Observable<UserModel> {
        let data = { 'userId': id };
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/user/get`, wrapJsonForRequest(data))
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<UserModel>>())
    }

    delete(id: number): Observable<any> {
        let data = { 'userId': id };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/user/delete`, wrapJsonForRequest(data))
    }

    list(data: any): Observable<UserModel[]> {
        return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/user/paginate`, wrapJsonForRequest(data)).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
    }

    pagination(data: any): Observable<UserTable> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/user/paginate`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: UserTable) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }

    importLocaitons(list: UserModel[]): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/user/import`, wrapJsonListForRequest('user', list));
    }

    setOrganization(data: ProfileModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setOrganizationDetails`, wrapJsonForRequest(data));
    }
}
