import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { LocationService } from 'src/app/core/services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { ChangeLocationModalComponent } from 'src/app/shared/components/change-location-modal/change-location-modal.component';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { Nullable } from 'src/app/core/models/navigation-menu.model';

@Component({
  selector: 'operator-header',
  templateUrl: './operator-header.component.html',
  styleUrls: ['./operator-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorHeaderComponent {
 
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  language$: Observable<string>;

  @Input()
  public logoSrc: Nullable<string> = null;

  @Input()
  public logoRedirect: Nullable<string> = null;

  @Input()
  public optionsTitle: Nullable<string> = 'Options';

  @Input()
  public locationName$: string;
  @Input()
  public companyName$: string;

  public readonly expandBtnIcon: IconProp = faBars as any;
  public readonly closeBtnIcon = faTimes as any;

  public isMenuClosed = true;
  userRole: string | null;

  constructor(public readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: MatDialog,
    private readonly locationService: LocationService,
    private readonly snackBar: MatSnackBar,
    private readonly organizationService: OrganizationService,
    public localizeService: LocalizeRouterService) {
      this.userRole = organizationService.getUserRole();
    this.language$ = localizeService.routerEvents.asObservable().pipe(startWith(localizeService.parser.currentLang))
  }

  openChangeLocationModal(): void {
    if (this.isLoading$.value) return;
    this.isLoading$.next(true);
    this.locationService.getLocationsByUser().subscribe({
      next: (response: any) => {
        this.isLoading$.next(false);
        this.dialogService.open(ChangeLocationModalComponent, {
          disableClose: true,
          width: 'calc(100% - 400px)',
          height: 'calc(100% - 100px)',
          data: { locations: response }
        }).afterClosed()
          .subscribe({
            next: (id: number) => {
              if (id && !isNaN(id)) {
                this.isLoading$.next(true);
                this.locationService.changeLocation(id).subscribe({
                  next: (location: any) => {
                    this.locationName$ = location?.port?.name;
                    this.organizationService.organization.next({
                      ...<any>this.organizationService.organization.getValue(),
                      locationName: location?.port?.name,
                      locationId: <number>location?.port?.id
                    });
                    this.snackBar.open('Port changed!', 'Success', {
                      duration: 3000,
                      horizontalPosition: 'center',
                      panelClass: ['success-snackbar'],
                      verticalPosition: 'top',
                    });
                    this.isLoading$.next(false);
                  },
                  error: (body) => {
                    this.snackBar.open(body?.error?.detail, 'Error', {
                      duration: 3000,
                      horizontalPosition: 'center',
                      panelClass: ['error-snackbar'],
                      verticalPosition: 'top',
                    });
                    this.isLoading$.next(false);
                  }
                });
              } else {
                this.isLoading$.next(false);
              }
            }
          });
      },
      error: (error) => {
        this.isLoading$.next(false);
        this.snackBar.open('Failed to load ports', 'Error', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
      }
    });
  }

}
