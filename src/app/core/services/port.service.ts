import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, map} from 'rxjs';
import {
    convertJsonToFormData,
    pluckArrayPaginationWrapperData,
    pluckItemWrapperData,
    wrapJsonForRequest, wrapJsonListForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseArrayPaginationWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {CustomFieldData} from "../models/custom-field.model";
import { ContactsTable, PortModel, PortTable } from '../models/port.model';

@Injectable({
  providedIn: 'root'
})
export class PortService {
  constructor(private http: HttpClient) {}

  create(data: PortModel): Observable<any> {
    const formData = convertJsonToFormData(data,'');
    formData.delete('data[imgPreview]');
    formData.append('imgPreview', data.imgPreview);
    formData.append('contacts', JSON.stringify(data.contacts));
    // formData.append('zones', JSON.stringify(data.zones));
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/port/create`, formData);
  }

  edit(id:number,data: PortModel): Observable<any> {
    data['portId']=id;
    const formData = convertJsonToFormData(data, '');
    formData.delete('data[imgPreview]');
    formData.delete('data[portId]');
    formData.append('contacts', JSON.stringify(data.contacts));
    // formData.append('zones', JSON.stringify(data.zones));
    if (data.imgPreview) formData.append('imgPreview', data.imgPreview);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/port/update`, formData);
  }

  get(id: number): Observable<any> {
      let data={
          portId:id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/port/get`,data)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
      let data={
          portId:id
      }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/port/delete`,data)
  }

  addPortContact(data: any): Observable<ContactsTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/port/contact/create`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: ContactsTable) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }
  deleteContact(portId: number, contactId: number): Observable<any> {
    let data={
        portId:portId,
        contactId:contactId
    }
  return this.http.post(`${environment.apiUrl}${environment.apiVersion}/port/contact/delete`,data)
}
  deleteZone(portId: number, zoneId: number): Observable<any> {
    let data={
        portId:portId,
        zoneId:zoneId
    }
  return this.http.post(`${environment.apiUrl}${environment.apiVersion}/port/zone/delete`,data)
}
  pagination(data: any): Observable<PortTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/port/paginate`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: PortTable) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }

    importLocaitons(list: PortModel[]): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/port/import`, wrapJsonListForRequest('port', list));
    }
}
