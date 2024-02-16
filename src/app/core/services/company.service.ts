import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, catchError, map} from 'rxjs';
import {
    convertJsonToFormData,
    pluckArrayPaginationWrapperData,
    pluckArrayWrapperData,
    pluckItemWrapperData,
    wrapJsonForRequest, wrapJsonListForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseArrayPaginationWrapper,
  ResponseArrayWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {CustomFieldData} from "../models/custom-field.model";
import { CompanyModel, CompanyTable, ContactsTable } from '../models/company.model';
import { ContactsModel } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  create(data: CompanyModel): Observable<any> {
    //const formData = convertJsonToFormData(data, 'data[attributes]');
    const formData = convertJsonToFormData(data,'');
    formData.delete('data[imgPreview]');
    formData.append('imgPreview', data.imgPreview);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/create`, formData);
  }

  edit(id:number,data: CompanyModel): Observable<any> {
    data['companyId']=id;
    const formData = convertJsonToFormData(data, '');
    formData.delete('data[imgPreview]');
    formData.delete('data[companyId]');
    if (data.imgPreview) formData.append('imgPreview', data.imgPreview);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/update`, formData);
  }

  get(id: number): Observable<any> {
      let data={
          companyId:id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/get`,data)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
      let data={
          locationId:id
      }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/company/delete`,data)
  }

  list(data: any): Observable<CompanyModel[]> {
    return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/paginate`,data)
    .pipe(
      pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
      catchError(() => [])
      )
  }


  pagination(data: any): Observable<CompanyTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/paginate`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: CompanyTable) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }
  addCompanyContact(data: any): Observable<ContactsTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/company/contact/create`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: ContactsTable) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }

    importLocaitons(list: CompanyModel[]): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/company/import`, wrapJsonListForRequest('company', list));
    }
}
