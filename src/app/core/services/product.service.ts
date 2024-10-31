import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckArrayPaginationWrapperData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../models/product.model';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CustomFieldData } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private route: string = '/admin/products'
  constructor(private http: HttpClient) { }

  create(data: ProductModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/product/create`, wrapJsonForRequest(data));
  }

  edit(id: number, data: any): Observable<any> {
    data['productId'] = id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/product/update`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    let data = {
      "productId": id
    }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/product/get`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  pagination(data: any): Observable<any> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/product/paginate`, wrapJsonForRequest(data))
      .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
        map((u: any) => {
          u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
          return u;
        })
      );
  }

  delete(id: number): Observable<any> {
    let data = { "productId": id };
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/product/delete`, wrapJsonForRequest(data))
  }

//   getProductList(data: any ): Observable<any> {
//     return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getProductList`, data )
//         .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
//             map((p: any) => {
//                 return p;
//             })
//         )
// }
  getCategoryList(data: any ): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/category/list`, data )
        .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
            map((p: any) => {
                return p;
            })
        )
}
  getSubCategory(id: number): Observable<any> {
    let data = {
      "categoryId": id
    }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/sub-category/list`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  

  list(data: any): Observable<ProductModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }
}
