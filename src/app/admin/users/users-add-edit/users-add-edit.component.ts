import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users-add-edit',
  templateUrl: './users-add-edit.component.html',
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
export class UsersAddEditComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedRole$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userForm: UntypedFormGroup;
  locations: number[] = [];
  id: number;
  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: UntypedFormBuilder,) { }

  ngOnInit(): void {
      this.subscribeForQueryParams();
      this.initForm();
  }

    onRoleChange(value: any) {
        this.selectedRole$.next(value.target.value);
    }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.userService.get(this.id).subscribe(response => {
        this.initForm(response);
        this.selectedRole$.next('DRIVER');
        this.isLoading$.next(false);
     });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: UserModel = <UserModel>{}): void {
    this.userForm = this.fb.group({
      user: this.fb.group({
        
        email: this.fb.control({ value: data?.user?.email || '', disabled: data?.user?.email ? true : false }, { nonNullable: false }),
        userRole: this.fb.control(data?.user?.userRole || 'ROLE_USER_PORTADMIN', { nonNullable: false }),
        status: this.fb.control(data?.user?.status || false, { nonNullable: false }),
      }),
      userSetting: this.fb.group({
        firstName: this.fb.control(data?.userSetting?.firstName || '', { nonNullable: false }),
        lastName: this.fb.control(data?.userSetting?.lastName || '', { nonNullable: false }),
        phone: this.fb.control(data?.userSetting?.phone || '', { nonNullable: false }),
        department: this.fb.control(data?.userSetting?.department || '', { nonNullable: false }),
      })
    });
  }

  saveUser(): void {
    this.isLoading$.next(true);
    const userData = this.userForm.getRawValue();
    userData.user.status = userData.user.status === 'true' || userData.user.status === true;
    if (this.id) {
      delete userData.user.email;
      delete userData.user.userRole;
      this.userService.edit(this.id, userData).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.userService.create(userData).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }
}
