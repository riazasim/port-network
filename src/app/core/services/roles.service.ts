import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthModel } from '../models/auth.model';
import { isUserInAnyRole, isUserInEveryRole, isUserInRole } from '../security/security.functions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService<T extends string = string> {
  private initialized: boolean = false;
  private readonly rolesSubject = new BehaviorSubject<T[]>([]);

  constructor(private readonly authService: AuthService) {
    this.init();
  }

  init(): void {
    if (!this.initialized) {
      const data = this.authService.getAuth();
      if (data) {
        const oldRole: any = this.rolesSubject.value;
        this.rolesSubject.next([...oldRole, data.userType]);
      }
      this.initialized = true;
    }
  }

  public setUserRoles(roles: T[]): void {
    this.rolesSubject.next(roles);
  }

  public addUserRoles(roles: T[]): void {
    this.rolesSubject.next([...roles]);
  }

  public addUserRole(role: T): void {
    const oldRole = this.rolesSubject.value;
    this.rolesSubject.next([...oldRole, role]);
  }

  public getUserRoles(): T[] {
    return this.rolesSubject.value;
  }

  public listenToUserRoles(): Observable<T[]> {
    return this.rolesSubject.asObservable();
  }

  public isUserInRole(role: T): boolean {
    return isUserInRole(this.getUserRoles(), role);
  }

  public isUserInAnyRole(roles: T[]): boolean {
    return isUserInAnyRole(this.getUserRoles(), roles);
  }

  public isUserInEveryRole(roles: T[]): boolean {
    return isUserInEveryRole(this.getUserRoles(), roles);
  }

  public removeUserRoles(): any {
    let role = localStorage.getItem('role');
    if(role) localStorage.removeItem('role');
    let userRole = localStorage.getItem('userRole');
    if(userRole) localStorage.removeItem('userRole');
}

}
