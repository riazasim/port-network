import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { UsersSuccessComponent } from './users-success/users-success.component';
import { UsersDeleteModalComponent } from './users-delete-modal/users-delete-modal.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoUsersComponent } from './no-users/no-users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileComponent } from './profile/profile.component';
import {MatMenuModule} from "@angular/material/menu";
import { UsersImportModalComponent } from './userss-import-modal/users-import-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UsersAddEditComponent,
    UsersImportModalComponent,
    UsersSuccessComponent,
    UsersDeleteModalComponent,
    NoUsersComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgScrollbarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonToggleModule,
  ]
})
export class UsersModule { }
