import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckArrayPaginationWrapperData,
  pluckArrayWrapperData,
  pluckItemWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseArrayPaginationWrapper,
  ResponseArrayWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {CustomFieldData} from "../models/custom-field.model";
import { BerthModel, BerthTable } from '../models/berth.model';

@Injectable({
  providedIn: 'root'
})
export class BerthService {
  constructor(private http: HttpClient) { }

  create(data: BerthModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/berth/create`, wrapJsonForRequest(data));
  }

  edit(id:number,data: BerthModel): Observable<any> {
    data['berthId']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/berth/update`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
      let data ={
        "berthId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/berth/get`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data ={
      "berthId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/berth/delete`, wrapJsonForRequest(data))
  }

  list(data: any): Observable<BerthModel[]> {
    return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/berth/paginate`, wrapJsonForRequest(data))
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  pagination(data: any): Observable<BerthTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/berth/paginate`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: BerthTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }

  importLocaitons(list: BerthModel[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/berth/import`,(list));
}
//   importLocaitons(list: BerthModel[]): Observable<any> {
//     return this.http.post(`${environment.apiUrl}${environment.apiVersion}/import`, wrapJsonListForRequest('location', list));
// }


}
