import { animate, style, transition, trigger } from '@angular/animations';
import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SignupModel } from 'src/app/core/models/signup.model';
import { AuthService } from 'src/app/core/services/auth.service';
import {environment} from "../../../environments/environment";
import {handleError} from "../../shared/utils/error-handling.function";
import {LoaderOrchestratorService} from "../../core/services/loader-orchestrator.service";
import {handleSuccess} from "../../shared/utils/success-handling.function";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ])
    ])
  ]
})
export class RegisterComponent {
  isEnglish$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.signUp();
    }


    // registerForm: UntypedFormGroup = new UntypedFormGroup({
    //     first_name: new UntypedFormControl(null, [Validators.required]),
    //     last_name: new UntypedFormControl(null, [Validators.required]),
    //     email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    //     phone: new UntypedFormControl(null, [Validators.required]),
    //     phone_region_code: new UntypedFormControl(null, [Validators.required]),
    // })

    // personForm = new FormGroup({
    //     user: new FormGroup({
    //         email: new FormControl(""),
    //     }),
    //     name: new FormControl("bob"),
    //     age: new FormControl(100),
    //     user_setting: new FormGroup({
    //         first_name: new FormControl(""),
    //         last_name: new FormControl(""),
    //         phone: new FormControl("")
    //     })
    // });


    // @ts-ignore
    registerForm: FormGroup<{
        userSetting: FormGroup<{
            phone: FormControl<string | null>;
            lastName: FormControl<string | null>;
            language: FormControl<string | null>;
            firstName: FormControl<string | null>;
            phoneRegionCode: FormControl<string | null>
        }>;
        user: FormGroup<{ email: FormControl<string | null> }>
    }> = new FormGroup({
        user:new FormGroup({
            email:new FormControl(null, [Validators.required, Validators.email])
        }),
        userSetting:new FormGroup({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            language: new FormControl(null, [Validators.required]),
            phone: new FormControl(null, [Validators.required]),
            phoneRegionCode: new FormControl(null, [Validators.required])
        })
    })

    // email = this.registerForm.getRawValue().user.email;




  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly auth: AuthService,
              private readonly route: ActivatedRoute,
              private loaderService: LoaderOrchestratorService,
              private readonly snackBar: MatSnackBar) {
       this.preCompleteSignUp();
  }

    preCompleteSignUp(): void {
        const user = this.auth.getAuth();
        // if (user) {
        //   this.router.navigate([user.userType === 'ADMIN' ? 'admin/dashboard' : 'operator/dashboard'], { relativeTo: this.route.parent });
        //   return;
        // }

        if (!environment.production) {
            // this.registerForm = new UntypedFormGroup({
            //     first_name: new UntypedFormControl('Iqbal', [Validators.required]),
            //     last_name: new UntypedFormControl('Channar', [Validators.required]),
            //     email: new UntypedFormControl('iqbalchannar796@gmail.com', [Validators.required, Validators.email]),
            //     phone: new UntypedFormControl('3006831796', [Validators.required]),
            //     phone_region_code: new UntypedFormControl('+92', [Validators.required]),
            // })

            this.registerForm = new FormGroup({
                user:new FormGroup({
                    email:new FormControl("mrumari@gmail.com",{nonNullable: false})
                }),
                userSetting:new FormGroup({
                    firstName: new FormControl("Asim", {nonNullable: false}),
                    lastName: new FormControl("Channar", {nonNullable: false}),
                    language: new FormControl("EN", {nonNullable: false}),
                    phone: new FormControl("33365356", {nonNullable: false}),
                    phoneRegionCode: new FormControl("+92", {nonNullable: false})
                })
            });

        }
    }


    signUp(): void {
        if (this.registerForm.valid) {
        this.registerForm.disable();
        this.isLoading$.next(true);
           let language="RO";
            if (this.isEnglish$){
                language ="EN"
            }
            this.registerForm.patchValue({userSetting:{language:language}});
              // let data = {
              //     "user": {
              //         "email": this.registerForm.value.email
              //     },
              //     "user_setting": {
              //         "timezone": "Europe/Bucharest",
              //         "first_name": this.registerForm.value.first_name,
              //         "last_name": this.registerForm.value.last_name,
              //         "language": language,
              //         "phone": this.registerForm.value.phone,
              //         "phone_region_code": this.registerForm.value.phone_region_code
              //     }
              // }


        this.auth.signup(<SignupModel>this.registerForm.getRawValue()).subscribe({
            next: (response) => {
                this.router.navigate(
                    ['../sign-in'], { relativeTo: this.route }
                )
                    .then(() => {
                        // this.snackBar.open("Account created! Check email please!", "Close", {
                        //     duration: 3000,
                        //     horizontalPosition: 'end',
                        //     panelClass: ['success-snackbar'],
                        //     verticalPosition: 'bottom',
                        // });
                        handleSuccess(this.snackBar, response, this.isLoading$)
                        this.loaderService.hideLoader()
                    })
            }, error: (body) => {
                this.registerForm.enable();
                handleError(this.snackBar, body, this.isLoading$)
            }});
        }
    }

  toggleLanguage(value: boolean): void {
    //TODO: select UI language
    this.isEnglish$.next(value);
  }
}
