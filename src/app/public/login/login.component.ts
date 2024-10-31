import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderOrchestratorService } from '../../core/services/loader-orchestrator.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { handleSuccess } from "../../shared/utils/success-handling.function";
import { SESSION_TOKEN } from 'src/app/core/constants/auth.constant';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.sigIn();
    }

    loginForm: UntypedFormGroup = new UntypedFormGroup({
        username: new UntypedFormControl(null, [Validators.required, Validators.email]),
        password: new UntypedFormControl(null, [Validators.required, Validators.pattern('')]),
    })
    constructor(private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly snackBar: MatSnackBar,
        private readonly auth: AuthService,
        private loaderService: LoaderOrchestratorService,
        private readonly organizationService: OrganizationService,
        private readonly rolesService: RolesService) {
        this.preCompleteSignIn();
    }

    preCompleteSignIn(): void {
        const user = this.auth.getAuth();

        // if (user) {
        //   this.router.navigate([user.userType === 'ADMIN' ? 'admin/dashboard' : 'operator/dashboard'], { relativeTo: this.route.parent });
        //   return;
        // }

        if (!environment.production) {
            this.loginForm = new UntypedFormGroup({
                // username: new UntypedFormControl('mrumari@gmail.com', [Validators.required, Validators.email]),
                // password: new UntypedFormControl('12345678', [Validators.required, Validators.pattern('')]),
                username: new UntypedFormControl('iqbalchannar796@gmail.com', [Validators.required, Validators.email]),
                password: new UntypedFormControl('12345678', [Validators.required, Validators.pattern('')]),
            })
        }
    }
    sigIn(): void {
        this.loginForm.disable();
        this.isLoading$.next(true);
        const isTutorialTrue = localStorage.getItem('tutorial') === 'true';
        this.auth.signin(this.loginForm.getRawValue()).subscribe({
            next: (response) => {
                this.auth.saveAuth(response);
                this.rolesService.setUserRoles([response.roles])
                this.organizationService.setUserRole(response?.userRole || "");
                this.organizationService.setPort(response?.port || "");
                // const redirectRoute = !isTutorialTrue ? '../onboarding' : response.roles.includes("ROLE_ADMIN") ? '../admin' : '../operator';
                this.router.navigate(['../operator'], { relativeTo: this.route }).then(() => {
                    this.loginForm.enable();
                    // this.snackBar.open("Login success!", "", {
                    //   duration: 3000,
                    //   horizontalPosition: 'end',
                    //   panelClass: ['success-snackbar'],
                    //   verticalPosition: 'bottom',
                    // });
                    handleSuccess(this.snackBar, response, this.isLoading$);
                    this.loaderService.hideLoader();
                })
            }, error: (body) => {
                //  console.log(body.data.attributes.message);
                this.loginForm.enable()
                handleError(this.snackBar, body, this.isLoading$);
            }
        });
    }
}
