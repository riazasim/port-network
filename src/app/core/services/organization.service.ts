// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, shareReplay } from 'rxjs';
import { pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { OrganizationModel } from '../models/organization.model';
import { ResponseItemWrapper } from '../models/response-wrappers.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private route: string = '/admin/organizations';
  organization: BehaviorSubject<OrganizationModel|null> = new BehaviorSubject<OrganizationModel|null>(null);
  publicOrganization: BehaviorSubject<OrganizationModel|null> = new BehaviorSubject<OrganizationModel|null>(null);
  isUmexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isChimpexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isComvexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) { }

  get(): Observable<OrganizationModel|null> {
    if (this.organization.getValue()) return of(this.organization.getValue());

    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}/checkAPICredentials`,null)
        .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  setUserRole(role: any): void {
    localStorage.setItem("userRole", role);
  }

  getUserRole(): string | null {
    return localStorage.getItem("userRole");
  }
  setPort(port: any): void {
    localStorage.setItem("portId", port?.id);
  }

  getPort(): string | null {
    return localStorage.getItem("portId");
  }

  // get(): Observable<OrganizationModel|null> {
  //   if (this.organization.getValue()) return of(this.organization.getValue());

  //   return this.http.get<any>(`${environment.apiUrl}${environment.apiVersion}/organization/get`)
  //   .pipe(
  //     map((response: any) => {
  //       debugger
  //       const parsed = {
  //         ...response.data.organization.attributes,
  //         locationId: response.data.locationId,
  //         locationName: response.data.locationName,
  //         userId: response.data.userId
  //       }

  //       switch (parsed.id) {
  //         case 7: this.isChimpexOrganization$.next(true); break;
  //         case 8: this.isComvexOrganization$.next(true); break;
  //         case 30: this.isUmexOrganization$.next(true); break;
  //       }

  //       this.organization.next(parsed);
  //       return parsed;
  //     })
  //     ).pipe(shareReplay())
  // }

  updateLogo(id: number, file: File): Observable<OrganizationModel> {
    const data = new FormData();
    data.append('logo', file);
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/logo/${id}`, data)
                    .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  updateCover(id: number, file: File): Observable<OrganizationModel> {
    const data = new FormData();
    data.append('cover', file);
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/cover/${id}`, data)
                    .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());;
  }

  updateBookingFormActivation(id: number, isActivated: boolean): Observable<OrganizationModel> {
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/booking-form-is-activated/${id}`, wrapJsonForRequest({ bookingFormIsActivated: +isActivated }))
                    .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  updatePrivacyLink(id: number, privacyLink: string): Observable<OrganizationModel> {
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/privacy-link/${id}`, wrapJsonForRequest({ privacyLink }))
                    .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  update(id: number, data: any): Observable<OrganizationModel> {
    const formData = new FormData();
    formData.append('data[attributes][name]', data.name);
    formData.append('data[attributes][bookingFormIsActivated]', `${+data.bookingFormIsActivated}`);
    formData.append('data[attributes][privacyLink]', data.privacyLink);
    formData.append('cover', data.coverFile);
    formData.append('logo', data.logoFile);
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, formData)
                    .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());;
  }
}
