import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckArrayPaginationWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayPaginationWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CustomFieldData } from '../models/custom-field.model';
import { AreaModel } from '../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(private http: HttpClient) { }

  create(data: AreaModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/area/create`, wrapJsonForRequest(data));
  }

  edit(id: number, data: any): Observable<any> {
    data['areaId'] = id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/area/update`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    let data = {
      "areaId": id
    }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/area/get`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  pagination(data: any): Observable<any> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/area/paginate`, wrapJsonForRequest(data))
      .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
        map((u: any) => {
          u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
          return u;
        })
      );
  }

  delete(id: number): Observable<any> {
    let data = { "areaId": id };
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/area/delete`, wrapJsonForRequest(data))
  }
}
